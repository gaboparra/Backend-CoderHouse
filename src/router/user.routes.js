import { Router } from "express";
import passport from "passport";
import { authorization } from "../middlewares/auth.middleware.js";
import UserRepository from "../repositories/user.repository.js";

const UserRouter = Router();
const userRepository = new UserRepository();

UserRouter.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  authorization("admin"),
  async (req, res) => {
    try {
      const users = await userRepository.getUsers();

      const usersInfo = users.map((user) => ({
        _id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role: user.role,
      }));
      res.status(200).json(usersInfo);
    } catch (error) {
      console.error("Error getting users:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

UserRouter.delete(
  "/",
  passport.authenticate("jwt", { session: false }),
  authorization("admin"),
  async (req, res) => {
    try {
      const users = await userRepository.getUsers();

      const inactiveUsers = users.filter((user) => {
        const twoDaysAgo = new Date();
        twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
        return user.last_login < twoDaysAgo;
      });

      for (const user of inactiveUsers) {
        await userRepository.deleteUser(user._id);

        await sendInactiveUserEmail(user.email);
      }

      res.status(200).json({ message: "Inactive users successfully deleted" });
    } catch (error) {
      console.error("Error deleting inactive users:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

export default UserRouter;
