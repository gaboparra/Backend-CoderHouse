import ProductModel from "../dao/mongo/models/products.model.js";
import CartModel from "../dao/mongo/models/carts.model.js";
import logger from "../utils/logger.js";

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
      title: "GeekyManga",
      style: "styles.css",
      products,
      user,
    });
  } catch (error) {
    logger.error("Error getting products:", error);
    res.status(500).render("error", { message: "Error getting products" });
  }
};

ViewsCtrl.realTimeProducts = async (req, res) => {
  try {
    res.render("realTimeProducts", {
      title: "Real Time Products",
      style: "styles.css",
    });
  } catch (error) {
    logger.error("Error rendering real time products view", error);
    res.status(500).render("error", { message: "Error getting products in real time" });
  }
};

ViewsCtrl.cartView = async (req, res) => {
  try {
    const cart = await CartModel.findById(req.params.cid).lean().exec();
    logger.info("Cart data:", cart);
    res.render("carts", {
      title: "Cart",
      style: "styles.css",
      cart,
    });
  } catch (error) {
    logger.error("Error rendering cart details view", error);
    res.status(500).render("error", { message: "Error getting cart details" });
  }
};

ViewsCtrl.loginView = (req, res) => {
  return res.render("login", {
    title: "Login",
    style: "styles.css",
  });
};

ViewsCtrl.registerView = (req, res) => {
  return res.render("register", {
    title: "Register",
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
      title: "Profile",
      style: "styles.css",
      user: user,
    });
  } catch (error) {
    logger.error("Error rendering profile:", error);
    res.status(500).render("error", { message: "Error rendering profile" });
  }
};

ViewsCtrl.paymentSuccessView = (req, res) => {
  return res.render("payment-success", {
    title: "Payment Success",
    style: "styles.css",
  });
};

ViewsCtrl.paymentErrorView = (req, res) => {
  return res.render("payment-error", {
    title: "Payment Error",
    style: "styles.css",
  });
};

export default ViewsCtrl;
