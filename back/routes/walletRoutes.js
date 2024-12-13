const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const Wallet = require("../models/Wallet");

router.get("/balance", protect, async (req, res) => {
  try {
    const wallet = await Wallet.getByUserId(req.user.id);
    res.json({
      success: true,
      data: wallet,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

module.exports = router;
