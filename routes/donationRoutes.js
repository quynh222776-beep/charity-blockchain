const express = require("express");
const Donation = require("../models/Donation");

const router = express.Router();

// Lấy tất cả donations
router.get("/", async (req, res) => {
  try {
    const donations = await Donation.find();
    res.json(donations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Lưu donation mới
router.post("/", async (req, res) => {
  const { wallet, amount, txHash } = req.body;
  
  try {
    const donation = new Donation({ wallet, amount, txHash });
    await donation.save();
    res.status(201).json(donation);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;