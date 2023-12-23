import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  first_name: { type: String, required: false },
  last_name: { type: String },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  age: { type: Number },
  password: { type: String, required: false },
  cart: { type: mongoose.Schema.Types.ObjectId, ref: "Cart" },
  role: { type: String, default: "user" },
});

const UserModel = mongoose.model("User", userSchema);

export default UserModel;
