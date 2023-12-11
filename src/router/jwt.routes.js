import { Router } from "express";
import { generateToken, authToken } from "../utils.js";
import UserModel from "../dao/mongo/models/user.model.js";

const jwtRouter = Router();

jwtRouter.post("/register", async (req, res) => {
  const user = req.body;

  const result = await UserModel.create(user);

  const access_token = generateToken(result);

  res.send({ status: "success", access_token });
});

jwtRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await UserModel.findOne({ email, password });
  if (!user)
    return res.status(400).send({ status: "error", error: "Invalid credentials" });

  const access_token = generateToken(user);

  res.send({ status: "success", access_token });
});

jwtRouter.post("/private", authToken, (req, res) => {
  res.send({ status: "success", payload: req.user });
});

export default jwtRouter;
