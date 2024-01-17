import { Router } from "express";
import { authToken } from "../utils.js";
import JwtCtrl from "../controllers/jwt.controller.js";

const jwtRouter = Router();

jwtRouter.post("/register", JwtCtrl.registerJwt);

jwtRouter.post("/login", JwtCtrl.loginJwt);

jwtRouter.post("/private", authToken, JwtCtrl.privateJwt);

export default jwtRouter;
