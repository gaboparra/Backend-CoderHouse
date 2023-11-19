import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  amount: Number,
  title: String,
});

const cartModel = mongoose.model("Cart", cartSchema);

export default cartModel;
