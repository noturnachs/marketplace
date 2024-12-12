import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import DashboardNavbar from "../components/DashboardNavbar";
import UserWallet from "./wallet/UserWallet";

function ProfilePage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditing, setIsEditing] = useState(false);

  // Get user data from localStorage
  const userData = JSON.parse(localStorage.getItem("userData")) || {
    username: "User",
    email: "user@example.com",
    role: "buyer",
    joinDate: "March 2024",
  };

  // Mock data
  const purchaseHistory = [
    {
      id: "ORD001",
      product: "Netflix Premium",
      price: "₱199",
      date: "2024-03-15",
      status: "active",
      expiresIn: "25 days",
      seller: "PremiumSeller",
      warranty: "30 days",
    },
    {
      id: "ORD002",
      product: "Spotify Premium",
      price: "₱90",
      date: "2024-02-28",
      status: "expired",
      expiresIn: "0 days",
      seller: "MusicDeals",
      warranty: "15 days",
    },
  ];

  const savedAccounts = [
    {
      type: "Netflix",
      email: "user@netflix.com",
      lastUsed: "2024-03-20",
    },
    {
      type: "Spotify",
      email: "user@spotify.com",
      lastUsed: "2024-03-15",
    },
  ];

  const notifications = [
    {
      id: 1,
      message: "Your Netflix subscription expires in 5 days",
      date: "2024-03-20",
      type: "warning",
    },
    {
      id: 2,
      message: "Successfully purchased Spotify Premium",
      date: "2024-03-15",
      type: "success",
    },
  ];

  // Update tabs array to include Wallet
  const tabs = [
    "Overview",
    "Purchases",
    "Accounts",
    "Wallet",
    "Notifications",
    "Settings",
  ];

  const handleCashIn = (option) => {
    // In a real app, this would open a payment gateway
    alert(`Processing payment of ${option.price} for ${option.coins} coins`);
    const currentWallet = JSON.parse(localStorage.getItem("userWallet")) || {
      coins: 0,
    };
    const newBalance = currentWallet.coins + option.coins;
    localStorage.setItem("userWallet", JSON.stringify({ coins: newBalance }));
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-primary">
      <DashboardNavbar />

      {/* Profile Content */}
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
                  Member since {userData.joinDate}
                </p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-accent">
                    {purchaseHistory.length}
                  </p>
                  <p className="text-xs text-textSecondary">Total Orders</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-accent">
                    {
                      purchaseHistory.filter((p) => p.status === "active")
                        .length
                    }
                  </p>
                  <p className="text-xs text-textSecondary">Active Subs</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-accent">
                    {savedAccounts.length}
                  </p>
                  <p className="text-xs text-textSecondary">Saved Accounts</p>
                </div>
              </div>
            </div>
          </div>

          {/* Updated Profile Tabs */}
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

          {/* Tab Content */}
          <div className="bg-secondary/50 backdrop-blur-lg rounded-xl p-6">
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-textPrimary mb-4">
                    Quick Stats
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-secondary/30 rounded-lg p-4">
                      <h3 className="text-sm font-medium text-textPrimary mb-2">
                        Active Subscriptions
                      </h3>
                      {purchaseHistory
                        .filter((p) => p.status === "active")
                        .map((purchase) => (
                          <div
                            key={purchase.id}
                            className="flex justify-between items-center mb-2"
                          >
                            <span className="text-sm text-textSecondary">
                              {purchase.product}
                            </span>
                            <span className="text-xs text-accent">
                              Expires in {purchase.expiresIn}
                            </span>
                          </div>
                        ))}
                    </div>
                    <div className="bg-secondary/30 rounded-lg p-4">
                      <h3 className="text-sm font-medium text-textPrimary mb-2">
                        Recent Activity
                      </h3>
                      {notifications.slice(0, 3).map((notif) => (
                        <div
                          key={notif.id}
                          className="flex justify-between items-center mb-2"
                        >
                          <span className="text-sm text-textSecondary">
                            {notif.message}
                          </span>
                          <span className="text-xs text-accent">
                            {notif.date}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Purchases Tab */}
            {activeTab === "purchases" && (
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-semibold text-textPrimary">
                    Purchase History
                  </h2>
                  <select className="bg-secondary/30 text-textPrimary text-sm rounded-lg px-3 py-1.5 border border-secondary">
                    <option>All Time</option>
                    <option>Last 30 Days</option>
                    <option>Last 3 Months</option>
                  </select>
                </div>
                {purchaseHistory.map((purchase) => (
                  <div
                    key={purchase.id}
                    className="bg-secondary/30 rounded-lg p-4 space-y-2"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-sm font-medium text-textPrimary">
                          {purchase.product}
                        </h3>
                        <p className="text-xs text-textSecondary">
                          Order ID: {purchase.id}
                        </p>
                      </div>
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          purchase.status === "active"
                            ? "bg-green-500/10 text-green-500"
                            : "bg-red-500/10 text-red-500"
                        }`}
                      >
                        {purchase.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-xs">
                      <div>
                        <p className="text-textSecondary">Purchase Date</p>
                        <p className="text-textPrimary">{purchase.date}</p>
                      </div>
                      <div>
                        <p className="text-textSecondary">Seller</p>
                        <p className="text-textPrimary">{purchase.seller}</p>
                      </div>
                      <div>
                        <p className="text-textSecondary">Warranty</p>
                        <p className="text-textPrimary">{purchase.warranty}</p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-sm font-medium text-accent">
                        {purchase.price}
                      </span>
                      <button className="text-xs text-textSecondary hover:text-textPrimary transition-colors">
                        View Details →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Saved Accounts Tab */}
            {activeTab === "accounts" && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-textPrimary mb-4">
                  Saved Accounts
                </h2>
                {savedAccounts.map((account, index) => (
                  <div
                    key={index}
                    className="bg-secondary/30 rounded-lg p-4 flex justify-between items-center"
                  >
                    <div>
                      <h3 className="text-sm font-medium text-textPrimary">
                        {account.type}
                      </h3>
                      <p className="text-xs text-textSecondary">
                        {account.email}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-textSecondary">
                        Last used: {account.lastUsed}
                      </p>
                      <button className="text-xs text-accent hover:text-accent/80 transition-colors mt-1">
                        Manage Account
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* New Wallet Tab */}
            {activeTab === "wallet" && (
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <h1 className="text-xl font-semibold text-textPrimary">
                    Wallet & Payments
                  </h1>
                </div>

                <UserWallet />

                <div className="space-y-3 mt-6">
                  <h3 className="text-sm font-medium text-textPrimary mb-2">
                    Available Payment Methods
                  </h3>
                  <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-5 text-textSecondary"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"
                        />
                      </svg>
                      <span className="text-sm text-textPrimary">GCash</span>
                    </div>
                    <span className="text-xs text-green-500">Available</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-5 text-textSecondary"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span className="text-sm text-textPrimary">Maya</span>
                    </div>
                    <span className="text-xs text-green-500">Available</span>
                  </div>

                  <p className="text-xs text-textSecondary text-center mt-6">
                    More payment methods coming soon
                  </p>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === "notifications" && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-textPrimary mb-4">
                  Recent Notifications
                </h2>
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`bg-secondary/30 rounded-lg p-4 border-l-2 ${
                      notif.type === "warning"
                        ? "border-yellow-500"
                        : "border-green-500"
                    }`}
                  >
                    <p className="text-sm text-textPrimary">{notif.message}</p>
                    <p className="text-xs text-textSecondary mt-1">
                      {notif.date}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === "settings" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-textPrimary mb-4">
                    Account Settings
                  </h2>
                  <div className="space-y-4">
                    <button
                      onClick={() => navigate("/wallet")}
                      className="w-full p-4 bg-secondary/30 rounded-lg text-left hover:bg-secondary/40 transition-colors"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm font-medium text-textPrimary">
                            Wallet & Payments
                          </p>
                          <p className="text-xs text-textSecondary">
                            Manage your balance and payment methods
                          </p>
                        </div>
                        <span className="text-sm font-medium text-accent">
                          ₱
                          {JSON.parse(localStorage.getItem("userWallet"))
                            ?.coins || 0}
                        </span>
                      </div>
                    </button>
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
                    <button className="w-full p-4 bg-secondary/30 rounded-lg text-left hover:bg-secondary/40 transition-colors">
                      <p className="text-sm font-medium text-textPrimary">
                        Notifications
                      </p>
                      <p className="text-xs text-textSecondary">
                        Manage your notification preferences
                      </p>
                    </button>
                    <button className="w-full p-4 bg-secondary/30 rounded-lg text-left hover:bg-secondary/40 transition-colors">
                      <p className="text-sm font-medium text-textPrimary">
                        Payment Methods
                      </p>
                      <p className="text-xs text-textSecondary">
                        Manage your payment options
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
          </div>
        </motion.div>
      </main>
    </div>
  );
}

export default ProfilePage;
