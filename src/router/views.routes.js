import { Router } from "express";
// import ProductManager from "../dao/file/managers/ProductManager.js";
import ProductModel from "../dao/mongo/models/products.model.js";
import CartModel from "../dao/mongo/models/carts.model.js";

const ViewsRouter = Router();
// const product = new ProductManager("./src/dao/files/products.json");

ViewsRouter.get("/", async (req, res) => {
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

    res.render("home", {
      title: "Handlebars",
      style: "styles.css",
      products,
    });
  } catch (error) {
    console.error("Error getting products:", error);
    res.status(500).render("error", { message: "Error getting products" });
  }
});

ViewsRouter.get("/realTimeProducts", async (req, res) => {
  try {
    res.render("realTimeProducts", {
      title: "Handlebars",
      style: "styles.css",
    });
  } catch (error) {
    console.error("Error al renderizar la vista de productos en tiempo real", error);
    res.status(500).render("error", { message: "Error al obtener productos en tiempo real" });
  }
});

ViewsRouter.get("/carts/:cid", async (req, res) => {
  try {
    const cart = await CartModel.findById(req.params.cid).lean().exec();
    res.render("carts", {
      title: "Detalles del Carrito",
      style: "styles.css",
      cart,
    });
  } catch (error) {
    console.error("Error al renderizar la vista de detalles del carrito", error);
    res.status(500).render("error", { message: "Error al obtener detalles del carrito" });
  }
});

export default ViewsRouter;
