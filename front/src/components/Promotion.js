// src/components/Promotion.js
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

function Promotion() {
  const navigate = useNavigate();

  return (
    <motion.div
      className=" py-16 sm:py-20 relative overflow-hidden mt-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Animated background circles */}
      <motion.div
        className="absolute top-10 left-10 w-64 h-64 bg-accent/5 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-10 right-10 w-64 h-64 bg-accent/5 rounded-full blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.5, 0.3, 0.5],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div className="max-w-6xl mx-auto px-6 relative">
        <motion.div
          className="text-center space-y-8 backdrop-blur-sm py-8 px-6 rounded-2xl border border-accent/20"
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <motion.div
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-block"
          >
            <span className="inline-block bg-accent text-white px-6 py-2 rounded-full text-sm font-medium transform -rotate-2">
              🔥 Special Launch Offer
            </span>
          </motion.div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-accent leading-tight">
            Limited Time Offer!
            <motion.span
              animate={{ rotate: [0, 15, 0] }}
              transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
              className="inline-block ml-2"
            >
              🎉
            </motion.span>
          </h2>

          <div className="max-w-3xl mx-auto">
            <p className="text-2xl sm:text-3xl text-textPrimary font-bold mb-4 bg-gradient-to-r from-accent to-accent/70 bg-clip-text text-transparent">
              First 5 sellers will enjoy 0 fees when cashing out!
            </p>
          </div>

          <motion.button
            onClick={() => navigate("/signup")}
            className="bg-accent text-white px-10 py-4 rounded-xl font-bold text-lg sm:text-xl shadow-lg shadow-accent/25 hover:shadow-accent/40 hover:bg-accent/90 transition-all duration-300 transform hover:-translate-y-1"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Get Started Now
          </motion.button>

          {/* Timer or urgency element */}
          <div className="text-sm text-textSecondary mt-6">
            <motion.span
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="inline-block mr-2 w-2 h-2 bg-accent rounded-full"
            />
            Limited spots available
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default Promotion;
