import { Router } from "express";
import CartManager from "../managers/CartManager.js";

const CartRouter = Router();
const carts = new CartManager();

CartRouter.post("/", async (req, res) => {
  try {
    res.send(await carts.addCarts());
  } catch (error) {
    return res.status(500).send("Error al agregar carrito" + error);
  }
});

CartRouter.get("/", async (req, res) => {
  try {
    res.send(await carts.readCarts());
  } catch (error) {
    return res.status(500).send("Error al obtener carritos" + error);
  }
});

CartRouter.get("/:id", async (req, res) => {
  try {
    res.send(await carts.getCartsById(req.params.id));
  } catch (error) {
    return res.status(500).send("Error al obtener carrito por ID" + error);
  }
});

CartRouter.post("/:cid/products/:pid", async (req, res) => {
  try {
    let cartId = req.params.cid;
    let productId = req.params.pid;
    res.send(await carts.addProductInCart(cartId, productId));
  } catch (error) {
    return res.status(500).send("Error al agregar producto al carrito" + error);
  }
});

export default CartRouter;
