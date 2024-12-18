const jwt = require("jsonwebtoken");
const User = require("../models/User");
const telegramBotService = require("../services/telegramBotService");

// Helper function to create and send token response
const sendTokenResponse = (user, statusCode, res) => {
  // Generate token directly if getSignedJwtToken is not available
  const token = jwt.sign(
    {
      id: user.id,
      username: user.username,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );

  res.status(statusCode).json({
    success: true,
    token,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      account_types: user.account_types,
      selling_experience: user.selling_experience,
      has_vouches: user.has_vouches,
      vouch_link: user.vouch_link,
      telegram_username: user.telegram_username,
      created_at: user.created_at,
      last_login: user.last_login,
      seller_status: user.seller_status,
    },
  });
};

// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const {
      username,
      email,
      password,
      role,
      accountTypes,
      sellingExperience,
      hasVouches,
      vouchLink,
      telegramUsername,
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    // Create user
    const user = await User.create({
      username,
      email,
      password,
      role,
      accountTypes,
      sellingExperience,
      hasVouches,
      vouchLink,
      telegram_username: telegramUsername,
    });

    sendTokenResponse(user, 201, res);
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // Validate username & password
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide username and password",
      });
    }

    // Check for user
    const user = await User.findByUsername(username);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Check if password matches
    const isMatch = await User.comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

// @desc    Logout user / clear cookie
// @route   GET /api/v1/auth/logout
// @access  Private
exports.logout = async (req, res) => {
  res.status(200).json({
    success: true,
    data: {},
  });
};

// @desc    Get current logged in user
// @route   GET /api/v1/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findByUsername(req.user.username);

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

exports.generateTelegramVerification = async (req, res) => {
  try {
    const { telegramUsername } = req.body;

    if (!telegramUsername) {
      return res.status(400).json({
        success: false,
        message: "Telegram username is required",
      });
    }

    const code = await telegramBotService.generateVerificationCode(
      telegramUsername
    );

    res.status(200).json({
      success: true,
      code,
      botUsername: process.env.TELEGRAM_BOT_USERNAME,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error generating verification code",
    });
  }
};

exports.checkVerification = async (req, res) => {
  try {
    const { code } = req.body;
    const isVerified = await telegramBotService.checkVerificationStatus(code);

    res.status(200).json({
      success: true,
      verified: isVerified,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error checking verification status",
    });
  }
};
