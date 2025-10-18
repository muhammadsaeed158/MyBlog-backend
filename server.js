// server.js — Deno-native backend for MyBlog
import { createClient } from "npm:@supabase/supabase-js";
import authHandler from "./auth.js";
import { createStory, getStories, getStoryById, updateStory, deleteStory } from "./story.js";

// Supabase setup
const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseKey = Deno.env.get("SUPABASE_KEY");
const supabase = createClient(supabaseUrl, supabaseKey);

// Helper: JSON response
function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

// Router handler
async function handler(req) {
  const url = new URL(req.url);
  const path = url.pathname;
  const method = req.method;

  // ✅ AUTH ROUTES (handled by auth.js)
  if (path.startsWith("/auth")) {
    // Remove "/auth" prefix for internal routing
    const authReq = new Request(req.url.replace("/auth", ""), req);
    return await authHandler(authReq);
  }

  // ✅ STORIES ROUTES
  if (path === "/stories" && method === "GET") {
    const stories = await getStories();
    return jsonResponse(stories);
  }

  if (path.startsWith("/stories/") && method === "GET") {
    const id = path.split("/")[2];
    const story = await getStoryById(id);
    return jsonResponse(story);
  }

  if (path === "/stories" && method === "POST") {
    const body = await req.json();
    const { title, short_intro, content, image_url, user_id } = body;
    const story = await createStory(title, short_intro, content, image_url, user_id);
    return jsonResponse(story, 201);
  }

  if (path.startsWith("/stories/") && method === "PUT") {
    const id = path.split("/")[2];
    const updates = await req.json();
    const updated = await updateStory(id, updates);
    return jsonResponse(updated);
  }

  if (path.startsWith("/stories/") && method === "DELETE") {
    const id = path.split("/")[2];
    await deleteStory(id);
    return jsonResponse({ success: true });
  }

  // ✅ ROOT PATH
  if (path === "/") {
    return new Response("🚀 MyBlog Backend (Deno-native) is running!");
  }

  // 404 fallback
  return jsonResponse({ error: "Not Found" }, 404);
}

// Start server
Deno.serve({ port: 8000 }, handler);