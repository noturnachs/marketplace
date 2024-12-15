import { useState, useEffect } from "react";
import { listingService } from "../../../services/listingService";
import { categories, getCategoryByName } from "../../../config/categories";

function ListingsTab() {
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
    features: [],
    in_stock: true,
  });
  const [newFeature, setNewFeature] = useState("");

  useEffect(() => {
    fetchListings();
  }, []);

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
        console.log("Updating listing with data:", {
          listingId: editingListing.id,
          formData,
        });
        await listingService.update(editingListing.id, formData);
      } else {
        console.log("Creating new listing with data:", formData);
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
        features: [],
        in_stock: true,
      });
      fetchListings();
    } catch (error) {
      console.error("Error submitting listing:", error);
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
    console.log("Editing listing:", listing);
    setEditingListing(listing);
    const formDataToSet = {
      title: listing.title,
      description: listing.description,
      price: listing.price,
      category: listing.category,
      duration: listing.duration,
      features: listing.features,
      in_stock: listing.in_stock ?? true,
    };
    console.log("Setting form data:", formDataToSet);
    setFormData(formDataToSet);
    setIsAddingListing(true);
  };

  const addFeature = (e) => {
    e.preventDefault();
    if (newFeature.trim()) {
      setFormData({
        ...formData,
        features: [...formData.features, newFeature.trim()],
      });
      setNewFeature("");
    }
  };

  const removeFeature = (index) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="space-y-6">
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
                features: [],
                in_stock: true,
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
          <form
            onSubmit={handleSubmit}
            className="bg-secondary/30 rounded-xl p-6 mb-6"
          >
            <div className="space-y-6">
              {/* Form Header */}
              <div className="border-b border-white/10 pb-4">
                <h2 className="text-lg font-semibold text-textPrimary">
                  {editingListing ? "Edit Listing" : "Create New Listing"}
                </h2>
                <p className="text-sm text-textSecondary mt-1">
                  Fill in the details below to{" "}
                  {editingListing ? "update your" : "create a new"} listing
                </p>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-4">
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-textSecondary mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Netflix Premium Subscription"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      className="w-full bg-secondary/50 rounded-lg px-4 py-2 text-textPrimary placeholder:text-textSecondary/50"
                      required
                    />
                  </div>

                  {/* Price */}
                  <div>
                    <label className="block text-sm font-medium text-textSecondary mb-1">
                      Price
                    </label>
                    <input
                      type="number"
                      placeholder="e.g., 100"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({ ...formData, price: e.target.value })
                      }
                      className="w-full bg-secondary/50 rounded-lg px-4 py-2 text-textPrimary placeholder:text-textSecondary/50 no-spinner"
                      required
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-textSecondary mb-1">
                      Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      className="w-full bg-secondary/50 rounded-lg px-4 py-2 text-textPrimary"
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.name}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Duration */}
                  <div>
                    <label className="block text-sm font-medium text-textSecondary mb-1">
                      Duration
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., 1 month"
                      value={formData.duration}
                      onChange={(e) =>
                        setFormData({ ...formData, duration: e.target.value })
                      }
                      className="w-full bg-secondary/50 rounded-lg px-4 py-2 text-textPrimary placeholder:text-textSecondary/50"
                      required
                    />
                  </div>

                  {/* In Stock Toggle */}
                  <div>
                    <label className="block text-sm font-medium text-textSecondary mb-1">
                      Stock Status
                    </label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            in_stock: !formData.in_stock,
                          })
                        }
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          formData.in_stock ? "bg-green-500" : "bg-gray-500"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            formData.in_stock
                              ? "translate-x-6"
                              : "translate-x-1"
                          }`}
                        />
                      </button>
                      <span className="text-sm text-textSecondary">
                        {formData.in_stock ? "In Stock" : "Out of Stock"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-textSecondary mb-1">
                      Description
                    </label>
                    <textarea
                      placeholder="Describe your listing in detail..."
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      className="w-full h-[120px] bg-secondary/50 rounded-lg px-4 py-2 text-textPrimary placeholder:text-textSecondary/50 resize-none"
                      required
                    />
                  </div>

                  {/* Features */}
                  <div>
                    <label className="block text-sm font-medium text-textSecondary mb-1">
                      Features
                    </label>
                    <div className="space-y-2 mb-2">
                      {formData.features.map((feature, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 bg-secondary/50 rounded-lg p-2"
                        >
                          <span className="text-sm text-textPrimary flex-1">
                            {feature}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeFeature(index)}
                            className="text-red-500 hover:text-red-500/80 transition-colors"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Add a feature..."
                        value={newFeature}
                        onChange={(e) => setNewFeature(e.target.value)}
                        className="flex-1 bg-secondary/50 rounded-lg px-4 py-2 text-textPrimary text-sm placeholder:text-textSecondary/50"
                      />
                      <button
                        type="button"
                        onClick={addFeature}
                        className="bg-accent text-white px-4 py-2 rounded-lg text-sm whitespace-nowrap hover:bg-accent/90 transition-colors"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-2 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingListing(false);
                    setEditingListing(null);
                  }}
                  className="px-4 py-2 bg-secondary/50 text-textSecondary rounded-lg text-sm hover:text-textPrimary transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-accent text-white rounded-lg text-sm hover:bg-accent/90 transition-colors"
                >
                  {editingListing ? "Update" : "Create"} Listing
                </button>
              </div>
            </div>
          </form>
        )}

        {isLoading ? (
          <p className="text-center text-textSecondary">Loading listings...</p>
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
                    {Icon && <Icon className={`w-5 h-5 ${category.color}`} />}
                    <div>
                      <h3 className="font-medium text-textPrimary flex items-center gap-2">
                        {listing.title}
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            listing.in_stock
                              ? "bg-green-500/10 text-green-500 border border-green-500/20"
                              : "bg-red-500/10 text-red-500 border border-red-500/20"
                          }`}
                        >
                          {listing.in_stock ? "In Stock" : "Out of Stock"}
                        </span>
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
    </div>
  );
}

export default ListingsTab;
