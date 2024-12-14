import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import DashboardNavbar from "../components/DashboardNavbar";
import SellerDashboard from "./seller/SellerDashboard";
import Marketplace from "./marketplace/Marketplace";

function DashboardPage() {
  const userData = JSON.parse(localStorage.getItem("userData")) || {};
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Get the tab from URL or default to "marketplace"
  const [activeView, setActiveView] = useState(
    searchParams.get("tab") || "marketplace"
  );

  // Update URL when tab changes
  const handleViewChange = (view) => {
    setActiveView(view);
    setSearchParams({ tab: view });
  };

  // Set initial tab from URL on component mount
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab) {
      setActiveView(tab);
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-primary">
      <DashboardNavbar />

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* View Toggle */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => handleViewChange("marketplace")}
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
              onClick={() => handleViewChange("seller")}
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
