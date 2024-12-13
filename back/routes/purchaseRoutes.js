const express = require("express");
const router = express.Router();
const Purchase = require("../models/Purchase");
const { protect } = require("../middleware/auth");

router.post("/", protect, async (req, res) => {
  try {
    const purchase = await Purchase.create({
      buyerId: req.user.id,
      listingId: req.body.listing_id,
      amount: req.body.amount,
      created_at: req.body.created_at,
    });

    res.json({
      success: true,
      data: purchase,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

router.get("/my-purchases", protect, async (req, res) => {
  try {
    const purchases = await Purchase.getByBuyerId(req.user.id);
    res.json({
      success: true,
      data: purchases,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

router.get("/my-sales", protect, async (req, res) => {
  try {
    const sales = await Purchase.getBySellerId(req.user.id);
    res.json({
      success: true,
      data: sales,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

router.put("/:id/status", protect, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, account_details } = req.body;

    const purchase = await Purchase.updateStatus(id, {
      status,
      account_details,
    });

    res.json({
      success: true,
      data: purchase,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

router.post("/:id/confirm", protect, async (req, res) => {
  try {
    const { id } = req.params;
    const purchase = await Purchase.confirmPurchase(id);

    res.json({
      success: true,
      data: purchase,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

module.exports = router;
