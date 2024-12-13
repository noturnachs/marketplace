const pool = require("../config/db");

class Wallet {
  static async getByUserId(userId) {
    const query = `
      SELECT * FROM wallets 
      WHERE user_id = $1
    `;
    const { rows } = await pool.query(query, [userId]);
    return rows[0] || { user_id: userId, coins: 0 };
  }
}

module.exports = Wallet;
