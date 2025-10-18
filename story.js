// story.js — Express Router version (for Node/Vercel Node runtime)
import express from "npm:express";
import { createClient } from "npm:@supabase/supabase-js";

const router = express.Router();

const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseKey = Deno.env.get("SUPABASE_KEY");
const supabase = createClient(supabaseUrl, supabaseKey);

// ==========================
// CREATE STORY
// ==========================
router.post("/", async (req, res) => {
  try {
    const { title, short_intro, content, image_url, user_id } = req.body;
    const { data, error } = await supabase
      .from("stories")
      .insert([{ title, short_intro, content, image_url, user_id }])
      .select();
    if (error) throw error;
    res.status(201).json(data[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ==========================
// GET ALL STORIES
// ==========================
router.get("/", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("stories")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ==========================
// GET SINGLE STORY BY ID
// ==========================
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from("stories")
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ==========================
// UPDATE STORY
// ==========================
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const { data, error } = await supabase
      .from("stories")
      .update(updates)
      .eq("id", id)
      .select();
    if (error) throw error;
    res.json(data[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ==========================
// DELETE STORY
// ==========================
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from("stories").delete().eq("id", id);
    if (error) throw error;
    res.json({ message: "Story deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;