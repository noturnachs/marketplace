import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { listingService } from "../../services/listingService";
import { categories, getCategoryByName } from "../../config/categories";

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
  });

  useEffect(() => {
    if (sellerStatus === "verified") {
      fetchListings();
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
    });
    setIsAddingListing(true);
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
          {/* Stats Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-secondary/30 rounded-lg p-4">
              <p className="text-sm text-textSecondary">Total Sales</p>
              <p className="text-2xl font-semibold text-textPrimary">₱0.00</p>
            </div>
            <div className="bg-secondary/30 rounded-lg p-4">
              <p className="text-sm text-textSecondary">Active Listings</p>
              <p className="text-2xl font-semibold text-textPrimary">
                {listings.length}
              </p>
            </div>
            <div className="bg-secondary/30 rounded-lg p-4">
              <p className="text-sm text-textSecondary">Completed Orders</p>
              <p className="text-2xl font-semibold text-textPrimary">0</p>
            </div>
            <div className="bg-secondary/30 rounded-lg p-4">
              <p className="text-sm text-textSecondary">Rating</p>
              <p className="text-2xl font-semibold text-textPrimary">N/A</p>
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
              <form onSubmit={handleSubmit} className="mb-6 space-y-4">
                <input
                  type="text"
                  placeholder="Title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full bg-secondary/50 rounded-lg px-4 py-2 text-textPrimary"
                  required
                />
                <textarea
                  placeholder="Description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full bg-secondary/50 rounded-lg px-4 py-2 text-textPrimary"
                  required
                />
                <input
                  type="number"
                  placeholder="Price"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  className="w-full bg-secondary/50 rounded-lg px-4 py-2 text-textPrimary"
                  required
                />
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full bg-secondary/50 rounded-lg px-4 py-2 text-textPrimary"
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => {
                    const Icon = category.icon;
                    return (
                      <option key={category.id} value={category.name}>
                        {category.name}
                      </option>
                    );
                  })}
                </select>
                <input
                  type="text"
                  placeholder="Duration (e.g., 30 days)"
                  value={formData.duration}
                  onChange={(e) =>
                    setFormData({ ...formData, duration: e.target.value })
                  }
                  className="w-full bg-secondary/50 rounded-lg px-4 py-2 text-textPrimary"
                  required
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="bg-accent text-white px-4 py-2 rounded-lg text-sm"
                  >
                    {editingListing ? "Update" : "Create"} Listing
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingListing(false);
                      setEditingListing(null);
                    }}
                    className="bg-secondary/50 text-textSecondary px-4 py-2 rounded-lg text-sm"
                  >
                    Cancel
                  </button>
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
    </motion.div>
  );
}

export default SellerDashboard;
