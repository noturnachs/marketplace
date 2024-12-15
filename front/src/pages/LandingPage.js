import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import Promotion from "../components/Promotion";
import bgLanding from "./imgs/bg-landing.png";

function LandingPage() {
  const navigate = useNavigate();

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.5 },
  };

  const stagger = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { staggerChildren: 0.2 },
  };

  return (
    <div
      className="min-h-screen bg-primary relative"
      style={{
        backgroundImage: `url(${bgLanding})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Add an overlay to ensure content remains readable */}
      <div className="absolute inset-0 bg-primary/70 backdrop-blur-sm"></div>

      {/* Wrap all content in a relative container to appear above the overlay */}
      <div className="relative">
        <Navbar />
        <main className="max-w-6xl mx-auto px-6 py-24">
          <motion.div
            className="text-center space-y-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-textPrimary tracking-tight leading-tight">
              Your Trusted{" "}
              <span className="text-accent block mt-2">
                Premium Marketplace
              </span>
            </h1>
            <p className="text-base sm:text-lg text-textSecondary max-w-2xl mx-auto leading-relaxed">
              Buy and sell digital accounts securely. We provide a safe platform
              for all your digital asset transactions.
            </p>
            <motion.button
              onClick={() => navigate("/login")}
              className="bg-accent/90 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-medium hover:bg-accent transition-all hover:scale-105 transform"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Explore Accounts
            </motion.button>
          </motion.div>

          {/* Add Promotion component here */}
          <div className="-mx-6">
            <Promotion />
          </div>

          {/* How it Works */}
          <motion.div
            className="mt-24 sm:mt-32"
            variants={fadeInUp}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-textPrimary text-center mb-12 sm:mb-16">
              How It Works
            </h2>
            <motion.div
              className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-12"
              variants={stagger}
              initial="initial"
              whileInView="whileInView"
              viewport={{ once: true }}
            >
              {[
                {
                  step: "01",
                  title: "Create Account",
                  desc: "Sign up and verify your identity in minutes.",
                },
                {
                  step: "02",
                  title: "Cash In",
                  desc: "Add funds to your wallet via GCash.",
                },
                {
                  step: "03",
                  title: "Buy Accounts",
                  desc: "Purchase premium accounts from verified sellers.",
                },
              ].map((item, i) => (
                <div key={i} className="relative">
                  <div className="text-4xl sm:text-5xl font-bold text-accent/20 mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-textPrimary mb-3">
                    {item.title}
                  </h3>
                  <p className="text-textSecondary">{item.desc}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Features Section */}
          <motion.div
            className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 mt-24 sm:mt-32"
            variants={stagger}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
          >
            {[
              {
                title: "Secure Transactions",
                desc: "Protected payments and verified sellers for your peace of mind.",
                features: ["Identity Verification", "Secure Payments"],
              },
              {
                title: "Wide Selection",
                desc: "Browse through thousands of verified digital accounts.",
                features: [
                  "Gaming Accounts",
                  "Social Media",
                  "Premium Services",
                ],
              },
              {
                title: "24/7 Support",
                desc: "Our team is always here to help with any issues or questions.",
                features: ["Telegram Support"],
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="bg-secondary/50 backdrop-blur p-6 sm:p-8 rounded-2xl hover:bg-secondary/70 transition-colors"
              >
                <h3 className="text-lg sm:text-xl font-semibold mb-3 text-textPrimary">
                  {feature.title}
                </h3>
                <p className="text-sm sm:text-base text-textSecondary leading-relaxed mb-4">
                  {feature.desc}
                </p>
                <ul className="space-y-2">
                  {feature.features.map((item, j) => (
                    <li
                      key={j}
                      className="text-textSecondary flex items-center text-sm sm:text-base"
                    >
                      <span className="w-1.5 h-1.5 bg-accent rounded-full mr-2"></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </motion.div>

          {/* Verified Sellers Section */}
          {/* <motion.div
            className="mt-24 sm:mt-32"
            variants={fadeInUp}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-textPrimary text-center mb-12 sm:mb-16">
              Top Verified Sellers
            </h2>
            <motion.div
              className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8"
              variants={stagger}
              initial="initial"
              whileInView="whileInView"
              viewport={{ once: true }}
            >
              {[
                {
                  name: "David Chen",
                  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
                  badge: "Elite Seller",
                  stats: {
                    sales: "500+",
                    rating: "4.9/5",
                    vouches: "312",
                  },
                  specialties: ["Gaming Accounts", "Steam", "Epic Games"],
                },
                {
                  name: "Emma Wilson",
                  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
                  badge: "Premium Seller",
                  stats: {
                    sales: "350+",
                    rating: "4.8/5",
                    vouches: "245",
                  },
                  specialties: ["Social Media", "Instagram", "TikTok"],
                },
                {
                  name: "Michael Ross",
                  avatar:
                    "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
                  badge: "Verified Pro",
                  stats: {
                    sales: "420+",
                    rating: "4.9/5",
                    vouches: "289",
                  },
                  specialties: ["Premium Services", "Netflix", "Spotify"],
                },
              ].map((seller, i) => (
                <div
                  key={i}
                  className="bg-secondary/50 backdrop-blur p-8 rounded-2xl hover:bg-secondary/70 transition-all hover:scale-[1.02]"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <img
                      src={seller.avatar}
                      alt={seller.name}
                      className="w-16 h-16 rounded-full bg-accent/10"
                    />
                    <div>
                      <h3 className="text-xl font-semibold text-textPrimary">
                        {seller.name}
                      </h3>
                      <span className="inline-block px-3 py-1 bg-accent/10 text-accent text-sm rounded-full">
                        {seller.badge}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center">
                      <div className="text-accent font-bold">
                        {seller.stats.sales}
                      </div>
                      <div className="text-textSecondary text-sm">Sales</div>
                    </div>
                    <div className="text-center">
                      <div className="text-accent font-bold">
                        {seller.stats.rating}
                      </div>
                      <div className="text-textSecondary text-sm">Rating</div>
                    </div>
                    <div className="text-center">
                      <div className="text-accent font-bold">
                        {seller.stats.vouches}
                      </div>
                      <div className="text-textSecondary text-sm">Vouches</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm text-textSecondary">Specialties:</div>
                    <div className="flex flex-wrap gap-2">
                      {seller.specialties.map((specialty, j) => (
                        <span
                          key={j}
                          className="px-3 py-1 bg-secondary rounded-full text-textSecondary text-sm"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div> */}

          {/* Testimonials */}
          <motion.div
            className="mt-24 sm:mt-32"
            variants={fadeInUp}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-textPrimary text-center mb-12 sm:mb-16">
              What Our Users Say
            </h2>
            <motion.div
              className="grid sm:grid-cols-2 gap-6 sm:gap-8"
              variants={stagger}
              initial="initial"
              whileInView="whileInView"
              viewport={{ once: true }}
            >
              {[
                {
                  quote:
                    "The most secure platform I've used for buying gaming accounts. Excellent support team!",
                  author: "Alex M.",
                  role: "Verified Buyer",
                },
                {
                  quote: "Made selling my accounts so easy.",
                  author: "Sarah K.",
                  role: "Verified Seller",
                },
              ].map((testimonial, i) => (
                <div key={i} className="bg-secondary/30 p-8 rounded-2xl">
                  <p className="text-textSecondary mb-6 italic">
                    "{testimonial.quote}"
                  </p>
                  <div className="text-textPrimary font-medium">
                    {testimonial.author}
                  </div>
                  <div className="text-accent text-sm">{testimonial.role}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default LandingPage;
