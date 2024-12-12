import { useState } from "react";
import { motion } from "framer-motion";
import DashboardNavbar from "../components/DashboardNavbar";
import SellerDashboard from "./seller/SellerDashboard";
import Marketplace from "./marketplace/Marketplace";

function DashboardPage() {
  const userData = JSON.parse(localStorage.getItem("userData")) || {};
  const [activeView, setActiveView] = useState("marketplace");

  return (
    <div className="min-h-screen bg-primary">
      <DashboardNavbar />

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* View Toggle */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveView("marketplace")}
            className={`text-sm font-medium px-4 py-2 rounded-lg transition-colors ${
              activeView === "marketplace"
                ? "bg-accent text-white"
                : "bg-secondary/50 text-textSecondary hover:text-textPrimary"
            }`}
          >
            Marketplace
          </button>
          {userData.role === "seller" && (
            <button
              onClick={() => setActiveView("seller")}
              className={`text-sm font-medium px-4 py-2 rounded-lg transition-colors ${
                activeView === "seller"
                  ? "bg-accent text-white"
                  : "bg-secondary/50 text-textSecondary hover:text-textPrimary"
              }`}
            >
              Seller Dashboard
            </button>
          )}
        </div>

        {activeView === "seller" ? <SellerDashboard /> : <Marketplace />}
      </main>
    </div>
  );
}

export default DashboardPage;
