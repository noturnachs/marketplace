const pool = require("../config/db");

class Purchase {
  static async create({ listingId, buyerId, amount }) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      // Debug logs
      console.log("Purchase attempt:", {
        listingId,
        buyerId,
        amount,
      });

      // Check wallet with debug
      const walletResult = await client.query(
        "SELECT coins FROM wallets WHERE user_id = $1",
        [buyerId]
      );
      console.log("Wallet balance:", walletResult.rows[0]?.coins);

      const wallet = walletResult.rows[0];
      const numAmount = parseFloat(amount);
      const numBalance = parseFloat(wallet?.coins || 0);

      if (!wallet || numBalance < numAmount) {
        throw new Error(
          `Insufficient balance. Required: ${numAmount}, Available: ${numBalance}`
        );
      }

      // Deduct from buyer's wallet
      await client.query(
        "UPDATE wallets SET coins = coins - $1 WHERE user_id = $2",
        [numAmount, buyerId]
      );

      // Create the purchase with CURRENT_TIMESTAMP which is in UTC by default
      const result = await client.query(
        `INSERT INTO purchases (listing_id, buyer_id, amount, status, created_at) 
         VALUES ($1, $2, $3, 'awaiting_seller', CURRENT_TIMESTAMP) 
         RETURNING *`,
        [listingId, buyerId, numAmount]
      );

      await client.query("COMMIT");
      return result.rows[0];
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  static async getByBuyerId(buyerId) {
    const client = await pool.connect();
    try {
      // Set timezone to Asia/Manila
      await client.query("SET timezone = 'Asia/Manila'");

      const query = `
        SELECT 
          p.*,
          l.title as listing_title,
          l.description as listing_description,
          u.username as seller_name,
          p.status,
          p.account_details
        FROM purchases p
        JOIN listings l ON p.listing_id = l.id
        JOIN users u ON l.seller_id = u.id
        WHERE p.buyer_id = $1
        ORDER BY p.created_at DESC
      `;

      const { rows } = await client.query(query, [buyerId]);
      return rows;
    } finally {
      client.release();
    }
  }

  static async getBySellerId(sellerId) {
    const client = await pool.connect();
    try {
      // Set timezone to Asia/Manila
      await client.query("SET timezone = 'Asia/Manila'");

      const query = `
        SELECT 
          p.*,
          l.title as listing_title,
          l.price,
          u.username as buyer_name,
          s.username as seller_name,
          CASE 
            WHEN p.status = 'completed' AND p.is_confirmed = true THEN p.amount
            ELSE 0
          END as completed_amount,
          CASE 
            WHEN p.status = 'awaiting_seller' OR (p.status = 'completed' AND p.is_confirmed = false) THEN p.amount
            ELSE 0
          END as pending_amount
        FROM purchases p
        JOIN listings l ON p.listing_id = l.id
        JOIN users u ON p.buyer_id = u.id
        JOIN users s ON l.seller_id = s.id
        WHERE l.seller_id = $1
        ORDER BY p.created_at DESC
      `;

      const { rows } = await client.query(query, [sellerId]);

      // Calculate totals
      const totalCompletedSales = rows.reduce(
        (sum, row) => sum + parseFloat(row.completed_amount || 0),
        0
      );
      const totalPendingSales = rows.reduce(
        (sum, row) => sum + parseFloat(row.pending_amount || 0),
        0
      );

      return {
        sales: rows,
        totalCompletedSales,
        totalPendingSales,
      };
    } finally {
      client.release();
    }
  }

  static async updateStatus(id, { status, account_details }) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      // Get purchase details first
      const purchaseResult = await client.query(
        `SELECT p.*, l.seller_id 
         FROM purchases p
         JOIN listings l ON p.listing_id = l.id
         WHERE p.id = $1`,
        [id]
      );
      const purchase = purchaseResult.rows[0];

      if (!purchase) {
        throw new Error("Purchase not found");
      }

      if (status === "cancelled") {
        // Refund buyer if cancelling
        await client.query(
          "UPDATE wallets SET coins = coins + $1 WHERE user_id = $2",
          [purchase.amount, purchase.buyer_id]
        );
      }

      // Update purchase status (but don't transfer coins yet)
      const updateResult = await client.query(
        `UPDATE purchases 
         SET status = $1, account_details = $2
         WHERE id = $3
         RETURNING *`,
        [status, account_details, id]
      );

      await client.query("COMMIT");
      return updateResult.rows[0];
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  static async confirmPurchase(id) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      // Get purchase details first
      const purchaseResult = await client.query(
        `SELECT p.*, l.seller_id 
         FROM purchases p
         JOIN listings l ON p.listing_id = l.id
         WHERE p.id = $1`,
        [id]
      );
      const purchase = purchaseResult.rows[0];

      if (!purchase) {
        throw new Error("Purchase not found");
      }

      if (purchase.status !== "completed") {
        throw new Error("Cannot confirm purchase that is not completed");
      }

      // Set is_confirmed to true
      await client.query(
        `UPDATE purchases 
         SET is_confirmed = TRUE
         WHERE id = $1`,
        [id]
      );

      // Now add the amount to seller's wallet
      await client.query(
        "UPDATE wallets SET coins = coins + $1 WHERE user_id = $2",
        [purchase.amount, purchase.seller_id]
      );

      await client.query("COMMIT");
      return true;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  static async handleExpiredPurchases() {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      console.log("Starting expired purchases check...");

      // Find purchases that are over 1 hour old and still awaiting seller
      // Convert UTC times to PH time (UTC+8) before comparison
      const expiredPurchases = await client.query(`
        SELECT 
          p.*,
          l.seller_id,
          l.price as amount,
          p.created_at AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Manila' as ph_created_at,
          NOW() AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Manila' as ph_current_time
        FROM purchases p
        JOIN listings l ON p.listing_id = l.id
        WHERE p.status = 'awaiting_seller'
        AND (p.created_at AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Manila') < 
            ((NOW() AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Manila') - INTERVAL '1 hour')
      `);

      console.log(`Found ${expiredPurchases.rows.length} expired purchases`);

      for (const purchase of expiredPurchases.rows) {
        console.log("Time Debug:", {
          purchase_id: purchase.id,
          utc_created_at: purchase.created_at,
          ph_created_at: purchase.ph_created_at,
          ph_current_time: purchase.ph_current_time,
          time_difference_minutes: Math.floor(
            (new Date(purchase.ph_current_time) -
              new Date(purchase.ph_created_at)) /
              (1000 * 60)
          ),
        });

        // Rest of the processing...
        console.log(`Processing expired purchase ID: ${purchase.id}`);
        console.log(`Created at (UTC): ${purchase.created_at}`);
        console.log(`Created at (PH): ${purchase.ph_created_at}`);
        console.log(`Current time (PH): ${purchase.ph_current_time}`);
        console.log(
          `Amount to refund: ${purchase.amount} to buyer ID: ${purchase.buyer_id}`
        );

        // Refund the buyer
        await client.query(
          "UPDATE wallets SET coins = coins + $1 WHERE user_id = $2",
          [purchase.amount, purchase.buyer_id]
        );
        console.log(
          `Refunded ${purchase.amount} coins to buyer ${purchase.buyer_id}`
        );

        // Update purchase status to cancelled
        await client.query(
          `UPDATE purchases 
           SET status = 'cancelled'
           WHERE id = $1`,
          [purchase.id]
        );
        console.log(`Updated purchase ${purchase.id} status to cancelled`);
      }

      await client.query("COMMIT");
      console.log("Expired purchases check completed successfully");
      return expiredPurchases.rows;
    } catch (error) {
      await client.query("ROLLBACK");
      console.error("Error in handleExpiredPurchases:", error);
      throw error;
    } finally {
      client.release();
    }
  }
}

module.exports = Purchase;
