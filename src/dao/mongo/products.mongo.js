import ProductModel from "./models/products.model.js";

export default class Product {
  getProducts = async () => {
    return ProductModel.find();
  };
  getProductById = async (id) => {
    return ProductModel.findById(id);
  };
  createProduct = async (product) => {
    return ProductModel.create(product);
  };
  updateProduct = async (id, product) => {
    return ProductModel.updateOne({ _id: id }, { $set: product });
  };
  deleteProduct = async (id) => {
    return ProductModel.deleteOne(id);
  };
}
