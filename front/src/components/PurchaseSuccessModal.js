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
          <p className="text-textSecondary mb-6">
            You have successfully purchased {listing.title}
          </p>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent/90 transition-colors"
          >
            Continue Shopping
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default PurchaseSuccessModal;
