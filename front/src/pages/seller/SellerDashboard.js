import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import DashboardTab from "./components/DashboardTab";
import SalesTab from "./components/SalesTab";
import ListingsTab from "./components/ListingsTab";

function SellerDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const userData = JSON.parse(localStorage.getItem("userData")) || {};
  const sellerStatus = userData.seller_status || "pending";

  const renderStatusMessage = () => {
    switch (sellerStatus) {
      case "pending":
        return (
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mb-6">
            <h3 className="text-yellow-500 font-medium mb-1">
              Verification Pending
            </h3>
            <p className="text-sm text-yellow-500/80">
              Your seller account is currently under review. This process
              usually takes 24-48 hours.
            </p>
          </div>
        );
      case "rejected":
        return (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
            <h3 className="text-red-500 font-medium mb-1">
              Verification Rejected
            </h3>
            <p className="text-sm text-red-500/80">
              Unfortunately, your seller verification was not approved.
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {renderStatusMessage()}

      {sellerStatus === "verified" && (
        <>
          <div className="bg-secondary/30 rounded-lg p-1">
            <nav className="flex gap-1">
              <button
                onClick={() => setActiveTab("dashboard")}
                className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === "dashboard"
                    ? "bg-accent text-white"
                    : "text-textSecondary hover:text-textPrimary"
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab("sales")}
                className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === "sales"
                    ? "bg-accent text-white"
                    : "text-textSecondary hover:text-textPrimary"
                }`}
              >
                Sales
              </button>
              <button
                onClick={() => setActiveTab("listings")}
                className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === "listings"
                    ? "bg-accent text-white"
                    : "text-textSecondary hover:text-textPrimary"
                }`}
              >
                Listings
              </button>
            </nav>
          </div>

          {activeTab === "dashboard" && <DashboardTab />}
          {activeTab === "sales" && <SalesTab />}
          {activeTab === "listings" && <ListingsTab />}
        </>
      )}
    </motion.div>
  );
}

export default SellerDashboard;
