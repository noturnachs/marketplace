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
    await pool.query(createTableQuery);
    console.log("Payments table created successfully");
  } catch (error) {
    console.error("Error creating payments table:", error.message);
    throw error;
  }
};

class Payment {
  static async create({ userId, amount, coins, referenceId, paymentMethod }) {
    // Convert amount to integer (remove decimal points)
    const amountInCents = Math.round(parseFloat(amount) * 100);
    const coinsAmount = Math.round(parseFloat(coins));

    const query = `
      INSERT INTO payments (user_id, amount, coins, reference_id, payment_method, status)
      VALUES ($1, $2, $3, $4, $5, 'pending')
      RETURNING *
    `;
    const values = [
      userId,
      amountInCents,
      coinsAmount,
      referenceId,
      paymentMethod,
    ];
    const { rows } = await pool.query(query, values);

    // Convert amount back to decimal for response
    const payment = rows[0];
    return {
      ...payment,
      amount: payment.amount / 100,
    };
  }

  static async updateStatus(referenceId, status) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      // Get payment details
      const paymentResult = await client.query(
        "SELECT * FROM payments WHERE reference_id = $1",
        [referenceId]
      );
      const payment = paymentResult.rows[0];

      if (!payment) {
        throw new Error("Payment not found");
      }

      // If approving payment, update wallet
      if (status === "approved") {
        // Check if wallet exists, if not create one
        const walletResult = await client.query(
          "SELECT * FROM wallets WHERE user_id = $1",
          [payment.user_id]
        );

        if (walletResult.rows.length === 0) {
          await client.query(
            "INSERT INTO wallets (user_id, coins) VALUES ($1, $2)",
            [payment.user_id, Math.round(payment.coins)]
          );
        } else {
          // Update existing wallet
          await client.query(
            "UPDATE wallets SET coins = coins + $1 WHERE user_id = $2",
            [Math.round(payment.coins), payment.user_id]
          );
        }
      }

      // Update payment status
      const updateResult = await client.query(
        `UPDATE payments 
         SET status = $1, updated_at = CURRENT_TIMESTAMP 
         WHERE reference_id = $2 
         RETURNING *`,
        [status, referenceId]
      );

      await client.query("COMMIT");

      // Convert amount back to decimal for response
      const updatedPayment = updateResult.rows[0];
      return {
        ...updatedPayment,
        amount: updatedPayment.amount / 100,
      };
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  static async getPaymentsByUserId(userId) {
    const query = `
      SELECT * FROM payments 
      WHERE user_id = $1 
      ORDER BY created_at DESC
    `;
    const { rows } = await pool.query(query, [userId]);
    // Convert amounts back to decimal
    return rows.map((payment) => ({
      ...payment,
      amount: payment.amount / 100,
    }));
  }

  static async getPendingPayments() {
    const query = `
      SELECT 
        payments.*,
        users.username,
        users.email
      FROM payments 
      JOIN users ON payments.user_id = users.id
      WHERE payments.status = 'pending'
      ORDER BY payments.created_at DESC
    `;
    const { rows } = await pool.query(query);
    // Convert amounts back to decimal
    return rows.map((payment) => ({
      ...payment,
      amount: payment.amount / 100,
    }));
  }

  static async getAllPayments() {
    const query = `
      SELECT 
        payments.*,
        users.username,
        users.email
      FROM payments 
      JOIN users ON payments.user_id = users.id
      ORDER BY payments.created_at DESC
    `;
    const { rows } = await pool.query(query);
    // Convert amounts back to decimal
    return rows.map((payment) => ({
      ...payment,
      amount: payment.amount / 100,
    }));
  }
}

// Initialize table
createPaymentsTable().catch(console.error);

module.exports = Payment;
