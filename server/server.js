/**
 * Import the packages.
 */
const express = require("express");
const mongoose = require("mongoose");

/**
 * The routes files are to be defined here.
 */
const users = require("./routes/api/users");
const profile = require("./routes/api/profile");
const posts = require("./routes/api/posts");

/**
 * Initialize the app
 */
const app = express();

/**
 * Database config
 */
const database = require("./config/keys").mongoURI;

/**
 * Connect to database
 */
mongoose
  .connect(database)
  .then(() => console.log("Connected"))
  .catch(error => console.log(error));

app.get("/", (req, res) => {
  res.send("Hello world from nepal");
});

/**
 * Use routes
 */
app.use("/api/users", users);
app.use("/api/profile", profile);
app.use("/api/posts", posts);

/**
 * Run the app.
 */
const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server is running on port ${port}`));
