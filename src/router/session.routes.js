import { Router } from "express";
import passport from "passport";
import SessionCtrl from "../controllers/session.controller.js";

const UserRouter = Router();

UserRouter.post(
  "/login",
  passport.authenticate("login", { session: false }),
  SessionCtrl.loginSession
);

UserRouter.post(
  "/register",
  passport.authenticate("register", { session: false }),
  SessionCtrl.registerSession
);

UserRouter.get("/logout", SessionCtrl.logoutSession);

// Github
UserRouter.get("/error", SessionCtrl.githubError);

UserRouter.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] }),
  SessionCtrl.githubSession
);

UserRouter.get(
  "/githubcallback",
  passport.authenticate("github", {
    failureRedirect: "/error",
    session: false,
  }),
  SessionCtrl.githubCallback
);

UserRouter.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  SessionCtrl.currentSession
);

export default UserRouter;
