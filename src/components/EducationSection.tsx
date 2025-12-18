import { AnimatedSection } from "./AnimatedSection";
import { motion } from "framer-motion";
import { GraduationCap, Award, Calendar } from "lucide-react";

const educationData = [
  {
    year: "2024 - Present",
    title: "B.Tech in Engineering",
    institution: "KIET Group of Engineering & Technology",
    description: "Pursuing Bachelor's degree with focus on full-stack development and emerging technologies.",
    status: "ongoing",
    icon: GraduationCap,
  },
  {
    year: "2022 - 2024",
    title: "Intermediate (MPC)",
    institution: "Sri Chaitanya Junior College, Eluru",
    description: "Completed with 92% aggregate, building strong foundations in mathematics and sciences.",
    achievement: "92%",
    icon: Award,
  },
  {
    year: "2022",
    title: "Secondary School (10th)",
    institution: "Sri Chaitanya Techno School, Eluru",
    description: "Graduated with distinction, demonstrating academic excellence from an early age.",
    achievement: "95.6%",
    icon: Award,
  },
];

export const EducationSection = () => {
  return (
    <section id="education" className="py-32 relative">
      <div className="section-container">
        <AnimatedSection>
          <div className="flex items-center gap-4 mb-4">
            <div className="line-accent" />
            <span className="text-sm font-medium text-primary uppercase tracking-widest">Education</span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-16">
            Academic <span className="text-gradient-gold">Journey</span>
          </h2>
        </AnimatedSection>

        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary via-border to-border" />

          {/* Timeline Items */}
          <div className="space-y-16">
            {educationData.map((item, index) => (
              <AnimatedSection key={index} delay={index * 0.2}>
                <div className={`relative flex flex-col md:flex-row gap-8 ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}>
                  {/* Content Card */}
                  <div className={`flex-1 ${index % 2 === 0 ? "md:pr-16" : "md:pl-16"}`}>
                    <motion.div
                      whileHover={{ y: -4 }}
                      className="card-premium p-8 ml-16 md:ml-0"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <Calendar className="w-4 h-4 text-primary" />
                        <span className="text-sm text-primary font-medium">{item.year}</span>
                        {item.achievement && (
                          <span className="ml-auto px-3 py-1 bg-primary/10 text-primary text-sm font-bold rounded-full">
                            {item.achievement}
                          </span>
                        )}
                        {item.status === "ongoing" && (
                          <span className="ml-auto px-3 py-1 bg-green-500/10 text-green-400 text-sm font-medium rounded-full">
                            Ongoing
                          </span>
                        )}
                      </div>
                      <h3 className="font-display text-xl font-bold text-foreground mb-2">
                        {item.title}
                      </h3>
                      <p className="text-primary/80 font-medium mb-3">{item.institution}</p>
                      <p className="text-muted-foreground">{item.description}</p>
                    </motion.div>
                  </div>

                  {/* Timeline Node */}
                  <div className="absolute left-8 md:left-1/2 -translate-x-1/2">
                    <motion.div
                      whileHover={{ scale: 1.2 }}
                      className="w-4 h-4 rounded-full bg-primary shadow-[0_0_20px_hsl(var(--primary))]"
                    />
                  </div>

                  {/* Empty Space */}
                  <div className="flex-1 hidden md:block" />
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
