const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const admin = require("../middleware/admin");
const Seller = require("../models/Seller");

// Get pending sellers
router.get("/pending", protect, admin, async (req, res) => {
  try {
    const sellers = await Seller.getPendingSellers();
    res.json({
      success: true,
      data: sellers,
    });
  } catch (error) {
    console.error("Error getting pending sellers:", error);
    res.status(500).json({
      success: false,
      error: "Failed to get pending sellers",
    });
  }
});

// Get all sellers
router.get("/", protect, admin, async (req, res) => {
  try {
    const sellers = await Seller.getAllSellers();
    res.json({
      success: true,
      data: sellers,
    });
  } catch (error) {
    console.error("Error getting all sellers:", error);
    res.status(500).json({
      success: false,
      error: "Failed to get sellers",
    });
  }
});

// Update seller status
router.put("/:id/status", protect, admin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const seller = await Seller.updateStatus(id, status);
    res.json({
      success: true,
      data: seller,
    });
  } catch (error) {
    console.error("Error updating seller status:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to update seller status",
    });
  }
});

module.exports = router;
