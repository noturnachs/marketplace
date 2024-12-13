const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const cookieParser = require("cookie-parser");

// Load env vars
dotenv.config();

// Initialize express
const app = express();

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser
app.use(cookieParser());

// Security middleware
app.use(helmet());
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? "https://yourdomain.com"
        : "http://localhost:3000",
    credentials: true,
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use("/api/", limiter);

// Routes
app.use("/api/v1/auth", require("./routes/authRoutes"));
app.use("/api/v1/listings", require("./routes/listingRoutes"));
app.use("/api/v1/payments", require("./routes/paymentRoutes"));
app.use("/api/v1/purchases", require("./routes/purchaseRoutes"));
app.use("/api/v1/wallet", require("./routes/walletRoutes"));
app.use("/api/v1/sellers", require("./routes/sellerRoutes"));
// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error:
      process.env.NODE_ENV === "development" ? err.message : "Server Error",
  });
});

const PORT = process.env.PORT || 5000;

// Store server instance
const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.log("Error:", err.message);
  // Close server & exit process
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.log("Error:", err.message);
  // Close server & exit process
  server.close(() => process.exit(1));
});
