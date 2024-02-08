import winston from "winston";
import config from "../config/config.js";

const customLevels = {
  levels: {
    fatal: 0,
    error: 1,
    warning: 2,
    info: 3,
    http: 4,
    debug: 5,
  },
  colors: {
    fatal: "magenta",
    error: "red",
    warning: "yellow",
    info: "cyan",
    http: "green",
    debug: "blue",
  },
};
winston.addColors(customLevels.colors);

// Logger para desarrollo
const developmentLogger = winston.createLogger({
  levels: customLevels.levels,
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.simple()
  ),
  transports: [new winston.transports.Console({ level: "debug" })],
});

// Logger para producción
const productionLogger = winston.createLogger({
  levels: customLevels.levels,
  format: winston.format.json(),
  transports: [
    new winston.transports.Console({ level: "info" }),
    new winston.transports.File({ filename: "./errors.log", level: "error" }),
  ],
});

// Selección del logger basado en el entorno
const logger = config.NODE_ENV === "production" ? productionLogger : developmentLogger;

// Middleware para agregar el logger a cada solicitud
export const addLogger = (req, res, next) => {
  req.logger = logger;
  req.logger.info(`[${req.method}] ${req.url} - ${new Date().toLocaleTimeString()}`);
  next();
};

export default logger;
