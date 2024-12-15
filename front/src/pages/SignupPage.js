import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { authService } from "../services/authService";
import TermsModal from "../components/TermsModal";

function SignupPage() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
    accountTypes: [],
    sellingExperience: "",
    hasVouches: "",
    vouchLink: "",
    telegramUsername: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [verificationCode, setVerificationCode] = useState(null);
  const [isVerified, setIsVerified] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    if (
      !formData.username ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword ||
      !formData.role
    ) {
      setError("All fields are required");
      return;
    }

    if (formData.role === "seller") {
      if (!formData.sellingExperience) {
        setError("Please indicate your selling experience");
        return;
      }
      if (!formData.hasVouches) {
        setError("Please indicate if you have vouches");
        return;
      }
      if (formData.hasVouches === "yes" && !formData.vouchLink) {
        setError("Please provide your vouch link");
        return;
      }
      if (formData.accountTypes.length === 0) {
        setError("Please select at least one account type to sell");
        return;
      }
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (!isVerified) {
      setError("Please verify your Telegram username first");
      return;
    }

    setIsLoading(true);

    try {
      await authService.register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        accountTypes: formData.accountTypes,
        sellingExperience: formData.sellingExperience,
        hasVouches: formData.hasVouches === "yes",
        vouchLink: formData.vouchLink,
        telegramUsername: formData.telegramUsername,
      });

      navigate("/login");
    } catch (error) {
      setError(error.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginClick = (e) => {
    e.preventDefault();
    navigate("/login");
  };

  const toggleAccountType = (type) => {
    setFormData((prevData) => {
      const accountTypes = prevData.accountTypes.includes(type)
        ? prevData.accountTypes.filter((t) => t !== type)
        : [...prevData.accountTypes, type];
      return { ...prevData, accountTypes };
    });
  };

  const handleTelegramVerification = async () => {
    try {
      setIsVerifying(true);
      const response = await authService.generateTelegramVerification(
        formData.telegramUsername
      );
      setVerificationCode(response.code);

      // Start polling for verification status
      const checkInterval = setInterval(async () => {
        const status = await authService.checkVerification(response.code);
        if (status.verified) {
          setIsVerified(true);
          clearInterval(checkInterval);
        }
      }, 3000);

      // Stop polling after 10 minutes
      setTimeout(() => clearInterval(checkInterval), 600000);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-secondary/50 backdrop-blur-lg rounded-xl p-6">
          <div className="text-center mb-6">
            <h1 className="text-xl font-bold text-textPrimary mb-1">
              Create Account
            </h1>
            <p className="text-sm text-textSecondary">
              Join our marketplace today
            </p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg"
            >
              <p className="text-red-500 text-xs text-center">{error}</p>
            </motion.div>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
            {/* Role Selection */}
            <div className="grid grid-cols-2 gap-3 mb-2">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: "buyer" })}
                className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  formData.role === "buyer"
                    ? "bg-accent text-white"
                    : "bg-secondary/50 text-textSecondary hover:text-textPrimary border border-secondary"
                }`}
              >
                Buyer
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: "seller" })}
                className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  formData.role === "seller"
                    ? "bg-accent text-white"
                    : "bg-secondary/50 text-textSecondary hover:text-textPrimary border border-secondary"
                }`}
              >
                Seller
              </button>
            </div>

            {/* Seller Account Types */}
            {formData.role === "seller" && (
              <>
                <div className="space-y-2">
                  <p className="text-xs font-medium text-textSecondary mb-1">
                    What accounts are you selling?
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      "AI Sites/Apps",
                      "Music Prems",
                      "Ent. Prems",
                      "Educational/Office Prems",
                      "Productivity Prems",
                      "Photo Editing Prems",
                      "VPN Prems",
                      "Unlocks",
                      "OTP Services",
                      "Smart/Globe GB",
                    ].map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => toggleAccountType(type)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                          formData.accountTypes.includes(type)
                            ? "bg-accent text-white"
                            : "bg-secondary/50 text-textSecondary hover:text-textPrimary border border-secondary"
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Selling Experience */}
                <div className="space-y-2">
                  <label className="block text-xs font-medium text-textSecondary">
                    How many years have you been selling?
                  </label>
                  <select
                    value={formData.sellingExperience}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        sellingExperience: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-secondary/50 border border-secondary focus:border-accent focus:outline-none text-textPrimary text-sm"
                  >
                    <option value="">Select experience</option>
                    <option value="<1">Less than 1 year</option>
                    <option value="1-2">1-2 years</option>
                    <option value="2-3">2-3 years</option>
                    <option value="3-5">3-5 years</option>
                    <option value="5+">More than 5 years</option>
                  </select>
                </div>

                {/* Vouches Question */}
                <div className="space-y-2">
                  <label className="block text-xs font-medium text-textSecondary mb-1">
                    Do you have vouches?
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, hasVouches: "yes" })
                      }
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        formData.hasVouches === "yes"
                          ? "bg-accent text-white"
                          : "bg-secondary/50 text-textSecondary hover:text-textPrimary border border-secondary"
                      }`}
                    >
                      Yes
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setFormData({
                          ...formData,
                          hasVouches: "no",
                          vouchLink: "", // Clear vouch link if "No" is selected
                        });
                      }}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        formData.hasVouches === "no"
                          ? "bg-accent text-white"
                          : "bg-secondary/50 text-textSecondary hover:text-textPrimary border border-secondary"
                      }`}
                    >
                      No
                    </button>
                  </div>

                  {/* Warning Message for No Vouches */}
                  {formData.hasVouches === "no" && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-2 p-2.5 bg-yellow-500/10 border border-yellow-500/20 rounded-lg"
                    >
                      <p className="text-yellow-500 text-xs text-center">
                        ⚠️ Please note: Seller applications without vouches are
                        more likely to be declined. We recommend building a
                        reputation first.
                      </p>
                    </motion.div>
                  )}
                </div>

                {/* Vouch Link Input - Only shown if hasVouches is "yes" */}
                {formData.hasVouches === "yes" && (
                  <div className="space-y-2">
                    <label
                      htmlFor="vouchLink"
                      className="block text-xs font-medium text-textSecondary mb-1"
                    >
                      Vouch Link
                    </label>
                    <div className="space-y-2">
                      <input
                        id="vouchLink"
                        type="url"
                        value={formData.vouchLink}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            vouchLink: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 rounded-lg bg-secondary/50 border border-secondary focus:border-accent focus:outline-none text-textPrimary text-sm"
                        placeholder="Enter your vouch link"
                      />
                      <div className="text-xs text-textSecondary">
                        Accepted platforms:
                        <div className="mt-1 flex flex-wrap gap-2">
                          {[
                            { name: "Telegram", url: "t.me/" },
                            { name: "Facebook", url: "facebook.com/" },
                            { name: "Twitter", url: "twitter.com/" },
                            { name: "Instagram", url: "instagram.com/" },
                          ].map((platform) => (
                            <div
                              key={platform.name}
                              className="inline-flex items-center px-2 py-1 rounded-md bg-secondary/30 text-textSecondary"
                            >
                              <span>{platform.name}</span>
                              <span className="ml-1 text-accent/60">
                                {platform.url}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

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
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                className="w-full px-3 py-2 rounded-lg bg-secondary/50 border border-secondary focus:border-accent focus:outline-none text-textPrimary text-sm"
                placeholder="Choose a username"
              />
            </div>

            {/* Email Input */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-medium text-textSecondary mb-1"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-3 py-2 rounded-lg bg-secondary/50 border border-secondary focus:border-accent focus:outline-none text-textPrimary text-sm"
                placeholder="Enter your email"
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
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full px-3 py-2 rounded-lg bg-secondary/50 border border-secondary focus:border-accent focus:outline-none text-textPrimary text-sm"
                placeholder="Create a password"
              />
            </div>

            {/* Confirm Password Input */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-xs font-medium text-textSecondary mb-1"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                className="w-full px-3 py-2 rounded-lg bg-secondary/50 border border-secondary focus:border-accent focus:outline-none text-textPrimary text-sm"
                placeholder="Confirm your password"
              />
            </div>

            {/* Telegram Username Input */}
            <div>
              <label className="block text-sm font-medium text-textSecondary mb-1">
                Telegram Username
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center text-textSecondary">
                  @
                </span>
                <input
                  type="text"
                  placeholder="your_telegram_username"
                  value={formData.telegramUsername}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      telegramUsername: e.target.value,
                    })
                  }
                  className="w-full bg-secondary/50 rounded-lg pl-8 pr-4 py-2 text-textPrimary placeholder:text-textSecondary/50"
                  required
                />
              </div>
              <p className="text-xs text-textSecondary mt-1">
                Required for communication and support
              </p>
            </div>

            {/* Telegram Username Verification */}
            <div className="mt-2">
              {!verificationCode ? (
                <button
                  type="button"
                  onClick={handleTelegramVerification}
                  disabled={!formData.telegramUsername || isVerifying}
                  className="px-4 py-2 bg-accent text-white rounded-lg text-sm hover:bg-accent/90 transition-colors"
                >
                  {isVerifying ? "Generating Code..." : "Verify Telegram"}
                </button>
              ) : (
                <div className="bg-secondary/30 rounded-lg p-4">
                  <p className="text-sm text-textPrimary mb-2">
                    Verification Code:{" "}
                    <span className="font-mono">{verificationCode}</span>
                  </p>
                  <p className="text-xs text-textSecondary">
                    1. Open Telegram and message{" "}
                    <span className="font-mono">@premiumhaven_bot</span>
                    <br />
                    2. Send the command:{" "}
                    <span className="font-mono">
                      /verify {verificationCode}
                    </span>
                  </p>
                  {isVerified && (
                    <div className="mt-2 text-green-500 text-sm">
                      ✓ Verified successfully!
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full bg-accent text-white py-2.5 rounded-lg font-medium hover:bg-accent/90 transition-colors text-sm"
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </motion.button>

            {/* Terms */}
            <p className="text-xs text-textSecondary text-center">
              By signing up, you agree to our{" "}
              <button
                onClick={() => setIsTermsOpen(true)}
                className="text-accent hover:text-accent/80"
              >
                Terms
              </button>{" "}
              and{" "}
              <button
                onClick={() => setIsTermsOpen(true)}
                className="text-accent hover:text-accent/80"
              >
                Privacy Policy
              </button>
            </p>
          </form>

          {/* Login Link */}
          <div className="mt-6 pt-4 border-t border-secondary/50 text-center">
            <p className="text-sm text-textSecondary">
              Already have an account?{" "}
              <button
                onClick={handleLoginClick}
                className="text-accent hover:text-accent/80 transition-colors"
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      </motion.div>

      <TermsModal isOpen={isTermsOpen} onClose={() => setIsTermsOpen(false)} />
    </div>
  );
}

export default SignupPage;
