// story.js — Supabase CRUD for Stories (Vercel Edge Function / Deno)
import { createClient } from "npm:@supabase/supabase-js";

const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_KEY");
const supabase = createClient(supabaseUrl, supabaseKey);

// Utility: send JSON response safely
function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

// =============================
// Handle incoming HTTP requests
// =============================
export default async function handler(req) {
  const url = new URL(req.url);
  const path = url.pathname;
  const method = req.method;

  try {
    // GET /api/stories — list all stories
    if (method === "GET" && path.endsWith("/stories")) {
      const { data, error } = await supabase
        .from("stories")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return jsonResponse({ stories: data });
    }

    // GET /api/stories/:id — get single story
    if (method === "GET" && path.match(/\/stories\/[0-9a-f-]+$/)) {
      const id = path.split("/").pop();
      const { data, error } = await supabase
        .from("stories")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      return jsonResponse({ story: data });
    }

    // POST /api/stories — create new story
    if (method === "POST" && path.endsWith("/stories")) {
      const body = await req.json();
      const { title, short_intro, content, image_url, user_id } = body;

      const { data, error } = await supabase
        .from("stories")
        .insert([{ title, short_intro, content, image_url, user_id }])
        .select();

      if (error) throw error;
      return jsonResponse({ message: "Story created", story: data[0] }, 201);
    }

    // PUT /api/stories/:id — update story
    if (method === "PUT" && path.match(/\/stories\/[0-9a-f-]+$/)) {
      const id = path.split("/").pop();
      const body = await req.json();

      const { data, error } = await supabase
        .from("stories")
        .update(body)
        .eq("id", id)
        .select();

      if (error) throw error;
      return jsonResponse({ message: "Story updated", story: data[0] });
    }

    // DELETE /api/stories/:id — delete story
    if (method === "DELETE" && path.match(/\/stories\/[0-9a-f-]+$/)) {
      const id = path.split("/").pop();
      const { error } = await supabase.from("stories").delete().eq("id", id);
      if (error) throw error;
      return jsonResponse({ message: "Story deleted" });
    }

    // If no route matched
    return jsonResponse({ error: "Not found" }, 404);
  } catch (err) {
    return jsonResponse({ error: err.message }, 500);
  }
}