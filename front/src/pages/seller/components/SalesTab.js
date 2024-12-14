import { useState, useEffect } from "react";
import { purchaseService } from "../../../services/purchaseService";
import SendAccountModal from "../../../components/SendAccountModal";

function SalesTab() {
  const [sales, setSales] = useState([]);
  const [error, setError] = useState(null);
  const [showSendAccountModal, setShowSendAccountModal] = useState(false);
  const [selectedSaleId, setSelectedSaleId] = useState(null);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [totalCompletedSales, setTotalCompletedSales] = useState(0);
  const [totalPendingSales, setTotalPendingSales] = useState(0);

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    try {
      const salesData = await purchaseService.getMySales();
      setSales(salesData.sales);
      setTotalCompletedSales(salesData.totalCompletedSales);
      setTotalPendingSales(salesData.totalPendingSales);
    } catch (error) {
      console.error("Error fetching sales:", error);
    }
  };

  const handleSendAccount = (saleId) => {
    setSelectedSaleId(saleId);
    setShowSendAccountModal(true);
  };

  const handleSubmitAccountDetails = async (accountDetails) => {
    try {
      setIsPurchasing(true);
      await purchaseService.updateStatus(selectedSaleId, {
        status: "completed",
        account_details: accountDetails,
      });
      setShowSendAccountModal(false);
      fetchSales();
    } catch (error) {
      setError(error.message);
    } finally {
      setIsPurchasing(false);
    }
  };

  const handleCancelOrder = async (saleId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;

    try {
      await purchaseService.updateStatus(saleId, {
        status: "cancelled",
      });
      fetchSales();
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Sales Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-secondary/30 rounded-lg p-4">
          <p className="text-sm text-textSecondary">Total Sales</p>
          <p className="text-2xl font-semibold text-textPrimary">
            {sales.length}
          </p>
        </div>
        <div className="bg-secondary/30 rounded-lg p-4">
          <p className="text-sm text-textSecondary">Completed Sales</p>
          <p className="text-2xl font-semibold text-green-500">
            {totalCompletedSales}
          </p>
        </div>
        <div className="bg-secondary/30 rounded-lg p-4">
          <p className="text-sm text-textSecondary">Pending Sales</p>
          <p className="text-2xl font-semibold text-yellow-500">
            {totalPendingSales}
          </p>
        </div>
      </div>

      {/* Sales List */}
      <div className="bg-secondary/30 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-textPrimary mb-4">
          Sales History
        </h2>
        <div className="space-y-4">
          {sales.length === 0 ? (
            <p className="text-center text-textSecondary py-4">
              No sales yet. Your sales will appear here.
            </p>
          ) : (
            sales.map((sale) => (
              <div key={sale.id} className="bg-secondary/50 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-medium text-textPrimary">
                      {sale.listing_title}
                    </h3>
                    <p className="text-sm text-textSecondary">
                      Purchased by {sale.buyer_name}
                    </p>
                    <p className="text-xs text-textSecondary">
                      {new Date(sale.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <p className="text-accent font-medium">
                    ₱{parseFloat(sale.amount).toFixed(2)}
                  </p>
                </div>

                <div className="border-t border-white/10 pt-3 mt-3">
                  {sale.status === "awaiting_seller" ? (
                    <>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                        <p className="text-sm text-yellow-500 font-medium">
                          Action Required
                        </p>
                      </div>
                      <p className="text-sm text-textSecondary mb-3">
                        Please send the account details to complete this order
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSendAccount(sale.id)}
                          className="px-3 py-1.5 bg-accent text-white text-sm rounded-lg hover:bg-accent/90 transition-colors"
                        >
                          Send Account Details
                        </button>
                        <button
                          onClick={() => handleCancelOrder(sale.id)}
                          className="px-3 py-1.5 bg-secondary/50 text-textSecondary text-sm rounded-lg hover:text-textPrimary transition-colors"
                        >
                          Cancel Order
                        </button>
                      </div>
                    </>
                  ) : sale.status === "completed" ? (
                    <>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <p className="text-sm text-green-500 font-medium">
                          {sale.is_confirmed
                            ? "Completed & Confirmed"
                            : "Completed (Awaiting Buyer Confirmation)"}
                        </p>
                      </div>
                      <div className="mt-2 bg-secondary/30 rounded-lg p-3">
                        <p className="text-sm text-textSecondary mb-1">
                          Account Details:
                        </p>
                        <p className="text-sm text-textPrimary font-mono whitespace-pre-wrap break-words max-w-[500px]">
                          {sale.account_details}
                        </p>
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <p className="text-sm text-red-500">Order Cancelled</p>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <SendAccountModal
        isOpen={showSendAccountModal}
        onClose={() => setShowSendAccountModal(false)}
        onSubmit={handleSubmitAccountDetails}
        isLoading={isPurchasing}
      />
    </div>
  );
}

export default SalesTab;
