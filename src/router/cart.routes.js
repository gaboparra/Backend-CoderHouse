import { Router } from "express";
import CartsCtrl from "../controllers/carts.controller.js";

const CartRouter = Router();

CartRouter.get("/", CartsCtrl.getCarts);

CartRouter.get("/:cid", CartsCtrl.getCartById);

CartRouter.post("/:pid", CartsCtrl.addProductInCart);

CartRouter.delete("/:cid", CartsCtrl.deleteAllProducts);

CartRouter.delete("/:cid/products/:pid", CartsCtrl.deleteProductInCart);

CartRouter.put("/:cid/products/:pid", CartsCtrl.updateProductInCart);

CartRouter.post("/:cid/purchase", CartsCtrl.purchase);

export default CartRouter;
