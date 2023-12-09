import { Router } from "express";
import UserModel from "../dao/mongo/models/user.model.js";

const UserRouter = Router();

UserRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email, password });

    if (!user) {
      return res.status(404).send("User not found");
    }

    req.session.user = user;
    return res.redirect("/home");
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).render("error", { message: "Error during login" });
  }
});

UserRouter.post("/register", async (req, res) => {
  try {
    const user = req.body;
    await UserModel.create(user);

    return res.redirect("/");
  } catch (error) {
    console.error("Error during user registration:", error);
    return res.status(500).render("error", { message: "Error during user registration" });
  }
});

UserRouter.get("/logout", (req, res) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        console.error("Error during logout:", err);
        return res.status(500).render("error", { message: "Error during logout" });
      }

      return res.redirect("/");
    });
  } catch (error) {
    console.error("Error during logout:", error);
    return res.status(500).render("error", { message: "Error during logout" });
  }
});

export default UserRouter;
