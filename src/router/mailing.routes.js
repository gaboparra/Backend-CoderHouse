import { Router } from "express";
import MailingCtrl from "../controllers/mailing.controller.js";

const MailingRouter = Router();

MailingRouter.get("/mail", MailingCtrl.sendMail);

export default MailingRouter;
