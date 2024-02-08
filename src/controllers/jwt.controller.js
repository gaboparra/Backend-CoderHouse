import UserModel from "../dao/mongo/models/user.model.js";
import { generateToken } from "../utils.js";
import logger from "../utils/logger.js";

const JwtCtrl = {};

JwtCtrl.registerJwt = async (req, res) => {
  const user = req.body;

  try {
    const result = await UserModel.create(user);
    const access_token = generateToken(result);

    req.session.user = user;

    res.cookie("token", access_token, { httpOnly: true });

    res.redirect("/");
  } catch (error) {
    logger.error("Error when registering:", error);
    res.status(500).send({ status: "error", error: "Error when registering" });
  }
};

JwtCtrl.loginJwt = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UserModel.findOne({ email, password });
    if (!user)
      return res.status(400).send({ status: "error", error: "Invalid credentials" });

    const access_token = generateToken(user);

    req.session.user = user;

    res.redirect("/");
  } catch (error) {
    logger.error("Error when logging in:", error);
    res.status(500).send({ status: "error", error: "Error when logging in" });
  }
};

JwtCtrl.privateJwt = (req, res) => {
  res.send({ status: "success", payload: req.user });
};

export default JwtCtrl;
