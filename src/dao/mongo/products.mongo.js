import ProductModel from "./models/products.model.js";

export default class Product {
  getProducts = async () => {
    return await ProductModel.find();
  };
  getProductById = async (id) => {
    return await ProductModel.findById(id);
  };
  createProduct = async (product) => {
    return await ProductModel.create(product);
  };
  updateProduct = async (id, product) => {
    return await ProductModel.updateOne({ _id: id }, { $set: product });
  };
  deleteProduct = async (id) => {
    return await ProductModel.deleteOne(id);
  };
}
