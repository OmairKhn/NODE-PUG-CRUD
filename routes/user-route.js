const express = require("express");
const router = express.Router();
const {
  addUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
} = require("./../userHandlers/userHandle.js");

// Create
router.post("/users", async (req, res) => {
  try {
    const createdUser = await addUser(req.body);
   res.redirect("/");
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({
      message: "Failed to create user",
      error: error.message,
    });
  }
});

// Read (all, paginated)
router.get("/users", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  try {
    const result = await getUsers(page, limit);
    res.json(result);
  } catch (err) {
    console.error("Pagination error:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

// Read (single)
router.get("/users/:id/edit", async (req, res) => {
  const item = await getUser(req.params.id);
  if (!item) {
    return res.status(404).send("User not found");
  }
  res.render("edit", { item });
});

// Update
router.put("/users/:id", async (req, res) => {
  const user = await updateUser(req.params["id"], req.body);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.redirect("/");
});

// Delete
router.delete("/users/:id", async (req, res) => {
  const user = await deleteUser(req.params["id"]);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.redirect("/"); // <-- This will reload the table page after delete
});

module.exports = router;
