// auth.js — Authentication routes for MyBlog Backend (Deno + Supabase)
import express from "npm:express";
import bcrypt from "npm:bcryptjs";
import jwt from "npm:jsonwebtoken";
import { createClient } from "npm:@supabase/supabase-js";

// Initialize router
const router = express.Router();

// Supabase setup
const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseKey = Deno.env.get("SUPABASE_KEY");
const supabase = createClient(supabaseUrl, supabaseKey);

// JWT secret key
const JWT_SECRET = Deno.env.get("JWT_SECRET") || "mysecretkey";

// ==========================
// SIGNUP
// ==========================
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    const { data, error } = await supabase
      .from("users")
      .insert([{ name, email, password: hashedPassword }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({ message: "Signup successful", user: data });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ==========================
// LOGIN
// ==========================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (error || !user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // Compare password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // Create JWT token
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ message: "Login successful", token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ==========================
// FORGOT PASSWORD (send reset link)
// ==========================
router.post("/forgot", async (req, res) => {
  try {
    const { email } = req.body;

    const { data: user } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (!user) {
      return res.status(400).json({ error: "Email not found" });
    }

    // Create reset token
    const resetToken = jwt.sign({ email }, JWT_SECRET, { expiresIn: "15m" });

    // In real app: send email. Here, just return link.
    const resetLink = `https://your-frontend-domain/reset.html?token=${resetToken}`;

    res.json({ message: "Password reset link generated", resetLink });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ==========================
// RESET PASSWORD
// ==========================
router.post("/reset", async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    const email = decoded.email;

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update in Supabase
    const { error } = await supabase
      .from("users")
      .update({ password: hashedPassword })
      .eq("email", email);

    if (error) throw error;

    res.json({ message: "Password reset successful" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ==========================
// EXPORT ROUTER
// ==========================
export default router;