import { motion, AnimatePresence } from "framer-motion";

function PurchaseSuccessModal({ isOpen, onClose, listing }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-secondary/95 backdrop-blur-lg rounded-xl max-w-md w-full mx-4 text-center p-6"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-16 h-16 text-green-500 mx-auto mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h2 className="text-xl font-semibold text-textPrimary mb-2">
            Purchase Successful!
          </h2>
          <div className="space-y-4">
            <p className="text-textSecondary">
              You have successfully purchased {listing.title}
            </p>

            <div className="bg-secondary/50 rounded-lg p-4">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                <p className="text-yellow-500 font-medium">Awaiting Seller</p>
              </div>
              <p className="text-sm text-textSecondary">
                Waiting for {listing.seller_name} to send the account details
              </p>
            </div>

            <p className="text-xs text-textSecondary">
              You'll be notified when the seller processes your order
            </p>
          </div>

          <button
            onClick={onClose}
            className="mt-6 px-6 py-2 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent/90 transition-colors"
          >
            View My Purchases
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default PurchaseSuccessModal;
