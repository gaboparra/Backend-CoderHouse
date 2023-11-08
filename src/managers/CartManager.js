import { promises as fs } from "fs";
import { nanoid } from "nanoid";
import ProductManager from "./ProductManager.js";

const allProducts = new ProductManager("./src/files/products.json");

class CartManager {
  constructor(path) {
    this.path = path;
  }

  readCarts = async () => {
    try {
      let carts = await fs.readFile(this.path, "utf-8");
      return JSON.parse(carts);
    } catch (error) {
      throw new Error("Error al leer carritos: " + error.message);
    }
  };

  writeCarts = async (carts) => {
    try {
      await fs.writeFile(this.path, JSON.stringify(carts));
    } catch (error) {
      throw new Error("Error al escribir carritos: " + error.message);
    }
  };

  addCarts = async () => {
    let oldCarts = await this.readCarts();
    const id = nanoid();
    const newCart = { id, products: [] };

    let allCarts = [...newCart, ...oldCarts];
    await this.writeCarts(allCarts);
    return "Carrito agregado";
  };

  getCartsById = async (id) => {
    try {
      let carts = await this.readCarts();
      let cartById = carts.find((cart) => cart.id === id);
      if (!cartById) return "Carrito no encontrado";
      return cartById;
    } catch (error) {
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
      throw new Error("Error al agregar producto al carrito: " + error.message);
    }
  };
}

export default CartManager;
