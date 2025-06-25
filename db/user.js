const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  age: Number,
  adress: String,
  Password: String,
}, { versionKey: false });

// Hash password before saving
userSchema.pre("save", async function(next) {
  if (this.isModified("Password")) {
    this.Password = await bcrypt.hash(this.Password, 10);
  }
  next();
});

const User = mongoose.model("User", userSchema);
module.exports = User;