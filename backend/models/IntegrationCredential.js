const mongoose = require("mongoose");
module.exports = mongoose.model(
  "IntegrationCredential",
  new mongoose.Schema(
    {
      _id: String,
      tokenHash: { type: String, required: true, select: false },
      enabled: { type: Boolean, default: true },
      lastUsedAt: Date,
    },
    { timestamps: true },
  ),
);
