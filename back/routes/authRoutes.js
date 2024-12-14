const express = require("express");
const router = express.Router();
const {
  register,
  login,
  logout,
  getMe,
  generateTelegramVerification,
  checkVerification,
} = require("../controllers/authController");
const { protect } = require("../middleware/auth");

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/me", protect, getMe);
router.post("/telegram-verify", generateTelegramVerification);
router.post("/telegram-verify/check", checkVerification);

module.exports = router;
