const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const admin = require("../middleware/admin");
const Seller = require("../models/Seller");
const SellerBalance = require("../models/SellerBalance");
const pool = require("../config/db");

// Admin routes
router.get("/pending", protect, admin, async (req, res) => {
  try {
    const sellers = await Seller.getPendingSellers();
    res.json({ success: true, data: sellers });
  } catch (error) {
    console.error("Error getting pending sellers:", error);
    res
      .status(500)
      .json({ success: false, error: "Failed to get pending sellers" });
  }
});

router.get("/", protect, admin, async (req, res) => {
  try {
    const sellers = await Seller.getAllSellers();
    res.json({ success: true, data: sellers });
  } catch (error) {
    console.error("Error getting all sellers:", error);
    res.status(500).json({ success: false, error: "Failed to get sellers" });
  }
});

// Seller routes
router.get("/fee-status", protect, async (req, res) => {
  try {
    const feeExempt = await Seller.getFeeExemptionStatus(req.user.id);
    res.json({ success: true, feeExempt: feeExempt });
  } catch (error) {
    console.error("Error fetching fee status:", error);
    res
      .status(500)
      .json({ success: false, error: "Failed to fetch fee exemption status" });
  }
});

router.get("/balance", protect, async (req, res) => {
  try {
    const balance = await SellerBalance.getBalance(req.user.id);
    res.json(balance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Public seller profile routes
router.get("/:id/profile", protect, async (req, res) => {
  try {
    const query = `
      SELECT 
        u.id,
        u.username,
        u.telegram_username,
        u.seller_status,
        u.account_types,
        u.created_at,
        u.has_vouches,
        u.vouch_link,
        u.vouch_count,
        COUNT(DISTINCT l.id) as total_listings,
        COUNT(DISTINCT p.id) as total_sales,
        COALESCE(SUM(p.amount), 0) as total_earnings
      FROM users u
      LEFT JOIN listings l ON u.id = l.seller_id
      LEFT JOIN purchases p ON l.id = p.listing_id
      WHERE u.id = $1 AND u.role = 'seller'
      GROUP BY u.id, u.username, u.telegram_username, u.seller_status, 
        u.account_types, u.created_at, u.has_vouches, u.vouch_link, u.vouch_count
    `;

    const { rows } = await pool.query(query, [req.params.id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Seller not found" });
    }

    const publicProfile = {
      id: rows[0].id,
      username: rows[0].username,
      telegram_username: rows[0].telegram_username,
      seller_status: rows[0].seller_status,
      account_types: rows[0].account_types,
      created_at: rows[0].created_at,
      total_sales: rows[0].total_sales,
      total_listings: rows[0].total_listings,
      has_vouches: rows[0].has_vouches,
      vouch_link: rows[0].vouch_link,
      vouch_count: rows[0].vouch_count || 0,
    };

    res.json({ success: true, data: publicProfile });
  } catch (error) {
    console.error("Error fetching seller profile:", error);
    res
      .status(500)
      .json({ success: false, error: "Error fetching seller profile" });
  }
});

router.get("/:id/listings", protect, async (req, res) => {
  try {
    const query = `
      SELECT 
        l.id,
        l.title,
        l.description,
        l.price,
        l.created_at,
        l.category,
        l.in_stock,
        COUNT(p.id) as total_purchases
      FROM listings l
      LEFT JOIN purchases p ON l.id = p.listing_id
      WHERE l.seller_id = $1 AND l.in_stock = true
      GROUP BY l.id
      ORDER BY l.created_at DESC
    `;

    const { rows } = await pool.query(query, [req.params.id]);
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error("Error fetching seller listings:", error);
    res.status(500).json({ success: false, error: "Error fetching listings" });
  }
});

// Admin management routes
router.put("/:id/status", protect, admin, async (req, res) => {
  try {
    const { status } = req.body;
    const seller = await Seller.updateStatus(req.params.id, status);
    res.json({ success: true, data: seller });
  } catch (error) {
    console.error("Error updating seller status:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to update seller status",
    });
  }
});

router.put("/:id/vouches", protect, async (req, res) => {
  try {
    const { vouch_link } = req.body;
    const seller = await Seller.updateVouchLink(req.params.id, vouch_link);
    res.json({ success: true, data: seller });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.put("/:id/fee-exemption", protect, admin, async (req, res) => {
  try {
    const { isExempt } = req.body;
    const seller = await Seller.updateFeeExemption(req.params.id, isExempt);
    res.json({ success: true, data: seller });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
