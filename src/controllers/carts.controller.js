import CartModel from "../dao/mongo/models/carts.model.js";
import ProductModel from "../dao/mongo/models/products.model.js";
import TicketModel from "../dao/mongo/models/ticket.model.js";
import logger from "../utils/logger.js";

const CartsCtrl = {};

CartsCtrl.getCarts = async (req, res) => {
  try {
    let carts = await CartModel.find();
    if (carts.length === 0) {
      carts = [new CartModel()];
      await CartModel.insertMany(carts);
    }
    res.json({ status: "success", payload: carts });
  } catch (error) {
    logger.error("Error in GET /carts:", error);
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
    logger.error(`Error in GET /carts/${req.params.cid}:`, error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};

CartsCtrl.createCart = async (req, res) => {
  try {
    const newCart = new CartModel();
    await newCart.save();

    res.status(201).json({ message: "Cart created successfully", cart: newCart });
  } catch (error) {
    logger.error("Error creating cart:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

CartsCtrl.addProductInCart = async (req, res) => {
  try {
    const product = await ProductModel.findById(req.params.pid);
    if (!product) {
      logger.error("Product not found");
      return res.status(404).json({ message: "Product not found" });
    }

    let cart = await CartModel.findById(req.params.cid);
    if (!cart) {
      cart = new CartModel();
      await cart.save();
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

    logger.info("Product added to cart:", product);
    return res.status(200).json({ message: "Product added to cart", cart });
  } catch (error) {
    logger.error("Error adding product to cart:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

CartsCtrl.deleteAllProducts = async (req, res) => {
  try {
    const cart = await CartModel.findById(req.params.cid);
    if (!cart) {
      logger.error("Cart not found");
      return res.status(404).json({ message: "Cart not found" });
    }
    cart.products = [];
    await cart.save();

    logger.info("Cart emptied successfully");
    return res.status(200).json({ message: "Cart successfully emptied", cart });
  } catch (error) {
    logger.error("Error emptying cart:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

CartsCtrl.deleteProductInCart = async (req, res) => {
  try {
    const cart = await CartModel.findById(req.params.cid);
    if (!cart) {
      logger.error("Cart not found");
      return res.status(404).json({ message: "Cart not found" });
    }
    const productIndex = cart.products.findIndex(
      (product) => product.product._id.toString() === req.params.pid
    );
    if (productIndex === -1) {
      logger.error("Product not found in cart");
      return res.status(404).json({ message: "Product not found in cart" });
    }
    cart.products.splice(productIndex, 1);
    await cart.save();

    logger.info("Product removed from cart");
    return res.status(200).json({ message: "Product removed from cart", cart });
  } catch (error) {
    logger.error("Error removing product from cart:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

CartsCtrl.updateProductInCart = async (req, res) => {
  try {
    const cart = await CartModel.findById(req.params.cid);
    if (!cart) {
      logger.error("Cart not found");
      return res.status(404).json({ message: "Cart not found" });
    }
    const productIndex = cart.products.findIndex(
      (product) => product.product._id.toString() === req.params.pid
    );
    if (productIndex === -1) {
      logger.error("Product not found in cart");
      return res.status(404).json({ message: "Product not found in cart" });
    }
    cart.products[productIndex].amount = req.body.amount;
    await cart.save();

    logger.info("Updated cart");
    return res.status(200).json({ message: "Updated cart", cart });
  } catch (error) {
    logger.error("Error updating cart:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

CartsCtrl.purchase = async (req, res) => {
  try {
    const cart = await CartModel.findById(req.params.cid);
    if (!cart) {
      logger.error("Cart not found");
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

      logger.error("Some products could not be processed");
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

    logger.info("Purchase completed");
    res.json({ message: "Purchase completed", ticket });
  } catch (err) {
    logger.error("Server error:", err);
    res.status(500).json({ message: "Server error", err });
  }
};

export default CartsCtrl;
