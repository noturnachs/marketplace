import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { paymentService } from "../../services/paymentService";
import qr100 from "./QRCodes/gcash-100.jpg";
import qr200 from "./QRCodes/gcash-200.jpg";
import qr300 from "./QRCodes/gcash-300.jpg";
import qr400 from "./QRCodes/gcash-400.jpg";
import qr500 from "./QRCodes/gcash-500.jpg";
import qr1000 from "./QRCodes/gcash-1000.jpg";

function UserWallet() {
  const [showCashIn, setShowCashIn] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [showQR, setShowQR] = useState(false);
  const [paymentReference, setPaymentReference] = useState("");
  const [walletData, setWalletData] = useState({ coins: 0, pendingCoins: 0 });
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingAmount, setProcessingAmount] = useState(null);

  const qrCodes = {
    100: qr100,
    200: qr200,
    300: qr300,
    400: qr400,
    500: qr500,
    1000: qr1000,
  };

  useEffect(() => {
    fetchWalletData();
  }, []);

  const fetchWalletData = async () => {
    try {
      const payments = await paymentService.getMyPayments();
      const approvedCoins = payments
        .filter((p) => p.status === "approved")
        .reduce((sum, p) => sum + p.coins, 0);
      const pendingCoins = payments
        .filter((p) => p.status === "pending")
        .reduce((sum, p) => sum + p.coins, 0);

      setWalletData({
        coins: approvedCoins,
        pendingCoins: pendingCoins,
      });
      setPaymentHistory(payments);
    } catch (error) {
      setError(error.message);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/10 text-yellow-500";
      case "approved":
        return "bg-green-500/10 text-green-500";
      case "rejected":
        return "bg-red-500/10 text-red-500";
      default:
        return "bg-gray-500/10 text-gray-500";
    }
  };

  const handleCashIn = async (option) => {
    if (isProcessing) return; // Prevent multiple clicks while processing

    try {
      setIsProcessing(true);
      setProcessingAmount(option.amount);

      const referenceId = `GC${Math.random()
        .toString(36)
        .substr(2, 9)
        .toUpperCase()}`;
      setPaymentReference(referenceId);

      await paymentService.createPayment({
        amount: option.amount,
        coins: option.coins,
        referenceId,
        paymentMethod: "GCash",
      });

      setSelectedAmount(option);
      setShowQR(true);
      await fetchWalletData(); // Refresh wallet data
    } catch (error) {
      setError(error.message);
    } finally {
      setIsProcessing(false);
      setProcessingAmount(null);
    }
  };

  const cashInOptions = [
    { amount: 100, coins: 100, price: "₱100" },
    { amount: 200, coins: 200, price: "₱200" },
    { amount: 300, coins: 300, price: "₱300" },
    { amount: 400, coins: 400, price: "₱400" },
    { amount: 500, coins: 500, price: "₱500" },
    { amount: 1000, coins: 1000, price: "₱1000" },
  ];

  const handleClose = () => {
    setShowQR(false);
    setSelectedAmount(null);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-secondary/50 backdrop-blur-lg rounded-xl p-6 mb-6"
      >
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-lg font-semibold text-textPrimary">
              My Wallet
            </h2>
            <p className="text-sm text-textSecondary">Available balance</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-accent">
              {walletData.coins} <span className="text-sm">coins</span>
            </p>
            {walletData.pendingCoins > 0 && (
              <p className="text-xs text-textSecondary">
                {walletData.pendingCoins} coins pending
              </p>
            )}
          </div>
        </div>

        <button
          onClick={() => setShowCashIn(!showCashIn)}
          className="w-full bg-accent text-white py-2 rounded-lg text-sm font-medium hover:bg-accent/90 transition-colors"
        >
          Cash In
        </button>

        {showCashIn && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-4 space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              {cashInOptions.map((option) => (
                <button
                  key={option.amount}
                  onClick={() => handleCashIn(option)}
                  disabled={isProcessing}
                  className={`p-4 bg-secondary/30 rounded-lg hover:bg-secondary/50 transition-colors text-left relative ${
                    isProcessing && processingAmount === option.amount
                      ? "cursor-not-allowed opacity-75"
                      : "hover:bg-secondary/50"
                  }`}
                >
                  {isProcessing && processingAmount === option.amount ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-secondary/30 rounded-lg">
                      <svg
                        className="animate-spin h-5 w-5 text-accent"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                    </div>
                  ) : null}
                  <p className="text-sm font-medium text-textPrimary">
                    {option.coins} coins
                  </p>
                  <p className="text-xs text-textSecondary">{option.price}</p>
                </button>
              ))}
            </div>
            <p className="text-xs text-textSecondary text-center">
              1 coin = ₱1 • GCash payments only
            </p>
          </motion.div>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-secondary/50 backdrop-blur-lg rounded-xl p-6"
      >
        <h2 className="text-lg font-semibold text-textPrimary mb-4">
          Top-up History
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-textSecondary">
                <th className="pb-4">Date</th>
                <th className="pb-4">Amount</th>
                <th className="pb-4">Coins</th>
                <th className="pb-4">Reference</th>
                <th className="pb-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {paymentHistory.map((payment) => (
                <tr
                  key={payment.id}
                  className="border-t border-white/5 text-sm"
                >
                  <td className="py-4 text-textPrimary">
                    {formatDate(payment.created_at)}
                  </td>
                  <td className="py-4 text-textPrimary">₱{payment.amount}</td>
                  <td className="py-4 text-textPrimary">{payment.coins}</td>
                  <td className="py-4 text-textSecondary">
                    {payment.reference_id}
                  </td>
                  <td className="py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${getStatusColor(
                        payment.status
                      )}`}
                    >
                      {payment.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {showQR && selectedAmount && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-secondary/95 backdrop-blur-lg rounded-xl p-6 max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-textPrimary mb-2">
                GCash Payment
              </h3>
              <p className="text-sm text-textSecondary">
                Amount: ₱{selectedAmount.amount}
              </p>
            </div>

            <div className="bg-white p-4 rounded-lg mb-6">
              <div className="max-h-[400px] overflow-y-auto">
                <img
                  src={qrCodes[selectedAmount.amount]}
                  alt={`GCash QR for ₱${selectedAmount.amount}`}
                  className="w-full h-auto object-contain mx-auto"
                />
              </div>
            </div>

            <div className="space-y-6">
              <div className="text-sm text-textSecondary space-y-3">
                <div className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-accent/10 text-accent">
                    1
                  </span>
                  <p>Open your GCash app</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-accent/10 text-accent">
                    2
                  </span>
                  <p>Scan this QR code</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-accent/10 text-accent">
                    3
                  </span>
                  <p>Complete the payment</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-accent/10 text-accent">
                    4
                  </span>
                  <p>Your coins will be credited automatically</p>
                </div>
              </div>

              <button
                onClick={handleClose}
                className="w-full bg-secondary/50 text-textSecondary py-3 rounded-lg text-sm font-medium hover:bg-secondary/70 transition-colors"
              >
                Close
              </button>
            </div>

            <p className="text-sm text-textSecondary text-center mt-2">
              Reference: {paymentReference}
            </p>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

export default UserWallet;
