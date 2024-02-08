import { promises as fs } from "fs";
import { nanoid } from "nanoid";
import ProductManager from "./ProductManager.js";
import logger from "../../../utils/logger.js";

const allProducts = new ProductManager("./src/dao/files/products.json");
class CartManager {
  constructor(path) {
    this.path = path;
  }

  readCarts = async () => {
    try {
      let carts = await fs.readFile(this.path, "utf-8");
      return JSON.parse(carts);
    } catch (error) {
      logger.error("Error al leer carritos:", error);
      throw new Error("Error al leer carritos: " + error.message);
    }
  };

  writeCarts = async (carts) => {
    try {
      await fs.writeFile(this.path, JSON.stringify(carts));
    } catch (error) {
      logger.error("Error al escribir carritos:", error);
      throw new Error("Error al escribir carritos: " + error.message);
    }
  };

  addCarts = async () => {
    try {
      let oldCarts = await this.readCarts();
      const id = nanoid();
      const newCart = { id, products: [] };

      let allCarts = [...newCart, ...oldCarts];
      await this.writeCarts(allCarts);
      return "Carrito agregado";
    } catch (error) {
      logger.error("Error al agregar carrito:", error);
      throw new Error("Error al agregar carrito: " + error.message);
    }
  };

  getCartsById = async (id) => {
    try {
      let carts = await this.readCarts();
      let cartById = carts.find((cart) => cart.id === id);
      if (!cartById) return "Carrito no encontrado";
      return cartById;
    } catch (error) {
      logger.error("Error al obtener carrito por ID:", error);
      throw new Error("Error al obtener carrito por ID: " + error.message);
    }
  };

  addProductInCart = async (cartId, productId) => {
    try {
      let carts = await this.readCarts();
      let cartById = carts.find((cart) => cart.id === cartId);
      if (!cartById) return "Carrito no encontrado";

      let products = await allProducts.readProducts();
      let productById = products.find((p) => p.id === productId);
      if (!productById) return "Producto no encontrado";

      if (cartById.products.some((p) => p.id === productId)) {
        let existingProduct = cartById.products.find((p) => p.id === productId);
        existingProduct.quantity++;
      } else {
        cartById.products.push({ id: productById.id, quantity: 1 });
      }

      let allCarts = await this.readCarts();
      let cartFilter = allCarts.filter((cart) => cart.id !== cartId);

      let updatedCarts = [cartById, ...cartFilter];
      await this.writeCarts(updatedCarts);

      return "Producto agregado al carrito";
    } catch (error) {
      logger.error("Error al agregar producto al carrito:", error);
      throw new Error("Error al agregar producto al carrito: " + error.message);
    }
  };
}

export default CartManager;
