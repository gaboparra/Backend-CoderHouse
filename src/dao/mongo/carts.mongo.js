import CartModel from "./models/carts.model.js";

export default class User {
  getCarts = async () => {
    return CartModel.find();
  };
  getCartById = async (id) => {
    return CartModel.findById(id);
  };
  createCart = async (cart) => {
    return CartModel.create(cart);
  };
  updateCart = async (id, cart) => {
    return CartModel.updateOne({ _id: id }, { $set: cart });
  };
}
