import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  products: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      amount: { type: Number, default: 1 },
    },
  ],
});

// Populate
cartSchema.pre("findOne", function () {
  this.populate("products.product");
});

const cartModel = mongoose.model("Cart", cartSchema);

export default cartModel;
