const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: {
    rejectUnauthorized: false, // Only use this in development
  },
});

// Test the connection
const testConnection = async () => {
  try {
    const client = await pool.connect();
    console.log("Database connected successfully");
    client.release();
  } catch (err) {
    console.error("Error connecting to the database:", err.message);
  }
};

testConnection();

module.exports = pool;
