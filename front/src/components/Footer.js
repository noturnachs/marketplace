import { motion } from "framer-motion";

function Footer() {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.5 },
  };

  return (
    <motion.footer
      className="bg-secondary/50 backdrop-blur-lg mt-32"
      variants={fadeInUp}
      initial="initial"
      whileInView="whileInView"
    >
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="text-2xl font-extrabold text-accent tracking-tight">
              AccountMarket
            </div>
            <p className="text-textSecondary text-sm">
              The most trusted digital account marketplace platform.
            </p>
            <div className="flex gap-4">
              {/* Social Media Icons */}
              {["twitter", "discord", "telegram"].map((social) => (
                <a
                  key={social}
                  href={`#${social}`}
                  className="text-textSecondary hover:text-accent transition-colors"
                >
                  <span className="w-8 h-8 rounded-lg bg-secondary/50 flex items-center justify-center">
                    {/* You can replace these with actual icons */}
                    {social[0].toUpperCase()}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-textPrimary font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {["Browse Accounts", "How it Works", "Pricing", "FAQ"].map(
                (link) => (
                  <li key={link}>
                    <a
                      href={`#${link}`}
                      className="text-textSecondary hover:text-accent transition-colors text-sm"
                    >
                      {link}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-textPrimary font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              {[
                "Help Center",
                "Contact Us",
                "Terms of Service",
                "Privacy Policy",
              ].map((link) => (
                <li key={link}>
                  <a
                    href={`#${link}`}
                    className="text-textSecondary hover:text-accent transition-colors text-sm"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-textPrimary font-semibold mb-4">Newsletter</h3>
            <p className="text-textSecondary text-sm mb-4">
              Stay updated with the latest accounts and features.
            </p>
            <form className="space-y-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 rounded-lg bg-secondary/50 border border-secondary focus:border-accent focus:outline-none text-textPrimary text-sm"
              />
              <button className="w-full bg-accent/90 text-white px-4 py-2 rounded-lg hover:bg-accent transition-colors text-sm font-medium">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-secondary/50">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-textSecondary text-sm">
              © 2024 AccountMarket. All rights reserved.
            </div>
            <div className="flex gap-6">
              {["Terms", "Privacy", "Cookies"].map((link) => (
                <a
                  key={link}
                  href={`#${link}`}
                  className="text-textSecondary hover:text-accent transition-colors text-sm"
                >
                  {link}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}

export default Footer;
