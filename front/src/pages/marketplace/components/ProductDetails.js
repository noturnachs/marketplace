import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { listingService } from "../../../services/listingService";
import { purchaseService } from "../../../services/purchaseService";
import { sellerService } from "../../../services/sellerService";
import DashboardNavbar from "../../../components/DashboardNavbar";
import LoadingSpinner from "../../../components/LoadingSpinner";
import PurchaseConfirmationModal from "../../../components/PurchaseConfirmationModal";
import PurchaseSuccessModal from "../../../components/PurchaseSuccessModal";
import { walletService } from "../../../services/walletService";

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
        const sellerData = await sellerService.getSellerDetails(data.seller_id);
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
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-semibold text-textPrimary">
                {listing.title}
              </h1>
              <p className="text-sm text-textSecondary">{listing.duration}</p>
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

          {/* Content */}
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
                    ₱{listing.price} <span className="text-sm">coins</span>
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-textSecondary mb-2">
                    Seller
                  </h3>
                  <div className="space-y-1">
                    <p className="text-sm text-blue-500">
                      {listing.seller_name}
                    </p>
                    <p className="text-xs text-[#22c55e]">
                      Telegram: @{listing.seller_telegram}
                    </p>
                    {sellerDetails?.vouch_link && (
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
                className="px-4 py-2 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent/90 transition-colors"
              >
                Purchase Now
              </button>
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
