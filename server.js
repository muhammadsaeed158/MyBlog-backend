// Import dependencies
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config(); // ⬅️ .env ko load karne ke liye

// Create Express app
const app = express();
app.use(cors());
app.use(express.json()); // For parsing JSON requests

// MongoDB connection string from .env
const mongoURI = process.env.MONGO_URI;

// Connect to MongoDB
mongoose.connect(mongoURI)
  .then(() => console.log("✅ MongoDB connected successfully!"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Define Post schema and model
const postSchema = new mongoose.Schema({
  title: String,
  content: String,
  author: String,
  date: { type: Date, default: Date.now }
});

const Post = mongoose.model("Post", postSchema);

// Home route
app.get("/", (req, res) => {
  res.send("🚀 Blog API is running...");
});

// Add new post
app.post("/posts", async (req, res) => {
  try {
    const newPost = new Post(req.body);
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all posts
app.get("/posts", async (req, res) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server running on http://127.0.0.1:${PORT}`);
});
