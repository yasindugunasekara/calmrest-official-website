const mongoose = require("mongoose");
const schema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
    phone: { type: String, maxLength: 30 },
    confirmedByIntegration: String,
    confirmedAt: Date,
    firstName: { type: String, required: true, trim: true, maxLength: 80 },
    lastName: { type: String, required: true, trim: true, maxLength: 80 },
    email: { type: String, required: true, lowercase: true },
    roomId: { type: mongoose.Schema.Types.ObjectId, ref: "Room", index: true },
    roomType: { type: String, required: true },
    checkIn: { type: String, required: true },
    checkOut: { type: String, required: true },
    guests: { type: Number, required: true, min: 1, max: 20 },
    specialRequest: { type: String, maxLength: 2000 },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Checked In", "Checked Out", "Cancelled"],
      default: "Pending",
      index: true,
    },
    pricePerNight: { type: Number, min: 0 },
    totalPrice: { type: Number, min: 0 },
    nights: { type: Number, min: 1 },
    idempotencyKey: { type: String, index: { unique: true, sparse: true } },
  },
  { timestamps: true },
);
schema.index({ roomId: 1, checkIn: 1, checkOut: 1, status: 1 });
module.exports = mongoose.model("Booking", schema);
