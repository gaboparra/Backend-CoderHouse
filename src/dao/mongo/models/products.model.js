import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productSchema = new mongoose.Schema({
  title: { type: String, required: true, index: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  imageUrl: { type: String, required: true },
});

// Plugin de paginación
productSchema.plugin(mongoosePaginate);

const productModel = mongoose.model("Product", productSchema);

export default productModel;
