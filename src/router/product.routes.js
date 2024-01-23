import { Router } from "express";
import ProductsCtrl from "../controllers/products.controller.js";

const ProductRouter = Router();

ProductRouter.get("/", ProductsCtrl.getProducts);

ProductRouter.get("/:pid", ProductsCtrl.getProductById);

ProductRouter.post("/", ProductsCtrl.createProduct);

ProductRouter.delete("/:pid", ProductsCtrl.deleteProduct);

ProductRouter.put("/:pid", ProductsCtrl.updateProduct);

export default ProductRouter;
