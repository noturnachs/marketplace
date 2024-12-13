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
        navigate("/seller");
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
              <a
                href="#forgot"
                className="text-accent hover:text-accent/80 transition-colors"
              >
                Forgot password?
              </a>
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
