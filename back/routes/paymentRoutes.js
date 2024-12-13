const express = require("express");
const router = express.Router();
const Payment = require("../models/Payment");
const { protect } = require("../middleware/auth");
const admin = require("../middleware/admin");

// Create new payment
router.post("/", protect, async (req, res) => {
  try {
    const { amount, coins, referenceId, paymentMethod } = req.body;

    if (!amount || !coins || !referenceId || !paymentMethod) {
      return res.status(400).json({
        success: false,
        error: "Please provide all required fields",
      });
    }

    const payment = await Payment.create({
      userId: req.user.id,
      amount,
      coins,
      referenceId,
      paymentMethod,
    });

    res.status(201).json({
      success: true,
      data: payment,
    });
  } catch (error) {
    if (error.code === "23505") {
      // Unique violation
      return res.status(400).json({
        success: false,
        error: "Reference ID already exists",
      });
    }
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

// Get all pending payments (admin only)
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

// Get all payments (admin only)
router.get("/all", protect, admin, async (req, res) => {
  try {
    const payments = await Payment.getAllPayments();
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
    const { referenceId } = req.params;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        error: "Invalid status. Must be 'approved' or 'rejected'",
      });
    }

    const payment = await Payment.updateStatus(referenceId, status);

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
