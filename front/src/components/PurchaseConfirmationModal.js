import { motion, AnimatePresence } from "framer-motion";

function PurchaseConfirmationModal({
  isOpen,
  onClose,
  listing,
  currentBalance,
  onConfirm,
  isPurchasing,
}) {
  if (!isOpen) return null;

  const newBalance = currentBalance - listing.price;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-secondary/95 backdrop-blur-lg rounded-xl max-w-md w-full mx-4"
        >
          <div className="p-6">
            <h2 className="text-lg font-semibold text-textPrimary mb-4">
              Confirm Purchase
            </h2>

            <div className="space-y-4">
              <div className="bg-secondary/50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-textPrimary mb-1">
                  {listing.title}
                </h3>
                <p className="text-xs text-textSecondary">{listing.duration}</p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-textSecondary">Current Balance</span>
                  <span className="text-textPrimary">₱{currentBalance}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-textSecondary">Price</span>
                  <span className="text-red-500">- ₱{listing.price}</span>
                </div>
                <div className="border-t border-white/10 pt-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-textSecondary">New Balance</span>
                    <span className="text-accent font-medium">
                      ₱{newBalance}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 p-4 flex justify-end gap-3">
            <button
              onClick={onClose}
              disabled={isPurchasing}
              className="px-4 py-2 text-sm text-textSecondary hover:text-textPrimary transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isPurchasing}
              className={`px-4 py-2 bg-accent text-white rounded-lg text-sm font-medium transition-colors ${
                isPurchasing
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-accent/90"
              }`}
            >
              {isPurchasing ? "Processing..." : "Confirm Purchase"}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default PurchaseConfirmationModal;
