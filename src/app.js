import express from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import handlebars from "express-handlebars";
import mongoose from "mongoose";
import { Server } from "socket.io";
import passport from "passport";
import initializePassport from "./config/passport.config.js";
import cookieParser from "cookie-parser";
import config from "./config/config.js";
import logger from "./utils/logger.js";
import swaggerJSDoc from "swagger-jsdoc";
import SwaggerUiExpress from "swagger-ui-express";
import cors from "cors";

import __dirname from "./utils.js";
import ProductRouter from "./router/product.routes.js";
import CartRouter from "./router/cart.routes.js";
import ViewsRouter from "./router/views.routes.js";
import SessionRouter from "./router/session.routes.js";
import jwtRouter from "./router/jwt.routes.js";
import ProductManager from "./dao/file/managers/ProductManager.js";
import MailingRouter from "./router/mailing.routes.js";
import LoggerRouter from "./router/logger.routes.js";
import PaymentRouter from "./router/payment.routes.js";

// Variables
const app = express();

// Cors
app.use(cors());

// Configuración Handlebars
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", express.static(__dirname + "/public"));

// Configuración Session
app.use(
  session({
    store: MongoStore.create({
      mongoUrl: config.mongoURL,
      dbName: config.mongoDBName,
    }),
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

// Cookie
app.use(cookieParser());

// Passport
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

// Rutas
app.use("/", ViewsRouter);
app.use("/", SessionRouter);
app.use("/", jwtRouter);
app.use("/", MailingRouter);
app.use("/", LoggerRouter);
app.use("/api/products", ProductRouter);
app.use("/api/carts", CartRouter);
app.use("/api/payments", PaymentRouter);

// MongoDB
mongoose.connect(config.mongoURL, { dbName: config.mongoDBName })
  .then(() => {
    logger.info("Connected to the database.");
  })
  .catch((error) => {
    logger.error("Error connecting to the database:", error.message);
  });

const server = app.listen(config.port, () =>
  logger.info(`Server is running on port ${config.port}`)
);

// Swagger
const swaggerOptions = {
  definition: {
    openapi: "3.0.1",
    info: {
      title: "Documentación de Ecommerce",
      description: "Descripción",
    },
  },
  apis: [`${__dirname}/docs/**/*.yaml`],
};
const specs = swaggerJSDoc(swaggerOptions);
app.use("/apidocs", SwaggerUiExpress.serve, SwaggerUiExpress.setup(specs));

// WebSocket
const socketServer = new Server(server);

socketServer.on("connection", async (socket) => {
  let manager = new ProductManager("./src/dao/files/products.json");
  let products = await manager.getProducts();

  socket.emit("products", products);

  socket.on("addProduct", async (product) => {
    await manager.addProducts(product);
  });
  socket.on("deleteProduct", async (id) => {
    await manager.deleteProducts(id);
  });

  // logger.info("Nuevo cliente conectado");
});
