import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { authService } from "../services/authService";
import { paymentService } from "../services/paymentService";
import { Link } from "react-router-dom";

function DashboardNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [balance, setBalance] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const userData = JSON.parse(localStorage.getItem("userData")) || {};

  const isAdmin = userData.role === "admin";
  const isBuyer = userData.role === "buyer";

  useEffect(() => {
    if (isBuyer) {
      fetchBalance();
    }
  }, [isBuyer]);

  const fetchBalance = async () => {
    try {
      const payments = await paymentService.getMyPayments();
      const totalCoins = payments
        .filter((p) => p.status === "approved")
        .reduce((sum, p) => sum + p.coins, 0);
      setBalance(totalCoins);
    } catch (error) {
      console.error("Error fetching balance:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const isProfilePage = location.pathname === "/profile";

  return (
    <nav className="bg-secondary/50 backdrop-blur-lg sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div
            className="text-lg font-bold text-accent tracking-tight cursor-pointer"
            onClick={() => navigate("/dashboard")}
          >
            PremiumHaven
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {isBuyer && (
              <div className="flex items-center gap-2 bg-secondary/30 px-3 py-1.5 rounded-lg">
                <span className="text-sm font-medium text-accent">
                  ₱{balance}
                </span>
                <button
                  onClick={() => navigate("/wallet")}
                  className="w-6 h-6 flex items-center justify-center bg-accent hover:bg-accent/80 text-white rounded-full transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4.5v15m7.5-7.5h-15"
                    />
                  </svg>
                </button>
              </div>
            )}
            <button
              onClick={() =>
                navigate(isProfilePage ? "/dashboard" : "/profile")
              }
              className="text-sm text-textSecondary hover:text-textPrimary transition-colors"
            >
              {isProfilePage ? "Marketplace" : "My Profile"}
            </button>
            {isAdmin ? (
              <Link
                to="/admin"
                className="text-sm font-medium text-textSecondary hover:text-textPrimary transition-colors"
              >
                Admin
              </Link>
            ) : userData.role === "seller" ? (
              <Link
                to="/seller"
                className="text-sm font-medium text-textSecondary hover:text-textPrimary transition-colors"
              >
                Seller Dashboard
              </Link>
            ) : null}
            <button
              onClick={handleLogout}
              className="text-sm text-textSecondary hover:text-textPrimary transition-colors"
            >
              Logout
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-textSecondary hover:text-textPrimary p-1.5"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden"
            >
              <div className="flex flex-col gap-3 pt-3 pb-2">
                {isBuyer && (
                  <div className="flex items-center justify-between py-1.5 px-3 bg-secondary/30 rounded-lg">
                    <span className="text-sm font-medium text-accent">
                      ₱{balance}
                    </span>
                    <button
                      onClick={() => {
                        navigate("/wallet");
                        setIsMenuOpen(false);
                      }}
                      className="w-6 h-6 flex items-center justify-center bg-accent hover:bg-accent/80 text-white rounded-full transition-colors"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="w-4 h-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 4.5v15m7.5-7.5h-15"
                        />
                      </svg>
                    </button>
                  </div>
                )}
                <button
                  onClick={() => {
                    navigate(isProfilePage ? "/dashboard" : "/profile");
                    setIsMenuOpen(false);
                  }}
                  className="text-sm text-textSecondary hover:text-textPrimary transition-colors py-1.5"
                >
                  {isProfilePage ? "Marketplace" : "My Profile"}
                </button>
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setIsMenuOpen(false)}
                    className="text-sm font-medium text-textSecondary hover:text-textPrimary transition-colors"
                  >
                    Admin Dashboard
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="text-sm text-textSecondary hover:text-textPrimary transition-colors py-1.5"
                >
                  Logout
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}

export default DashboardNavbar;
