import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: false },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  age: { type: Number, required: false },
  password: { type: String, required: false },
});

const UserModel = mongoose.model("User", userSchema);

export default UserModel;
