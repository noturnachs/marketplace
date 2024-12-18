import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { listingService } from "../../../services/listingService";
import { purchaseService } from "../../../services/purchaseService";
import { sellerService } from "../../../services/sellerService";
import DashboardNavbar from "../../../components/DashboardNavbar";
import LoadingSpinner from "../../../components/LoadingSpinner";
import PurchaseConfirmationModal from "../../../components/PurchaseConfirmationModal";
import PurchaseSuccessModal from "../../../components/PurchaseSuccessModal";
import { walletService } from "../../../services/walletService";
import { getListingHeader } from "../listingHeaders";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);
  const [sellerDetails, setSellerDetails] = useState(null);

  useEffect(() => {
    fetchListing();
    fetchWalletBalance();
  }, [id]);

  const fetchListing = async () => {
    try {
      const data = await listingService.getById(id);
      setListing(data);

      if (data.seller_id) {
        const sellerData = await sellerService.getSellerProfile(data.seller_id);
        setSellerDetails(sellerData);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchWalletBalance = async () => {
    try {
      const wallet = await walletService.getBalance();
      setWalletBalance(wallet.coins);
    } catch (error) {
      console.error("Error fetching wallet balance:", error);
    }
  };

  const handleConfirmPurchase = async () => {
    try {
      setIsPurchasing(true);
      await purchaseService.create(listing.id, listing.price);
      navigate("/profile?tab=purchases");
    } catch (error) {
      setError(error.message);
    } finally {
      setIsPurchasing(false);
      setShowConfirmModal(false);
    }
  };

  // Update purchase button click handler
  const handlePurchaseClick = () => {
    setShowConfirmModal(true);
  };

  if (isLoading) return <LoadingSpinner />;
  if (error)
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-lg">
          {error}
        </div>
      </div>
    );
  if (!listing)
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="bg-secondary/50 backdrop-blur-lg p-4 rounded-lg text-textPrimary">
          Listing not found
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-primary">
      <DashboardNavbar />

      <main className="max-w-4xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Content */}
          <div className="bg-secondary/50 backdrop-blur-lg rounded-xl overflow-hidden">
            {/* Conditional Header */}
            {listing && getListingHeader(listing.title) && (
              <div className="w-full h-48 bg-secondary">
                <img
                  src={getListingHeader(listing.title).image}
                  alt={getListingHeader(listing.title).alt}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="p-6 space-y-6">
              {/* Header */}
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-semibold text-textPrimary">
                    {listing.title}
                  </h1>
                  <p className="text-sm text-textSecondary">
                    {listing.duration}
                  </p>
                </div>
                <button
                  onClick={() => navigate("/dashboard")}
                  className="text-textSecondary hover:text-textPrimary transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="bg-secondary/50 backdrop-blur-lg rounded-xl">
                <div className="p-6 space-y-6">
                  <div>
                    <h3 className="text-sm font-medium text-textSecondary mb-2">
                      Description
                    </h3>
                    <p className="text-sm text-textPrimary">
                      {listing.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-textSecondary mb-2">
                        Price
                      </h3>
                      <p className="text-lg font-bold text-accent">
                        ₱{listing.price}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-textSecondary mb-2">
                        Status
                      </h3>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          listing.in_stock
                            ? "bg-green-500/10 text-green-500 border border-green-500/20"
                            : "bg-red-500/10 text-red-500 border border-red-500/20"
                        }`}
                      >
                        {listing.in_stock ? "In Stock" : "Out of Stock"}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-textSecondary mb-2">
                        Seller
                      </h3>
                      <div className="space-y-1">
                        <Link
                          to={`/seller/${listing.seller_id}/profile`}
                          className="text-sm text-blue-500 hover:text-blue-400 transition-colors"
                        >
                          {listing.seller_name}
                        </Link>
                        <p className="text-xs text-[#22c55e]">
                          Telegram: @{listing.seller_telegram}
                        </p>
                        {sellerDetails?.vouch_link ? (
                          <a
                            href={sellerDetails.vouch_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-accent hover:text-accent/80 transition-colors flex items-center gap-1"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                            View Vouches
                          </a>
                        ) : (
                          <div className="flex items-center gap-1 text-xs text-yellow-500">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                clipRule="evenodd"
                              />
                            </svg>
                            This seller has no vouches - purchase with care
                          </div>
                        )}
                        {sellerDetails?.has_vouches &&
                          !sellerDetails?.vouch_link && (
                            <p className="text-xs text-yellow-500">
                              Seller has vouches but link not available
                            </p>
                          )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-textSecondary mb-2">
                      Features
                    </h3>
                    <ul className="list-disc list-inside text-sm text-textPrimary space-y-1">
                      {listing.features && listing.features.length > 0 ? (
                        listing.features.map((feature, index) => (
                          <li key={index}>{feature}</li>
                        ))
                      ) : (
                        <li>No features listed</li>
                      )}
                    </ul>
                  </div>
                </div>

                <div className="flex justify-end gap-3 p-6 border-t border-white/10">
                  <button
                    onClick={() => navigate("/dashboard")}
                    className="px-4 py-2 text-sm text-textSecondary hover:text-textPrimary transition-colors"
                    disabled={isPurchasing}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handlePurchaseClick}
                    disabled={!listing.in_stock || isPurchasing}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      listing.in_stock
                        ? "bg-accent text-white hover:bg-accent/90"
                        : "bg-gray-500/50 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    {listing.in_stock ? "Purchase Now" : "Out of Stock"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      <PurchaseConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        listing={listing}
        currentBalance={walletBalance}
        onConfirm={handleConfirmPurchase}
        isPurchasing={isPurchasing}
      />

      <PurchaseSuccessModal
        isOpen={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false);
          navigate("/profile");
        }}
        listing={listing}
      />
    </div>
  );
}

export default ProductDetails;
