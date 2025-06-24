const express = require("express");
const app = express();
const port = 3000;
const mongoose = require("mongoose");
const userRoutes = require("./routes/user-route.js");
const cors = require("cors");
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const methodOverride = require('method-override');
app.use(methodOverride('_method'));
app.use(userRoutes);
const User = require("./db/user.js"); // Make sure this path is correct
app.set("view engine", "pug");
app.set("views", __dirname + "/views");

app.get("/", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 5;
  const searchTerm = req.query.search || "";
  let filter = {};
  if (searchTerm) {
    filter = {
      $or: [
        { name: { $regex: searchTerm, $options: "i" } },
        { email: { $regex: searchTerm, $options: "i" } },
        { adress: { $regex: searchTerm, $options: "i" } },
      ],
    };
  }
  const total = await User.countDocuments(filter);
  const items = await User.find(filter)
    .skip((page - 1) * limit)
    .limit(limit);
  res.render("index", {
    items,
    page,
    totalPages: Math.ceil(total / limit),
    searchTerm,
  });
});

app.get("/new", (req, res) => {
  res.render("new");
});

async function connectDB() {
  await mongoose.connect("mongodb://localhost:27017", {
    dbName: "UsersDb",
  });
  console.log("Connected to MongoDB");
}
connectDB().catch((error) => console.error(err));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
