import { createClient } from "@supabase/supabase-js";

// ⚠️ Backend only: Use Service Role Key safely, never expose on frontend
const supabaseUrl = "https://ynvhluadxmsjoihdjmky.supabase.co";
const supabaseServiceKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InludmhsdWFkeG1zam9paGRqbWt5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTMwNDAxOCwiZXhwIjoyMDc0ODgwMDE4fQ.YrwVbrhxoc2Mtqf0iHV1hdr5T7bbti4gEEIkvpBUb4M";

const supabase = createClient(supabaseUrl, supabaseServiceKey);

/**
 * Create a new post
 * @param {string} title
 * @param {string} content
 * @param {string} author
 */
export async function createPost(title, content, author) {
  const { data, error } = await supabase
    .from("posts")
    .insert([{ title, content, author }])
    .select(); // return inserted row

  if (error) throw new Error(error.message);
  return data[0];
}

/**
 * Get all posts
 */
export async function getPosts() {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}

/**
 * Get a post by ID
 * @param {string} id
 */
export async function getPostById(id) {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);
  return data;
}

/**
 * Update a post by ID
 * @param {string} id
 * @param {object} updates
 */
export async function updatePost(id, updates) {
  const { data, error } = await supabase
    .from("posts")
    .update(updates)
    .eq("id", id)
    .select();

  if (error) throw new Error(error.message);
  return data[0];
}

/**
 * Delete a post by ID
 * @param {string} id
 */
export async function deletePost(id) {
  const { error } = await supabase
    .from("posts")
    .delete()
    .eq("id", id);

  if (error) throw new Error(error.message);
  return true;
}