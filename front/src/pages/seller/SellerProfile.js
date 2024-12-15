import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import DashboardNavbar from "../../components/DashboardNavbar";
import { sellerService } from "../../services/sellerService";

function SellerProfile() {
  const { sellerId } = useParams();
  const [seller, setSeller] = useState(null);
  const [listings, setListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [profileData, listingsData] = await Promise.all([
          sellerService.getSellerProfile(sellerId),
          sellerService.getSellerListings(sellerId),
        ]);
        setSeller(profileData);
        setListings(listingsData);
      } catch (error) {
        setError(error.message || "Failed to load seller profile");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [sellerId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-primary">
        <DashboardNavbar />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <p className="text-textSecondary">Loading seller profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-primary">
        <DashboardNavbar />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary">
      <DashboardNavbar />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Seller Header */}
          <div className="bg-secondary/50 backdrop-blur-lg rounded-xl p-6 mb-6">
            <div className="flex items-start gap-6">
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-textPrimary mb-2">
                  {seller?.username}
                </h1>
                <div className="flex flex-col sm:flex-row gap-2 mb-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm inline-flex items-center w-fit ${
                      seller?.seller_status === "verified"
                        ? "bg-green-500/10 text-green-500"
                        : "bg-yellow-500/10 text-yellow-500"
                    }`}
                  >
                    {seller?.seller_status === "verified"
                      ? "Verified Seller"
                      : "Pending Verification"}
                  </span>
                  <span className="text-textSecondary text-sm">
                    Member since{" "}
                    {new Date(seller?.created_at).toLocaleDateString()}
                  </span>
                </div>
                {seller?.telegram_username && (
                  <a
                    href={`https://t.me/${seller.telegram_username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-accent hover:text-accent/80 transition-colors text-sm"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18.716-3.818 15.515-3.818 15.515-.121.487-.477.645-.773.645-.418 0-.706-.268-.944-.511l-4.033-3.458-1.591 1.434c-.122.098-.244.146-.366.146-.245 0-.489-.171-.489-.416v-4.584l7.142-6.689c.198-.183.198-.549-.122-.549-.074 0-.171.024-.269.098l-8.733 5.555-3.624-1.263c-.489-.171-.538-.549-.05-.818l14.909-5.825c.416-.171.806.122.806.549 0 .073-.025.171-.049.171z" />
                    </svg>
                    <span>@{seller.telegram_username}</span>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-secondary/30 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-accent">
                {seller?.total_sales || 0}
              </p>
              <p className="text-sm text-textSecondary">Total Sales</p>
            </div>
            <div className="bg-secondary/30 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-accent">
                {seller?.total_listings || 0}
              </p>
              <p className="text-sm text-textSecondary">Total Listings</p>
            </div>
            <div className="bg-secondary/30 rounded-lg p-4 text-center col-span-2 sm:col-span-1">
              <p className="text-2xl font-bold text-accent">
                {seller?.account_types?.length || 0}
              </p>
              <p className="text-sm text-textSecondary">Account Types</p>
            </div>
          </div>

          {/* Account Types */}
          {seller?.account_types && seller.account_types.length > 0 && (
            <div className="bg-secondary/30 rounded-lg p-6 mb-6">
              <h2 className="text-lg font-semibold text-textPrimary mb-4">
                Account Types
              </h2>
              <div className="flex flex-wrap gap-2">
                {seller.account_types.map((type, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-secondary/50 rounded-full text-sm text-textSecondary"
                  >
                    {type}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Active Listings */}
          <div className="bg-secondary/30 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-textPrimary mb-4">
              Active Listings
            </h2>
            <div className="grid gap-4">
              {listings.map((listing) => (
                <div
                  key={listing.id}
                  className="bg-secondary/50 rounded-lg p-4 hover:bg-secondary/70 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-textPrimary font-medium">
                        {listing.title}
                      </h3>
                      <p className="text-sm text-textSecondary">
                        {listing.description}
                      </p>
                    </div>
                    <p className="text-accent font-bold">₱{listing.price}</p>
                  </div>
                </div>
              ))}
              {listings.length === 0 && (
                <p className="text-textSecondary text-center py-4">
                  No active listings
                </p>
              )}
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

export default SellerProfile;
