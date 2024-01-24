import config from "../config/config.js";
import mongoose from "mongoose";
import { opts } from "../commander.js";

export let User;
export let Product;
export let Cart;
// export let Ticket;

console.log("persistence with " + opts.persistence);

if (opts.persistence === "MONGO") {
  await mongoose.connect(config.mongoURL, { dbName: config.mongoDBName });
  console.log("Connected to the database.");

  const { default: UserMongo } = await import("./mongo/users.mongo.js");
  const { default: ProductMongo } = await import("./mongo/products.mongo.js");
  const { default: CartMongo } = await import("./mongo/carts.mongo.js");

  User = UserMongo;
  Product = ProductMongo;
  Cart = CartMongo;
} else {
  console.log("Error when choosing persistence");
}
