import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authService";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        await authService.checkAuth();
        setIsAuthenticated(true);
      } catch {
        setIsAuthenticated(false);
      }
    };

    checkAuthStatus();
  }, []);

  const handleLogin = () => {
    navigate("/login");
    setIsMenuOpen(false);
  };

  const handleSignup = () => {
    navigate("/signup");
    setIsMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      setIsAuthenticated(false);
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className="bg-secondary/50 backdrop-blur-lg sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div
            className="text-lg font-bold text-accent tracking-tight cursor-pointer"
            onClick={() => navigate("/")}
          >
            PremiumHaven
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex gap-4">
            {isAuthenticated ? (
              <>
                <button
                  onClick={() => navigate("/dashboard")}
                  className="text-sm text-textSecondary hover:text-textPrimary transition-colors"
                >
                  Marketplace
                </button>
                <button
                  onClick={handleLogout}
                  className="text-sm text-textSecondary hover:text-textPrimary transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleLogin}
                  className="text-sm text-textSecondary hover:text-textPrimary transition-colors"
                >
                  Login
                </button>
                <button
                  onClick={handleSignup}
                  className="bg-accent/90 text-white px-4 py-1.5 rounded-lg hover:bg-accent transition-colors text-sm font-medium"
                >
                  Sign Up
                </button>
              </>
            )}
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
                {isAuthenticated ? (
                  <>
                    <button
                      onClick={() => navigate("/marketplace")}
                      className="text-sm text-textSecondary hover:text-textPrimary transition-colors py-1.5"
                    >
                      Marketplace
                    </button>
                    <button
                      onClick={handleLogout}
                      className="text-sm text-textSecondary hover:text-textPrimary transition-colors py-1.5"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleLogin}
                      className="text-sm text-textSecondary hover:text-textPrimary transition-colors py-1.5"
                    >
                      Login
                    </button>
                    <button
                      onClick={handleSignup}
                      className="bg-accent/90 text-white px-4 py-1.5 rounded-lg hover:bg-accent transition-colors text-sm font-medium"
                    >
                      Sign Up
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}

export default Navbar;
