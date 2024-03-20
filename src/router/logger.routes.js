import { Router } from "express";
import { addLogger } from "../utils/logger.js";

const loggerRouter = Router();

loggerRouter.get("/loggerTest", addLogger, (req, res) => {
  req.logger.debug("Esto es un mensaje de debug");
  req.logger.http("Esto es un mensaje HTTP");
  req.logger.info("Esto es un mensaje de información");
  req.logger.warning("Esto es un mensaje de advertencia");
  req.logger.error("Esto es un mensaje de error");
  req.logger.fatal("Esto es un mensaje fatal");

  res.send("Prueba de todos los loggers realizada");
});

export default loggerRouter;
