import { useState, useEffect } from "react";
import { sellerService } from "../../../services/sellerService";
import { listingService } from "../../../services/listingService";
import { purchaseService } from "../../../services/purchaseService";

function DashboardTab() {
  const [balance, setBalance] = useState({
    gross_sales: "0.00",
    available_balance: "0.00",
    total_fees: "0.00",
  });
  const [isFeeExempt, setIsFeeExempt] = useState(false);
  const [activeListings, setActiveListings] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [error, setError] = useState(null);
  const userData = JSON.parse(localStorage.getItem("userData")) || {};

  useEffect(() => {
    fetchBalance();
    fetchFeeStatus();
    fetchListingsCount();
    fetchOrdersCount();
  }, []);

  const fetchBalance = async () => {
    try {
      const balanceData = await sellerService.getBalance();
      setBalance(balanceData);
    } catch (error) {
      setError(error.message);
    }
  };

  const fetchFeeStatus = async () => {
    try {
      const feeExempt = await sellerService.getFeeStatus();
      setIsFeeExempt(feeExempt);
    } catch (error) {
      console.error("Error fetching fee status:", error);
    }
  };

  const fetchListingsCount = async () => {
    try {
      const listings = await listingService.getMyListings();
      setActiveListings(listings.length);
    } catch (error) {
      console.error("Error fetching listings count:", error);
    }
  };

  const fetchOrdersCount = async () => {
    try {
      const salesData = await purchaseService.getMySales();
      setTotalOrders(salesData.sales.length);
    } catch (error) {
      console.error("Error fetching orders count:", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Available Balance */}
        <div className="bg-secondary/30 rounded-lg p-4">
          <p className="text-sm text-textSecondary">
            Available Balance (After Fees)
          </p>
          <p className="text-2xl font-bold text-green-500">
            ₱{parseFloat(balance.available_balance).toFixed(2)}
          </p>
          <p className="text-xs text-textSecondary mt-1">
            {isFeeExempt ? "No fees deducted" : "Standard 5% fee applies"}
          </p>
        </div>

        {/* Gross Sales */}
        <div className="bg-secondary/30 rounded-lg p-4">
          <p className="text-sm text-textSecondary">Gross Sales</p>
          <p className="text-2xl font-bold text-accent">
            ₱{parseFloat(balance.gross_sales).toFixed(2)}
          </p>
          <p className="text-xs text-textSecondary mt-1">
            Total fees: ₱{parseFloat(balance.total_fees).toFixed(2)}
          </p>
        </div>

        {/* Active Listings */}
        <div className="bg-secondary/30 rounded-lg p-4">
          <p className="text-sm text-textSecondary">Active Listings</p>
          <p className="text-2xl font-bold text-textPrimary">
            {activeListings}
          </p>
          <p className="text-xs text-textSecondary mt-1">
            Total active listings
          </p>
        </div>

        {/* Total Orders */}
        <div className="bg-secondary/30 rounded-lg p-4">
          <p className="text-sm text-textSecondary">Total Orders</p>
          <p className="text-2xl font-bold text-textPrimary">{totalOrders}</p>
          <p className="text-xs text-textSecondary mt-1">
            All-time total orders
          </p>
        </div>
      </div>

      {/* Cashout Section */}
      <div className="bg-secondary/30 rounded-lg p-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold text-textPrimary">Cashout</h2>
            <p className="text-sm text-textSecondary mt-1">
              Convert your earnings to real money
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-textSecondary">Available Balance</p>
            <p className="text-2xl font-bold text-green-500">
              ₱{parseFloat(balance.available_balance).toFixed(2)}
            </p>
            <p className="text-xs text-textSecondary mt-1">
              {isFeeExempt ? "No fees deducted" : "Standard 5% fee applies"}
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <div className="bg-secondary/50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-textPrimary mb-2">
              How to Cashout
            </h3>
            <div className="space-y-2">
              <p className="text-sm text-textSecondary">
                Contact our admin through:
              </p>
              <div className="flex flex-col gap-2">
                <a
                  href="https://t.me/Gxngzxxr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-accent hover:text-accent/80 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18.716-3.818 15.515-3.818 15.515-.121.487-.477.645-.773.645-.418 0-.706-.268-.944-.511l-4.033-3.458-1.591 1.434c-.122.098-.244.146-.366.146-.245 0-.489-.171-.489-.416v-4.584l7.142-6.689c.198-.183.198-.549-.122-.549-.074 0-.171.024-.269.098l-8.733 5.555-3.624-1.263c-.489-.171-.538-.549-.05-.818l14.909-5.825c.416-.171.806.122.806.549 0 .073-.025.171-.049.171z" />
                  </svg>
                  <span className="text-sm">@Gxngzxxr</span>
                </a>
                <a
                  href="https://t.me/ppprtts"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-accent hover:text-accent/80 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18.716-3.818 15.515-3.818 15.515-.121.487-.477.645-.773.645-.418 0-.706-.268-.944-.511l-4.033-3.458-1.591 1.434c-.122.098-.244.146-.366.146-.245 0-.489-.171-.489-.416v-4.584l7.142-6.689c.198-.183.198-.549-.122-.549-.074 0-.171.024-.269.098l-8.733 5.555-3.624-1.263c-.489-.171-.538-.549-.05-.818l14.909-5.825c.416-.171.806.122.806.549 0 .073-.025.171-.049.171z" />
                  </svg>
                  <span className="text-sm">@ppprtts</span>
                </a>
              </div>
            </div>
          </div>

          <div className="bg-secondary/50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-textPrimary mb-2">
              Important Notes
            </h3>
            <ul className="list-disc list-inside space-y-1">
              <li className="text-sm text-textSecondary">
                Processing time: 24-48 hours
              </li>
              <li className="text-sm text-textSecondary">
                Have your payment details ready
              </li>
              <li className="text-sm text-textSecondary">
                Minimum withdrawal amount: ₱100
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Telegram Notifications Section */}
      <div className="bg-secondary/30 rounded-lg p-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold text-textPrimary">
              Telegram Notifications
            </h2>
            <p className="text-sm text-textSecondary mt-1">
              Get instant notifications for new orders via Telegram
            </p>
          </div>
          {userData.telegram_username && (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-green-500">Connected</span>
            </div>
          )}
        </div>

        <div className="mt-6 space-y-4">
          {userData.telegram_username && (
            <div className="bg-secondary/50 rounded-lg p-4">
              <p className="text-sm text-textSecondary mb-2">
                Connected Account
              </p>
              <p className="text-textPrimary font-medium">
                @{userData.telegram_username}
              </p>
            </div>
          )}

          <div className="bg-secondary/50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-textPrimary mb-2">
              Connect with our Bot
            </h3>
            <div className="space-y-2">
              <p className="text-sm text-textSecondary">
                1. Open Telegram and search for @premiumhaven_bot
              </p>
              <p className="text-sm text-textSecondary">
                2. Start a chat with the bot by clicking "Start" or sending any
                message
              </p>
              <p className="text-sm text-textSecondary">
                3. You'll receive instant notifications for new orders
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardTab;
