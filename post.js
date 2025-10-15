// post.js — Supabase CRUD for Posts (Deno Deploy)
import { createClient } from "npm:@supabase/supabase-js";

// Supabase backend configuration
const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_KEY");

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

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
    .select();

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