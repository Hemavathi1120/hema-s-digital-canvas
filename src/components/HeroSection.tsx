import { motion } from "framer-motion";
import { MapPin, Sparkles, Code2, Download } from "lucide-react";
import { useProfile } from "@/hooks/usePortfolioData";

export const HeroSection = () => {
  const { data: profile } = useProfile();

  return (
    <section className="relative min-h-screen md:min-h-screen flex items-center justify-center overflow-hidden pt-16 md:pt-20 pb-8 md:pb-12 lg:pb-16">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/3" />

        {/* Grid Pattern - Only visible in dark mode */}
        <svg className="absolute inset-0 w-full h-full opacity-0 dark:opacity-5" preserveAspectRatio="none">
          <defs>
            <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="currentColor" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        {/* Premium Floating Orbs with Enhanced Effects - Kept Behind Content */}
        <motion.div
          animate={{
            y: [-30, 30, -30],
            x: [0, 20, 0],
            opacity: [0.08, 0.2, 0.08],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 -left-32 w-96 h-96 bg-gradient-to-br from-primary/15 to-primary/5 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            y: [30, -30, 30],
            x: [0, -20, 0],
            opacity: [0.06, 0.15, 0.06],
            scale: [1, 1.15, 1]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/4 -right-32 w-96 h-96 bg-gradient-to-tl from-gold-dark/12 to-gold-dark/4 rounded-full blur-3xl"
        />

        {/* Accent Orbs - Very Subtle */}
        <motion.div
          animate={{
            rotate: [0, 360],
            opacity: [0.03, 0.08, 0.03]
          }}
          transition={{ duration: 15, repeat: Infinity, linear: true }}
          className="absolute top-1/2 right-1/3 w-64 h-64 bg-cyan-500/5 rounded-full blur-2xl"
        />
      </div>

      <div className="section-container relative z-10">
        {/* Main Content - Centered Grid Layout */}
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
          {/* Left Side - Content */}
          <motion.div className="text-left lg:text-center">
            {/* Intro Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/40 bg-primary/8 mb-6"
            >
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Full Stack Developer</span>
            </motion.div>

            {/* Main Headline - Premium Typography */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-7xl font-bold tracking-tight mb-4 md:mb-6 leading-tight">
                <span className="block text-foreground">Crafting</span>
                <span className="block bg-gradient-to-r from-primary via-gold-dark to-primary bg-clip-text text-transparent animate-gradient">
                  Digital Excellence
                </span>
              </h1>
            </motion.div>

            {/* Subtitle - Elegant Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-2xl mb-6 md:mb-8 leading-relaxed"
            >
              B.Tech student passionate about building elegant solutions. Full stack developer, Toastmaster leader,
              and innovation enthusiast dedicated to creating experiences that matter.
            </motion.p>

            {/* Location with Icon */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="flex items-center gap-2 text-muted-foreground mb-6 md:mb-10"
            >
              <MapPin className="w-5 h-5 text-primary" />
              <span className="text-base">Andhra Pradesh, India</span>
            </motion.div>

            {/* CTA Buttons - Premium Design */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-col sm:flex-row items-center lg:items-start gap-3 sm:gap-4 mb-8 md:mb-12"
            >
              <a
                href="#projects"
                className="group relative px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-primary to-gold-dark text-primary-foreground font-semibold rounded-full overflow-hidden shadow-2xl hover:shadow-primary/50 transition-all duration-300 transform hover:scale-105 text-sm md:text-base"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-gold-dark/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="relative flex items-center gap-2">
                  View My Work
                  <motion.span
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    →
                  </motion.span>
                </span>
              </a>
              <a
                href="#contact"
                className="px-6 md:px-8 py-3 md:py-4 border border-primary/30 text-foreground font-medium rounded-full hover:border-primary/60 hover:bg-primary/8 transition-all duration-300 group text-sm md:text-base"
              >
                <span className="flex items-center gap-2">
                  Get In Touch
                  <Code2 className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                </span>
              </a>
              {profile?.resume_url && (
                <a
                  href={profile.resume_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 md:px-8 py-3 md:py-4 border border-primary/30 text-foreground font-medium rounded-full hover:border-primary/60 hover:bg-primary/8 transition-all duration-300 group text-sm md:text-base"
                  aria-label="View Resume"
                >
                  <span className="flex items-center gap-2">
                    View Resume
                    <Download className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  </span>
                </a>
              )}
            </motion.div>

            {/* Social Links - Premium Icons */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="flex items-center gap-4"
            >
              <span className="text-sm text-muted-foreground font-medium">Connect:</span>
              <a
                href="https://github.com/Hemavathi1120"
                target="_blank"
                rel="noopener noreferrer"
                className="group w-11 h-11 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 hover:bg-primary/8 transition-all duration-300"
                aria-label="GitHub"
              >
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                </svg>
              </a>
              <a
                href="https://www.linkedin.com/in/saidhu-hemavathi-ba0b0631b/"
                target="_blank"
                rel="noopener noreferrer"
                className="group w-11 h-11 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 hover:bg-primary/8 transition-all duration-300"
                aria-label="LinkedIn"
              >
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </motion.div>
          </motion.div>

          {/* Right Side - Profile Picture with Premium Glass Effect */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: 50 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="hidden lg:flex items-center justify-center"
          >
            <div className="relative">
              {/* Animated Background Glow with Multiple Layers */}
              <motion.div
                animate={{
                  rotate: [0, 360],
                  scale: [1, 1.05, 1]
                }}
                transition={{ duration: 8, repeat: Infinity }}
                className="absolute -inset-8 rounded-full bg-gradient-to-br from-primary via-gold-dark to-primary opacity-20 blur-2xl"
              />
              <motion.div
                animate={{
                  rotate: [360, 0],
                  scale: [1, 0.95, 1]
                }}
                transition={{ duration: 10, repeat: Infinity }}
                className="absolute -inset-6 rounded-full border border-primary/10 backdrop-blur-xl"
              />

              {/* Glass Effect Container */}
              <div className="relative w-80 h-80 rounded-3xl overflow-hidden border border-white/8 bg-white/3 shadow-2xl p-1">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-gold-dark/5" />

                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt="Hemavathi Saidhu"
                    className="relative w-full h-full object-cover rounded-3xl"
                    loading="eager"
                    decoding="async"
                    fetchPriority="high"
                  />
                ) : (
                  <div className="relative w-full h-full bg-gradient-to-br from-primary/5 to-gold-dark/5 rounded-3xl flex items-center justify-center">
                    <span className="text-muted-foreground">Portfolio Image</span>
                  </div>
                )}

                {/* Floating Badge on Image */}
                <motion.div
                  animate={{ y: [-8, 8, -8] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute bottom-6 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full bg-white/8 border border-white/15 text-sm font-semibold text-foreground"
                >
                  Open to Opportunities
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
