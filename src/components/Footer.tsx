import { motion } from "framer-motion";
import { Heart, ArrowUp } from "lucide-react";
import { useState, useEffect } from "react";

export const Footer = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when page is scrolled down
  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Scroll to top smoothly
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  return (
    <footer className="py-12 border-t border-border relative">
      <div className="section-container">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <span className="font-display text-xl font-semibold">
              <span className="text-gradient-gold">H</span>
              <span className="text-foreground">ema</span>
            </span>
            <span className="text-muted-foreground text-sm">© 2025</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Made with</span>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <Heart className="w-4 h-4 text-primary fill-primary" />
            </motion.div>
            <span>in India</span>
          </div>

          <nav className="flex items-center gap-6">
            {["About", "Projects", "Contact"].map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase()}`}
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                {link}
              </a>
            ))}
          </nav>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
        transition={{ duration: 0.3 }}
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 p-3 rounded-full bg-gradient-to-r from-primary to-gold-dark text-primary-foreground shadow-lg hover:shadow-primary/50 transition-all duration-300 transform hover:scale-110 ${
          isVisible ? "pointer-events-auto" : "pointer-events-none"
        }`}
        aria-label="Scroll to top"
      >
        <ArrowUp className="w-5 h-5" />
      </motion.button>
    </footer>
  );
};
