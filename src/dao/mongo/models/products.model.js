import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  stock: Number,
  inCart: { type: Boolean, default: false },
});

const productModel = mongoose.model("Product", productSchema);

export default productModel;
