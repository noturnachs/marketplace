const pool = require("../config/db");

const createPaymentsTable = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS payments (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id),
      amount DECIMAL(10,2) NOT NULL,
      coins INTEGER NOT NULL,
      reference_id VARCHAR(50) UNIQUE NOT NULL,
      payment_method VARCHAR(20) NOT NULL,
      status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    )
  `;

  try {
    const client = await pool.connect();
    try {
      await client.query(createTableQuery);
      console.log("Payments table created successfully");
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Error creating payments table:", error.message);
  }
};

createPaymentsTable().catch(console.error);

class Payment {
  static async create(paymentData) {
    const { userId, amount, coins, referenceId, paymentMethod } = paymentData;

    const query = `
      INSERT INTO payments (user_id, amount, coins, reference_id, payment_method)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;

    const values = [userId, amount, coins, referenceId, paymentMethod];

    try {
      const { rows } = await pool.query(query, values);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async updateStatus(referenceId, status) {
    const query = `
      UPDATE payments 
      SET status = $1, updated_at = CURRENT_TIMESTAMP
      WHERE reference_id = $2
      RETURNING *
    `;

    try {
      const { rows } = await pool.query(query, [status, referenceId]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async getPendingPayments() {
    const query = `
      SELECT p.*, u.username 
      FROM payments p
      JOIN users u ON p.user_id = u.id
      WHERE p.status = 'pending'
      ORDER BY p.created_at DESC
    `;

    try {
      const { rows } = await pool.query(query);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async getPaymentsByUserId(userId) {
    const query = `
      SELECT * FROM payments
      WHERE user_id = $1
      ORDER BY created_at DESC
    `;

    try {
      const { rows } = await pool.query(query, [userId]);
      return rows;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Payment;
