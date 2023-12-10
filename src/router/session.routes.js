import { Router } from "express";
// import UserModel from "../dao/mongo/models/user.model.js";
import passport from "passport";
// import { createHash, isValidPassword } from "../utils.js";

const UserRouter = Router();

UserRouter.post(
  "/login",
  passport.authenticate('login', { failureRedirect: '/' }),
  async (req, res) => {
    if (!req.user) return res.status(400).send('Invalid credentials')

    req.session.user = req.user
    return res.send('Logged.')
  });

UserRouter.post(
  "/register",
  passport.authenticate('register', { failureRedirect: '/' }),
  async (req, res) => {
    res.send('Registered')
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
