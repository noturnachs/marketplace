import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import DashboardNavbar from "../components/DashboardNavbar";
import UserWallet from "./wallet/UserWallet";

function ProfilePage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditing, setIsEditing] = useState(false);
  const [purchaseHistory, setPurchaseHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Get user data from localStorage
  const userData = JSON.parse(localStorage.getItem("userData")) || {};

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
              {purchaseHistory.length === 0 ? (
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
                          {purchase.product}
                        </h3>
                        <p className="text-xs text-textSecondary">
                          {new Date(purchase.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          purchase.status === "active"
                            ? "bg-green-500/10 text-green-500"
                            : "bg-red-500/10 text-red-500"
                        }`}
                      >
                        {purchase.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-xs text-textSecondary">
                      <div>
                        <p>Price: ₱{purchase.price}</p>
                        <p>Seller: {purchase.seller}</p>
                      </div>
                      <div>
                        <p>Expires in: {purchase.expires_in}</p>
                        <p>Warranty: {purchase.warranty}</p>
                      </div>
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
