const express = require("express");
const router = express.Router();
const Todo = require("../db/todo.js");
const requireLogin = require("../middleware/auth");

// List todos
router.get("/todos", requireLogin, async (req, res) => {
  const todos = await Todo.find({ user: req.session.userId });
  res.render("todos", { todos });
});

// Add todo
router.post("/todos", requireLogin, async (req, res) => {
  await Todo.create({ text: req.body.text, user: req.session.userId });
  res.redirect("/todos");
});

// Edit todo page
router.get("/todos/:id/edit", requireLogin, async (req, res) => {
  const todo = await Todo.findOne({ _id: req.params.id, user: req.session.userId });
  if (!todo) return res.redirect("/todos");
  res.render("edit-todo", { todo });
});

// Update todo
router.post("/todos/:id", requireLogin, async (req, res) => {
  await Todo.findOneAndUpdate({ _id: req.params.id, user: req.session.userId }, { text: req.body.text });
  res.redirect("/todos");
});

// Delete todo
router.post("/todos/:id/delete", requireLogin, async (req, res) => {
  await Todo.findOneAndDelete({ _id: req.params.id, user: req.session.userId });
  res.redirect("/todos");
});

module.exports = router;