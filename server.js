// ✅ server.js — Supabase + Deno Deploy backend

import express from "npm:express";
import cors from "npm:cors";
import { createClient } from "npm:@supabase/supabase-js";

// 📝 Import story CRUD functions
import { createStory, getStories, getStoryById } from "./story.js";

// ⚙️ Initialize Express app
const app = express();
app.use(cors());
app.use(express.json());

// 🔗 Supabase connection using Deno secrets
const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_KEY");

const supabase = createClient(supabaseUrl, supabaseKey);

// 🏠 Home route
app.get("/", (req, res) => {
  res.send("🚀 Supabase Blog API is running successfully on Deno Deploy!");
});

// ==========================
// 📋 POSTS SECTION
// ==========================
app.get("/posts", async (req, res) => {
  try {
    const { data, error } = await supabase.from("posts").select("*");
    if (error) throw error;
    res.json({ success: true, posts: data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

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
app.get("/stories", async (req, res) => {
  try {
    const stories = await getStories();
    res.json({ success: true, stories });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post("/stories", async (req, res) => {
  try {
    const { title, short_intro, content, image_url, user_id } = req.body;
    const story = await createStory(title, short_intro, content, image_url, user_id);
    res.status(201).json({ success: true, story });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.get("/stories/:id", async (req, res) => {
  try {
    const story = await getStoryById(req.params.id);
    res.json({ success: true, story });
  } catch (err) {
    res.status(404).json({ success: false, error: err.message });
  }
});

// 🚀 Server Start
const PORT = 8000;
app.listen(PORT, () => {
  console.log(`✅ Supabase Backend running at http://localhost:${PORT}`);
});