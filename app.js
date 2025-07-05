// const express = require("express");
const express = require("express");
const app = express();
const User = require("./db/user.js"); // Make sure this is at the top
const port = 5000;
const mongoose = require("mongoose");
const userRoutes = require("./routes/user-route.js");
const todoRoutes = require("./routes/todo-route.js");
const cors = require("cors");
const session = require("express-session");
const methodOverride = require("method-override");
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(
  session({
    secret: "yourSecretKey",
    resave: false,
    saveUninitialized: false,
  })
);

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use(express.static("public")); // Serve static files from the public directory

app.use(async (req, res, next) => {
  res.locals.session = req.session;
  if (req.session.userId) {
    try {
      
      const user = await User.findById(req.session.userId).lean();
      res.locals.currentUser = user;
    } catch (err) {
      res.locals.currentUser = null;
    }
  } else {
    res.locals.currentUser = null;
  }
  next();
});

app.get("/", (req, res) => {
  if (req.session.userId) {
    // Redirect logged-in users to their todos
    res.redirect("/todos");
  } else {
    // Redirect guests to login
    res.redirect("/login");
  }
});

app.use(userRoutes);
app.use(todoRoutes);

async function connectDB() {
  await mongoose.connect("mongodb://localhost:27017", {
    dbName: "UsersDb",
  });
  console.log("Connected to MongoDB");
}
connectDB().catch((error) => console.error(error));

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
