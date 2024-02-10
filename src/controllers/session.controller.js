import jwt from "jsonwebtoken";
import config from "../config/config.js";
import logger from "../utils/logger.js";

const SessionCtrl = {};

SessionCtrl.loginSession = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(400).render("login", { error: "Credenciales inválidas" });
    }

    const { token } = req.user;

    req.session.user = {
      _id: req.user._id,
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      email: req.user.email,
      age: req.user.age,
      cart: req.user.cart,
      role: req.user.role,
    };

    return res.cookie("cookieJWT", token, {
      maxAge: 60 * 60 * 1000,
      httpOnly: true}).redirect("/");

  } catch (error) {
    logger.error("Error during login:", error);
    return res.status(500).render("error", { message: "Error during login" });
  }
};

SessionCtrl.registerSession = async (req, res) => {
  try {
    res.send("Registered");
  } catch (error) {
    logger.error("Error during registration:", error);
    return res.status(500).render("error", { message: "Error during registration" });
  }
};

SessionCtrl.logoutSession = (req, res) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        logger.error("Error during logout:", err);
        return res.status(500).render("error", { message: "Error during logout" });
      }

      return res.redirect("/");
    });
  } catch (error) {
    logger.error("Error during logout:", error);
    return res.status(500).render("error", { message: "Error during logout" });
  }
};

SessionCtrl.githubError = (req, res) => res.send("Error");
SessionCtrl.githubSession = async (req, res) => {};
SessionCtrl.githubCallback = (req, res) => {
  if (!req.user) {
    return res.status(400).send("Invalid Github");
  }

  res.cookie("cookieJWT", req.user.token).redirect("/");
};

SessionCtrl.currentSession = (req, res) => {
  try {
    const token = req.cookies.token;

    const payload = jwt.verify(token, config.PRIVATE_KEY);
    if (!payload)
      return res.status(401).json({ status: "failed", message: "User not found" });

    req.user = payload;

    return res.status(200).json(req.user);
  } catch (error) {
    logger.error("User not found:", error);
    return res.status(500).render("error", { message: "User not found" });
  }
};

export default SessionCtrl;
