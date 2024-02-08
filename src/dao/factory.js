import config from "../config/config.js";
import mongoose from "mongoose";
import { opts } from "../commander.js";
import logger from "../utils/logger.js";

export let User;
export let Product;
export let Cart;

logger.info("Persistence with " + opts.persistence);

if (opts.persistence === "MONGO") {
  await mongoose.connect(config.mongoURL, { dbName: config.mongoDBName })
    .then(() => {
      logger.info("Connected to the database.");
    })
    .catch((error) => {
      logger.error("Error connecting to the database:", error.message);
    });

  const { default: UserMongo } = await import("./mongo/users.mongo.js");
  const { default: ProductMongo } = await import("./mongo/products.mongo.js");
  const { default: CartMongo } = await import("./mongo/carts.mongo.js");

  User = UserMongo;
  Product = ProductMongo;
  Cart = CartMongo;
} else {
  logger.error("Error when choosing persistence");
}
