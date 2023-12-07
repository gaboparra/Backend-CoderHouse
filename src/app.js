import express from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import handlebars from "express-handlebars";
import mongoose from "mongoose";
import { Server } from "socket.io";

import __dirname from "./utils.js";
import ProductRouter from "./router/product.routes.js";
import CartRouter from "./router/cart.routes.js";
import ViewsRouter from "./router/views.routes.js";
import ProductManager from "./dao/file/managers/ProductManager.js";

const app = express();
const PORT = 8080;

// Configuración Handlebars
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", express.static(__dirname + "/public"));

//Session Mongo
app.use(session({
  store: MongoStore.create({
    mongoUrl: "mongodb+srv://Gabo:yomZ9Hh3CmMxegpr@clustergabo.o8l1pm6.mongodb.net/",
    dbName: "ecommerce"
  }),
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}))

// Rutas
app.use("/api/products", ProductRouter);
app.use("/api/carts", CartRouter);
app.use("/home", ViewsRouter);

// MongoDB
const url = "mongodb+srv://Gabo:yomZ9Hh3CmMxegpr@clustergabo.o8l1pm6.mongodb.net/";
mongoose.connect(url, { dbName: "ecommerce" })
  .then(() => {
    console.log("Connected to the database.");
  })
  .catch((error) => {
    console.log("Error connecting to the database:", error.message);
  });

const server = app.listen(PORT, () =>
  console.log(`Server is running on port ${PORT}`)
);

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

  //console.log("Nuevo cliente conectado");
});
