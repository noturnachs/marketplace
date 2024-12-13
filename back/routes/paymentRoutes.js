const express = require("express");
const router = express.Router();
const Payment = require("../models/Payment");
const { protect } = require("../middleware/auth");
const admin = require("../middleware/admin");

// Create new payment
router.post("/", protect, async (req, res) => {
  try {
    const paymentData = {
      userId: req.user.id,
      amount: req.body.amount,
      coins: req.body.coins,
      referenceId: req.body.referenceId,
      paymentMethod: req.body.paymentMethod || "GCash",
    };

    const payment = await Payment.create(paymentData);
    res.status(201).json({
      success: true,
      data: payment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Get user's payments
router.get("/my-payments", protect, async (req, res) => {
  try {
    const payments = await Payment.getPaymentsByUserId(req.user.id);
    res.json({
      success: true,
      data: payments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Get pending payments (admin only)
router.get("/pending", protect, admin, async (req, res) => {
  try {
    const payments = await Payment.getPendingPayments();
    res.json({
      success: true,
      data: payments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Update payment status (admin only)
router.put("/:referenceId/status", protect, admin, async (req, res) => {
  try {
    const { status } = req.body;
    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        error: "Invalid status",
      });
    }

    const payment = await Payment.updateStatus(req.params.referenceId, status);
    if (!payment) {
      return res.status(404).json({
        success: false,
        error: "Payment not found",
      });
    }

    res.json({
      success: true,
      data: payment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

module.exports = router;
