import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import DashboardNavbar from "../components/DashboardNavbar";
import UserWallet from "./wallet/UserWallet";
import { purchaseService } from "../services/purchaseService";
import { authService } from "../services/authService";
import { sellerService } from "../services/sellerService";
import ColorCustomizer from "../components/ColorCustomizer";

function darkenHexColor(hex, amount) {
  hex = hex.replace(/^#/, "");

  let r = parseInt(hex.substring(0, 2), 16);
  let g = parseInt(hex.substring(2, 4), 16);
  let b = parseInt(hex.substring(4, 6), 16);

  r = Math.max(0, r - amount);
  g = Math.max(0, g - amount);
  b = Math.max(0, b - amount);

  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

function ProfilePage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(
    searchParams.get("tab") || "overview"
  );
  const [purchaseHistory, setPurchaseHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditingTelegram, setIsEditingTelegram] = useState(false);
  const [newTelegramUsername, setNewTelegramUsername] = useState("");
  const [seller, setSeller] = useState(null);
  const [listings, setListings] = useState([]);
  const [isSellerLoading, setIsSellerLoading] = useState(true);
  const [colorCustomization, setColorCustomization] = useState(null);

  const userData = JSON.parse(localStorage.getItem("userData")) || {};

  const tabs = [
    "Overview",
    ...(userData.role === "seller" ? ["Seller Profile"] : []),
    "Purchases",
    "Wallet",
  ];

  const fetchPurchaseHistory = async () => {
    try {
      const purchases = await purchaseService.getMyPurchases();
      setPurchaseHistory(purchases);
    } catch (error) {
      console.error("Error fetching purchases:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Format join date
  const formatJoinDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  // Empty state components

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

  const handleConfirmPurchase = async (purchaseId) => {
    try {
      setIsLoading(true);
      await purchaseService.confirmPurchase(purchaseId);
      fetchPurchaseHistory(); // Refresh the purchases list
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Update URL when tab changes
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  // Set initial tab from URL on component mount
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab && ["overview", "purchases", "wallet"].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const handleListingClick = (listingId) => {
    navigate(`/marketplace/${listingId}`);
  };

  const handleUpdateTelegramUsername = async () => {
    try {
      setIsLoading(true);
      setError(null);

      await authService.updateTelegramUsername(newTelegramUsername);

      // Force re-render by updating state
      setIsEditingTelegram(false);
      setNewTelegramUsername("");

      // Optional: Show success message
      // You might want to add a toast notification here
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchData = async () => {
    try {
      setIsSellerLoading(true);
      const userId = userData.id;
      const [profileData, listingsData, customizationData] = await Promise.all([
        sellerService.getSellerProfile(userId),
        sellerService.getSellerListings(userId),
        sellerService.getProfileCustomization(userId),
      ]);
      setSeller({
        ...profileData,
        primary_color: customizationData?.primary_color || "#17222e",
        secondary_color: customizationData?.secondary_color || "#182531",
        accent_color: customizationData?.accent_color || "#6366F1",
      });
      setListings(listingsData);
      setColorCustomization(customizationData);
    } catch (error) {
      setError(error.message || "Failed to load profile data");
    } finally {
      setIsSellerLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [userData.id]);

  const handleColorSave = () => {
    fetchData();
  };

  useEffect(() => {
    if (activeTab === "purchases") {
      fetchPurchaseHistory();
    }
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-primary">
      <DashboardNavbar />

      <main className="max-w-4xl mx-auto px-4 py-4 sm:py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Profile Header with Stats */}
          <div className="bg-secondary/50 backdrop-blur-lg rounded-xl p-4 sm:p-6 mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
              <div>
                <h1 className="text-xl font-bold text-textPrimary mb-2">
                  {userData.username}
                </h1>
                <p className="text-sm text-textSecondary">
                  Member since {formatJoinDate(userData.created_at)}
                </p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 w-full sm:w-auto">
                <div className="text-center p-3 bg-secondary/30 rounded-lg">
                  <p className="text-xl sm:text-2xl font-bold text-accent">
                    {purchaseHistory.length}
                  </p>
                  <p className="text-xs text-textSecondary">Purchases</p>
                </div>
                <div className="text-center p-3 bg-secondary/30 rounded-lg">
                  <p className="text-xl sm:text-2xl font-bold text-accent">
                    ₱
                    {purchaseHistory
                      .reduce((sum, p) => sum + parseFloat(p.amount), 0)
                      .toFixed(2)}
                  </p>
                  <p className="text-xs text-textSecondary">Total Spent</p>
                </div>
                <div className="text-center p-3 bg-secondary/30 rounded-lg">
                  <p className="text-xl sm:text-2xl font-bold text-accent">
                    {listings?.length || 0}
                  </p>
                  <p className="text-xs text-textSecondary">Listings</p>
                </div>
                <div className="text-center p-3 bg-secondary/30 rounded-lg">
                  <p className="text-xl sm:text-2xl font-bold text-accent">
                    {seller?.vouches || 0}
                  </p>
                  <p className="text-xs text-textSecondary">Vouches</p>
                </div>
                <div className="text-center p-3 bg-secondary/30 rounded-lg">
                  <p className="text-xl sm:text-2xl font-bold text-accent">
                    {seller?.account_types?.length || 0}
                  </p>
                  <p className="text-xs text-textSecondary">Account Types</p>
                </div>
              </div>
            </div>
          </div>

          {/* Telegram Section */}
          <div className="bg-secondary/30 rounded-lg p-6 mb-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-sm font-semibold text-textPrimary">
                  Telegram Notifications
                </h2>
                <p className="text-xs text-textSecondary mt-1">
                  Connect your Telegram account
                </p>
              </div>
              {userData.telegram_username && (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-green-500">Connected</span>
                </div>
              )}
            </div>

            {!userData.telegram_username ? (
              <button
                onClick={() => setIsEditingTelegram(true)}
                className="mt-4 px-4 py-2 bg-accent text-white rounded-lg text-sm hover:bg-accent/90 transition-colors"
              >
                Connect Telegram
              </button>
            ) : (
              <div className="mt-4 space-y-4">
                <div className="bg-secondary/50 rounded-lg p-4">
                  <p className="text-xs text-textSecondary">
                    Connected Account
                  </p>
                  <p className="text-textPrimary font-medium text-xs">
                    @{userData.telegram_username}
                  </p>
                </div>
                <button
                  onClick={() => setIsEditingTelegram(true)}
                  className="text-accent hover:text-accent/80 transition-colors text-xs"
                >
                  Update Username
                </button>
              </div>
            )}
          </div>

          {/* Telegram Edit Modal */}
          {isEditingTelegram && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-secondary rounded-lg p-4 sm:p-6 w-full max-w-md">
                <h3 className="text-lg font-semibold text-textPrimary mb-4">
                  {userData.telegram_username ? "Update" : "Add"} Telegram
                  Username
                </h3>

                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-4">
                    <p className="text-sm text-red-500">{error}</p>
                  </div>
                )}

                <div className="space-y-4">
                  <input
                    type="text"
                    value={newTelegramUsername}
                    onChange={(e) => setNewTelegramUsername(e.target.value)}
                    placeholder="Enter your Telegram username"
                    className="w-full bg-secondary/50 rounded-lg px-4 py-2 text-textPrimary"
                  />

                  <div className="bg-secondary/50 rounded-lg p-3">
                    <p className="text-sm text-textSecondary">
                      After connecting, start a chat with our bot{" "}
                      <span className="font-mono">
                        @{process.env.REACT_APP_TELEGRAM_BOT_USERNAME}
                      </span>{" "}
                      to receive notifications.
                    </p>
                  </div>
                </div>

                <div className="flex justify-end gap-2 mt-6">
                  <button
                    onClick={() => {
                      setIsEditingTelegram(false);
                      setError(null);
                    }}
                    className="px-4 py-2 bg-secondary/50 text-textSecondary rounded-lg text-sm hover:text-textPrimary transition-colors"
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdateTelegramUsername}
                    className="px-4 py-2 bg-accent text-white rounded-lg text-sm hover:bg-accent/90 transition-colors"
                    disabled={isLoading}
                  >
                    {isLoading ? "Saving..." : "Save"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Profile Tabs */}
          <div className="flex gap-4 mb-6 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabChange(tab.toLowerCase())}
                className={`text-sm font-medium transition-colors whitespace-nowrap px-2 py-1 ${
                  activeTab === tab.toLowerCase()
                    ? "text-accent border-b-2 border-accent"
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
              <div className="bg-secondary/30 rounded-lg p-6">
                <h2 className="text-lg font-semibold text-textPrimary mb-4">
                  Account Overview
                </h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-textSecondary">Email</p>
                    <p className="text-sm text-textPrimary">{userData.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-textSecondary">Role</p>
                    <p className="text-sm text-textPrimary capitalize">
                      {userData.role}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-textSecondary">Telegram</p>
                    <p className="text-sm text-textPrimary">
                      @{userData.telegram_username}
                    </p>
                  </div>
                </div>
              </div>
              {!userData.telegram_username && (
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mb-4">
                  <h3 className="text-yellow-500 font-medium mb-1">
                    Set Up Telegram Notifications
                  </h3>
                  <p className="text-sm text-yellow-500/80">
                    Add your Telegram username to receive instant notifications
                    when sellers send your account details.
                  </p>
                  <button
                    onClick={() => setIsEditingTelegram(true)}
                    className="mt-2 px-4 py-2 bg-yellow-500 text-white rounded-lg text-sm hover:bg-yellow-500/90 transition-colors"
                  >
                    Add Telegram Username
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Seller Profile Tab */}
          {activeTab === "seller profile" && !isSellerLoading && (
            <>
              <div
                className="space-y-6 rounded-lg px-4 py-8"
                style={{ backgroundColor: seller?.primary_color }}
              >
                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div
                    className="rounded-lg p-6 text-center transition-all duration-200"
                    style={{ backgroundColor: seller?.secondary_color }}
                  >
                    <p
                      className="text-4xl font-bold mb-1"
                      style={{
                        color: darkenHexColor(
                          seller?.accent_color || "#000000",
                          100
                        ),
                      }}
                    >
                      {listings?.length || 0}
                    </p>
                    <p
                      className="text-sm font-bold"
                      style={{
                        color: darkenHexColor(
                          seller?.accent_color || "#000000",
                          -20
                        ),
                      }}
                    >
                      Total Listings
                    </p>
                  </div>
                  <div
                    className="rounded-lg p-6 text-center transition-all duration-200"
                    style={{ backgroundColor: seller?.secondary_color }}
                  >
                    <p
                      className="text-4xl font-bold mb-1"
                      style={{
                        color: darkenHexColor(
                          seller?.accent_color || "#000000",
                          100
                        ),
                      }}
                    >
                      {seller?.vouches || 0}
                    </p>
                    <p
                      className="text-sm font-bold"
                      style={{
                        color: darkenHexColor(
                          seller?.accent_color || "#000000",
                          -20
                        ),
                      }}
                    >
                      Vouches
                    </p>
                  </div>
                  <div
                    className="rounded-lg p-6 text-center transition-all duration-200"
                    style={{ backgroundColor: seller?.secondary_color }}
                  >
                    <p
                      className="text-4xl font-bold mb-1"
                      style={{
                        color: darkenHexColor(
                          seller?.accent_color || "#000000",
                          100
                        ),
                      }}
                    >
                      {seller?.account_types?.length || 0}
                    </p>
                    <p
                      className="text-sm font-bold"
                      style={{
                        color: darkenHexColor(
                          seller?.accent_color || "#000000",
                          -20
                        ),
                      }}
                    >
                      Account Types
                    </p>
                  </div>
                </div>

                {/* Account Types Section */}
                {seller?.account_types && seller.account_types.length > 0 && (
                  <div
                    className="rounded-lg p-6 transition-all duration-200"
                    style={{ backgroundColor: seller?.secondary_color }}
                  >
                    <h2
                      className="text-xl font-semibold mb-4"
                      style={{ color: seller?.accent_color }}
                    >
                      Account Types
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {seller.account_types.map((type, index) => (
                        <span
                          key={index}
                          className="px-4 py-2 rounded-full text-xs font-medium transition-all duration-200"
                          style={{
                            backgroundColor: darkenHexColor(
                              seller?.accent_color || "#000000",
                              100
                            ),
                          }}
                        >
                          <span
                            className="font-bold"
                            style={{ color: seller?.accent_color }}
                          >
                            {type}
                          </span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Active Listings Section */}
                <div
                  className="rounded-lg p-6 transition-all duration-200"
                  style={{ backgroundColor: seller?.secondary_color }}
                >
                  <h2
                    className="text-xl font-bold mb-4"
                    style={{ color: seller?.accent_color }}
                  >
                    Active Listings
                  </h2>
                  <div className="grid gap-4">
                    {listings.map((listing) => (
                      <div
                        key={listing.id}
                        className="rounded-lg p-4 transition-all duration-200 "
                        style={{
                          backgroundColor: darkenHexColor(
                            seller?.accent_color,
                            100
                          ),
                        }}
                        onClick={() => handleListingClick(listing.id)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium mb-1">
                              {listing.title}
                            </h3>
                            <p
                              className="text-xs p-2 rounded-lg opacity-80"
                              style={{ backgroundColor: seller?.accent_color }}
                            >
                              {listing.description}
                            </p>
                          </div>
                          <p
                            className="font-bold"
                            style={{
                              color: darkenHexColor(seller?.accent_color, -20),
                            }}
                          >
                            ₱{listing.price}
                          </p>
                        </div>
                      </div>
                    ))}
                    {listings.length === 0 && (
                      <p
                        className="text-center py-4"
                        style={{ color: seller?.secondary_color }}
                      >
                        No active listings
                      </p>
                    )}
                  </div>
                </div>

                {/* Warning Message for No Vouches */}
                {seller?.vouches === 0 && (
                  <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                    <div className="flex items-center gap-2">
                      <span className="text-yellow-500">⚠️</span>
                      <p className="text-yellow-500">
                        Seller has no vouches, buy with care.
                      </p>
                    </div>
                  </div>
                )}

                {/* Color Customizer */}
              </div>
              <ColorCustomizer
                sellerId={userData.id}
                onSave={handleColorSave}
              />
            </>
          )}
          {activeTab === "seller profile" && isSellerLoading && (
            <div className="text-center py-4">Loading seller profile...</div>
          )}

          {/* Purchases Tab */}
          {activeTab === "purchases" && (
            <div className="space-y-4">
              {isLoading ? (
                <div className="text-center py-8">
                  <p className="text-textSecondary">Loading purchases...</p>
                </div>
              ) : purchaseHistory.length === 0 ? (
                <EmptyPurchases />
              ) : (
                purchaseHistory.map((purchase) => (
                  <div
                    key={purchase.id}
                    className="bg-secondary/30 rounded-lg p-4"
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-2 mb-2">
                      <div>
                        <h3 className="text-sm font-medium text-textPrimary">
                          {purchase.listing_title}
                        </h3>
                        <p className="text-xs text-textSecondary">
                          Sold by{" "}
                          <Link
                            to={`/seller/${purchase.seller_id}`}
                            className="text-accent hover:text-accent/80 transition-colors"
                          >
                            {purchase.seller_name}
                          </Link>{" "}
                          • {new Date(purchase.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <span className="text-accent font-medium order-first sm:order-last">
                        ₱{parseFloat(purchase.amount).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      {purchase.status === "awaiting_seller" ? (
                        <>
                          <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                          <div className="flex-1">
                            <p className="text-sm text-yellow-500">
                              Waiting for {purchase.seller_name} to send the
                              account
                            </p>
                            <div className="bg-secondary/50 rounded-lg p-3 mt-2">
                              <p className="text-xs text-textSecondary">
                                ⏰ If seller fails to send the account within 1
                                hour, your funds will be automatically refunded.
                              </p>
                              {/* <p className="text-xs text-textSecondary mt-1">
                                Ordered at: {formatPhTime(purchase.created_at)}
                              </p> */}
                            </div>
                          </div>
                        </>
                      ) : purchase.status === "completed" ? (
                        <>
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <div className="text-sm">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="text-green-500 font-medium">
                                {purchase.is_confirmed
                                  ? "Account Confirmed"
                                  : "Account Received - Pending Confirmation"}
                              </p>
                            </div>
                            <p className="text-textPrimary bg-secondary/50 p-2 rounded-lg font-mono whitespace-pre-wrap break-words max-w-[500px]">
                              {purchase.account_details}
                            </p>
                            {!purchase.is_confirmed ? (
                              <div className="mt-3 border-t border-white/10 pt-3">
                                <p className="text-sm text-yellow-500 mb-2">
                                  Please confirm if you received a valid account
                                </p>
                                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 mb-3">
                                  <p className="text-sm text-yellow-500">
                                    ⚠️ Important: Failure to confirm within 24
                                    hours will void the warranty and support for
                                    this purchase.
                                  </p>
                                </div>
                                <button
                                  onClick={() =>
                                    handleConfirmPurchase(purchase.id)
                                  }
                                  disabled={isLoading}
                                  className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  {isLoading
                                    ? "Confirming..."
                                    : "Confirm Account"}
                                </button>
                              </div>
                            ) : (
                              <div className="mt-3 border-t border-white/10 pt-3">
                                <p className="text-sm text-green-500">
                                  ✓ You already confirmed that you have received
                                  the product.
                                </p>
                              </div>
                            )}
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          <div>
                            <p className="text-sm text-red-500">
                              Order cancelled
                            </p>
                            <p className="text-xs text-green-500 mt-1">
                              ✓ Amount has already been refunded to your account
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                    <div className="text-xs text-textSecondary mt-2">
                      <p>Transaction ID: {purchase.id}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Wallet Tab */}
          {activeTab === "wallet" && <UserWallet />}
        </motion.div>
      </main>
    </div>
  );
}

export default ProfilePage;
