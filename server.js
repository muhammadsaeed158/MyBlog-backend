// server.js — MyBlog Backend (Supabase + Deno Deploy)
import express from "npm:express";
import cors from "npm:cors";

// Import CRUD functions
import { createPost, getPosts, getPostById, updatePost, deletePost } from "./post.js";
import { createStory, getStories, getStoryById, updateStory, deleteStory } from "./story.js";

// ✅ Import Authentication routes
import authRoutes from "./auth.js";

// Initialize Express app
const app = express();
app.use(cors());
app.use(express.json());

// ==========================
// AUTH ROUTES
// ==========================
app.use("/auth", authRoutes); // 👈 all auth endpoints: /auth/signup, /auth/login, /auth/forgot-password

// ==========================
// HOME ROUTE
// ==========================
app.get("/", (req, res) => {
  res.send("🚀 MyBlog Backend is running!");
});

// ==========================
// POSTS ROUTES
// ==========================

// Get all posts
app.get("/posts", async (req, res) => {
  try {
    const posts = await getPosts();
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single post by ID
app.get("/posts/:id", async (req, res) => {
  try {
    const post = await getPostById(req.params.id);
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create new post
app.post("/posts", async (req, res) => {
  try {
    const { title, content, author } = req.body;
    const newPost = await createPost(title, content, author);
    res.status(201).json(newPost);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update post by ID
app.put("/posts/:id", async (req, res) => {
  try {
    const updatedPost = await updatePost(req.params.id, req.body);
    res.json(updatedPost);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete post by ID
app.delete("/posts/:id", async (req, res) => {
  try {
    await deletePost(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ==========================
// STORIES ROUTES
// ==========================

// Get all stories
app.get("/stories", async (req, res) => {
  try {
    const stories = await getStories();
    res.json(stories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single story by ID
app.get("/stories/:id", async (req, res) => {
  try {
    const story = await getStoryById(req.params.id);
    res.json(story);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create new story
app.post("/stories", async (req, res) => {
  try {
    const { title, short_intro, content, image_url, user_id } = req.body;
    const newStory = await createStory(title, short_intro, content, image_url, user_id);
    res.status(201).json(newStory);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update story by ID
app.put("/stories/:id", async (req, res) => {
  try {
    const updatedStory = await updateStory(req.params.id, req.body);
    res.json(updatedStory);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete story by ID
app.delete("/stories/:id", async (req, res) => {
  try {
    await deleteStory(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ==========================
// SERVER START
// ==========================
const PORT = Deno.env.get("PORT") || 8000;
app.listen(PORT, () => {
  console.log(`✅ MyBlog Backend running on port ${PORT}`);
});