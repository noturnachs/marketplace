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
    // Convert username to lowercase when generating code
    const normalizedUsername = telegramUsername.toLowerCase();
    const code = crypto.randomBytes(3).toString("hex");
    const expiresAt = new Date(Date.now() + 600000); // 10 minutes from now

    await pool.query(
      `INSERT INTO telegram_verifications (code, telegram_username, expires_at)
       VALUES ($1, $2, $3)`,
      [code, normalizedUsername, expiresAt]
    );

    return code;
  }

  async verifyCode(code, username) {
    // Convert username to lowercase for case-insensitive comparison
    const normalizedUsername = username.toLowerCase();

    // First, clean up any expired codes for this username
    await pool.query(
      `DELETE FROM telegram_verifications 
       WHERE LOWER(telegram_username) = LOWER($1) 
       AND expires_at < NOW()`,
      [normalizedUsername]
    );

    // Then attempt verification with case-insensitive username comparison
    const result = await pool.query(
      `UPDATE telegram_verifications 
       SET verified = TRUE 
       WHERE code = $1 
       AND LOWER(telegram_username) = LOWER($2) 
       AND expires_at > NOW()
       AND verified = FALSE
       RETURNING *`,
      [code, normalizedUsername]
    );

    // Check if this code exists but was already verified (case-insensitive)
    if (result.rowCount === 0) {
      const existingCode = await pool.query(
        `SELECT verified 
         FROM telegram_verifications 
         WHERE code = $1 
         AND LOWER(telegram_username) = LOWER($2)`,
        [code, normalizedUsername]
      );

      if (existingCode.rows[0]?.verified) {
        return { success: false, message: "Code already used" };
      }
    }

    return {
      success: result.rowCount > 0,
      message: result.rowCount > 0 ? "Verification successful" : "Invalid code",
    };
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

  async notifySellerOfPurchase(purchase, listing, buyer) {
    try {
      // Get seller's telegram username from the database
      const { rows } = await pool.query(
        "SELECT telegram_username FROM users WHERE id = $1",
        [listing.seller_id]
      );

      const sellerTelegram = rows[0]?.telegram_username;
      if (!sellerTelegram) {
        console.error("No telegram username found for seller");
        return;
      }

      // Format the message
      const message = `
🛍️ New Purchase Alert!

Product: ${listing.title}
Price: ₱${purchase.amount}
Buyer: ${buyer.username}

⚡ Please log in to your account to process this order:
${process.env.FRONTEND_URL}/dashboard?tab=seller

⏰ Note: Order will auto-cancel in 1 hour if not processed.
      `;

      // Find chat ID for the seller (if they've interacted with the bot)
      const chatId = await this.findChatIdByUsername(sellerTelegram);
      if (chatId) {
        await this.bot.sendMessage(chatId, message, { parse_mode: "HTML" });
      }
    } catch (error) {
      console.error("Error sending Telegram notification:", error);
    }
  }

  async findChatIdByUsername(username) {
    try {
      const result = await pool.query(
        "SELECT chat_id FROM telegram_chats WHERE username = $1",
        [username]
      );
      return result.rows[0]?.chat_id;
    } catch (error) {
      console.error("Error finding chat ID:", error);
      return null;
    }
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
          verification.message === "Code already used"
            ? "❌ This code has already been used."
            : "❌ Invalid or expired verification code."
        );
      }
    });

    // Store chat IDs when users interact with the bot
    this.bot.on("message", async (msg) => {
      if (msg.from.username) {
        try {
          await pool.query(
            `INSERT INTO telegram_chats (username, chat_id) 
             VALUES ($1, $2) 
             ON CONFLICT (username) 
             DO UPDATE SET chat_id = EXCLUDED.chat_id`,
            [msg.from.username, msg.chat.id]
          );
        } catch (error) {
          console.error("Error storing chat ID:", error);
        }
      }
    });
  }

  async notifyBuyerOfAccount(purchase, listing, buyer) {
    try {
      // Get buyer's telegram username
      const { rows } = await pool.query(
        "SELECT telegram_username FROM users WHERE id = $1",
        [buyer.id]
      );

      const buyerTelegram = rows[0]?.telegram_username;
      if (!buyerTelegram) {
        console.error("No telegram username found for buyer");
        return;
      }

      // Format the message
      const message = `
🎉 Account Details Received!

Product: ${listing.title}
Seller: ${listing.seller_name}
Price Paid: ₱${purchase.amount}

Your account details are ready! Please log in to view them:
${process.env.FRONTEND_URL}/profile

⚠️ Important: Please confirm receipt within 24 hours.
      `;

      // Find chat ID for the buyer
      const chatId = await this.findChatIdByUsername(buyerTelegram);
      if (chatId) {
        await this.bot.sendMessage(chatId, message, { parse_mode: "HTML" });
      }
    } catch (error) {
      console.error("Error sending buyer notification:", error);
    }
  }

  async notifySellerOfVerification(sellerId, status) {
    try {
      // Get seller's telegram username from the database
      const { rows } = await pool.query(
        "SELECT telegram_username, username FROM users WHERE id = $1",
        [sellerId]
      );

      const seller = rows[0];
      if (!seller?.telegram_username) {
        console.error("No telegram username found for seller");
        return;
      }

      // Format the message based on status
      const message =
        status === "verified"
          ? `
🎉 Congratulations ${seller.username}!

Your seller account has been verified. You can now:
• Create listings
• Sell accounts
• Receive payments

Start selling now:
${process.env.FRONTEND_URL}/dashboard?tab=seller
        `
          : `
❌ Account Update

Dear ${seller.username},

Your seller account verification was not approved. This might be due to:
• Insufficient selling experience
• Missing or invalid vouches
• Incomplete information

Please contact support for more information.
        `;

      // Find chat ID for the seller
      const chatId = await this.findChatIdByUsername(seller.telegram_username);
      if (chatId) {
        await this.bot.sendMessage(chatId, message, { parse_mode: "HTML" });
      }
    } catch (error) {
      console.error("Error sending verification notification:", error);
    }
  }
}

module.exports = new TelegramBotService();
