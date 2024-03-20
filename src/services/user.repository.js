export default class UserRepository {
  constructor(dao) {
    this.dao = dao;
  }

  getUsers = async () => {
    return await this.dao.getUsers();
  };
  getUserById = async (id) => {
    return await this.dao.getUserById(id);
  };
  register = async (user) => {
    return await this.dao.createUser(user);
  };
  updateUser = async (id, user) => {
    return await this.dao.updateOne({ _id: id }, { $set: user });
  };
  deleteUser = async (id) => {
    return await this.dao.deleteOne(id);
  };
}
