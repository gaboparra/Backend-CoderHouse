import UserModel from "./models/user.model.js";

export default class User {
  getUsers = async () => {
    return await UserModel.find();
  };
  getUserById = async (id) => {
    return await UserModel.findById(id);
  };
  createUser = async (user) => {
    return await UserModel.create(user);
  };
  updateUser = async (id, user) => {
    return await UserModel.updateOne({ _id: id }, { $set: user });
  };
  deleteUser = async (id) => {
    return await UserModel.deleteOne(id);
  };
}
