import { motion, AnimatePresence } from "framer-motion";

function SendAccountModal({ isOpen, onClose, onSubmit, isLoading }) {
  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    onSubmit(formData.get("accountDetails"));
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-secondary/95 backdrop-blur-lg rounded-xl max-w-md w-full mx-4"
        >
          <form onSubmit={handleSubmit} className="p-6">
            <h2 className="text-lg font-semibold text-textPrimary mb-4">
              Send Account Details
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-textSecondary mb-2">
                  Account Details
                </label>
                <textarea
                  name="accountDetails"
                  rows="4"
                  placeholder="Enter account username and password..."
                  className="w-full bg-secondary/50 rounded-lg px-4 py-2 text-textPrimary"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="px-4 py-2 text-sm text-textSecondary hover:text-textPrimary transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent/90 transition-colors"
              >
                {isLoading ? "Sending..." : "Send Details"}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default SendAccountModal;
