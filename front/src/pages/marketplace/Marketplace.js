import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { listingService } from "../../services/listingService";
import { categories, getCategoryByName } from "../../config/categories";
import LoadingSpinner from "../../components/LoadingSpinner";

function Marketplace() {
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

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

  const filteredListings = listings.filter((listing) => {
    const matchesCategory =
      selectedCategory === "all" || listing.category === selectedCategory;
    const matchesSearch = listing.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
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
            <input
              type="text"
              placeholder="Search listings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-secondary/50 backdrop-blur-lg rounded-xl px-4 py-2 text-textPrimary placeholder:text-textSecondary focus:outline-none focus:ring-2 focus:ring-accent/50"
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
                        <h3 className="text-lg font-semibold text-textPrimary">
                          {listing.title}
                        </h3>
                      </div>
                      <p className="text-sm text-textSecondary">
                        {listing.duration}
                      </p>
                    </div>
                    <p className="text-lg font-bold text-accent">
                      ₱{listing.price} <span className="text-sm">coins</span>
                    </p>
                  </div>

                  <p className="text-sm text-textSecondary line-clamp-2">
                    {listing.description}
                  </p>

                  <div className="flex justify-between items-center">
                    <p className="text-sm text-textSecondary">
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
