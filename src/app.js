import express from "express";
import __dirname from "./utils.js";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import ProductRouter from "./router/product.routes.js";
import CartRouter from "./router/cart.routes.js";
import ViewsRouter from "./router/views.routes.js";
import ProductManager from "./managers/ProductManager.js";

const app = express();
const PORT = 8080;

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", express.static(__dirname + "/public"));
app.use("/products", ProductRouter);
app.use("/carts", CartRouter);
app.use("/home", ViewsRouter);

const server = app.listen(PORT, () => console.log(`Local Host ${PORT}`));
const socketServer = new Server(server);

socketServer.on("connection", async (socket) => {
  let manager = new ProductManager();
  let products = await manager.getProducts();
  socket.emit("products", products);

  //socket.on()

  //socket.on()

  console.log("Nuevo cliente conectado");
});
