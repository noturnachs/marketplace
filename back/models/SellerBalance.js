const pool = require("../config/db");

const createSellerBalancesTable = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS seller_balances (
      id SERIAL PRIMARY KEY,
      seller_id INTEGER REFERENCES users(id),
      gross_sales DECIMAL(10,2) DEFAULT 0,
      available_balance DECIMAL(10,2) DEFAULT 0,
      total_fees DECIMAL(10,2) DEFAULT 0,
      last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(seller_id)
    )
  `;

  try {
    const client = await pool.connect();
    await client.query(createTableQuery);
    console.log("Seller balances table created successfully");
    client.release();
  } catch (error) {
    console.error("Error creating seller balances table:", error);
  }
};

class SellerBalance {
  static async getBalance(sellerId) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      // Try to get existing balance
      const query = `
        SELECT * FROM seller_balances 
        WHERE seller_id = $1
      `;
      const { rows } = await client.query(query, [sellerId]);

      if (rows.length === 0) {
        // If no balance record exists, create one with default values
        const insertQuery = `
          INSERT INTO seller_balances (
            seller_id, 
            gross_sales, 
            available_balance, 
            total_fees
          )
          VALUES ($1, 0, 0, 0)
          RETURNING *
        `;
        const result = await client.query(insertQuery, [sellerId]);
        await client.query("COMMIT");
        return result.rows[0];
      }

      await client.query("COMMIT");
      return rows[0];
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  static async updateBalance(sellerId, amount) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      // Calculate fees (5%)
      const fee = parseFloat(amount) * 0.05;
      const netAmount = parseFloat(amount) - fee;

      // Upsert the balance record
      const query = `
        INSERT INTO seller_balances (
          seller_id, 
          gross_sales, 
          available_balance,
          total_fees,
          last_updated
        )
        VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
        ON CONFLICT (seller_id)
        DO UPDATE SET
          gross_sales = seller_balances.gross_sales + $2,
          available_balance = seller_balances.available_balance + $3,
          total_fees = seller_balances.total_fees + $4,
          last_updated = CURRENT_TIMESTAMP
        RETURNING *
      `;

      const { rows } = await client.query(query, [
        sellerId,
        amount,
        netAmount,
        fee,
      ]);

      await client.query("COMMIT");
      return rows[0];
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  static async deductBalance(sellerId, amount) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const query = `
        UPDATE seller_balances
        SET available_balance = available_balance - $2,
            last_updated = CURRENT_TIMESTAMP
        WHERE seller_id = $1 AND available_balance >= $2
        RETURNING *
      `;

      const { rows } = await client.query(query, [sellerId, amount]);

      if (rows.length === 0) {
        throw new Error("Insufficient balance");
      }

      await client.query("COMMIT");
      return rows[0];
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }
}

// Initialize table
createSellerBalancesTable();

module.exports = SellerBalance;
