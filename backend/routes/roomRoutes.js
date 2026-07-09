const express = require("express");
const Room = require("../models/Room");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// CREATE Room
router.post("/", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const room = new Room(req.body);
    await room.save();
    res.status(201).json(room);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET all Rooms
router.get("/", async (req, res) => {
  try {
    const rooms = await Room.find();
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE Room
router.put("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const updatedRoom = await Room.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updatedRoom);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE Room
router.delete("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    await Room.findByIdAndDelete(req.params.id);
    res.json({ message: "Room deleted successfully ✅" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Get single room by ID
router.get("/:id",async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ message: "Room not found" });
    res.json(room);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
