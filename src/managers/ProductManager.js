import { promises as fs } from 'fs'
import { nanoid } from 'nanoid'

class ProductManager {
    constructor() {
        this.path = "./src/files/products.json"
    }

    readProducts = async () => {
        let products = await fs.readFile(this.path, "utf-8")
        return JSON.parse(products);
    }

    writeProducts = async (product) => {
        await fs.writeFile(this.path, JSON.stringify(product))
    }

    addProducts = async (product) => {
        let oldProducts = await this.readProducts()
        product.id = nanoid()
        let allProducts = [...oldProducts, product]
        await this.writeProducts(allProducts)
        return "Producto agregado"
    };

    getProducts = async () => {
        return await this.readProducts()
    };

    getProductsById = async (id) => {
        let products = await this.readProducts()
        let productById = products.find(p => p.id === id)
        if (!productById) return "Producto no encontrado"
        return productById
    };

    updateProducts = async (id, product) => {
        let products = await this.readProducts()
        let productById = products.find(p => p.id === id)
        if (!productById) return "Producto no encontrado"
        await this.deleteProducts(id)
        let oldProducts = await this.readProducts()
        let productsUpdate = [{ ...product, id: id }, ...oldProducts]
        await this.writeProducts(productsUpdate)
        return "Producto actualizado"
    }

    deleteProducts = async (id) => {
        let products = await this.readProducts()
        let existingProduct = products.some(p => p.id === id)
        if (existingProduct) {
            let filterProducts = products.filter(p => p.id != id)
            await this.writeProducts(filterProducts)
            return "Producto eliminado"
        } else {
            return "Producto no encontrado"
        }
    }
}

export default ProductManager 