import { Router, json } from "express";
// import CartManager from "../dao/file/managers/CartManager.js";
import ProductModel from "../dao/mongo/models/products.model.js";
import CartModel from "../dao/mongo/models/carts.model.js";

const CartRouter = Router();
// const carts = new CartManager("./src/files/carts.json");

CartRouter.get("/", async (req, res) => {
  try {
    const carts = await CartModel.find();
    res.json({ status: "success", payload: carts });
  } catch (error) {
    console.error("Error in GET /carts", error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
});

CartRouter.get("/:cid", async (req, res) => {
  try {
    const cartId = req.params.cid;
    const cart = await CartModel.findById(cartId);
    if (cart) {
      res.json({ status: "success", payload: cart });
    } else {
      res.status(404).json({ status: "error", message: "Cart not found" });
    }
  } catch (error) {
    console.error(`Error in GET /carts/${req.params.cid}`, error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
});

CartRouter.post("/", async (req, res) => {
  try {
    const { productId, amount } = req.body;
    const product = await ProductModel.findById(productId);
    if (!product) {
      return res.status(400).json({ message: "Product not found" });
    }
    const cartItem = await CartModel.findOne({ productId });
    if (cartItem) {
      cartItem.amount += amount;
      await cartItem.save();
    } else {
      const newCartItem = new CartModel({ productId, amount });
      await newCartItem.save();
    }
    await ProductModel.findByIdAndUpdate(productId, { inCart: true });
    res.json({ message: "Product added to cart" });
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

CartRouter.put("/:cid", async (req, res) => {
  try {
    const productId = req.params.cid;
    const { amount } = req.body;
    const cartItem = await CartModel.findOne({ productId });
    if (!cartItem) {
      return res.status(400).json({ message: "Product not found in the cart" });
    }
    cartItem.amount = amount;
    await cartItem.save();

    res.json({ message: "Cart updated successfully" });
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

CartRouter.delete("/:cid", async (req, res) => {
  try {
    const productId = req.params.cid;
    const cartItem = await CartModel.findOne({ productId });

    if (!cartItem) {
      return res.status(400).json({ message: "Product not found in the cart" });
    }
    if (cartItem.amount > 1) {
      cartItem.amount -= 1;
      await cartItem.save();
    } else {
      await CartModel.deleteOne({ productId });
    }
    await ProductModel.findByIdAndUpdate(productId, { inCart: false });

    res.json({ message: "Product removed from cart" });
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

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
