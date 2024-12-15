import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { authService } from "../services/authService";

function LoginPage() {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [showForgotMessage, setShowForgotMessage] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await authService.login(
        credentials.username,
        credentials.password
      );

      localStorage.setItem("userData", JSON.stringify(response.user));
      const userData = JSON.parse(localStorage.getItem("userData"));

      if (userData.role === "admin") {
        navigate("/admin");
      } else if (userData.role === "seller") {
        navigate("/dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      setError(error.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignupClick = (e) => {
    e.preventDefault();
    navigate("/signup");
  };

  const handleForgotClick = (e) => {
    e.preventDefault();
    setShowForgotMessage(true);
    setTimeout(() => setShowForgotMessage(false), 5000); // Show for 5 seconds
  };

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Login Card */}
        <div className="bg-secondary/50 backdrop-blur-lg rounded-xl p-6">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-xl font-bold text-textPrimary mb-1">
              Welcome Back
            </h1>
            <p className="text-sm text-textSecondary">
              Sign in to your account
            </p>
          </div>

          {/* Error Message - Moved to top */}
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg"
            >
              <p className="text-red-500 text-xs text-center">{error}</p>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Username Input */}
            <div>
              <label
                htmlFor="username"
                className="block text-xs font-medium text-textSecondary mb-1"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                value={credentials.username}
                onChange={(e) =>
                  setCredentials({ ...credentials, username: e.target.value })
                }
                className="w-full px-3 py-2 rounded-lg bg-secondary/50 border border-secondary focus:border-accent focus:outline-none text-textPrimary text-sm"
                placeholder="Enter your username"
              />
            </div>

            {/* Password Input */}
            <div>
              <label
                htmlFor="password"
                className="block text-xs font-medium text-textSecondary mb-1"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={credentials.password}
                onChange={(e) =>
                  setCredentials({ ...credentials, password: e.target.value })
                }
                className="w-full px-3 py-2 rounded-lg bg-secondary/50 border border-secondary focus:border-accent focus:outline-none text-textPrimary text-sm"
                placeholder="Enter your password"
              />
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full bg-accent text-white py-2.5 rounded-lg font-medium hover:bg-accent/90 transition-colors text-sm"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </motion.button>

            {/* Additional Links */}
            <div className="text-center text-xs">
              <button
                onClick={handleForgotClick}
                className="text-accent hover:text-accent/80 transition-colors"
              >
                Forgot password?
              </button>
              {showForgotMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-2 p-3 bg-secondary/30 rounded-lg space-y-2"
                >
                  <p className="text-textSecondary">
                    Please contact admin via Telegram for password reset
                  </p>
                  <a
                    href="https://t.me/ppprtts"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-accent hover:text-accent/80 transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18.716-3.818 15.515-3.818 15.515-.121.487-.477.645-.773.645-.418 0-.706-.268-.944-.511l-4.033-3.458-1.591 1.434c-.122.098-.244.146-.366.146-.245 0-.489-.171-.489-.416v-4.584l7.142-6.689c.198-.183.198-.549-.122-.549-.074 0-.171.024-.269.098l-8.733 5.555-3.624-1.263c-.489-.171-.538-.549-.05-.818l14.909-5.825c.416-.171.806.122.806.549 0 .073-.025.171-.049.171z" />
                    </svg>
                    <span>@ppprtts</span>
                  </a>
                </motion.div>
              )}
            </div>
          </form>

          {/* Sign Up Link */}
          <div className="mt-6 pt-4 border-t border-secondary/50 text-center">
            <p className="text-sm text-textSecondary">
              Don't have an account?{" "}
              <button
                onClick={handleSignupClick}
                className="text-accent hover:text-accent/80 transition-colors"
              >
                Sign up
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default LoginPage;
