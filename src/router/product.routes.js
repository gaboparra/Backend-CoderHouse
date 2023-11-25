import { Router } from "express";
// import ProductManager from "../dao/file/managers/ProductManager.js";
import ProductModel from "../dao/mongo/models/products.model.js";

const ProductRouter = Router();
// const product = new ProductManager("./src/files/products.json");

ProductRouter.get("/", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const sort = req.query.sort || {};
    const query = req.query.query || {};

    const products = await ProductModel.paginate(query, {
      page,
      limit,
      sort,
      lean: true,
    });
    // const products = await ProductModel.find().lean().exec();

    res.json({ status: "success", payload: products });
  } catch (error) {
    console.error("Error in GET /", error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
});

ProductRouter.get("/:pid", async (req, res) => {
  try {
    const productId = req.params.pid;
    const product = await ProductModel.findById(productId);
    if (product) {
      res.json({ status: "success", payload: product });
    } else {
      res.status(404).json({ status: "error", message: "Product not found" });
    }
  } catch (error) {
    console.error(`Error in GET /${req.params.pid}`, error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
});

ProductRouter.post("/", async (req, res) => {
  try {
    const data = req.body;
    const result = await ProductModel.create(data);
    res.json({ status: "success", payload: result });
  } catch (error) {
    console.error("Error in POST /", error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
});

ProductRouter.delete("/:pid", async (req, res) => {
  try {
    const productId = req.params.pid;
    const product = await ProductModel.findByIdAndDelete(productId);
    if (product) {
      res.json({ status: "Removed product" });
    } else {
      res.status(404).json({ status: "error", message: "Product not found" });
    }
  } catch (error) {
    console.error(`Error in DELETE /${req.params.pid}`, error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
});

ProductRouter.put("/:pid", async (req, res) => {
  try {
    const productId = req.params.pid;
    const updateProduct = req.body;
    const product = await ProductModel.findByIdAndUpdate(
      productId,
      updateProduct
    );
    if (product) {
      res.json({ status: "Updated product" });
    } else {
      res.status(404).json({ status: "error", message: "Product not found" });
    }
  } catch (error) {
    console.error(`Error in PUT /${req.params.pid}`, error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
});

// ProductRouter.get("/", async (req, res) => {
//   try {
//     let products = await product.getProducts();
//     res.status(200).json(products);
//   } catch (error) {
//     return res.status(500).send("Error al obtener productos" + error);
//   }
// });

// ProductRouter.get("/:id", async (req, res) => {
//   try {
//     let id = req.params.id;
//     res.send(await product.getProductsById(id));
//   } catch (error) {
//     return res.status(500).send("Error al obtener producto por ID" + error);
//   }
// });

// ProductRouter.post("/", async (req, res) => {
//   try {
//     let newProduct = req.body;
//     res.send(await product.addProducts(newProduct));
//   } catch (error) {
//     return res.status(500).send("Error al agregar producto" + error);
//   }
// });

// ProductRouter.put("/:id", async (req, res) => {
//   try {
//     let id = req.params.id;
//     let updateProduct = req.body;
//     res.send(await product.updateProducts(id, updateProduct));
//   } catch (error) {
//     return res.status(500).send("Error al actualizar producto" + error);
//   }
// });

// ProductRouter.delete("/:id", async (req, res) => {
//   try {
//     let id = req.params.id;
//     res.send(await product.deleteProducts(id));
//   } catch (error) {
//     return res.status(500).send("Error al eliminar producto" + error);
//   }
// });

export default ProductRouter;
