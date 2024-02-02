import { Router } from "express";
import CartsCtrl from "../controllers/carts.controller.js";
import { authorization } from "../middlewares/auth.middleware.js";
import passport from "passport";

const CartRouter = Router();

CartRouter.get("/", CartsCtrl.getCarts);

CartRouter.get("/:cid", CartsCtrl.getCartById);

CartRouter.post(
  "/:pid",
  passport.authenticate("jwt", { session: false }),
  authorization("user"),
  CartsCtrl.addProductInCart
);

CartRouter.delete(
  "/:cid",
  passport.authenticate("jwt", { session: false }),
  authorization("user"),
  CartsCtrl.deleteAllProducts
);

CartRouter.delete(
  "/:cid/products/:pid",
  passport.authenticate("jwt", { session: false }),
  authorization("user"),
  CartsCtrl.deleteProductInCart
);

CartRouter.put(
  "/:cid/products/:pid",
  passport.authenticate("jwt", { session: false }),
  authorization("user"),
  CartsCtrl.updateProductInCart
);

CartRouter.post(
  "/:cid/purchase",
  passport.authenticate("jwt", { session: false }),
  authorization("user"),
  CartsCtrl.purchase
);

export default CartRouter;
