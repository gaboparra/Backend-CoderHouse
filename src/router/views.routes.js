import { Router } from "express";
import ProductManager from "../managers/ProductManager.js";

const ViewsRouter = Router();
const product = new ProductManager("./src/files/products.json");

ViewsRouter.get("/", async (req, res) => {
  try {
    let products = await product.getProducts();
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

export default ViewsRouter;
