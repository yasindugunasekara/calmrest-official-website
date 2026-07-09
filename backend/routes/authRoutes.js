const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// 🟢 Normal Email/Password Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        error: "Invalid email or password",
      });
    }

    // Prevent Google users from using password login
    if (user.provider === "google") {
      return res.status(400).json({
        error: "Please login with Google",
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        error: "Invalid email or password",
      });
    }

    // Generate JWT
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET || "default_jwt_secret_fallback_key_12345",
      {
        expiresIn: process.env.JWT_EXPIRE || "7d",
      }
    );

    // Success
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        provider: user.provider,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: err.message,
    });
  }
});

// 🟣 Google Login
router.post("/google", async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      provider,
    } = req.body;

    if (!email) {
      return res.status(400).json({
        error: "Email is required",
      });
    }

    let user = await User.findOne({ email });

    // Create user if not exists
    if (!user) {
      user = new User({
        firstName: firstName || "",
        lastName: lastName || "",
        email,
        provider: provider || "google",
        role: "user",
      });

      await user.save();
    }

    // Generate JWT
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET || "default_jwt_secret_fallback_key_12345",
      {
        expiresIn: process.env.JWT_EXPIRE || "7d",
      }
    );

    res.status(200).json({
      message: "Google login successful",
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        provider: user.provider,
      },
    });
  } catch (err) {
    console.error("Google login error:", err);

    res.status(500).json({
      error: "Server error during Google login",
    });
  }
});

module.exports = router;