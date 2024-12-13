const pool = require("../config/db");
const bcrypt = require("bcryptjs");

const createUsersTable = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(50) UNIQUE NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      role VARCHAR(20) NOT NULL CHECK (role IN ('buyer', 'seller')),
      seller_status VARCHAR(20) DEFAULT 'pending' CHECK (seller_status IN ('pending', 'verified', 'rejected')),
      account_types TEXT[] DEFAULT '{}',
      selling_experience VARCHAR(50),
      has_vouches BOOLEAN,
      vouch_link VARCHAR(255),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      last_login TIMESTAMP WITH TIME ZONE
    )
  `;

  try {
    const client = await pool.connect();
    try {
      await client.query(createTableQuery);
      console.log("Users table created successfully");
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Error creating users table:", error.message);
    // Don't throw the error, just log it
  }
};

// Initialize table
createUsersTable().catch(console.error);

class User {
  static async create(userData) {
    const {
      username,
      email,
      password,
      role,
      accountTypes,
      sellingExperience,
      hasVouches,
      vouchLink,
    } = userData;

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const query = `
      INSERT INTO users (username, email, password, role, account_types, selling_experience, has_vouches, vouch_link)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id, username, email, role
    `;

    const values = [
      username,
      email.toLowerCase(),
      hashedPassword,
      role,
      accountTypes || [],
      sellingExperience || null,
      hasVouches || false,
      vouchLink || null,
    ];

    try {
      const { rows } = await pool.query(query, values);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async findByEmail(email) {
    const query = "SELECT * FROM users WHERE email = $1";
    const { rows } = await pool.query(query, [email.toLowerCase()]);
    return rows[0];
  }

  static async findByUsername(username) {
    const query = "SELECT * FROM users WHERE username = $1";
    const { rows } = await pool.query(query, [username]);
    return rows[0];
  }

  static async comparePassword(candidatePassword, hashedPassword) {
    return await bcrypt.compare(candidatePassword, hashedPassword);
  }
}

module.exports = User;
