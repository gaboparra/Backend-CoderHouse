import { Router } from "express";
import passport from "passport";
import { authToken } from "../utils.js";
import JwtCtrl from "../controllers/jwt.controller.js";

const jwtRouter = Router();

jwtRouter.post(
  "/register",
  passport.authenticate("register", { session: false }),
  JwtCtrl.registerJwt
);

jwtRouter.post(
  "/login",
  passport.authenticate("login", { session: false }),
  JwtCtrl.loginJwt
);

jwtRouter.post("/private", authToken, JwtCtrl.privateJwt);

export default jwtRouter;
