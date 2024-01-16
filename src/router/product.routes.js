import { Router } from "express";
// import ProductManager from "../dao/file/managers/ProductManager.js";
// import ProductModel from "../dao/mongo/models/products.model.js";
import ProductsCtrl from "../controllers/products.controller.js";

const ProductRouter = Router();
// const product = new ProductManager("./src/files/products.json");

ProductRouter.get("/", ProductsCtrl.getProducts);

ProductRouter.get("/:pid", ProductsCtrl.getProduct);

ProductRouter.post("/", ProductsCtrl.createProduct);

ProductRouter.delete("/:pid", ProductsCtrl.deleteProduct);

ProductRouter.put("/:pid", ProductsCtrl.updateProduct);

// ProductRouter.get("/", async (req, res) => {
//   try {
//     let products = await product.getProducts();
//     res.status(200).json(products);
//   } catch (error) {
//     return res.status(500).send("Error al obtener productos" + error);
//   }
// });

// ProductRouter.get("/:id", async (req, res) => {
//   try {
//     let id = req.params.id;
//     res.send(await product.getProductsById(id));
//   } catch (error) {
//     return res.status(500).send("Error al obtener producto por ID" + error);
//   }
// });

// ProductRouter.post("/", async (req, res) => {
//   try {
//     let newProduct = req.body;
//     res.send(await product.addProducts(newProduct));
//   } catch (error) {
//     return res.status(500).send("Error al agregar producto" + error);
//   }
// });

// ProductRouter.put("/:id", async (req, res) => {
//   try {
//     let id = req.params.id;
//     let updateProduct = req.body;
//     res.send(await product.updateProducts(id, updateProduct));
//   } catch (error) {
//     return res.status(500).send("Error al actualizar producto" + error);
//   }
// });

// ProductRouter.delete("/:id", async (req, res) => {
//   try {
//     let id = req.params.id;
//     res.send(await product.deleteProducts(id));
//   } catch (error) {
//     return res.status(500).send("Error al eliminar producto" + error);
//   }
// });

export default ProductRouter;
