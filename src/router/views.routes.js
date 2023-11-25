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
    return res.status(500).send("Error al obtener productos" + error);
  }
});

ViewsRouter.get("/realTimeProducts", async (req, res) => {
  try {
    res.render("realTimeProducts", {
      title: "Handlebars",
      style: "styles.css",
    });
  } catch (error) {
    return res.status(500).send("Error al obtener productos" + error);
  }
});

ViewsRouter.get("/carts/:cid", async (req, res) => {
  try {
    res.render("carts", {
      title: "Detalles del Carrito",
      style: "styles.css",
    });
  } catch (error) {
    console.error("Error al renderizar la vista de detalles del carrito", error);
    res.status(500).send("Error interno del servidor");
  }
});

export default ViewsRouter;
