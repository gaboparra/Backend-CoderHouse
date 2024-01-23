export default class UserRepository {
  constructor(dao) {
    this.dao = dao;
  }

  getUsers = async () => {
    return this.dao.getUsers();
  };
  getUserById = async (id) => {
    return this.dao.getUserById(id);
  };
  register = async (user) => {
    return this.dao.createUser(user);
  };
}
