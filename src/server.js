import express from "express"
import ProductManager from "../productManager.js"

const app = express();
const products = new ProductManager();
const readProducts = products.readProducts();

app.get("/products", async (req, res) => {
    let limit = parseInt(req.query.limit);
    if (!limit) return res.send(await readProducts)

    let allProducts = await readProducts
    let productLimit = allProducts.slice(0, limit)
    res.send(productLimit);
});

app.get("/products/:id", async (req, res) => {
    let id = parseInt(req.params.id)
    let allProducts = await readProducts
    let productById = allProducts.find(product => product.id === id)
    res.send(productById)
})

const PORT = 8080
const server = app.listen(PORT, () => console.log(`Local Host ${PORT}`))

//http://localhost:8080/