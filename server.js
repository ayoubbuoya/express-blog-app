// Import dependencies
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

const app = express();

// Set the views directory
app.set("views", path.join(__dirname, "views"));
// Set EJS as the view engine
app.set("view engine", "ejs");

// Middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// Connect to mongo db
mongoose.connect("mongodb://localhost/blog", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const Post = require("./models/Post");

// Define routes
app.get("/", (req, res) => {
  res.send("Hello, world!");
});

// Get all blog posts
app.get("/posts", async (req, res) => {
  try {
    const posts = await Post.find();
    const success = req.query.success;
    res.render("blogs", { posts, success });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new blog post
app.get("/posts/create", async (req, res) => {
  try {
    res.render("add-blog");
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Create a new blog post
app.post("/posts", async (req, res) => {
  try {
    const { title, content } = req.body;
    const description = content.substring(0, 160) + "...";
    const post = new Post({ title, content, description });
    const savedPost = await post.save();
    res.redirect("/posts?success=true");
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Start the server
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
