const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
require("./cron/purchaseExpiryCheck");

// Load env vars
dotenv.config();

// Initialize express
const app = express();

// Trust proxy
app.set("trust proxy", 1);

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Security middleware
app.use(helmet());
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? process.env.FRONTEND_URL
        : "http://localhost:3000",
    credentials: true,
  })
);

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

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

module.exports = app;
