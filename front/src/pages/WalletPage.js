import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import UserWallet from "./wallet/UserWallet";
import DashboardNavbar from "../components/DashboardNavbar";

function WalletPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-primary">
      <DashboardNavbar />

      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-secondary/30 rounded-lg transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5 text-textSecondary"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
              />
            </svg>
          </button>
          <h1 className="text-xl font-semibold text-textPrimary">
            Wallet & Payments
          </h1>
        </div>

        <UserWallet />

        <div className="bg-secondary/50 backdrop-blur-lg rounded-xl p-6">
          <h2 className="text-lg font-semibold text-textPrimary mb-4">
            Payment Methods
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
              <div className="flex items-center gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5 text-textSecondary"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"
                  />
                </svg>
                <span className="text-sm text-textPrimary">GCash</span>
              </div>
              <span className="text-xs text-green-500">Available</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
              <div className="flex items-center gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5 text-textSecondary"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-sm text-textPrimary">Maya</span>
              </div>
              <span className="text-xs text-green-500">Available</span>
            </div>

            <p className="text-xs text-textSecondary text-center mt-6">
              More payment methods coming soon
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default WalletPage;
