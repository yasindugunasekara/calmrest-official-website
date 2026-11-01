const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    isRead: { type: Boolean, default: false },
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    message: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);
