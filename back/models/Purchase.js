const pool = require("../config/db");

class Purchase {
  static async create({ buyer_id, listing_id }) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      // Get listing details
      const listingResult = await client.query(
        "SELECT price, seller_id FROM listings WHERE id = $1",
        [listing_id]
      );
      const listing = listingResult.rows[0];

      if (!listing) {
        throw new Error("Listing not found");
      }

      // Check buyer's wallet balance
      const walletResult = await client.query(
        "SELECT coins FROM wallets WHERE user_id = $1",
        [buyer_id]
      );
      const wallet = walletResult.rows[0];

      if (!wallet || parseFloat(wallet.coins) < parseFloat(listing.price)) {
        throw new Error(
          `Insufficient coins. Required: ${listing.price}, Available: ${
            wallet?.coins || 0
          }`
        );
      }

      // Deduct coins from buyer
      await client.query(
        "UPDATE wallets SET coins = coins - $1 WHERE user_id = $2",
        [listing.price, buyer_id]
      );

      // Add coins to seller
      await client.query(
        "UPDATE wallets SET coins = coins + $1 WHERE user_id = $2",
        [listing.price, listing.seller_id]
      );

      // Create purchase record
      const purchaseResult = await client.query(
        `INSERT INTO purchases (buyer_id, listing_id, amount)
         VALUES ($1, $2, $3)
         RETURNING *`,
        [buyer_id, listing_id, listing.price]
      );

      await client.query("COMMIT");
      return purchaseResult.rows[0];
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  static async getByBuyerId(buyerId) {
    const query = `
      SELECT 
        p.*,
        l.title as listing_title,
        l.description as listing_description,
        u.username as seller_name
      FROM purchases p
      JOIN listings l ON p.listing_id = l.id
      JOIN users u ON l.seller_id = u.id
      WHERE p.buyer_id = $1
      ORDER BY p.created_at DESC
    `;

    const { rows } = await pool.query(query, [buyerId]);
    return rows;
  }

  static async getBySellerId(sellerId) {
    const query = `
      SELECT 
        p.*,
        l.title as listing_title,
        l.price,
        u.username as buyer_name
      FROM purchases p
      JOIN listings l ON p.listing_id = l.id
      JOIN users u ON p.buyer_id = u.id
      WHERE l.seller_id = $1
      ORDER BY p.created_at DESC
    `;

    const { rows } = await pool.query(query, [sellerId]);
    return rows;
  }
}

module.exports = Purchase;
