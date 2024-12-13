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
    const {
      seller_id,
      title,
      description,
      price,
      category,
      duration,
      features,
    } = listingData;

    const query = `
      INSERT INTO listings (seller_id, title, description, price, category, duration, features)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;

    const values = [
      seller_id,
      title,
      description,
      price,
      category,
      duration,
      features || [],
    ];

    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  static async getAll() {
    const result = await pool.query(
      "SELECT listings.*, users.username as seller_name FROM listings JOIN users ON listings.seller_id = users.id"
    );
    return result.rows;
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
    const result = await pool.query(
      "SELECT listings.*, users.username as seller_name FROM listings JOIN users ON listings.seller_id = users.id WHERE listings.id = $1",
      [id]
    );
    return result.rows[0];
  }

  static async update(id, listingData) {
    const { title, description, price, category, duration, features } =
      listingData;

    const query = `
      UPDATE listings 
      SET title = $1, description = $2, price = $3, category = $4, duration = $5, features = $6
      WHERE id = $7
      RETURNING *
    `;

    const values = [
      title,
      description,
      price,
      category,
      duration,
      features || [],
      id,
    ];

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

  static async getByUserId(userId) {
    const result = await pool.query(
      "SELECT listings.*, users.username as seller_name FROM listings JOIN users ON listings.seller_id = users.id WHERE seller_id = $1",
      [userId]
    );
    return result.rows;
  }
}

// Initialize table
createListingsTable();

module.exports = Listing;
