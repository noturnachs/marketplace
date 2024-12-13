const cron = require("node-cron");
const Purchase = require("../models/Purchase");

// Run every 5 minutes
cron.schedule("*/1 * * * *", async () => {
  try {
    console.log(
      "Running purchase expiry check at:",
      new Date().toLocaleString("en-US", { timeZone: "Asia/Manila" })
    );
    const expiredPurchases = await Purchase.handleExpiredPurchases();

    if (expiredPurchases.length > 0) {
      console.log(`Processed ${expiredPurchases.length} expired purchases`);
      console.log("Expired purchases details:", expiredPurchases);
    } else {
      console.log("No expired purchases found");
    }
  } catch (error) {
    console.error("Error processing expired purchases:", error);
  }
});
