import { Router } from "express";
import passport from "passport";
import SessionCtrl from "../controllers/session.controller.js";

const SessionRouter = Router();

SessionRouter.post(
  "/login",
  passport.authenticate("login", { session: false }),
  SessionCtrl.loginSession
);

SessionRouter.post(
  "/register",
  passport.authenticate("register", { session: false }),
  SessionCtrl.registerSession
);

SessionRouter.get("/logout", SessionCtrl.logoutSession);

// Github
SessionRouter.get("/error", SessionCtrl.githubError);

SessionRouter.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] }),
  SessionCtrl.githubSession
);

SessionRouter.get(
  "/githubcallback",
  passport.authenticate("github", {
    failureRedirect: "/error",
    session: false,
  }),
  SessionCtrl.githubCallback
);

SessionRouter.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  SessionCtrl.currentSession
);

SessionRouter.post("/forgot-password", SessionCtrl.requestPasswordReset);

export default SessionRouter;
