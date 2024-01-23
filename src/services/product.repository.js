export default class ProductRepository {
  constructor(dao) {
    this.dao = dao;
  }

  getProducts = async () => {
    return this.dao.getProducts();
  };
  getProductById = async (id) => {
    return this.dao.getProductById(id);
  };
  createProduct = async (product) => {
    return this.dao.createProduct(product);
  };
}
