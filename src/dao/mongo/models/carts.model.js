import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  // products: [{ type: mongoose.Schema.Types.ObjectId, ref: "products", amount: Number }],
  products: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "products" },
      amount: { type: Number, default: 1 },
    },
  ],
});
cartSchema.pre("findOne", function () {
  this.populate("products.product");
});

const cartModel = mongoose.model("carts", cartSchema);

export default cartModel;
