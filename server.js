

console.log("🔍 SUPABASE_URL =", Deno.env.get("SUPABASE_URL"));
console.log("🔍 SUPABASE_KEY =", Deno.env.get("SUPABASE_KEY") ? "✅ Loaded" : "❌ Missing");
// server.js — Deno Deploy + Supabase backend

import express from "npm:express";
import cors from "npm:cors";
import { createClient } from "npm:@supabase/supabase-js";

// ⚙️ Initialize Express
const app = express();
app.use(cors());
app.use(express.json());

// 🔗 Supabase connection setup
// In Deno Deploy, we use Deno.env.get() instead of process.env
const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseKey = Deno.env.get("SUPABASE_KEY"); // anon/public key
const supabase = createClient(supabaseUrl, supabaseKey);

// 🏠 Home route
app.get("/", (req, res) => {
  res.send("🚀 Supabase Blog API is running successfully on Deno Deploy!");
});

// 📋 Get all posts
app.get("/posts", async (req, res) => {
  try {
    const { data, error } = await supabase.from("posts").select("*");
    if (error) throw error;
    res.json({ success: true, posts: data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ➕ Add new post
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

// 🚀 Start server
const PORT = 8000;
app.listen(PORT, () => {
  console.log(`✅ Supabase Backend running at http://localhost:${PORT}`);
});
