const pool = require("../config/db");
const TelegramBotService = require("../services/telegramBotService");

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
        u.fee_exempt,
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
        u.last_login,
        u.fee_exempt
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

    await TelegramBotService.notifySellerOfVerification(id, status);

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

  static async getSellerDetails(id) {
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
        u.vouch_count,
        u.last_login,
        COUNT(DISTINCT l.id) as total_listings,
        COUNT(DISTINCT p.id) as total_sales,
        COALESCE(SUM(p.amount), 0) as total_earnings
      FROM users u
      LEFT JOIN listings l ON u.id = l.seller_id
      LEFT JOIN purchases p ON l.id = p.listing_id
      WHERE u.id = $1 AND u.role = 'seller'
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
        u.vouch_count,
        u.last_login
    `;

    const { rows } = await pool.query(query, [id]);

    if (rows.length === 0) {
      throw new Error("Seller not found");
    }

    return rows[0];
  }

  static async updateVouchLink(id, vouchLink) {
    const query = `
      UPDATE users
      SET 
        vouch_link = $1,
        has_vouches = TRUE
      WHERE id = $2 AND role = 'seller'
      RETURNING id, username, vouch_link, has_vouches
    `;

    const { rows } = await pool.query(query, [vouchLink, id]);

    if (rows.length === 0) {
      throw new Error("Seller not found");
    }

    return rows[0];
  }

  static async updateFeeExemption(sellerId, isExempt) {
    const query = `
      UPDATE users 
      SET fee_exempt = $1 
      WHERE id = $2 AND role = 'seller' 
      RETURNING *
    `;

    const { rows } = await pool.query(query, [isExempt, sellerId]);
    return rows[0];
  }

  static async getFeeExemptionStatus(sellerId) {
    const query = `
      SELECT fee_exempt 
      FROM users 
      WHERE id = $1 AND role = 'seller'
    `;

    const { rows } = await pool.query(query, [sellerId]);
    return rows[0]?.fee_exempt || false;
  }

  static async getProfile(id) {
    const query = `
      SELECT 
        u.id,
        u.username,
        u.telegram_username,
        u.created_at,
        u.seller_status,
        u.has_vouches,
        u.vouch_link,
        u.vouch_count,
        u.account_types,
        COALESCE(
          (SELECT COUNT(*) FROM listings l WHERE l.seller_id = u.id AND l.in_stock = true),
          0
        ) as total_listings,
        COALESCE(
          (SELECT COUNT(*) FROM purchases p 
           JOIN listings l ON p.listing_id = l.id 
           WHERE l.seller_id = u.id AND p.status = 'completed' AND p.is_confirmed = true),
          0
        ) as total_sales
      FROM users u
      WHERE u.id = $1 AND u.role = 'seller'
    `;

    const { rows } = await pool.query(query, [id]);
    if (rows.length === 0) {
      throw new Error("Seller not found");
    }

    return rows[0];
  }
}

module.exports = Seller;
