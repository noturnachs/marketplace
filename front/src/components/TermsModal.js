import { motion, AnimatePresence } from "framer-motion";

function TermsModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-secondary/90 backdrop-blur rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
        >
          <h2 className="text-2xl font-bold text-textPrimary mb-4">
            Seller Terms & Conditions
          </h2>

          <div className="space-y-4 text-textSecondary">
            <section>
              <h3 className="text-lg font-semibold text-textPrimary mb-2">
                1. Account Requirements
              </h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>Must have a verified Telegram account</li>
                <li>Previous selling experience is preferred</li>
                <li>
                  Vouches from previous transactions are highly recommended
                </li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-textPrimary mb-2">
                2. Selling Guidelines
              </h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  Only sell accounts that you own or have permission to sell
                </li>
                <li>Provide accurate descriptions of accounts</li>
                <li>Maintain competitive and fair pricing</li>
                <li>Respond to buyer inquiries promptly</li>
                <li>Complete transactions within agreed timeframes</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-textPrimary mb-2">
                3. Fees & Payments
              </h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>First 5 sellers enjoy 0% cashout fees (Launch Offer)</li>
                <li>Standard cashout fee: 5%</li>
                <li>Minimum withdrawal amount: ₱100</li>
                <li>Processing time: 24-48 hours</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-textPrimary mb-2">
                4. Prohibited Activities
              </h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>Selling credit cards</li>
                <li>Price manipulation or false advertising</li>
                <li>Creating multiple seller accounts</li>
                <li>Engaging in any form of scam</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-textPrimary mb-2">
                5. Account Suspension
              </h3>
              <p>
                We reserve the right to suspend or terminate seller accounts
                for:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Violation of these terms</li>
                <li>Multiple buyer complaints</li>
                <li>Suspicious activity</li>
                <li>Extended periods of inactivity</li>
              </ul>
            </section>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="bg-accent text-white px-6 py-2 rounded-lg hover:bg-accent/90 transition-colors"
            >
              Close
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default TermsModal;
