const TelegramBot = require("node-telegram-bot-api");
const crypto = require("crypto");
const pool = require("../config/db");

class TelegramBotService {
  constructor() {
    this.bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, {
      polling: true,
    });
    this.setupListeners();
    this.createVerificationTable();
  }

  async createVerificationTable() {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS telegram_verifications (
        code VARCHAR(10) PRIMARY KEY,
        telegram_username VARCHAR(255) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
        verified BOOLEAN DEFAULT FALSE
      );
    `;

    try {
      await pool.query(createTableQuery);
      console.log("Telegram verifications table created successfully");

      // Create a function to automatically delete expired codes
      await pool.query(`
        CREATE OR REPLACE FUNCTION delete_expired_verifications()
        RETURNS trigger AS $$
        BEGIN
          DELETE FROM telegram_verifications WHERE expires_at < NOW();
          RETURN NULL;
        END;
        $$ LANGUAGE plpgsql;
        
        DROP TRIGGER IF EXISTS trigger_delete_expired_verifications ON telegram_verifications;
        
        CREATE TRIGGER trigger_delete_expired_verifications
        AFTER INSERT ON telegram_verifications
        EXECUTE FUNCTION delete_expired_verifications();
      `);
    } catch (error) {
      console.error("Error creating telegram verifications table:", error);
    }
  }

  async generateVerificationCode(telegramUsername) {
    const code = crypto.randomBytes(3).toString("hex");
    const expiresAt = new Date(Date.now() + 600000); // 10 minutes from now

    await pool.query(
      `INSERT INTO telegram_verifications (code, telegram_username, expires_at)
       VALUES ($1, $2, $3)`,
      [code, telegramUsername, expiresAt]
    );

    return code;
  }

  async verifyCode(code, username) {
    const result = await pool.query(
      `UPDATE telegram_verifications 
       SET verified = TRUE 
       WHERE code = $1 
       AND telegram_username = $2 
       AND expires_at > NOW()
       AND verified = FALSE
       RETURNING *`,
      [code, username]
    );

    return { success: result.rowCount > 0 };
  }

  async checkVerificationStatus(code) {
    const result = await pool.query(
      `SELECT verified 
       FROM telegram_verifications 
       WHERE code = $1 
       AND expires_at > NOW()`,
      [code]
    );

    return result.rows[0]?.verified || false;
  }

  setupListeners() {
    this.bot.onText(/\/start/, (msg) => {
      const chatId = msg.chat.id;
      this.bot.sendMessage(
        chatId,
        "Welcome to PremiumHaven Verification Bot! Use /verify <code> to verify your account."
      );
    });

    this.bot.onText(/\/verify (.+)/, async (msg, match) => {
      const chatId = msg.chat.id;
      const code = match[1];
      const username = msg.from.username;

      const verification = await this.verifyCode(code, username);
      if (verification.success) {
        this.bot.sendMessage(
          chatId,
          "✅ Verification successful! You can now close this chat."
        );
      } else {
        this.bot.sendMessage(
          chatId,
          "❌ Invalid or expired verification code."
        );
      }
    });
  }
}

module.exports = new TelegramBotService();
