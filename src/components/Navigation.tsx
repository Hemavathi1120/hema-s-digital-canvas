import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { useActiveSection } from "@/hooks/useActiveSection";

const navLinks = [
  { name: "About", href: "#about" },
  { name: "Education", href: "#education" },
  { name: "Skills", href: "#skills" },
  { name: "Projects", href: "#projects" },
  { name: "Leadership", href: "#leadership" },
  { name: "Contact", href: "#contact" },
];

export const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const activeSection = useActiveSection();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-gradient-to-b from-background via-background to-background/95 border-b border-white/5 shadow-lg"
            : "bg-transparent"
        }`}
      >
        <div className="section-container py-5 flex items-center justify-between">
          <motion.a
            href="#"
            className="font-display text-2xl font-bold tracking-tight relative z-20 group"
            whileHover={{ scale: 1.05 }}
          >
            <span className="bg-gradient-to-r from-primary via-gold-dark to-primary bg-clip-text text-transparent animate-gradient">H</span>
            <span className="text-foreground group-hover:text-primary transition-colors">emavathi</span>
          </motion.a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <ul className="flex items-center gap-8">
              {navLinks.map((link) => {
                const isActive = activeSection === link.href.slice(1);
                return (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className={`text-sm font-semibold transition-all duration-300 relative group ${
                        isActive
                          ? "text-primary"
                          : "text-foreground hover:text-primary"
                      }`}
                    >
                      {link.name}
                      <span
                        className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-primary to-gold-dark transition-all duration-300 ${
                          isActive ? "w-full" : "w-0 group-hover:w-full"
                        }`}
                      />
                    </a>
                  </li>
                );
              })}
            </ul>
            <div className="h-6 w-px bg-white/10" />
            <ThemeToggle />
          </div>

          {/* Mobile Menu Button & Theme Toggle */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 text-foreground"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-gradient-to-b from-background via-background to-background/98 md:hidden"
          >
            <div className="section-container py-5 flex justify-between items-center">
              <span className="font-display text-2xl font-bold">
                <span className="bg-gradient-to-r from-primary to-gold-dark bg-clip-text text-transparent">H</span>
                <span className="text-foreground">emavathi</span>
              </span>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-foreground"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <motion.ul
              initial="initial"
              animate="animate"
              className="flex flex-col items-center justify-center h-[70vh] gap-8"
            >
              {navLinks.map((link, index) => {
                const isActive = activeSection === link.href.slice(1);
                return (
                  <motion.li
                    key={link.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <a
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`text-2xl font-display font-medium transition-all duration-300 relative group ${
                        isActive
                          ? "text-primary"
                          : "text-foreground hover:text-primary"
                      }`}
                    >
                      {link.name}
                      <span
                        className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-1 w-10 bg-gradient-to-r from-primary to-gold-dark rounded-full transition-all duration-300 ${
                          isActive ? "scale-100" : "scale-0 group-hover:scale-100"
                        }`}
                      />
                    </a>
                  </motion.li>
                );
              })}
            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
