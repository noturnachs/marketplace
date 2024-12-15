const pool = require("../config/db");

class SellerProfile {
  static async getByUserId(sellerId) {
    const query = `
      SELECT * FROM seller_profiles 
      WHERE seller_id = $1
    `;
    const { rows } = await pool.query(query, [sellerId]);
    return rows[0];
  }

  static async update(sellerId, colors) {
    // First check if a profile exists
    const existingProfile = await this.getByUserId(sellerId);

    if (!existingProfile) {
      // If no profile exists, create one
      const insertQuery = `
        INSERT INTO seller_profiles (
          seller_id, 
          primary_color, 
          secondary_color, 
          accent_color
        ) 
        VALUES ($1, $2, $3, $4)
        RETURNING *
      `;

      const values = [
        sellerId,
        colors.primary_color || "#17222e",
        colors.secondary_color || "#182531",
        colors.accent_color || "#6366F1",
      ];

      const { rows } = await pool.query(insertQuery, values);
      return rows[0];
    }

    // If profile exists, update it
    const updateQuery = `
      UPDATE seller_profiles 
      SET 
        primary_color = $1,
        secondary_color = $2,
        accent_color = $3
      WHERE seller_id = $4
      RETURNING *
    `;

    const values = [
      colors.primary_color || existingProfile.primary_color,
      colors.secondary_color || existingProfile.secondary_color,
      colors.accent_color || existingProfile.accent_color,
      sellerId,
    ];

    const { rows } = await pool.query(updateQuery, values);
    return rows[0];
  }
}

module.exports = SellerProfile;
