export default class CartRepository {
  constructor(dao) {
    this.dao = dao;
  }

  getCarts = async () => {
    return this.dao.getCarts();
  };
  getCartById = async (id) => {
    return this.dao.getCartById(id);
  };
  createCart = async (cart) => {
    return this.dao.createCart(cart);
  };

  addProduct = async (id, product) => {
    const cart = await this.dao.getCartById(id);
    cart.products.push(product);

    return this.dao.updateCart(id, cart);
  };
}
