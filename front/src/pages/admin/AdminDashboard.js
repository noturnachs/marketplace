import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { paymentService } from "../../services/paymentService";
import { sellerService } from "../../services/sellerService";
import DashboardNavbar from "../../components/DashboardNavbar";

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("pending");
  const [pendingPayments, setPendingPayments] = useState([]);
  const [allPayments, setAllPayments] = useState([]);
  const [pendingSellers, setPendingSellers] = useState([]);
  const [allSellers, setAllSellers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [stats, setStats] = useState({
    pendingCount: 0,
    processedToday: 0,
    pendingSellers: 0,
  });
  const [error, setError] = useState(null);
  const [isUpdatingFee, setIsUpdatingFee] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      await Promise.all([fetchPayments(), fetchSellers()]);
    } catch (error) {
      setError(error.message);
    }
  };

  const fetchSellers = async () => {
    const pending = await sellerService.getPendingSellers();
    const all = await sellerService.getAllSellers();
    setPendingSellers(pending);
    setAllSellers(all);
    setStats((prev) => ({
      ...prev,
      pendingSellers: pending.length,
    }));
  };

  const fetchPayments = async () => {
    try {
      const pending = await paymentService.getPendingPayments();
      const all = await paymentService.getAllPayments();
      setPendingPayments(pending);
      setAllPayments(all);

      // Calculate stats
      const today = new Date().toISOString().split("T")[0];
      const processedToday = all.filter(
        (p) =>
          p.updated_at?.startsWith(today) &&
          (p.status === "approved" || p.status === "rejected")
      ).length;

      setStats({
        pendingCount: pending.length,
        processedToday,
      });
    } catch (error) {
      setError(error.message);
    }
  };

  const handleStatusUpdate = async (referenceId, newStatus) => {
    try {
      await paymentService.updatePaymentStatus(referenceId, newStatus);
      await fetchPayments(); // Refresh all data
      alert(`Payment ${newStatus} successfully`);
    } catch (error) {
      console.error("Error updating payment status:", error);
      alert("Failed to update payment status");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const filteredPayments = allPayments.filter((payment) =>
    payment.reference_id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const displayPayments =
    activeTab === "pending" ? pendingPayments : filteredPayments;

  const handleSellerVerification = async (sellerId, status) => {
    try {
      // Update seller status - notification will be sent automatically from backend
      await sellerService.updateStatus(sellerId, status);

      // Refresh the sellers list
      await fetchSellers();

      // Show success message
      alert(`Seller ${status} successfully`);
    } catch (error) {
      console.error("Error updating seller status:", error);
      alert("Failed to update seller status");
    }
  };

  const handleFeeExemption = async (sellerId, currentExemption) => {
    try {
      setIsUpdatingFee(true);
      await sellerService.updateFeeExemption(sellerId, !currentExemption);
      await fetchSellers(); // Refresh the sellers list
      alert(
        `Fee exemption ${
          !currentExemption ? "enabled" : "disabled"
        } successfully`
      );
    } catch (error) {
      console.error("Error updating fee exemption:", error);
      alert("Failed to update fee exemption");
    } finally {
      setIsUpdatingFee(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary">
      <DashboardNavbar />

      <main className="max-w-6xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Header and Stats */}
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-textPrimary">
              Admin Dashboard
            </h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-secondary/50 backdrop-blur-lg rounded-xl p-6">
              <h3 className="text-sm text-textSecondary mb-2">
                Pending Payments
              </h3>
              <p className="text-2xl font-bold text-accent">
                {stats.pendingCount}
              </p>
            </div>
            <div className="bg-secondary/50 backdrop-blur-lg rounded-xl p-6">
              <h3 className="text-sm text-textSecondary mb-2">
                Processed Today
              </h3>
              <p className="text-2xl font-bold text-accent">
                {stats.processedToday}
              </p>
            </div>
            <div className="bg-secondary/50 backdrop-blur-lg rounded-xl p-6">
              <h3 className="text-sm text-textSecondary mb-2">
                Pending Sellers
              </h3>
              <p className="text-2xl font-bold text-accent">
                {stats.pendingSellers}
              </p>
            </div>
          </div>

          {/* Tabs and Search */}
          <div className="bg-secondary/50 backdrop-blur-lg rounded-xl p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="flex gap-4">
                <button
                  onClick={() => setActiveTab("pending")}
                  className={`text-sm font-medium ${
                    activeTab === "pending"
                      ? "text-accent"
                      : "text-textSecondary hover:text-textPrimary"
                  }`}
                >
                  Pending Payments
                </button>
                <button
                  onClick={() => setActiveTab("all")}
                  className={`text-sm font-medium ${
                    activeTab === "all"
                      ? "text-accent"
                      : "text-textSecondary hover:text-textPrimary"
                  }`}
                >
                  All Payments
                </button>
                <button
                  onClick={() => setActiveTab("sellers")}
                  className={`text-sm font-medium ${
                    activeTab === "sellers"
                      ? "text-accent"
                      : "text-textSecondary hover:text-textPrimary"
                  }`}
                >
                  Seller Verification
                </button>
              </div>
              {activeTab === "all" && (
                <div className="w-full sm:w-auto">
                  <input
                    type="text"
                    placeholder="Search by reference ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2 bg-secondary/30 rounded-lg text-sm text-textPrimary placeholder-textSecondary focus:outline-none focus:ring-2 focus:ring-accent/50"
                  />
                </div>
              )}
            </div>

            {/* Sellers Table */}
            {activeTab === "sellers" && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-sm text-textSecondary">
                      <th className="pb-4">Username</th>
                      <th className="pb-4">Email</th>
                      <th className="pb-4">Account Types</th>
                      <th className="pb-4">Exp</th>
                      <th className="pb-4">Vouches</th>
                      <th className="pb-4">Status</th>
                      <th className="pb-4">Fee Status</th>
                      <th className="pb-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {allSellers.map((seller) => (
                      <tr key={seller.id} className="border-t border-white/5">
                        <td className="py-4 text-textPrimary">
                          {seller.username}
                        </td>
                        <td className="py-4 text-textPrimary">
                          {seller.email}
                        </td>
                        <td className="py-4">
                          <div className="flex flex-wrap gap-1">
                            {seller.account_types?.map((type) => (
                              <span
                                key={type}
                                className="px-2 py-1 bg-secondary/30 rounded-full text-xs text-textSecondary"
                              >
                                {type}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="py-4 text-textPrimary">
                          {seller.selling_experience || "Not specified"}
                        </td>
                        <td className="py-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span
                                className={`w-2 h-2 rounded-full ${
                                  seller.has_vouches
                                    ? "bg-green-500"
                                    : "bg-red-500"
                                }`}
                              ></span>
                              <span>{seller.has_vouches ? "Yes" : "No"}</span>
                            </div>
                            {seller.vouch_link && (
                              <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                                <a
                                  href={seller.vouch_link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-500"
                                >
                                  View Vouches
                                </a>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="py-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              seller.seller_status === "verified"
                                ? "bg-green-500/10 text-green-500"
                                : seller.seller_status === "pending"
                                ? "bg-yellow-500/10 text-yellow-500"
                                : "bg-red-500/10 text-red-500"
                            }`}
                          >
                            {seller.seller_status}
                          </span>
                        </td>
                        <td className="py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                handleFeeExemption(seller.id, seller.fee_exempt)
                              }
                              disabled={isUpdatingFee}
                              className={`px-3 py-1 rounded-lg text-xs transition-colors ${
                                seller.fee_exempt
                                  ? "bg-green-500/10 text-green-500 hover:bg-green-500/20"
                                  : "bg-red-500/10 text-red-500 hover:bg-red-500/20"
                              }`}
                            >
                              {seller.fee_exempt
                                ? "Fee Exempt"
                                : "Standard Fee"}
                            </button>
                          </div>
                        </td>
                        <td className="py-4">
                          <div className="flex gap-2">
                            {seller.seller_status === "pending" && (
                              <>
                                <button
                                  onClick={() =>
                                    handleSellerVerification(
                                      seller.id,
                                      "verified"
                                    )
                                  }
                                  className="px-3 py-1 bg-green-500/10 text-green-500 rounded-lg text-xs hover:bg-green-500/20 transition-colors"
                                >
                                  Verify
                                </button>
                                <button
                                  onClick={() =>
                                    handleSellerVerification(
                                      seller.id,
                                      "rejected"
                                    )
                                  }
                                  className="px-3 py-1 bg-red-500/10 text-red-500 rounded-lg text-xs hover:bg-red-500/20 transition-colors"
                                >
                                  Reject
                                </button>
                              </>
                            )}
                            {seller.seller_status === "rejected" && (
                              <button
                                onClick={() =>
                                  handleSellerVerification(
                                    seller.id,
                                    "verified"
                                  )
                                }
                                className="px-3 py-1 bg-green-500/10 text-green-500 rounded-lg text-xs hover:bg-green-500/20 transition-colors"
                              >
                                Verify
                              </button>
                            )}
                            {seller.seller_status === "verified" && (
                              <button
                                onClick={() =>
                                  handleSellerVerification(
                                    seller.id,
                                    "rejected"
                                  )
                                }
                                className="px-3 py-1 bg-red-500/10 text-red-500 rounded-lg text-xs hover:bg-red-500/20 transition-colors"
                              >
                                Suspend
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Payments Table */}
            {activeTab !== "sellers" && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-sm text-textSecondary">
                      <th className="pb-4">Date</th>
                      <th className="pb-4">User</th>
                      <th className="pb-4">Amount</th>
                      <th className="pb-4">Method</th>
                      <th className="pb-4">Reference</th>
                      <th className="pb-4">Status</th>
                      {activeTab === "pending" && (
                        <th className="pb-4">Actions</th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {displayPayments.map((payment) => (
                      <tr key={payment.id} className="border-t border-white/5">
                        <td className="py-4 text-textPrimary">
                          {formatDate(payment.created_at)}
                        </td>
                        <td className="py-4">
                          <div>
                            <p className="text-textPrimary">
                              {payment.username}
                            </p>
                            <p className="text-xs text-textSecondary">
                              {payment.user_id}
                            </p>
                          </div>
                        </td>
                        <td className="py-4">
                          <div>
                            <p className="text-textPrimary">
                              ₱{payment.amount}
                            </p>
                            <p className="text-xs text-textSecondary">
                              {payment.coins} coins
                            </p>
                          </div>
                        </td>
                        <td className="py-4 text-textPrimary">
                          {payment.payment_method}
                        </td>
                        <td className="py-4 text-textPrimary">
                          {payment.reference_id}
                        </td>
                        <td className="py-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              payment.status === "pending"
                                ? "bg-yellow-500/10 text-yellow-500"
                                : payment.status === "approved"
                                ? "bg-green-500/10 text-green-500"
                                : "bg-red-500/10 text-red-500"
                            }`}
                          >
                            {payment.status}
                          </span>
                        </td>
                        {activeTab === "pending" && (
                          <td className="py-4">
                            <div className="flex gap-2">
                              <button
                                onClick={() =>
                                  handleStatusUpdate(
                                    payment.reference_id,
                                    "approved"
                                  )
                                }
                                className="px-3 py-1 bg-green-500/10 text-green-500 rounded-lg text-xs hover:bg-green-500/20 transition-colors"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() =>
                                  handleStatusUpdate(
                                    payment.reference_id,
                                    "rejected"
                                  )
                                }
                                className="px-3 py-1 bg-red-500/10 text-red-500 rounded-lg text-xs hover:bg-red-500/20 transition-colors"
                              >
                                Reject
                              </button>
                            </div>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
}

export default AdminDashboard;
