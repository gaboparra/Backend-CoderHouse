export default class CartRepository {
  constructor(dao) {
    this.dao = dao;
  }

  getCarts = async () => {
    return await this.dao.getCarts();
  };
  getCartById = async (id) => {
    return await this.dao.getCartById(id);
  };
  createCart = async (cart) => {
    return await this.dao.createCart(cart);
  };
  addProduct = async (id, product) => {
    const cart = await this.dao.getCartById(id);
    cart.products.push(product);

    return await this.dao.updateCart(id, cart);
  };
  deleteCart = async (id) => {
    return await this.dao.deleteOne(id);
  };
  updateCart = async (id, cart) => {
    return await this.dao.updateOne({ _id: id }, { $set: cart });
  };
}
