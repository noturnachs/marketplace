const pool = require("../config/db");

const createListingsTable = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS listings (
      id SERIAL PRIMARY KEY,
      seller_id INTEGER REFERENCES users(id),
      title VARCHAR(100) NOT NULL,
      description TEXT,
      price DECIMAL(10,2) NOT NULL,
      category VARCHAR(50) NOT NULL,
      duration VARCHAR(50),
      in_stock BOOLEAN DEFAULT true,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    )
  `;

  try {
    const client = await pool.connect();
    await client.query(createTableQuery);
    console.log("Listings table created successfully");
    client.release();
  } catch (error) {
    console.error("Error creating listings table:", error);
  }
};

class Listing {
  static async create(listingData) {
    const { seller_id, title, description, price, category, duration } =
      listingData;

    const query = `
      INSERT INTO listings (seller_id, title, description, price, category, duration)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;

    const values = [seller_id, title, description, price, category, duration];

    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  static async getAll() {
    const query = `
      SELECT l.*, u.username as seller_name 
      FROM listings l
      JOIN users u ON l.seller_id = u.id
      ORDER BY l.created_at DESC
    `;

    const { rows } = await pool.query(query);
    return rows;
  }

  static async getBySellerId(sellerId) {
    const query = `
      SELECT * FROM listings 
      WHERE seller_id = $1 
      ORDER BY created_at DESC
    `;

    const { rows } = await pool.query(query, [sellerId]);
    return rows;
  }

  static async getById(id) {
    const query = `
      SELECT l.*, u.username as seller_name 
      FROM listings l
      JOIN users u ON l.seller_id = u.id
      WHERE l.id = $1
    `;

    const { rows } = await pool.query(query, [id]);
    return rows[0];
  }

  static async update(id, sellerId, updateData) {
    const allowedUpdates = [
      "title",
      "description",
      "price",
      "category",
      "duration",
      "in_stock",
    ];
    const updates = [];
    const values = [id, sellerId];
    let valueCount = 3;

    for (const [key, value] of Object.entries(updateData)) {
      if (allowedUpdates.includes(key)) {
        updates.push(`${key} = $${valueCount}`);
        values.push(value);
        valueCount++;
      }
    }

    if (updates.length === 0) return null;

    const query = `
      UPDATE listings 
      SET ${updates.join(", ")}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1 AND seller_id = $2
      RETURNING *
    `;

    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  static async delete(id, sellerId) {
    const query = `
      DELETE FROM listings 
      WHERE id = $1 AND seller_id = $2
      RETURNING *
    `;

    const { rows } = await pool.query(query, [id, sellerId]);
    return rows[0];
  }
}

// Initialize table
createListingsTable();

module.exports = Listing;
