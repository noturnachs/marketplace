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
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex flex-col items-center text-center space-y-6">
          {/* Brand */}
          <div className="space-y-2">
            <div className="text-2xl font-extrabold text-accent tracking-tight">
              PremiumHaven
            </div>
            <p className="text-textSecondary text-sm">
              The most trusted digital account marketplace platform.
            </p>
          </div>

          {/* Admin Contacts */}
          <div className="space-y-2">
            <p className="text-textSecondary text-sm">Contact Admins:</p>
            <div className="flex gap-4 justify-center">
              <a
                href="https://t.me/rizebaby01"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-secondary/50 rounded-lg text-textSecondary hover:text-accent transition-colors text-sm"
              >
                @rizebaby01
              </a>
              <a
                href="https://t.me/grim1232"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-secondary/50 rounded-lg text-textSecondary hover:text-accent transition-colors text-sm"
              >
                @grim1232
              </a>
            </div>
          </div>

          {/* Copyright */}
          <div className="text-textSecondary text-sm pt-6 border-t border-secondary/50 w-full">
            © 2024 PremiumHaven. All rights reserved.
          </div>
        </div>
      </div>
    </motion.footer>
  );
}

export default Footer;
