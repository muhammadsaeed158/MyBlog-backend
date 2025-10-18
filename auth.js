// auth.js — Deno-native version (no Express)
import { createClient } from "npm:@supabase/supabase-js";
import bcrypt from "npm:bcryptjs";
import jwt from "npm:jsonwebtoken";

const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseKey = Deno.env.get("SUPABASE_KEY");
const supabase = createClient(supabaseUrl, supabaseKey);
const JWT_SECRET = Deno.env.get("JWT_SECRET") || "mysecretkey";

// Helper: JSON response
function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export default async (req) => {
  const url = new URL(req.url);
  const path = url.pathname;
  const body = await req.json();

  try {
    // =============== SIGNUP ===============
    if (path === "/signup" && req.method === "POST") {
      const { name, email, password } = body;

      const { data: existingUser } = await supabase
        .from("users")
        .select("*")
        .eq("email", email)
        .single();

      if (existingUser) {
        return jsonResponse({ error: "User already exists" }, 400);
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const { data, error } = await supabase
        .from("users")
        .insert([{ name, email, password: hashedPassword }])
        .select()
        .single();

      if (error) throw error;

      return jsonResponse({ message: "Signup successful", user: data });
    }

    // =============== LOGIN ===============
    if (path === "/login" && req.method === "POST") {
      const { email, password } = body;

      const { data: user, error } = await supabase
        .from("users")
        .select("*")
        .eq("email", email)
        .single();

      if (error || !user) {
        return jsonResponse({ error: "Invalid email or password" }, 400);
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return jsonResponse({ error: "Invalid email or password" }, 400);
      }

      const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
        expiresIn: "7d",
      });

      return jsonResponse({ message: "Login successful", token });
    }

    // =============== FORGOT PASSWORD ===============
    if (path === "/forgot" && req.method === "POST") {
      const { email } = body;

      const { data: user } = await supabase
        .from("users")
        .select("*")
        .eq("email", email)
        .single();

      if (!user) {
        return jsonResponse({ error: "Email not found" }, 400);
      }

      const resetToken = jwt.sign({ email }, JWT_SECRET, { expiresIn: "15m" });
      const resetLink = `https://your-frontend-domain/reset.html?token=${resetToken}`;

      return jsonResponse({
        message: "Password reset link generated",
        resetLink,
      });
    }

    // =============== RESET PASSWORD ===============
    if (path === "/reset" && req.method === "POST") {
      const { token, newPassword } = body;
      const decoded = jwt.verify(token, JWT_SECRET);
      const email = decoded.email;

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      const { error } = await supabase
        .from("users")
        .update({ password: hashedPassword })
        .eq("email", email);

      if (error) throw error;

      return jsonResponse({ message: "Password reset successful" });
    }

    // =============== DEFAULT (Not Found) ===============
    return jsonResponse({ error: "Not found" }, 404);
  } catch (err) {
    return jsonResponse({ error: err.message }, 500);
  }
};