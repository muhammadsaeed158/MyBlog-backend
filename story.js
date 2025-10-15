// story.js — Supabase CRUD for Stories (Deno Deploy)
import { createClient } from "npm:@supabase/supabase-js";

// Supabase backend configuration
const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_KEY");

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// Create a new story
export async function createStory(title, short_intro, content, image_url, user_id) {
  const { data, error } = await supabase
    .from("stories")
    .insert([{ title, short_intro, content, image_url, user_id }])
    .select();

  if (error) throw new Error(error.message);
  return data[0];
}

// Get all stories
export async function getStories() {
  const { data, error } = await supabase
    .from("stories")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}

// Get single story by ID
export async function getStoryById(id) {
  const { data, error } = await supabase
    .from("stories")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);
  return data;
}

// Update story by ID
export async function updateStory(id, updates) {
  const { data, error } = await supabase
    .from("stories")
    .update(updates)
    .eq("id", id)
    .select();

  if (error) throw new Error(error.message);
  return data[0];
}

// Delete story by ID
export async function deleteStory(id) {
  const { error } = await supabase
    .from("stories")
    .delete()
    .eq("id", id);

  if (error) throw new Error(error.message);
  return true;
}