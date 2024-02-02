import { Router } from "express";
import ProductsCtrl from "../controllers/products.controller.js";
import passport from "passport";
import { authorization } from "../middlewares/auth.middleware.js";

const ProductRouter = Router();

ProductRouter.get("/", ProductsCtrl.getProducts);

ProductRouter.get("/mockingproducts", ProductsCtrl.mockingProducts);

ProductRouter.get("/:pid", ProductsCtrl.getProductById);

ProductRouter.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  authorization("admin"),
  ProductsCtrl.createProduct
);

ProductRouter.delete(
  "/:pid",
  passport.authenticate("jwt", { session: false }),
  authorization("admin"),
  ProductsCtrl.deleteProduct
);

ProductRouter.put(
  "/:pid",
  passport.authenticate("jwt", { session: false }),
  authorization("admin"),
  ProductsCtrl.updateProduct
);

export default ProductRouter;
