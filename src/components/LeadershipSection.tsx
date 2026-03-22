import { AnimatedSection } from "./AnimatedSection";
import { motion } from "framer-motion";
import { Mic, Users, Award, Calendar, Star } from "lucide-react";
import { useLeadership } from "@/hooks/usePortfolioData";

const iconMap: Record<string, React.FC<React.SVGProps<SVGSVGElement>>> = {
  Mic,
  Users,
  Award,
  Star,
};

export const LeadershipSection = () => {
  const { data: leadershipData = [], isLoading } = useLeadership();

  return (
    <section id="leadership" className="py-10 md:py-16 lg:py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-gold-dark/5" />

      <div className="section-container relative">
        <AnimatedSection>
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="line-accent" />
              <span className="text-sm font-medium text-primary uppercase tracking-widest">Leadership</span>
              <div className="line-accent rotate-180" />
            </div>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4 md:mb-6">
              Beyond <span className="text-gradient-gold">Code</span>
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
              Leadership isn't just about giving orders—it's about inspiring others,
              facilitating growth, and building communities.
            </p>
          </div>
        </AnimatedSection>

        {/* Leadership Experiences - Feature Cards */}
        {leadershipData.length > 0 && (
          <>
            <AnimatedSection delay={0.2}>
            <motion.div
                whileHover={{ y: -4 }}
                className="card-premium p-6 md:p-8 lg:p-12 mb-12 md:mb-16 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px]" />

                <div className="relative grid md:grid-cols-2 gap-6 md:gap-8 lg:gap-12 items-center">
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-3 rounded-xl bg-primary/10">
                        <Users className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-display text-2xl font-bold text-foreground">
                          {leadershipData[0]?.organization || "Leadership"}
                        </h3>
                      </div>
                    </div>

                    <p className="text-muted-foreground leading-relaxed mb-8">
                      {leadershipData[0]?.description}
                    </p>

                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-primary" />
                      <span className="text-sm text-muted-foreground">
                        Since {new Date(leadershipData[0]?.start_date || "").toLocaleDateString("en-US", { year: "numeric", month: "long" })}
                      </span>
                    </div>
                  </div>

                  {/* Visual Element */}
                  <div className="hidden md:flex items-center justify-center">
                    <div className="relative w-64 h-64">
                      <img
                        src="/logos/toastmasters-logo.png"
                        alt="Leadership Logo"
                        className="w-full h-full object-contain"
                        loading="lazy"
                        decoding="async"
                        fetchPriority="high"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatedSection>

            {/* Achievement Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 lg:gap-6 mb-16">
              {leadershipData.slice(0, 3).map((experience, index) => {
                const IconComponent = iconMap.Award;
                return (
                  <AnimatedSection key={experience.id} delay={0.3 + index * 0.1}>
                    <motion.div
                      whileHover={{ y: -4, borderColor: "hsl(var(--primary)/0.5)" }}
                      className="p-6 rounded-2xl border border-border bg-card/50 text-center h-80 flex flex-col"
                    >
                      <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <IconComponent className="w-6 h-6 text-primary" />
                      </div>
                      <h4 className="font-display text-lg font-bold text-foreground mb-1 line-clamp-2">
                        {experience.title}
                      </h4>
                      <p className="text-primary text-sm font-medium mb-3 line-clamp-2">{experience.organization}</p>
                      <p className="text-muted-foreground text-sm flex-grow overflow-hidden line-clamp-4">
                        {experience.description}
                      </p>
                    </motion.div>
                  </AnimatedSection>
                );
              })}
            </div>

            {/* Timeline */}
            <AnimatedSection delay={0.6}>
              <div className="max-w-2xl mx-auto">
                <h3 className="font-display text-xl font-bold text-foreground text-center mb-8">
                  My Leadership Journey
                </h3>
                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />
                  {leadershipData.map((experience, index) => (
                    <motion.div
                      key={experience.id}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.2 }}
                      className="relative pl-12 pb-8 last:pb-0"
                    >
                      <div className="absolute left-2 top-1 w-4 h-4 rounded-full bg-primary" />
                      <span className="text-xs text-primary font-medium uppercase tracking-wider">
                        {new Date(experience.start_date).toLocaleDateString("en-US", { year: "numeric", month: "short" })}
                      </span>
                      <h4 className="font-display text-lg font-bold text-foreground mt-1 mb-2">
                        {experience.title}
                      </h4>
                      <p className="text-muted-foreground text-sm">{experience.description}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          </>
        )}

        {isLoading && (
          <AnimatedSection>
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading leadership experiences...</p>
            </div>
          </AnimatedSection>
        )}

        {!isLoading && leadershipData.length === 0 && (
          <AnimatedSection>
            <div className="text-center py-12">
              <p className="text-muted-foreground">No leadership experiences yet. Stay tuned!</p>
            </div>
          </AnimatedSection>
        )}
      </div>
    </section>
  );
};
