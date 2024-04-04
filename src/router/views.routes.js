import { Router } from "express";
import passport from "passport";
import ViewsCtrl from "../controllers/views.controller.js";

const ViewsRouter = Router();

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

ViewsRouter.get(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  auth,
  ViewsCtrl.profileView
);

ViewsRouter.get('/checkout', ViewsCtrl.checkoutView)

ViewsRouter.get('/payment-success', ViewsCtrl.paymentSuccessView)

ViewsRouter.get('/payment-error', ViewsCtrl.paymentErrorView)

export default ViewsRouter;
