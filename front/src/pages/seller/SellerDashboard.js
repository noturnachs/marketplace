import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { listingService } from "../../services/listingService";
import { purchaseService } from "../../services/purchaseService";
import { categories, getCategoryByName } from "../../config/categories";
import SendAccountModal from "../../components/SendAccountModal";
import { sellerService } from "../../services/sellerService";

function SellerDashboard() {
  const userData = JSON.parse(localStorage.getItem("userData")) || {};
  const sellerStatus = userData.seller_status || "pending";
  const [listings, setListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddingListing, setIsAddingListing] = useState(false);
  const [editingListing, setEditingListing] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    duration: "",
    features: [],
  });
  const [newFeature, setNewFeature] = useState("");
  const [sales, setSales] = useState([]);
  const [totalCompletedSales, setTotalCompletedSales] = useState(0);
  const [totalPendingSales, setTotalPendingSales] = useState(0);
  const [showSendAccountModal, setShowSendAccountModal] = useState(false);
  const [selectedSaleId, setSelectedSaleId] = useState(null);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [isEditingTelegram, setIsEditingTelegram] = useState(false);
  const [newTelegramUsername, setNewTelegramUsername] = useState("");
  const [balance, setBalance] = useState({
    gross_sales: "0.00",
    available_balance: "0.00",
    total_fees: "0.00",
  });

  useEffect(() => {
    if (sellerStatus === "verified") {
      fetchListings();
      fetchSales();
      fetchBalance();
    }
  }, [sellerStatus]);

  const fetchListings = async () => {
    try {
      const data = await listingService.getMyListings();
      setListings(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSales = async () => {
    try {
      const salesData = await purchaseService.getMySales();
      setSales(salesData.sales);
      setTotalCompletedSales(salesData.totalCompletedSales);
      setTotalPendingSales(salesData.totalPendingSales);
    } catch (error) {
      console.error("Error fetching sales:", error);
    }
  };

  const fetchBalance = async () => {
    try {
      const balanceData = await sellerService.getBalance();
      setBalance(balanceData);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingListing) {
        await listingService.update(editingListing.id, formData);
      } else {
        await listingService.create(formData);
      }
      setIsAddingListing(false);
      setEditingListing(null);
      setFormData({
        title: "",
        description: "",
        price: "",
        category: "",
        duration: "",
        features: [],
      });
      fetchListings();
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this listing?")) {
      try {
        await listingService.delete(id);
        fetchListings();
      } catch (error) {
        setError(error.message);
      }
    }
  };

  const handleEdit = (listing) => {
    setEditingListing(listing);
    setFormData({
      title: listing.title,
      description: listing.description,
      price: listing.price,
      category: listing.category,
      duration: listing.duration,
      features: listing.features,
    });
    setIsAddingListing(true);
  };

  const addFeature = (e) => {
    e.preventDefault();
    if (newFeature.trim()) {
      setFormData({
        ...formData,
        features: [...formData.features, newFeature.trim()],
      });
      setNewFeature("");
    }
  };

  const removeFeature = (index) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== index),
    });
  };

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
              usually takes 24-48 hours. We'll notify you once your account has
              been verified.
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
              Unfortunately, your seller verification was not approved. This
              might be due to incomplete information or not meeting our seller
              criteria. Please contact support for more information.
            </p>
          </div>
        );
      case "verified":
        return null; // No message needed for verified sellers
      default:
        return null;
    }
  };

  const handleSendAccount = (saleId) => {
    setSelectedSaleId(saleId);
    setShowSendAccountModal(true);
  };

  const handleSubmitAccountDetails = async (accountDetails) => {
    try {
      setIsPurchasing(true);
      await purchaseService.updateStatus(selectedSaleId, {
        status: "completed",
        account_details: accountDetails,
      });
      setShowSendAccountModal(false);
      fetchSales();
    } catch (error) {
      setError(error.message);
    } finally {
      setIsPurchasing(false);
    }
  };

  const handleCancelOrder = async (saleId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;

    try {
      await purchaseService.updateStatus(saleId, {
        status: "cancelled",
      });
      fetchSales(); // Refresh sales list
    } catch (error) {
      setError(error.message);
    }
  };

  const handleUpdateTelegramUsername = async () => {
    try {
      // Add API call to update telegram username
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/v1/users/telegram-username`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ telegram_username: newTelegramUsername }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update Telegram username");
      }

      // Update local storage with new user data
      const userData = JSON.parse(localStorage.getItem("userData"));
      userData.telegram_username = newTelegramUsername;
      localStorage.setItem("userData", JSON.stringify(userData));

      setIsEditingTelegram(false);
      setNewTelegramUsername("");

      // Show success message
      // You might want to add a toast notification here
    } catch (error) {
      setError(error.message);
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
          {/* Stats Section - Updated to show net balance after fees */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-secondary/30 rounded-lg p-4">
              <p className="text-sm text-textSecondary">
                Available Balance (After Fees)
              </p>
              <p className="text-2xl font-bold text-green-500">
                ₱{parseFloat(balance.available_balance).toFixed(2)}
              </p>
              <p className="text-xs text-textSecondary mt-1">
                5% fee per order
              </p>
            </div>

            <div className="bg-secondary/30 rounded-lg p-4">
              <p className="text-sm text-textSecondary">Gross Sales</p>
              <p className="text-2xl font-bold text-accent">
                ₱{parseFloat(balance.gross_sales).toFixed(2)}
              </p>
              <p className="text-xs text-textSecondary mt-1">
                Total fees: ₱{parseFloat(balance.total_fees).toFixed(2)}
              </p>
            </div>

            <div className="bg-secondary/30 rounded-lg p-4">
              <p className="text-sm text-textSecondary">Active Listings</p>
              <p className="text-2xl font-semibold text-textPrimary">
                {listings.length}
              </p>
            </div>

            <div className="bg-secondary/30 rounded-lg p-4">
              <p className="text-sm text-textSecondary">Total Orders</p>
              <p className="text-2xl font-semibold text-textPrimary">
                {sales.length}
              </p>
            </div>
          </div>

          {/* Cashout Section */}
          <div className="bg-secondary/30 rounded-lg p-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-semibold text-textPrimary">
                  Cashout
                </h2>
                <p className="text-sm text-textSecondary mt-1">
                  Convert your earnings to real money
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-textSecondary">Available Balance</p>
                <p className="text-2xl font-bold text-green-500">
                  ₱{(totalCompletedSales * 0.95).toFixed(2)}
                </p>
                <p className="text-xs text-textSecondary mt-1">After fees</p>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div className="bg-secondary/50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-textPrimary mb-2">
                  How to Cashout
                </h3>
                <div className="space-y-2">
                  <p className="text-sm text-textSecondary">
                    Contact our admin through:
                  </p>
                  <div className="flex flex-col gap-2">
                    <a
                      href="https://t.me/rizebaby01"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-accent hover:text-accent/80 transition-colors"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18.716-3.818 15.515-3.818 15.515-.121.487-.477.645-.773.645-.418 0-.706-.268-.944-.511l-4.033-3.458-1.591 1.434c-.122.098-.244.146-.366.146-.245 0-.489-.171-.489-.416v-4.584l7.142-6.689c.198-.183.198-.549-.122-.549-.074 0-.171.024-.269.098l-8.733 5.555-3.624-1.263c-.489-.171-.538-.549-.05-.818l14.909-5.825c.416-.171.806.122.806.549 0 .073-.025.171-.049.171z" />
                      </svg>
                      <span className="text-sm">@rizebaby01</span>
                    </a>
                    <a
                      href="https://t.me/grim1232"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-accent hover:text-accent/80 transition-colors"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18.716-3.818 15.515-3.818 15.515-.121.487-.477.645-.773.645-.418 0-.706-.268-.944-.511l-4.033-3.458-1.591 1.434c-.122.098-.244.146-.366.146-.245 0-.489-.171-.489-.416v-4.584l7.142-6.689c.198-.183.198-.549-.122-.549-.074 0-.171.024-.269.098l-8.733 5.555-3.624-1.263c-.489-.171-.538-.549-.05-.818l14.909-5.825c.416-.171.806.122.806.549 0 .073-.025.171-.049.171z" />
                      </svg>
                      <span className="text-sm">@grim1232</span>
                    </a>
                  </div>
                </div>
              </div>

              <div className="bg-secondary/50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-textPrimary mb-2">
                  Important Notes
                </h3>
                <ul className="list-disc list-inside space-y-1">
                  <li className="text-sm text-textSecondary">
                    Processing time: 24-48 hours
                  </li>
                  <li className="text-sm text-textSecondary">
                    Have your payment details ready
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Telegram Notification Setup */}
          <div className="bg-secondary/30 rounded-lg p-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-sm font-semibold text-textPrimary">
                  Telegram Notifications
                </h2>
                <p className="text-xs text-textSecondary mt-1">
                  Get instant notifications for new orders via Telegram
                </p>
              </div>
              {userData.telegram_username && (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-green-500">Connected</span>
                </div>
              )}
            </div>

            <div className="mt-4">
              {!userData.telegram_username ? (
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                  <h3 className="text-yellow-500 font-medium mb-2">
                    Set Up Telegram Notifications
                  </h3>
                  <p className="text-sm text-yellow-500/80 mb-4">
                    Add your Telegram username to receive instant notifications
                    when you get new orders.
                  </p>
                  <button
                    onClick={() => {
                      /* Add function to update Telegram username */
                    }}
                    className="px-4 py-2 bg-yellow-500 text-white rounded-lg text-sm hover:bg-yellow-500/90 transition-colors"
                  >
                    Add Telegram Username
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-secondary/50 rounded-lg p-4">
                    <p className="text-xs text-textSecondary mb-2">
                      Connected Account
                    </p>
                    <p className="text-textPrimary font-medium text-xs">
                      @{userData.telegram_username}
                    </p>
                  </div>

                  <div className="bg-secondary/50 rounded-lg p-4">
                    <p className="text-xs text-textSecondary mb-2">
                      Connect with our Bot
                    </p>
                    <div className="space-y-2">
                      <p className="text-xs text-textPrimary">
                        1. Open Telegram and search for{" "}
                        <span className="font-mono">
                          @{process.env.REACT_APP_TELEGRAM_BOT_USERNAME}
                        </span>
                      </p>
                      <p className="text-xs text-textPrimary">
                        2. Start a chat with the bot by clicking "Start" or
                        sending any message
                      </p>
                      <p className="text-xs text-textPrimary">
                        3. You'll receive instant notifications for new orders
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      /* Add function to update Telegram username */
                    }}
                    className="text-accent hover:text-accent/80 transition-colors text-xs"
                  >
                    Update Telegram Username
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Sales History - Updated to show confirmation status */}
          <div className="bg-secondary/30 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-textPrimary mb-4">
              Recent Sales
            </h2>
            <div className="space-y-4">
              {sales.length === 0 ? (
                <p className="text-center text-textSecondary py-4">
                  No sales yet. Your sales will appear here.
                </p>
              ) : (
                sales.map((sale) => (
                  <div key={sale.id} className="bg-secondary/50 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-medium text-textPrimary">
                          {sale.listing_title}
                        </h3>
                        <p className="text-sm text-textSecondary">
                          Purchased by {sale.buyer_name}
                        </p>
                        <p className="text-xs text-textSecondary">
                          Sold by {sale.seller_name} •{" "}
                          {new Date(sale.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <p className="text-accent font-medium">
                        ₱{parseFloat(sale.amount).toFixed(2)}
                      </p>
                    </div>

                    {/* Status and Actions Section - Updated to show confirmation status */}
                    <div className="border-t border-white/10 pt-3 mt-3">
                      {sale.status === "awaiting_seller" ? (
                        <>
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                            <p className="text-sm text-yellow-500 font-medium">
                              Action Required
                            </p>
                          </div>
                          <p className="text-sm text-textSecondary mb-3">
                            Please send the account details to complete this
                            order
                          </p>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleSendAccount(sale.id)}
                              className="px-3 py-1.5 bg-accent text-white text-sm rounded-lg hover:bg-accent/90 transition-colors"
                            >
                              Send Account Details
                            </button>
                            <button
                              onClick={() => handleCancelOrder(sale.id)}
                              className="px-3 py-1.5 bg-secondary/50 text-textSecondary text-sm rounded-lg hover:text-textPrimary transition-colors"
                            >
                              Cancel Order
                            </button>
                          </div>
                        </>
                      ) : sale.status === "completed" ? (
                        <>
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <p className="text-sm text-green-500 font-medium">
                              {sale.is_confirmed
                                ? "Completed & Confirmed"
                                : "Completed (Awaiting Buyer Confirmation)"}
                            </p>
                          </div>
                          <div className="mt-2 bg-secondary/30 rounded-lg p-3">
                            <p className="text-sm text-textSecondary mb-1">
                              Account Details:
                            </p>
                            <p className="text-sm text-textPrimary font-mono whitespace-pre-wrap break-words max-w-[500px]">
                              {sale.account_details}
                            </p>
                          </div>
                        </>
                      ) : (
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          <p className="text-sm text-red-500">
                            Order Cancelled
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Listings Management */}
          <div className="bg-secondary/30 rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-textPrimary">
                My Listings
              </h2>
              <button
                onClick={() => {
                  setIsAddingListing(true);
                  setEditingListing(null);
                  setFormData({
                    title: "",
                    description: "",
                    price: "",
                    category: "",
                    duration: "",
                    features: [],
                  });
                }}
                className="bg-accent text-white px-4 py-2 rounded-lg text-sm"
              >
                Add New Listing
              </button>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-lg mb-4">
                {error}
              </div>
            )}

            {isAddingListing && (
              <form
                onSubmit={handleSubmit}
                className="bg-secondary/30 rounded-xl p-6 mb-6"
              >
                <div className="space-y-6">
                  {/* Header */}
                  <div className="border-b border-white/10 pb-4">
                    <h2 className="text-lg font-semibold text-textPrimary">
                      {editingListing ? "Edit Listing" : "Create New Listing"}
                    </h2>
                    <p className="text-sm text-textSecondary mt-1">
                      Fill in the details below to{" "}
                      {editingListing ? "update your" : "create a new"} listing
                    </p>
                  </div>

                  {/* Form Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div className="space-y-4">
                      {/* Title */}
                      <div>
                        <label className="block text-sm font-medium text-textSecondary mb-1">
                          Title
                        </label>
                        <input
                          type="text"
                          placeholder="e.g., Netflix Premium Subscription"
                          value={formData.title}
                          onChange={(e) =>
                            setFormData({ ...formData, title: e.target.value })
                          }
                          className="w-full bg-secondary/50 rounded-lg px-4 py-2 text-textPrimary placeholder:text-textSecondary/50"
                          required
                        />
                      </div>

                      {/* Price */}
                      <div>
                        <label className="block text-sm font-medium text-textSecondary mb-1">
                          Price (in coins)
                        </label>
                        <input
                          type="number"
                          placeholder="e.g., 100"
                          value={formData.price}
                          onChange={(e) =>
                            setFormData({ ...formData, price: e.target.value })
                          }
                          className="w-full bg-secondary/50 rounded-lg px-4 py-2 text-textPrimary placeholder:text-textSecondary/50"
                          required
                        />
                      </div>

                      {/* Category */}
                      <div>
                        <label className="block text-sm font-medium text-textSecondary mb-1">
                          Category
                        </label>
                        <select
                          value={formData.category}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              category: e.target.value,
                            })
                          }
                          className="w-full bg-secondary/50 rounded-lg px-4 py-2 text-textPrimary"
                          required
                        >
                          <option value="">Select Category</option>
                          {categories.map((category) => (
                            <option key={category.id} value={category.name}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Duration */}
                      <div>
                        <label className="block text-sm font-medium text-textSecondary mb-1">
                          Duration
                        </label>
                        <input
                          type="text"
                          placeholder="e.g., 1 month"
                          value={formData.duration}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              duration: e.target.value,
                            })
                          }
                          className="w-full bg-secondary/50 rounded-lg px-4 py-2 text-textPrimary placeholder:text-textSecondary/50"
                          required
                        />
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-4">
                      {/* Description */}
                      <div>
                        <label className="block text-sm font-medium text-textSecondary mb-1">
                          Description
                        </label>
                        <textarea
                          placeholder="Describe your listing in detail..."
                          value={formData.description}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              description: e.target.value,
                            })
                          }
                          className="w-full h-[120px] bg-secondary/50 rounded-lg px-4 py-2 text-textPrimary placeholder:text-textSecondary/50 resize-none"
                          required
                        />
                      </div>

                      {/* Features */}
                      <div>
                        <label className="block text-sm font-medium text-textSecondary mb-1">
                          Features
                        </label>
                        <div className="space-y-2 mb-2">
                          {formData.features.map((feature, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-2 bg-secondary/50 rounded-lg p-2"
                            >
                              <span className="text-sm text-textPrimary flex-1">
                                {feature}
                              </span>
                              <button
                                type="button"
                                onClick={() => removeFeature(index)}
                                className="text-red-500 hover:text-red-500/80 transition-colors"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </button>
                            </div>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Add a feature..."
                            value={newFeature}
                            onChange={(e) => setNewFeature(e.target.value)}
                            className="flex-1 bg-secondary/50 rounded-lg px-4 py-2 text-textPrimary text-sm placeholder:text-textSecondary/50"
                          />
                          <button
                            type="button"
                            onClick={addFeature}
                            className="bg-accent text-white px-4 py-2 rounded-lg text-sm whitespace-nowrap hover:bg-accent/90 transition-colors"
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Form Actions */}
                  <div className="flex justify-end gap-2 pt-4 border-t border-white/10">
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingListing(false);
                        setEditingListing(null);
                      }}
                      className="px-4 py-2 bg-secondary/50 text-textSecondary rounded-lg text-sm hover:text-textPrimary transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-accent text-white rounded-lg text-sm hover:bg-accent/90 transition-colors"
                    >
                      {editingListing ? "Update" : "Create"} Listing
                    </button>
                  </div>
                </div>
              </form>
            )}

            {isLoading ? (
              <p className="text-center text-textSecondary">
                Loading listings...
              </p>
            ) : (
              <div className="grid gap-4">
                {listings.map((listing) => {
                  const category = getCategoryByName(listing.category);
                  const Icon = category?.icon;

                  return (
                    <div
                      key={listing.id}
                      className="bg-secondary/50 rounded-lg p-4 flex justify-between items-center"
                    >
                      <div className="flex items-center gap-2">
                        {Icon && (
                          <Icon className={`w-5 h-5 ${category.color}`} />
                        )}
                        <div>
                          <h3 className="font-medium text-textPrimary">
                            {listing.title}
                          </h3>
                          <p className="text-sm text-textSecondary">
                            ₱{listing.price}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(listing)}
                          className="text-accent hover:text-accent/80 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(listing.id)}
                          className="text-red-500 hover:text-red-500/80 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}

      <SendAccountModal
        isOpen={showSendAccountModal}
        onClose={() => setShowSendAccountModal(false)}
        onSubmit={handleSubmitAccountDetails}
        isLoading={isPurchasing}
      />

      {isEditingTelegram && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-secondary rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-textPrimary mb-4">
              Update Telegram Username
            </h3>
            <input
              type="text"
              value={newTelegramUsername}
              onChange={(e) => setNewTelegramUsername(e.target.value)}
              placeholder="Enter your Telegram username"
              className="w-full bg-secondary/50 rounded-lg px-4 py-2 text-textPrimary mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsEditingTelegram(false)}
                className="px-4 py-2 bg-secondary/50 text-textSecondary rounded-lg text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateTelegramUsername}
                className="px-4 py-2 bg-accent text-white rounded-lg text-sm"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default SellerDashboard;
