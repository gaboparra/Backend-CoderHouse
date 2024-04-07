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
  role: { type: String, enum: ["admin", "user"], default: "user" },
  last_connection: { type: Date, default: Date.now },
});

const UserModel = mongoose.model("User", userSchema);

export default UserModel;
