import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { listingService } from "../../services/listingService";
import { categories, getCategoryByName } from "../../config/categories";
import { grid } from "ldrs";

function Marketplace() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [listings, setListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Configure loader
  grid.register();

  const allCategory = {
    id: "all",
    name: "All",
    icon: null,
    color: "text-accent",
  };

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

  const filteredListings =
    selectedCategory === "All"
      ? listings
      : listings.filter((listing) => listing.category === selectedCategory);

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
    window.location.reload();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Categories */}
      <div className="bg-secondary/50 backdrop-blur-lg rounded-xl p-6">
        <h2 className="text-lg font-semibold text-textPrimary mb-4">
          Categories
        </h2>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory("All")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedCategory === "All"
                ? "bg-accent text-white"
                : "bg-secondary/30 text-textSecondary hover:text-textPrimary"
            }`}
          >
            All
          </button>
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.name)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                  selectedCategory === category.name
                    ? "bg-accent text-white"
                    : "bg-secondary/30 text-textSecondary hover:text-textPrimary"
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
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-lg">
          {error}
        </div>
      )}

      {/* Loading State with ldrs animation */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <l-grid size="50" speed="1.5" color="white"></l-grid>
        </div>
      ) : (
        /* Listings Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredListings.length === 0 ? (
            <div className="col-span-full text-center text-textSecondary py-8">
              No listings found in this category.
            </div>
          ) : (
            filteredListings.map((listing) => {
              const category = getCategoryByName(listing.category);
              const Icon = category?.icon;

              return (
                <motion.div
                  key={listing.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-secondary/50 backdrop-blur-lg rounded-xl p-6 space-y-4"
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

                  <p className="text-sm text-textSecondary">
                    {listing.description}
                  </p>

                  <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-textSecondary">Seller:</span>
                      <span className="text-textPrimary">
                        {listing.seller_name}
                      </span>
                    </div>
                    <button
                      onClick={() => handlePurchase(listing)}
                      className="bg-accent/90 text-white px-4 py-1.5 rounded-lg hover:bg-accent transition-colors text-sm font-medium"
                    >
                      Purchase
                    </button>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      )}
    </motion.div>
  );
}

export default Marketplace;
