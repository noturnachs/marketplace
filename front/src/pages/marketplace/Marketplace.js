import { useState } from "react";
import { motion } from "framer-motion";

function Marketplace() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = [
    "All",
    "AI Sites/Apps",
    "Music Prems",
    "Ent. Prems",
    "Educational/Office Prems",
    "Productivity Prems",
    "Photo Editing Prems",
    "VPN Prems",
    "Unlocks",
    "OTP Services",
    "Smart/Globe GB",
  ];

  const listings = [
    {
      id: "LST001",
      product: "Netflix Premium",
      price: 199,
      duration: "1 Month",
      seller: "PremiumSeller",
      category: "Ent. Prems",
      inStock: true,
      description: "UHD/4K Quality • 4 Screens • No Sharing",
      rating: 4.8,
      sales: 150,
    },
    {
      id: "LST002",
      product: "Spotify Premium",
      price: 90,
      duration: "1 Month",
      seller: "MusicDeals",
      category: "Music Prems",
      inStock: true,
      description: "Individual Plan • Ad-free • Offline Mode",
      rating: 4.9,
      sales: 200,
    },
    {
      id: "LST003",
      product: "ChatGPT Plus",
      price: 299,
      duration: "1 Month",
      seller: "AIProvider",
      category: "AI Sites/Apps",
      inStock: false,
      description: "GPT-4 • DALL-E • Advanced Features",
      rating: 4.7,
      sales: 85,
    },
  ];

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
    alert(`Successfully purchased ${listing.product}!`);
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
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? "bg-accent text-white"
                  : "bg-secondary/30 text-textSecondary hover:text-textPrimary"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Listings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredListings.map((listing) => (
          <motion.div
            key={listing.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-secondary/50 backdrop-blur-lg rounded-xl p-6 space-y-4"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-textPrimary">
                  {listing.product}
                </h3>
                <p className="text-sm text-textSecondary">{listing.duration}</p>
              </div>
              <p className="text-lg font-bold text-accent">
                {listing.price} <span className="text-sm">coins</span>
              </p>
            </div>

            <p className="text-sm text-textSecondary">{listing.description}</p>

            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-2">
                <span className="text-textSecondary">Seller:</span>
                <span className="text-textPrimary">{listing.seller}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-yellow-500">★</span>
                <span className="text-textPrimary">{listing.rating}</span>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  listing.inStock
                    ? "bg-green-500/10 text-green-500"
                    : "bg-red-500/10 text-red-500"
                }`}
              >
                {listing.inStock ? "In Stock" : "Out of Stock"}
              </span>
              <button
                onClick={() => handlePurchase(listing)}
                disabled={!listing.inStock}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  listing.inStock
                    ? "bg-accent text-white hover:bg-accent/90 transition-colors"
                    : "bg-secondary/30 text-textSecondary cursor-not-allowed"
                }`}
              >
                Purchase
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

export default Marketplace;
