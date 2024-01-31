import ProductModel from "../dao/mongo/models/products.model.js";
import { generateProducts } from "../utils.js";

const ProductsCtrl = {};

ProductsCtrl.getProducts = async (req, res) => {
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

    res.json({ status: "success", payload: products });
  } catch (error) {
    console.error("Error in GET /", error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};

ProductsCtrl.mockingProducts = async (req, res) => {
  const products = [];

  for (let i = 0; i < 100; i++) {
    products.push(generateProducts());
  }

  res.send({ status: "success", products });
};

ProductsCtrl.getProductById = async (req, res) => {
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
};

ProductsCtrl.createProduct = async (req, res) => {
  try {
    const data = req.body;
    const result = await ProductModel.create(data);
    res.json({ status: "success", payload: result });
  } catch (error) {
    console.error("Error in POST /", error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};

ProductsCtrl.deleteProduct = async (req, res) => {
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
};

ProductsCtrl.updateProduct = async (req, res) => {
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
};

export default ProductsCtrl;
