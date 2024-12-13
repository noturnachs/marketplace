import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import DashboardNavbar from "../components/DashboardNavbar";
import UserWallet from "./wallet/UserWallet";
import { purchaseService } from "../services/purchaseService";

function ProfilePage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditing, setIsEditing] = useState(false);
  const [purchaseHistory, setPurchaseHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [countdowns, setCountdowns] = useState({});

  const userData = JSON.parse(localStorage.getItem("userData")) || {};

  useEffect(() => {
    fetchPurchaseHistory();
  }, []);

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const phTime = new Date(date.getTime() + 8 * 60 * 60 * 1000);
    const now = new Date(Date.now() + 8 * 60 * 60 * 1000);
    const seconds = Math.floor((now - phTime) / 1000);
    const minutes = Math.floor(seconds / 60);

    if (minutes < 1) {
      return "just now";
    } else if (minutes === 1) {
      return "1 minute ago";
    } else if (minutes < 60) {
      return `${minutes} minutes ago`;
    } else {
      return (
        phTime.toLocaleString("en-US", {
          hour: "numeric",
          minute: "numeric",
          hour12: true,
          timeZone: "Asia/Manila",
        }) + " PHT"
      );
    }
  };

  const formatPhTime = (dateString) => {
    const date = new Date(dateString);
    const phDate = new Date(date.getTime() + 8 * 60 * 60 * 1000);

    return (
      phDate.toLocaleString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      }) + " PHT"
    );
  };

  const fetchPurchaseHistory = async () => {
    try {
      const purchases = await purchaseService.getMyPurchases();
      setPurchaseHistory(purchases);
    } catch (error) {
      console.error("Error fetching purchases:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Format join date
  const formatJoinDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  const tabs = ["Overview", "Purchases", "Wallet", "Settings"];

  // Empty state components
  const EmptyOverview = () => (
    <div className="text-center py-8">
      <div className="bg-secondary/30 rounded-lg p-8">
        <h3 className="text-lg font-medium text-textPrimary mb-2">
          Welcome to PremiumHaven!
        </h3>
        <p className="text-sm text-textSecondary">
          Start exploring our marketplace to find premium subscriptions at great
          prices.
        </p>
        <button
          onClick={() => navigate("/dashboard")}
          className="mt-4 px-4 py-2 bg-accent text-white rounded-lg text-sm hover:bg-accent/90 transition-colors"
        >
          Browse Marketplace
        </button>
      </div>
    </div>
  );

  const EmptyPurchases = () => (
    <div className="text-center py-8">
      <div className="bg-secondary/30 rounded-lg p-8">
        <h3 className="text-lg font-medium text-textPrimary mb-2">
          No Purchases Yet
        </h3>
        <p className="text-sm text-textSecondary">
          You haven't made any purchases yet. Check out our marketplace to get
          started!
        </p>
        <button
          onClick={() => navigate("/dashboard")}
          className="mt-4 px-4 py-2 bg-accent text-white rounded-lg text-sm hover:bg-accent/90 transition-colors"
        >
          Explore Products
        </button>
      </div>
    </div>
  );

  const handleConfirmPurchase = async (purchaseId) => {
    try {
      setIsLoading(true);
      await purchaseService.confirmPurchase(purchaseId);
      fetchPurchaseHistory(); // Refresh the purchases list
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary">
      <DashboardNavbar />

      <main className="max-w-4xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Profile Header with Stats */}
          <div className="bg-secondary/50 backdrop-blur-lg rounded-xl p-6 mb-6">
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
              <div>
                <h1 className="text-xl font-bold text-textPrimary mb-2">
                  {userData.username}
                </h1>
                <p className="text-sm text-textSecondary">
                  Member since {formatJoinDate(userData.created_at)}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-accent">
                    {purchaseHistory.length}
                  </p>
                  <p className="text-xs text-textSecondary">Total Purchases</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-accent">
                    ₱
                    {purchaseHistory
                      .reduce((sum, p) => sum + parseFloat(p.amount), 0)
                      .toFixed(2)}
                  </p>
                  <p className="text-xs text-textSecondary">Total Spent</p>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Tabs */}
          <div className="flex gap-4 mb-6 overflow-x-auto pb-2">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab.toLowerCase())}
                className={`text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab.toLowerCase()
                    ? "text-accent"
                    : "text-textSecondary hover:text-textPrimary"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {purchaseHistory.length === 0 ? (
                <EmptyOverview />
              ) : (
                <div className="bg-secondary/30 rounded-lg p-6">
                  <h2 className="text-lg font-semibold text-textPrimary mb-4">
                    Account Overview
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-textSecondary">Email</p>
                      <p className="text-sm text-textPrimary">
                        {userData.email}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-textSecondary">Role</p>
                      <p className="text-sm text-textPrimary capitalize">
                        {userData.role}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Purchases Tab */}
          {activeTab === "purchases" && (
            <div className="space-y-4">
              {isLoading ? (
                <div className="text-center py-8">
                  <p className="text-textSecondary">Loading purchases...</p>
                </div>
              ) : purchaseHistory.length === 0 ? (
                <EmptyPurchases />
              ) : (
                purchaseHistory.map((purchase) => (
                  <div
                    key={purchase.id}
                    className="bg-secondary/30 rounded-lg p-4"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-sm font-medium text-textPrimary">
                          {purchase.listing_title}
                        </h3>
                        <p className="text-xs text-textSecondary">
                          Sold by {purchase.seller_name} •{" "}
                          {new Date(purchase.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <span className="text-accent font-medium">
                        ₱{parseFloat(purchase.amount).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      {purchase.status === "awaiting_seller" ? (
                        <>
                          <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                          <div className="flex-1">
                            <p className="text-sm text-yellow-500">
                              Waiting for {purchase.seller_name} to send the
                              account
                            </p>
                            <div className="bg-secondary/50 rounded-lg p-3 mt-2">
                              <p className="text-xs text-textSecondary">
                                ⏰ If seller fails to send the account within 1
                                hour, your funds will be automatically refunded.
                              </p>
                              {/* <p className="text-xs text-textSecondary mt-1">
                                Ordered at: {formatPhTime(purchase.created_at)}
                              </p> */}
                            </div>
                          </div>
                        </>
                      ) : purchase.status === "completed" ? (
                        <>
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <div className="text-sm">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="text-green-500 font-medium">
                                {purchase.is_confirmed
                                  ? "Account Confirmed"
                                  : "Account Received - Pending Confirmation"}
                              </p>
                            </div>
                            <p className="text-textPrimary bg-secondary/50 p-2 rounded-lg font-mono whitespace-pre-wrap">
                              {purchase.account_details}
                            </p>
                            {!purchase.is_confirmed ? (
                              <div className="mt-3 border-t border-white/10 pt-3">
                                <p className="text-sm text-yellow-500 mb-2">
                                  Please confirm if you received a valid account
                                </p>
                                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 mb-3">
                                  <p className="text-sm text-yellow-500">
                                    ⚠️ Important: Failure to confirm receipt
                                    within 24 hours will void the warranty and
                                    support for this purchase.
                                  </p>
                                </div>
                                <button
                                  onClick={() =>
                                    handleConfirmPurchase(purchase.id)
                                  }
                                  disabled={isLoading}
                                  className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  {isLoading
                                    ? "Confirming..."
                                    : "Confirm Account Receipt"}
                                </button>
                              </div>
                            ) : (
                              <div className="mt-3 border-t border-white/10 pt-3">
                                <p className="text-sm text-green-500">
                                  ✓ You already confirmed that you have received
                                  the product.
                                </p>
                              </div>
                            )}
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          <div>
                            <p className="text-sm text-red-500">
                              Order cancelled
                            </p>
                            <p className="text-xs text-green-500 mt-1">
                              ✓ Amount has already been refunded to your account
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                    <div className="text-xs text-textSecondary mt-2">
                      <p>Transaction ID: {purchase.id}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Wallet Tab */}
          {activeTab === "wallet" && <UserWallet />}

          {/* Settings Tab */}
          {activeTab === "settings" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-textPrimary mb-4">
                  Account Settings
                </h2>
                <div className="space-y-4">
                  <button className="w-full p-4 bg-secondary/30 rounded-lg text-left hover:bg-secondary/40 transition-colors">
                    <p className="text-sm font-medium text-textPrimary">
                      Profile Information
                    </p>
                    <p className="text-xs text-textSecondary">
                      Update your personal details
                    </p>
                  </button>
                  <button className="w-full p-4 bg-secondary/30 rounded-lg text-left hover:bg-secondary/40 transition-colors">
                    <p className="text-sm font-medium text-textPrimary">
                      Security
                    </p>
                    <p className="text-xs text-textSecondary">
                      Change password and security settings
                    </p>
                  </button>
                  <button className="w-full p-4 bg-red-500/10 rounded-lg text-left hover:bg-red-500/20 transition-colors">
                    <p className="text-sm font-medium text-red-500">
                      Delete Account
                    </p>
                    <p className="text-xs text-red-500/80">
                      Permanently delete your account
                    </p>
                  </button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}

export default ProfilePage;
