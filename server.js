// server.js — Node.js + Supabase backend

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

// 🔐 Load environment variables from .env file
dotenv.config();

// ⚙️ Initialize Express
const app = express();
app.use(cors());
app.use(express.json());

// 🔗 Supabase connection setup
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY; // use anon/public key
const supabase = createClient(supabaseUrl, supabaseKey);

// 🏠 Home route
app.get("/", (req, res) => {
  res.send("🚀 Supabase Blog API running successfully on Termux!");
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
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Supabase Backend running at http://127.0.0.1:${PORT}`);
});
