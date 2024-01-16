import ProductModel from "../dao/mongo/models/products.model.js";
import CartModel from "../dao/mongo/models/carts.model.js";

const ViewsCtrl = {};

ViewsCtrl.homeProducts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const sort = req.query.sort || {};
    const query = req.query.query ? JSON.parse(req.query.query) : {};

    const products = await ProductModel.paginate(query, {
      page,
      limit,
      sort,
      lean: true,
    });

    const user = req.session.user;

    res.render("home", {
      title: "Ecommerce",
      style: "styles.css",
      products,
      user,
    });
  } catch (error) {
    console.error("Error getting products:", error);
    res.status(500).render("error", { message: "Error getting products" });
  }
};

ViewsCtrl.realTimeProducts = async (req, res) => {
  try {
    res.render("realTimeProducts", {
      title: "Handlebars",
      style: "styles.css",
    });
  } catch (error) {
    console.error("Error rendering real time products view", error);
    res.status(500).render("error", {message: "Error getting products in real time"});
  }
};

ViewsCtrl.cartView = async (req, res) => {
  try {
    const cart = await CartModel.findById(req.params.cid).lean().exec();
    console.log("Cart data:", cart);
    res.render("carts", {
      title: "Cart Details",
      style: "styles.css",
      cart,
    });
  } catch (error) {
    console.error("Error rendering cart details view", error);
    res.status(500).render("error", { message: "Error getting cart details" });
  }
};

ViewsCtrl.loginView = (req, res) => {
  return res.render("login", {
    title: "Ecommerce",
    style: "styles.css",
  });
};

ViewsCtrl.registerView = (req, res) => {
  return res.render("register", {
    title: "Ecommerce",
    style: "styles.css",
  });
};

ViewsCtrl.profileView = (req, res) => {
  try {
    const user = req.session.user;
    if (!user) {
      req.session.destroy();
      return res.redirect("/login");
    }
    res.render("profile", {
      title: "Ecommerce",
      style: "styles.css",
      user: user,
    });
  } catch (error) {
    console.error("Error rendering profile:", error);
    res.status(500).render("error", { message: "Error rendering profile" });
  }
};

export default ViewsCtrl;
