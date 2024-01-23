import UserModel from "./models/user.model.js";

export default class User {
  getUsers = async () => {
    return UserModel.find();
  };
  getUserById = async (id) => {
    return UserModel.findById(id);
  };
  createUser = async (user) => {
    return UserModel.create(user);
  };
  // updateUser = async (id, user) => { return UserModel.updateOne({ _id: id }, { $set: user }) }
}
