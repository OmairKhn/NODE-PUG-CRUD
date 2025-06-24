const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    age: Number,
    adress: String,
    Password: String,
  },
  { versionKey: false }
);
const User = mongoose.model("User", userSchema);
module.exports = User;
