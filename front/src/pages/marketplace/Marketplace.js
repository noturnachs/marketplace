import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { listingService } from "../../services/listingService";
import { categories, getCategoryByName } from "../../config/categories";
import LoadingSpinner from "../../components/LoadingSpinner";
import debounce from "lodash/debounce";

function Marketplace() {
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      const data = await listingService.getAll();
      setListings(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const debouncedSetSearch = useCallback(
    debounce((value) => {
      setDebouncedSearchQuery(value);
    }, 300),
    []
  );

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    debouncedSetSearch(e.target.value);
  };

  const filteredListings = listings.filter((listing) => {
    // If there's a search term, ignore category filter
    const searchTerm = debouncedSearchQuery.toLowerCase().trim();
    if (searchTerm) {
      return (
        listing.title.toLowerCase().includes(searchTerm) ||
        listing.description.toLowerCase().includes(searchTerm) ||
        listing.seller_name.toLowerCase().includes(searchTerm) ||
        listing.category.toLowerCase().includes(searchTerm) ||
        (listing.price && listing.price.toString().includes(searchTerm))
      );
    }

    // If no search term, apply category filter only
    return selectedCategory === "all" || listing.category === selectedCategory;
  });

  if (isLoading) return <LoadingSpinner />;
  if (error)
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-lg">
          {error}
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-primary">
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col gap-6">
          {/* Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <svg
                className="w-5 h-5 text-textSecondary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search listings..."
              value={searchQuery}
              onChange={(e) => handleSearch(e)}
              className="w-full bg-secondary/50 backdrop-blur-lg rounded-xl pl-10 pr-4 py-2 text-textPrimary placeholder:text-textSecondary focus:outline-none focus:ring-2 focus:ring-accent/50"
            />
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === "all"
                  ? "bg-accent text-white"
                  : "bg-secondary/50 text-textSecondary hover:text-textPrimary"
              }`}
            >
              All Categories
            </button>
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.name)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === category.name
                      ? "bg-accent text-white"
                      : "bg-secondary/50 text-textSecondary hover:text-textPrimary"
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 ${
                      selectedCategory === category.name
                        ? "text-white"
                        : category.color
                    }`}
                  />
                  {category.name}
                </button>
              );
            })}
          </div>

          {/* Listings Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map((listing) => {
              const category = getCategoryByName(listing.category);
              const Icon = category?.icon;

              return (
                <motion.div
                  key={listing.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-secondary/50 backdrop-blur-lg rounded-xl p-6 space-y-4 cursor-pointer hover:bg-secondary/60 transition-colors"
                  onClick={() => navigate(`/marketplace/${listing.id}`)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        {Icon && (
                          <Icon className={`w-5 h-5 ${category.color}`} />
                        )}
                        <h3 className="text-sm font-semibold text-textPrimary">
                          {listing.title}
                        </h3>
                      </div>
                      <p className="text-xs text-textSecondary">
                        {listing.duration}
                      </p>
                    </div>
                    <p className="text-sm font-bold text-accent">
                      ₱{listing.price} <span className="text-sm">coins</span>
                    </p>
                  </div>

                  <p className="text-xs text-textSecondary line-clamp-2">
                    {listing.description}
                  </p>

                  <div className="flex justify-between items-center">
                    <p className="text-xs text-textSecondary">
                      Seller: {listing.seller_name}
                    </p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/marketplace/${listing.id}`);
                      }}
                      className="bg-accent text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-accent/90 transition-colors"
                    >
                      View Details
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Marketplace;
