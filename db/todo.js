const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema({
  text: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
}, { versionKey: false });

const Todo = mongoose.connection.useDb('TodosDb').model("Todo", todoSchema);
module.exports = Todo;