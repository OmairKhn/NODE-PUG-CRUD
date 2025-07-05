// const express = require("express");
// const router = express.Router();
// const {
//   addUser,
//   getUsers,
//   getUser,
//   updateUser,
//   deleteUser,
// } = require("./../userHandlers/userHandle.js");

// // Create
// router.post("/users", async (req, res) => {
//   try {
//     const createdUser = await addUser(req.body);
//    res.redirect("/");
//   } catch (error) {
//     console.error("Error creating user:", error);
//     res.status(500).json({
//       message: "Failed to create user",
//       error: error.message,
//     });
//   }
// });

// // Read (all, paginated)
// router.get("/users", async (req, res) => {
//   const page = parseInt(req.query.page) || 1;
//   const limit = parseInt(req.query.limit) || 5;
//   try {
//     const result = await getUsers(page, limit);
//     res.json(result);
//   } catch (err) {
//     console.error("Pagination error:", err);
//     res.status(500).json({ message: "Server Error" });
//   }
// });

// // Read (single)
// router.get("/users/:id/edit", async (req, res) => {
//   const item = await getUser(req.params.id);
//   if (!item) {
//     return res.status(404).send("User not found");
//   }
//   res.render("edit", { item });
// });

// // Update
// router.put("/users/:id", async (req, res) => {
//   const user = await updateUser(req.params["id"], req.body);
//   if (!user) {
//     return res.status(404).json({ message: "User not found" });
//   }
//   res.redirect("/");
// });

// // Delete
// router.delete("/users/:id", async (req, res) => {
//   const user = await deleteUser(req.params["id"]);
//   if (!user) {
//     return res.status(404).json({ message: "User not found" });
//   }
//   res.redirect("/"); // <-- This will reload the table page after delete
// });

// module.exports = router;
const express = require("express");
const bcrypt = require("bcrypt");

const router = express.Router();
const { addUser, findUserByEmail } = require("../userHandlers/userHandle.js");
// Register page
router.get("/register", (req, res) => res.render("new"));

// Register handler
router.post("/register", async (req, res) => {
  try {
    await addUser(req.body); // This will hash the password and save the user
    res.redirect("/login");
  } catch (err) {
    res.render("new", { error: "Registration failed. Try a different email." });
  }
});

// Login page
router.get("/login", (req, res) => res.render("login"));

// Login handler
router.post("/login", async (req, res) => {
  const { email, Password } = req.body;
  const user = await findUserByEmail({ email });
  if (user && (await bcrypt.compare(Password, user.Password))) {
    req.session.userId = user._id;
    res.redirect("/todos");
  }
});

// Logout
router.get("/logout", (req, res) => {
  req.session.destroy(() => res.redirect("/login"));
});

module.exports = router;
