// server.js
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { createClient } = require("@supabase/supabase-js");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// 🔑 Supabase config (apna project URL aur Anon Key yahan dalna)
const supabase = createClient(
  "https://YOUR-PROJECT.supabase.co",
  "YOUR-ANON-KEY"
);

// ✅ Test route
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// ✅ Get all stories
app.get("/stories", async (req, res) => {
  const { data, error } = await supabase.from("stories").select("*");
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// ✅ Add new story
app.post("/stories", async (req, res) => {
  const { title, content } = req.body;
  const { data, error } = await supabase
    .from("stories")
    .insert([{ title, content }]);
  
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// ✅ Run server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
