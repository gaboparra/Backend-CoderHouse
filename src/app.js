import express from "express";
import __dirname from "./utils.js";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import ProductRouter from "./router/product.routes.js";
import CartRouter from "./router/cart.routes.js";
import ViewsRouter from "./router/views.routes.js";
import ProductManager from "./dao/file/managers/ProductManager.js";
import mongoose from "mongoose";
// import productModel from "./dao/mongo/models/products.model.js";

const app = express();
const PORT = 8080;

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", express.static(__dirname + "/public"));

app.use("/api/products", ProductRouter);
app.use("/api/carts", CartRouter);
app.use("/home", ViewsRouter);

// Mongo DB //
const url =
  "mongodb+srv://Gabo:yomZ9Hh3CmMxegpr@clustergabo.o8l1pm6.mongodb.net/";
mongoose
  .connect(url, { dbName: "ecommerce" })
  .then(() => {
    console.log("BD connected.");
  })
  .catch((e) => {
    console.log("Error connecting to DB.");
  });

// WebSocket //
const server = app.listen(PORT, () => console.log(`Local Host ${PORT}`));
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
