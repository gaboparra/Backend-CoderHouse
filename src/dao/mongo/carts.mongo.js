import CartModel from "./models/carts.model.js";

export default class Cart {
  getCarts = async () => {
    return await CartModel.find();
  };
  getCartById = async (id) => {
    return await CartModel.findById(id);
  };
  createCart = async (cart) => {
    return await CartModel.create(cart);
  };
  deleteCart = async (id) => {
    return await CartModel.deleteOne(id);
  };
  updateCart = async (id, cart) => {
    return await CartModel.updateOne({ _id: id }, { $set: cart });
  };
}
