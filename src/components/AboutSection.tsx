import { AnimatedSection } from "./AnimatedSection";
import { motion } from "framer-motion";
import { Code2, Heart, Target } from "lucide-react";
import { useProfile } from "@/hooks/usePortfolioData";

export const AboutSection = () => {
  const { data: profile } = useProfile();
  
  return (
    <section id="about" className="py-32 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-medium/30 to-transparent" />
      
      <div className="section-container relative">
        <AnimatedSection>
          <div className="flex items-center gap-4 mb-4">
            <div className="line-accent" />
            <span className="text-sm font-medium text-primary uppercase tracking-widest">About Me</span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-16">
            Passionate About Creating<br />
            <span className="text-gradient-gold">Digital Excellence</span>
          </h2>
        </AnimatedSection>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image/Visual Side */}
          <AnimatedSection delay={0.2}>
            <div className="relative">
              <div className="aspect-[4/5] rounded-3xl overflow-hidden card-premium p-1">
                {profile?.avatar_url ? (
                  <div className="w-full h-full rounded-[22px] overflow-hidden bg-gradient-to-br from-slate-medium to-slate-dark">
                    <img
                      src={profile.avatar_url}
                      alt="Hemavathi Saidhu"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-full h-full rounded-[22px] bg-slate-medium flex items-center justify-center">
                    <div className="text-center p-8">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="w-32 h-32 mx-auto mb-6 rounded-full border-2 border-dashed border-primary/30 flex items-center justify-center"
                      >
                        <span className="font-display text-5xl font-bold text-gradient-gold">HS</span>
                      </motion.div>
                      <p className="text-muted-foreground text-sm">
                        Full Stack Developer<br />& Toastmaster
                      </p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Floating Elements */}
              <motion.div
                animate={{ y: [-10, 10, -10] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -top-6 -right-6 p-4 card-premium"
              >
                <Code2 className="w-8 h-8 text-primary" />
              </motion.div>
              <motion.div
                animate={{ y: [10, -10, 10] }}
                transition={{ duration: 5, repeat: Infinity }}
                className="absolute -bottom-6 -left-6 p-4 card-premium"
              >
                <Target className="w-8 h-8 text-primary" />
              </motion.div>
            </div>
          </AnimatedSection>

          {/* Content Side */}
          <AnimatedSection delay={0.4}>
            <div className="space-y-6">
              <p className="text-lg text-muted-foreground leading-relaxed">
                I'm <span className="text-foreground font-medium">Hemavathi Saidhu</span>, a B.Tech student 
                at KIET Group of Engineering & Technology with a deep passion for building exceptional 
                digital experiences. My journey in tech began with curiosity and has evolved into a 
                commitment to excellence.
              </p>
              
              <p className="text-lg text-muted-foreground leading-relaxed">
                Beyond coding, I serve as the <span className="text-primary font-medium">Secretary 
                of KIET Toastmasters Club</span>, where I blend my technical skills with leadership 
                and communication expertise. This unique combination allows me to approach problems 
                with both analytical precision and human-centered thinking.
              </p>

              <p className="text-lg text-muted-foreground leading-relaxed">
                Based in the serene landscapes of Andhra Pradesh, I draw inspiration from the 
                intersection of tradition and innovation, crafting solutions that are both elegant 
                and impactful.
              </p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8">
                {[
                  { value: "3+", label: "Projects" },
                  { value: "95.6%", label: "10th Grade" },
                  { value: "92%", label: "Intermediate" },
                ].map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="font-display text-3xl font-bold text-gradient-gold mb-1">
                      {stat.value}
                    </div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};
