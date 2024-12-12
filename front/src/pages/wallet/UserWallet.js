import { useState } from "react";
import { motion } from "framer-motion";

function UserWallet() {
  const [showCashIn, setShowCashIn] = useState(false);

  // Mock wallet data (in real app, this would come from an API/backend)
  const walletData = JSON.parse(localStorage.getItem("userWallet")) || {
    coins: 0,
    pendingCoins: 0,
  };

  const cashInOptions = [
    { amount: 100, coins: 100, price: "₱100" },
    { amount: 500, coins: 525, price: "₱500" },
    { amount: 1000, coins: 1100, price: "₱1000" },
    { amount: 2000, coins: 2300, price: "₱2000" },
  ];

  const handleCashIn = (option) => {
    // In a real app, this would open a payment gateway
    alert(`Processing payment of ${option.price} for ${option.coins} coins`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-secondary/50 backdrop-blur-lg rounded-xl p-6 mb-6"
    >
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-lg font-semibold text-textPrimary">My Wallet</h2>
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
                className="p-4 bg-secondary/30 rounded-lg hover:bg-secondary/50 transition-colors text-left"
              >
                <p className="text-sm font-medium text-textPrimary">
                  {option.coins} coins
                </p>
                <p className="text-xs text-textSecondary">{option.price}</p>
                {option.coins > option.amount && (
                  <p className="text-xs text-green-500">
                    +{option.coins - option.amount} bonus
                  </p>
                )}
              </button>
            ))}
          </div>
          <p className="text-xs text-textSecondary text-center">
            1 coin = ₱1 • Bonus coins on larger purchases
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}

export default UserWallet;
