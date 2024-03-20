export default class ProductRepository {
  constructor(dao) {
    this.dao = dao;
  }

  getProducts = async () => {
    return await this.dao.getProducts();
  };
  getProductById = async (id) => {
    return await this.dao.getProductById(id);
  };
  createProduct = async (product) => {
    return await this.dao.createProduct(product);
  };
  updateProduct = async (id, product) => {
    return await this.dao.updateOne({ _id: id }, { $set: product });
  };
  deleteProduct = async (id) => {
    return await this.dao.deleteOne(id);
  };
}
