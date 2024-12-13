const pool = require("../config/db");

class Seller {
  static async getPendingSellers() {
    const query = `
      SELECT 
        u.id,
        u.username,
        u.email,
        u.seller_status,
        u.account_types,
        u.created_at,
        COUNT(l.id) as total_listings,
        COUNT(p.id) as total_sales
      FROM users u
      LEFT JOIN listings l ON u.id = l.seller_id
      LEFT JOIN purchases p ON l.id = p.listing_id
      WHERE u.role = 'seller' 
      AND u.seller_status = 'pending'
      GROUP BY u.id
      ORDER BY u.created_at DESC
    `;

    const { rows } = await pool.query(query);
    return rows;
  }

  static async getAllSellers() {
    const query = `
      SELECT 
        u.id,
        u.username,
        u.email,
        u.seller_status,
        u.account_types,
        u.created_at,
        u.selling_experience,
        u.has_vouches,
        u.vouch_link,
        u.last_login,
        COUNT(DISTINCT l.id) as total_listings,
        COUNT(DISTINCT p.id) as total_sales,
        COALESCE(SUM(p.amount), 0) as total_earnings
      FROM users u
      LEFT JOIN listings l ON u.id = l.seller_id
      LEFT JOIN purchases p ON l.id = p.listing_id
      WHERE u.role = 'seller'
      GROUP BY 
        u.id,
        u.username,
        u.email,
        u.seller_status,
        u.account_types,
        u.created_at,
        u.selling_experience,
        u.has_vouches,
        u.vouch_link,
        u.last_login
      ORDER BY 
        CASE 
          WHEN u.seller_status = 'pending' THEN 1
          WHEN u.seller_status = 'verified' THEN 2
          ELSE 3
        END,
        u.created_at DESC
    `;

    const { rows } = await pool.query(query);
    return rows;
  }

  static async updateStatus(id, status) {
    const query = `
      UPDATE users
      SET seller_status = $1
      WHERE id = $2 AND role = 'seller'
      RETURNING id, username, email, seller_status, account_types
    `;

    const { rows } = await pool.query(query, [status, id]);

    if (rows.length === 0) {
      throw new Error("Seller not found");
    }

    return rows[0];
  }

  static async getSellerStats(sellerId) {
    const query = `
      SELECT 
        COUNT(DISTINCT l.id) as total_listings,
        COUNT(DISTINCT p.id) as total_sales,
        COALESCE(SUM(p.amount), 0) as total_earnings
      FROM users u
      LEFT JOIN listings l ON u.id = l.seller_id
      LEFT JOIN purchases p ON l.id = p.listing_id
      WHERE u.id = $1 AND u.role = 'seller'
      GROUP BY u.id
    `;

    const { rows } = await pool.query(query, [sellerId]);
    return (
      rows[0] || {
        total_listings: 0,
        total_sales: 0,
        total_earnings: 0,
      }
    );
  }
}

module.exports = Seller;
