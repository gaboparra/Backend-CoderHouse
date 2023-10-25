import { promises as fs } from 'fs'
import { nanoid } from 'nanoid'
import ProductManager from './ProductManager.js'

const allProducts = new ProductManager

class CartManager {
    constructor() {
        this.path = "./src/files/cart.json";
    }

    readCarts = async () => {
        let carts = await fs.readFile(this.path, "utf-8")
        return JSON.parse(carts);
    }

    writeCarts = async (carts) => {
        await fs.writeFile(this.path, JSON.stringify(carts))
    }

    addCarts = async () => {
        let oldCarts = await this.readCarts()
        let id = nanoid()
        let carts = [{ id: id, products: [] }, ...oldCarts]
        await this.writeCarts(carts)
        return "Carrito agregado"
    }

    getCartsById = async (id) => {
        let carts = await this.readCarts()
        let cartById = carts.find(cart => cart.id === id)
        if (!cartById) return "Carrito no encontrado"
        return cartById
    };

    addProductInCart = async (cartId, productId) => {
        let carts = await this.readCarts()
        let cartById = carts.find(cart => cart.id === cartId)
        if (!cartById) return "Carrito no encontrado"
        let products = await allProducts.readProducts()
        let productById = products.find(p => p.id === productId)
        if (!productById) return "Producto no encontrado"

        let allCarts = await this.readCarts()
        let cartFilter = allCarts.filter(cart => cart.id != cartId)

        if (cartById.products.some(p => p.id === productId)) {
            let moreProductInCart = cartById.products.find(p => p.id === productId)
            moreProductInCart.quantity++
            let cart = [cartById, ...cartFilter]
            await this.writeCarts(cart)
            return "Producto agregado al carrito"
        }
        cartById.products.push({ id: productById.id, quantity: 1 })
        let cart = [cartById, ...cartFilter]
        await this.writeCarts(cart)
        return "Producto agregado al carrito"
    }
}

export default CartManager



