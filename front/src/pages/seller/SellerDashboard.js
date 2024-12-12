import { motion } from "framer-motion";

function SellerDashboard() {
  // Mock seller data
  const sellerStats = {
    totalSales: "₱12,450",
    monthlyRevenue: "₱3,890",
    activeListings: 15,
    pendingOrders: 3,
  };

  const recentOrders = [
    {
      id: "ORD123",
      buyer: "JohnDoe",
      product: "Netflix Premium",
      price: "₱199",
      status: "pending",
      date: "2024-03-20",
    },
    {
      id: "ORD122",
      buyer: "AliceSmith",
      product: "Spotify Premium",
      price: "₱90",
      status: "completed",
      date: "2024-03-19",
    },
  ];

  const listings = [
    {
      id: "LST001",
      product: "Netflix Premium",
      price: "₱199",
      duration: "1 Month",
      inStock: true,
      sales: 12,
    },
    {
      id: "LST002",
      product: "Spotify Premium",
      price: "₱90",
      duration: "1 Month",
      inStock: false,
      sales: 15,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-secondary/50 backdrop-blur-lg rounded-xl p-4">
          <p className="text-sm text-textSecondary mb-1">Total Sales</p>
          <p className="text-xl font-bold text-accent">
            {sellerStats.totalSales}
          </p>
        </div>
        <div className="bg-secondary/50 backdrop-blur-lg rounded-xl p-4">
          <p className="text-sm text-textSecondary mb-1">Monthly Revenue</p>
          <p className="text-xl font-bold text-accent">
            {sellerStats.monthlyRevenue}
          </p>
        </div>
        <div className="bg-secondary/50 backdrop-blur-lg rounded-xl p-4">
          <p className="text-sm text-textSecondary mb-1">Active Listings</p>
          <p className="text-xl font-bold text-accent">
            {sellerStats.activeListings}
          </p>
        </div>
        <div className="bg-secondary/50 backdrop-blur-lg rounded-xl p-4">
          <p className="text-sm text-textSecondary mb-1">Pending Orders</p>
          <p className="text-xl font-bold text-accent">
            {sellerStats.pendingOrders}
          </p>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-secondary/50 backdrop-blur-lg rounded-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-textPrimary">
            Recent Orders
          </h2>
          <button className="text-sm text-accent hover:text-accent/80 transition-colors">
            View All
          </button>
        </div>
        <div className="space-y-4">
          {recentOrders.map((order) => (
            <div
              key={order.id}
              className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg"
            >
              <div>
                <p className="text-sm font-medium text-textPrimary">
                  {order.product}
                </p>
                <p className="text-xs text-textSecondary">
                  Buyer: {order.buyer} • {order.date}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-accent">{order.price}</p>
                <span
                  className={`text-xs ${
                    order.status === "completed"
                      ? "text-green-500"
                      : "text-yellow-500"
                  }`}
                >
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Listings */}
      <div className="bg-secondary/50 backdrop-blur-lg rounded-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-textPrimary">
            My Listings
          </h2>
          <button className="text-sm bg-accent text-white px-4 py-2 rounded-lg hover:bg-accent/90 transition-colors">
            Add New Listing
          </button>
        </div>
        <div className="space-y-4">
          {listings.map((listing) => (
            <div
              key={listing.id}
              className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg"
            >
              <div>
                <p className="text-sm font-medium text-textPrimary">
                  {listing.product}
                </p>
                <p className="text-xs text-textSecondary">
                  Duration: {listing.duration}
                </p>
              </div>
              <div className="text-right flex flex-col items-end gap-1">
                <p className="text-sm text-accent">{listing.price}</p>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    listing.inStock
                      ? "bg-green-500/10 text-green-500"
                      : "bg-red-500/10 text-red-500"
                  }`}
                >
                  {listing.inStock ? "In Stock" : "Out of Stock"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button className="p-4 bg-secondary/30 rounded-lg text-sm text-textPrimary hover:bg-secondary/50 transition-colors">
          Manage Listings
        </button>
        <button className="p-4 bg-secondary/30 rounded-lg text-sm text-textPrimary hover:bg-secondary/50 transition-colors">
          View Analytics
        </button>
        <button className="p-4 bg-secondary/30 rounded-lg text-sm text-textPrimary hover:bg-secondary/50 transition-colors">
          Support Tickets
        </button>
      </div>
    </motion.div>
  );
}

export default SellerDashboard;
