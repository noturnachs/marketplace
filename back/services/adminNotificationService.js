const TelegramBot = require("node-telegram-bot-api");
const pool = require("../config/db");

class AdminNotificationService {
  constructor() {
    this.bot = new TelegramBot(process.env.TELEGRAM_ADMIN_BOT_TOKEN, {
      polling: false, // We only need to send messages, not receive them
    });
    this.adminGroupId = process.env.TELEGRAM_ADMIN_GROUP_ID;
  }

  async notifyNewCashIn(payment) {
    try {
      // Fetch username using user_id
      const userQuery = "SELECT username FROM users WHERE id = $1";
      const { rows } = await pool.query(userQuery, [payment.user_id]);
      const username = rows[0]?.username;

      const message = `
🔔 *New Cash-In Request*


To be Added: ${payment.coins}
User: ${username}
Method: ${payment.payment_method}
Reference: \`${payment.reference_id}\`

[View Admin Dashboard](${process.env.FRONTEND_URL}/admin)
      `;

      await this.bot.sendMessage(this.adminGroupId, message, {
        parse_mode: "Markdown",
        disable_web_page_preview: true,
      });
    } catch (error) {
      console.error("Error sending admin notification:", error);
    }
  }

  async notifyNewSeller(seller) {
    const message = `
👤 *New Seller Application*

Username: ${seller.username}
Account Types: ${seller.account_types.join(", ")}
Experience: ${seller.selling_experience}
Has Vouches: ${seller.has_vouches ? "Yes" : "No"}
${seller.vouch_link ? `Vouch Link: ${seller.vouch_link}` : ""}

[View Admin Dashboard](${process.env.FRONTEND_URL}/admin)
    `;

    try {
      await this.bot.sendMessage(this.adminGroupId, message, {
        parse_mode: "Markdown",
        disable_web_page_preview: true,
      });
    } catch (error) {
      console.error("Error sending admin notification:", error);
    }
  }
}

module.exports = new AdminNotificationService();
