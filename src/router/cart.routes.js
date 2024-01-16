import { Router } from "express";
// import CartManager from "../dao/file/managers/CartManager.js";
import CartsCtrl from "../controllers/carts.controller.js";

const CartRouter = Router();
// const carts = new CartManager("./src/files/carts.json");

CartRouter.get("/", CartsCtrl.getCarts);

CartRouter.get("/:cid", CartsCtrl.getCartById);

CartRouter.post("/:pid", CartsCtrl.addProductInCart);

CartRouter.delete("/:cid", CartsCtrl.deleteAllProducts);

CartRouter.delete("/:cid/products/:pid", CartsCtrl.deleteProductInCart);

CartRouter.put("/:cid/products/:pid", CartsCtrl.updateProductInCart);

// CartRouter.post("/", async (req, res) => {
//   try {
//     res.send(await carts.addCarts());
//   } catch (error) {
//     return res.status(500).send("Error al agregar carrito" + error);
//   }
// });

// CartRouter.get("/", async (req, res) => {
//   try {
//     res.send(await carts.readCarts());
//   } catch (error) {
//     return res.status(500).send("Error al obtener carritos" + error);
//   }
// });

// CartRouter.get("/:id", async (req, res) => {
//   try {
//     res.send(await carts.getCartsById(req.params.id));
//   } catch (error) {
//     return res.status(500).send("Error al obtener carrito por ID" + error);
//   }
// });

// CartRouter.post("/:cid/products/:pid", async (req, res) => {
//   try {
//     let cartId = req.params.cid;
//     let productId = req.params.pid;
//     res.send(await carts.addProductInCart(cartId, productId));
//   } catch (error) {
//     return res.status(500).send("Error al agregar producto al carrito" + error);
//   }
// });

export default CartRouter;
