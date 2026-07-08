require("dotenv").config();

// Force Node.js to use Google DNS
const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Route Imports
const roomRoutes = require("./routes/roomRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const testimonialsRoute = require("./routes/testimonials");
const messageRoutes = require("./routes/messageRoutes");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// =======================
// Middlewares
// =======================
app.use(cors());
app.use(express.json());

// =======================
// API Routes
// =======================
app.use("/api/rooms", roomRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/testimonials", testimonialsRoute);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

// =======================
// Root Route
// =======================
app.get("/", (req, res) => {
    res.send("Calm Rest Backend is running 🚀");
});

// =======================
// MongoDB Connection
// =======================
async function startServer() {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log("✅ Connected to MongoDB");

        app.listen(PORT, () => {
            console.log(`✅ Server running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("❌ MongoDB Connection Error:");
        console.error(error);
        process.exit(1);
    }
}

startServer();