const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// Create default user endpoint
router.post("/create-admin", async (req, res) => {
  try {
    const existingUser = await User.findOne({ username: "admin" });
    if (existingUser) {
      return res.json({ message: "Admin user already exists", credentials: { username: "admin", password: "admin123" } });
    }

    const hashedPassword = await bcrypt.hash("admin123", 10);
    const user = new User({
      username: "admin",
      password: hashedPassword,
      name: "Administrator"
    });

    await user.save();
    res.json({ 
      message: "Admin user created successfully", 
      credentials: { username: "admin", password: "admin123" } 
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating user", error: error.message });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ userId: user._id }, "your_jwt_secret", { expiresIn: "1d" });

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        name: user.name,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
