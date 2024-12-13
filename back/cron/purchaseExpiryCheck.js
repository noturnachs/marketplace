const cron = require("node-cron");
const Purchase = require("../models/Purchase");

// Run every 5 minutes
cron.schedule("*/5 * * * *", async () => {
  try {
    console.log("Checking for expired purchases...");
    const expiredPurchases = await Purchase.handleExpiredPurchases();

    if (expiredPurchases.length > 0) {
      console.log(`Processed ${expiredPurchases.length} expired purchases`);
    }
  } catch (error) {
    console.error("Error processing expired purchases:", error);
  }
});
