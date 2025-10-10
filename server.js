// ✅ server.js — Supabase + Deno Deploy backend
// Backend Live URL: https://myblog-backend-4xr8vcky4ba7.muhammadsaeed158.deno.net/

import express from "npm:express";
import cors from "npm:cors";
import { createClient } from "npm:@supabase/supabase-js";

// ⚙️ Initialize Express app
const app = express();
app.use(cors());
app.use(express.json());

// 🔗 Supabase connection setup
const supabaseUrl = "https://ynvhluadxmsjoihdjmky.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InludmhsdWFkeG1zam9paGRqbWt5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzMDQwMTgsImV4cCI6MjA3NDg4MDAxOH0.MFbwBZf5AZZVhV7UZWA-eHMi0KWGXW1wxATyHgo3agE";

const supabase = createClient(supabaseUrl, supabaseKey);

// 🏠 Home route
app.get("/", (req, res) => {
  res.send("🚀 Supabase Blog API is running successfully on Deno Deploy!");
});

// ==========================
// 📋 POSTS SECTION
// ==========================

// 🧾 Get all posts
app.get("/posts", async (req, res) => {
  try {
    const { data, error } = await supabase.from("posts").select("*");
    if (error) throw error;
    res.json({ success: true, posts: data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ➕ Add a new post
app.post("/posts", async (req, res) => {
  try {
    const { title, content, author } = req.body;
    const { data, error } = await supabase
      .from("posts")
      .insert([{ title, content, author }])
      .select();

    if (error) throw error;
    res.status(201).json({ success: true, post: data });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// ==========================
// 📰 STORIES SECTION
// ==========================

// 🧾 Get all stories
app.get("/stories", async (req, res) => {
  try {
    const { data, error } = await supabase.from("stories").select("*");
    if (error) throw error;
    res.json({ success: true, stories: data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ➕ Add new story
app.post("/stories", async (req, res) => {
  try {
    const { title, short_intro, content, image_url, user_id } = req.body;
    const { data, error } = await supabase
      .from("stories")
      .insert([{ title, short_intro, content, image_url, user_id }])
      .select();

    if (error) throw error;
    res.status(201).json({ success: true, story: data });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// ==========================
// 🚀 Server Start
// ==========================
const PORT = 8000;
app.listen(PORT, () => {
  console.log(`✅ Supabase Backend running at http://localhost:${PORT}`);
});