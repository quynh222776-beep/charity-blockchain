const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema({
  wallet: String,
  amount: Number,
  txHash: String,
  time: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Donation", donationSchema);