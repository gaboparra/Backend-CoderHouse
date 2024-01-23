import config from "../config/config.js";
import mongoose from "mongoose";

export let User;
export let Product;
export let Cart;
// export let Ticket;

switch (config.persistence) {
  case "MONGO":
    await mongoose.connect(config.mongoURL, { dbName: config.mongoDBName });
    console.log("Connected to the database.");

    const { default: UserMongo } = await import("./mongo/users.mongo.js");
    const { default: ProductMongo } = await import("./mongo/products.mongo.js");
    const { default: CartMongo } = await import("./mongo/carts.mongo.js");

    User = UserMongo;
    Product = ProductMongo;
    Cart = CartMongo;

    break;

  default:
    throw new Error("Persistence not recognized");
}
