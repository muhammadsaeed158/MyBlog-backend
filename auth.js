// auth.js
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = express.Router();

// Temporary in-memory user storage (replace later with Supabase)
const users = [];

// Secret key for JWT
const SECRET_KEY = "my_secret_key_123";

// ✅ SIGNUP
router.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: { message: "Missing email or password" } });

  const exists = users.find(u => u.email === email);
  if (exists)
    return res.status(400).json({ error: { message: "User already exists" } });

  const hashed = await bcrypt.hash(password, 10);
  users.push({ email, password: hashed });

  res.json({ success: true, message: "Account created successfully!" });
});

// ✅ LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = users.find(u => u.email === email);
  if (!user)
    return res.status(400).json({ error: { message: "User not found" } });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid)
    return res.status(400).json({ error: { message: "Invalid password" } });

  const token = jwt.sign({ email: user.email }, SECRET_KEY, { expiresIn: "1h" });
  res.json({ success: true, token });
});

// ✅ FORGOT PASSWORD (Mock)
router.post("/forgot-password", (req, res) => {
  const { email } = req.body;

  const user = users.find(u => u.email === email);
  if (!user)
    return res.status(404).json({ error: { message: "Email not found" } });

  res.json({ success: true, message: "Password reset link sent (demo)" });
});

export default router;