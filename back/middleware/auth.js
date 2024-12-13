const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in cookies first
    if (req.cookies.token) {
      token = req.cookies.token;
    }
    // Then check Authorization header as fallback
    else if (req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    // Log for debugging
    console.log("Token received:", token);
    console.log("Cookies received:", req.cookies);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to access this route - No token found",
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Decoded token:", decoded);

      // Get user from token
      const user = await User.findByUsername(decoded.username);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: "User no longer exists",
        });
      }

      req.user = user;
      next();
    } catch (err) {
      console.error("Token verification error:", err);
      return res.status(401).json({
        success: false,
        message: "Not authorized - Invalid token",
        error: err.message,
      });
    }
  } catch (error) {
    console.error("Auth middleware error:", error);
    next(error);
  }
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to perform this action",
      });
    }

    // For sellers, check verification status
    if (req.user.role === "seller" && req.user.seller_status !== "verified") {
      return res.status(403).json({
        success: false,
        message: "Your seller account must be verified to perform this action",
      });
    }

    next();
  };
};
