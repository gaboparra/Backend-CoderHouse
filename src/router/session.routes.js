import { Router } from "express";
// import UserModel from "../dao/mongo/models/user.model.js";
import passport from "passport";
// import { createHash, isValidPassword } from "../utils.js";

const UserRouter = Router();

UserRouter.post("/login", passport.authenticate("login"), async (req, res) => {
  try {
    if (!req.user) return res.status(400).send("Invalid credentials");

    req.session.user = {
      _id: req.user._id,
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      email: req.user.email,
      age: req.user.age,
      cart: req.user.cart,
      role: req.user.role,
    };

    return res.redirect("/");
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).render("error", { message: "Error during login" });
  }
});

UserRouter.post("/register", passport.authenticate("register"), async (req, res) => {
  try {
    res.send("Registered");
  } catch (error) {
    console.error("Error during registration:", error);
    return res.status(500).render("error", { message: "Error during registration" });
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

// Github
UserRouter.get("/error", (req, res) => res.send("Error"));

UserRouter.get("/github", passport.authenticate("github", { scope: ["user: email"] }), async (req, res) => { });

UserRouter.get("/githubcallback", passport.authenticate("github", { failureRedirect: "/error" }), (req, res) => {

  req.session.user = req.user;

  res.redirect("/");
});

export default UserRouter;
