import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { listingService } from "../../../services/listingService";
import DashboardNavbar from "../../../components/DashboardNavbar";
import LoadingSpinner from "../../../components/LoadingSpinner";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchListing();
  }, [id]);

  const fetchListing = async () => {
    try {
      const data = await listingService.getById(id);
      setListing(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePurchase = (listing) => {
    const userWallet = JSON.parse(localStorage.getItem("userWallet")) || {
      coins: 0,
    };

    if (userWallet.coins < listing.price) {
      alert("Insufficient coins! Please add funds to your wallet.");
      return;
    }

    const newBalance = userWallet.coins - listing.price;
    localStorage.setItem(
      "userWallet",
      JSON.stringify({ ...userWallet, coins: newBalance })
    );
    alert(`Successfully purchased ${listing.title}!`);
    navigate("/dashboard");
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
                  <p className="text-sm text-textPrimary">
                    {listing.seller_name}
                  </p>
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
              >
                Cancel
              </button>
              <button
                onClick={() => handlePurchase(listing)}
                className="px-4 py-2 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent/90 transition-colors"
              >
                Purchase Now
              </button>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

export default ProductDetails;
