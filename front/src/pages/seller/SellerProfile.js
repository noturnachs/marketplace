import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardNavbar from "../../components/DashboardNavbar";
import { sellerService } from "../../services/sellerService";
import LoadingSpinner from "../../components/LoadingSpinner";

function SellerProfile() {
  const { sellerId } = useParams();
  const navigate = useNavigate();
  const [seller, setSeller] = useState(null);
  const [listings, setListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [profileData, listingsData, customizationData] =
          await Promise.all([
            sellerService.getSellerProfile(sellerId),
            sellerService.getSellerListings(sellerId),
            sellerService.getProfileCustomization(sellerId),
          ]);
        setSeller({
          ...profileData,
          primary_color: customizationData?.primary_color || "#17222e",
          secondary_color: customizationData?.secondary_color || "#182531",
          accent_color: customizationData?.accent_color || "#ffffff",
        });
        setListings(listingsData);
      } catch (error) {
        setError(error.message || "Failed to load seller profile");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [sellerId]);

  const handleListingClick = (listingId) => {
    navigate(`/marketplace/${listingId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-primary">
        <DashboardNavbar />
        <LoadingSpinner />
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
      <main
        className="max-w-4xl mx-auto px-4 py-8 rounded-lg mt-5"
        style={{ backgroundColor: seller?.primary_color }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Seller Header */}
          <div
            className="backdrop-blur-lg rounded-xl p-6 mb-6 transition-all duration-200"
            style={{ backgroundColor: seller?.secondary_color }}
          >
            <div className="flex items-start gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h1
                    className="text-2xl font-bold"
                    style={{ color: seller?.accent_color }}
                  >
                    {seller?.username}
                  </h1>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold inline-flex items-center ${
                      seller?.seller_status === "verified"
                        ? "bg-green-500/40 text-green-500"
                        : "bg-yellow-500/40 text-yellow-500"
                    }`}
                  >
                    {seller?.seller_status === "verified"
                      ? "Verified Seller"
                      : "Pending Verification"}
                  </span>
                </div>
                <div className="flex flex-col gap-y-2 mb-1">
                  <span className="text-xs text-yellow-500">
                    Member since{" "}
                    {new Date(seller?.created_at).toLocaleDateString()}
                  </span>
                  {seller?.has_vouches && seller?.vouch_link ? (
                    <a
                      href={seller.vouch_link}
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
                      Seller has no vouches, buy with care.
                    </div>
                  )}
                </div>
                {seller?.telegram_username && (
                  <a
                    href={`https://t.me/${seller.telegram_username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-accent hover:text-accent/80 transition-colors text-xs"
                  >
                    Contact: <span>@{seller.telegram_username}</span>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div
              className="rounded-lg p-6 text-center transition-all duration-200"
              style={{ backgroundColor: seller?.secondary_color }}
            >
              <p
                className="text-4xl font-bold mb-1"
                style={{ color: darkenHexColor(seller?.accent_color, 100) }}
              >
                {seller?.total_listings || 0}
              </p>
              <p
                className="text-sm font-bold"
                style={{ color: darkenHexColor(seller?.accent_color, -20) }}
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
                style={{ color: darkenHexColor(seller?.accent_color, 100) }}
              >
                {seller?.vouch_count || 0}
              </p>
              <p
                className="text-sm font-bold"
                style={{ color: darkenHexColor(seller?.accent_color, -20) }}
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
                style={{ color: darkenHexColor(seller?.accent_color, 100) }}
              >
                {seller?.account_types?.length || 0}
              </p>
              <p
                className="text-sm font-bold"
                style={{ color: darkenHexColor(seller?.accent_color, -20) }}
              >
                Account Types
              </p>
            </div>
          </div>

          {/* Account Types */}
          {seller?.account_types && seller.account_types.length > 0 && (
            <div
              className="rounded-lg p-6 mb-6 transition-all duration-200"
              style={{ backgroundColor: seller?.secondary_color }}
            >
              <h2
                className="text-lg font-bold mb-4"
                style={{ color: seller?.accent_color }}
              >
                Account Types
              </h2>
              <div className="flex flex-wrap gap-2">
                {seller.account_types.map((type, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 rounded-full text-xs font-regular transition-all duration-200 text-textSecondary"
                    style={{
                      backgroundColor: darkenHexColor(
                        seller?.accent_color,
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

          {/* Active Listings */}
          <div
            className="space-y-4  rounded-lg p-6"
            style={{ backgroundColor: seller?.secondary_color }}
          >
            <h2
              className="text-lg font-bold  "
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
                    backgroundColor: darkenHexColor(seller?.accent_color, 100),
                  }}
                  onClick={() => handleListingClick(listing.id)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium mb-1">{listing.title}</h3>
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
        </motion.div>
      </main>
    </div>
  );
}

export default SellerProfile;
