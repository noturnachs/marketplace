const express = require("express");
const router = express.Router();
const { protect, restrictTo } = require("../middleware/auth");
const Listing = require("../models/Listing");

// Create a new listing
router.post("/", protect, restrictTo("seller"), async (req, res) => {
  try {
    const listingData = {
      ...req.body,
      seller_id: req.user.id,
    };

    const listing = await Listing.create(listingData);
    res.status(201).json({
      status: "success",
      data: listing,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
});

// Get all listings (for marketplace)
router.get("/", async (req, res) => {
  try {
    const listings = await Listing.getAll();
    res.json({
      status: "success",
      data: listings,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

// Get seller's listings
router.get("/my-listings", protect, restrictTo("seller"), async (req, res) => {
  try {
    const listings = await Listing.getBySellerId(req.user.id);
    res.json({
      status: "success",
      data: listings,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

// Update a listing
router.put("/:id", protect, restrictTo("seller"), async (req, res) => {
  try {
    const listing = await Listing.update(req.params.id, req.user.id, req.body);

    if (!listing) {
      return res.status(404).json({
        status: "error",
        message: "Listing not found or unauthorized",
      });
    }

    res.json({
      status: "success",
      data: listing,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
});

// Delete a listing
router.delete("/:id", protect, restrictTo("seller"), async (req, res) => {
  try {
    const listing = await Listing.delete(req.params.id, req.user.id);

    if (!listing) {
      return res.status(404).json({
        status: "error",
        message: "Listing not found or unauthorized",
      });
    }

    res.json({
      status: "success",
      data: listing,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
});

module.exports = router;
