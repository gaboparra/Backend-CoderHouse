import CartModel from "../dao/mongo/models/carts.model.js";
import ProductModel from "../dao/mongo/models/products.model.js";
import TicketModel from "../dao/mongo/models/ticket.model.js";

const CartsCtrl = {};

CartsCtrl.getCarts = async (req, res) => {
  try {
    const carts = await CartModel.findOne();
    res.json({ status: "success", payload: carts });
  } catch (error) {
    console.error("Error in GET /carts", error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};

CartsCtrl.getCartById = async (req, res) => {
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
};

CartsCtrl.addProductInCart = async (req, res) => {
  try {
    const product = await ProductModel.findById(req.params.pid);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    let cart = await CartModel.findOne();
    if (!cart) {
      cart = new CartModel();
    }
    const existingProduct = cart.products.find(
      (p) => p.product._id.toString() === req.params.pid
    );
    if (existingProduct) {
      existingProduct.amount += 1;
    } else {
      cart.products.push({ product: product, amount: 1 });
    }
    await cart.save();

    return res.status(200).json({ message: "Product added to cart", cart });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

CartsCtrl.deleteAllProducts = async (req, res) => {
  try {
    const cart = await CartModel.findById(req.params.cid);
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    cart.products = [];
    await cart.save();

    return res.status(200).json({ message: "Carrito vaciado exitosamente", cart });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

CartsCtrl.deleteProductInCart = async (req, res) => {
  try {
    const cart = await CartModel.findById(req.params.cid);
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    const productIndex = cart.products.findIndex(
      (product) => product.product._id.toString() === req.params.pid
    );
    if (productIndex === -1) {
      return res.status(404).json({ message: "Product not found in cart" });
    }
    cart.products.splice(productIndex, 1);
    await cart.save();

    return res.status(200).json({ message: "Product removed from cart", cart });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

CartsCtrl.updateProductInCart = async (req, res) => {
  try {
    const cart = await CartModel.findById(req.params.cid);
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    const productIndex = cart.products.findIndex(
      (product) => product.product._id.toString() === req.params.pid
    );
    if (productIndex === -1) {
      return res.status(404).json({ message: "Product not found in cart" });
    }
    cart.products[productIndex].amount = req.body.amount;
    await cart.save();

    return res.status(200).json({ message: "Updated cart", cart });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

CartsCtrl.purchase = async (req, res) => {
  try {
    const cart = await CartModel.findById(req.params.cid);
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    let total = 0;
    const failedProducts = [];
    const successfulProducts = [];
    for (let item of cart.products) {
      const product = await ProductModel.findById(item.product);
      if (product.stock < item.amount) {
        failedProducts.push(item);
      } else {
        product.stock -= item.amount;
        await product.save();
        total += product.price * item.amount;
        successfulProducts.push(item);
      }
    }

    if (failedProducts.length > 0) {
      cart.products = failedProducts;
      await cart.save();
      return res.status(400).json({
        message: "Some products could not be processed",
        failedProducts: failedProducts.map((item) => item.product),
      });
    }

    const ticket = new TicketModel({
      purchaser: cart.user,
      amount: total,
      purchase_datetime: new Date(),
    });
    await ticket.save();

    cart.products = [];
    await cart.save();

    res.json({ message: "Purchase completed", ticket });
  } catch (err) {
    res.status(500).json({ message: "Server error", err });
  }
};

export default CartsCtrl;
