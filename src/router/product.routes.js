import { Router } from "express";
import ProductManager from "../managers/ProductManager.js";

const ProductRouter = Router()
const product = new ProductManager();

ProductRouter.get("/", async (req, res) => {
    try {
        res.send(await product.getProducts())
    } catch (error) {
        return res.status(500).send("Error al obtener productos" + error);
    }
});

ProductRouter.get("/:id", async (req, res) => {
    try {
        let id = req.params.id
        res.send(await product.getProductsById(id))
    } catch (error) {
        return res.status(500).send("Error al obtener producto por ID" + error);
    }
});

ProductRouter.post("/", async (req, res) => {
    try {
        let newProduct = req.body
        res.send(await product.addProducts(newProduct))
    } catch (error) {
        return res.status(500).send("Error al agregar producto" + error);
    }
});

ProductRouter.put("/:id", async (req, res) => {
    try {
        let id = req.params.id
        let updateProduct = req.body;
        res.send(await product.updateProducts(id, updateProduct))
    } catch (error) {
        return res.status(500).send("Error al actualizar producto" + error);
    }
});

ProductRouter.delete("/:id", async (req, res) => {
    try {
        let id = req.params.id
        res.send(await product.deleteProducts(id))
    } catch (error) {
        return res.status(500).send("Error al eliminar producto" + error);
    }
});

export default ProductRouter;

