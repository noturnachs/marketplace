import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { paymentService } from "../../services/paymentService";
import DashboardNavbar from "../../components/DashboardNavbar";

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("pending");
  const [pendingPayments, setPendingPayments] = useState([]);
  const [allPayments, setAllPayments] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [stats, setStats] = useState({
    pendingCount: 0,
    processedToday: 0,
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPayments();
  }, []);

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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  Pending Requests
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

            {/* Payments Table */}
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
                          <p className="text-textPrimary">{payment.username}</p>
                          <p className="text-xs text-textSecondary">
                            {payment.user_id}
                          </p>
                        </div>
                      </td>
                      <td className="py-4">
                        <div>
                          <p className="text-textPrimary">₱{payment.amount}</p>
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
          </div>
        </motion.div>
      </main>
    </div>
  );
}

export default AdminDashboard;
