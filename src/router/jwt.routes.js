import { Router } from "express";
import { generateToken, authToken } from "../utils.js";
import UserModel from "../dao/mongo/models/user.model.js";

const jwtRouter = Router();

jwtRouter.post("/register", async (req, res) => {
  const user = req.body;

  try {
    const result = await UserModel.create(user);
    const access_token = generateToken(result);
    res.send({ status: "success", access_token });
  } catch (error) {
    console.error("Error when registering:", error);
    res.status(500).send({ status: "error", error: "Error when registering" });
  }
});

jwtRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UserModel.findOne({ email, password });
    if (!user)
      return res.status(400).send({ status: "error", error: "Invalid credentials" });

    const access_token = generateToken(user);

    req.session.user = user;

    res.redirect("/");
  } catch (error) {
    console.error("Error when logging in:", error);
    res.status(500).send({ status: "error", error: "Error when logging in" });
  }
});

jwtRouter.post("/private", authToken, (req, res) => {
  res.send({ status: "success", payload: req.user });
});

export default jwtRouter;
