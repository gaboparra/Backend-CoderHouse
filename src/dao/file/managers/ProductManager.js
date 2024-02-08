import { promises as fs } from "fs";
import { nanoid } from "nanoid";
import logger from "../../../utils/logger.js";
class ProductManager {
  constructor(path) {
    this.path = path;
  }

  readProducts = async () => {
    try {
      let products = await fs.readFile(this.path, "utf-8");
      return JSON.parse(products);
    } catch (error) {
      logger.error("Error al leer productos:", error);
      throw new Error("Error al leer productos: " + error.message);
    }
  };

  writeProducts = async (product) => {
    try {
      await fs.writeFile(this.path, JSON.stringify(product));
    } catch (error) {
      logger.error("Error al escribir productos:", error);
      throw new Error("Error al escribir productos: " + error.message);
    }
  };

  addProducts = async (product) => {
    try {
      if (
        !product ||
        !product.title ||
        !product.description ||
        !product.price ||
        !product.stock
      ) {
        throw new Error(
          "Los campos 'title' y 'price' son obligatorios para agregar un producto"
        );
      }

      let oldProducts = await this.readProducts();
      const codeExists = oldProducts.some((p) => p.id === product.id);

      if (codeExists) {
        throw new Error("El código de producto ya existe.");
      }

      product.id = nanoid();
      let allProducts = [...oldProducts, product];
      await this.writeProducts(allProducts);
      return "Producto agregado";
    } catch (error) {
      logger.error("Error al agregar productos:", error);
      throw new Error("Error al agregar productos: " + error.message);
    }
  };

  getProducts = async () => {
    try {
      return await this.readProducts();
    } catch (error) {
      logger.error("Error al obtener productos:", error);
      throw new Error("Error al obtener productos: " + error.message);
    }
  };

  getProductsById = async (id) => {
    try {
      let products = await this.readProducts();
      let productById = products.find((p) => p.id === id);
      if (!productById) return "Producto no encontrado";
      return productById;
    } catch (error) {
      logger.error("Error al obtener producto por ID:", error);
      throw new Error("Error al obtener producto por ID: " + error.message);
    }
  };

  updateProducts = async (id, product) => {
    try {
      let products = await this.readProducts();
      let productById = products.find((p) => p.id === id);
      if (!productById) return "Producto no encontrado";
      let oldProducts = products.filter((p) => p.id != id);
      let productUpdated = { ...productById, ...product };
      oldProducts.push(productUpdated);
      await this.writeProducts(oldProducts);
      return "Producto actualizado";
    } catch (error) {
      logger.error("Error al actualizar productos:", error);
      throw new Error("Error al actualizar productos: " + error.message);
    }
  };

  deleteProducts = async (id) => {
    try {
      let products = await this.readProducts();
      let existingProduct = products.some((p) => p.id === id);
      if (existingProduct) {
        let filterProducts = products.filter((p) => p.id != id);
        await this.writeProducts(filterProducts);
        return "Producto eliminado";
      } else {
        return "Producto no encontrado";
      }
    } catch (error) {
      logger.error("Error al eliminar productos:", error);
      throw new Error("Error al eliminar productos: " + error.message);
    }
  };
}

export default ProductManager;
