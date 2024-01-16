import { Router } from "express";
// import ProductManager from "../dao/file/managers/ProductManager.js";
import ViewsCtrl from "../controllers/views.controller.js";

const ViewsRouter = Router();
// const product = new ProductManager("./src/dao/files/products.json");

function sessionActive(req, res, next) {
  if (req.session?.user) return res.redirect("/profile");
  return next();
}

function auth(req, res, next) {
  if (req.session?.user) return next();
  res.redirect("/login");
}

ViewsRouter.get("/", ViewsCtrl.homeProducts);

ViewsRouter.get("/realTimeProducts", ViewsCtrl.realTimeProducts);

ViewsRouter.get("/carts/:cid", ViewsCtrl.cartView);

ViewsRouter.get("/login", sessionActive, ViewsCtrl.loginView);

ViewsRouter.get("/register", sessionActive, ViewsCtrl.registerView);

ViewsRouter.get("/profile", auth, ViewsCtrl.profileView);

export default ViewsRouter;
