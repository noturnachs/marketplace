const jwt = require("jsonwebtoken");
const User = require("../models/User");

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

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  };

  console.log("Setting cookie with options:", cookieOptions);

  res.cookie("token", token, cookieOptions);

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
exports.logout = async (req, res, next) => {
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "User logged out successfully",
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
