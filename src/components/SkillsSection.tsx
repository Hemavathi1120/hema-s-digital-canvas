import { AnimatedSection } from "./AnimatedSection";
import { motion } from "framer-motion";

const skillCategories = [
  {
    title: "Frontend",
    skills: [
      { name: "React", level: 85 },
      { name: "TypeScript", level: 80 },
      { name: "Tailwind CSS", level: 90 },
      { name: "HTML/CSS", level: 95 },
      { name: "JavaScript", level: 88 },
    ],
  },
  {
    title: "Backend",
    skills: [
      { name: "Node.js", level: 75 },
      { name: "Express.js", level: 70 },
      { name: "MongoDB", level: 72 },
      { name: "REST APIs", level: 80 },
      { name: "SQL", level: 68 },
    ],
  },
  {
    title: "Tools & Others",
    skills: [
      { name: "Git/GitHub", level: 85 },
      { name: "VS Code", level: 95 },
      { name: "Figma", level: 60 },
      { name: "Firebase", level: 65 },
      { name: "Vercel", level: 75 },
    ],
  },
];

export const SkillsSection = () => {
  return (
    <section id="skills" className="py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-medium/20 to-transparent" />
      
      <div className="section-container relative">
        <AnimatedSection>
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="line-accent" />
              <span className="text-sm font-medium text-primary uppercase tracking-widest">Skills</span>
              <div className="line-accent rotate-180" />
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground">
              Technical <span className="text-gradient-gold">Expertise</span>
            </h2>
          </div>
        </AnimatedSection>

        <div className="grid md:grid-cols-3 gap-8">
          {skillCategories.map((category, categoryIndex) => (
            <AnimatedSection key={categoryIndex} delay={categoryIndex * 0.15}>
              <motion.div
                whileHover={{ y: -8 }}
                className="card-premium p-8 h-full"
              >
                <h3 className="font-display text-xl font-bold text-foreground mb-8 flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-primary" />
                  {category.title}
                </h3>
                
                <div className="space-y-6">
                  {category.skills.map((skill, skillIndex) => (
                    <div key={skillIndex}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-foreground">{skill.name}</span>
                        <span className="text-xs text-muted-foreground">{skill.level}%</span>
                      </div>
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.level}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: skillIndex * 0.1 }}
                          className="h-full bg-gold-gradient rounded-full"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>

        {/* Skill Tags */}
        <AnimatedSection delay={0.5}>
          <div className="mt-16 flex flex-wrap justify-center gap-3">
            {["Problem Solving", "Team Leadership", "Communication", "Adaptability", "Quick Learner", "Time Management"].map(
              (tag, index) => (
                <motion.span
                  key={index}
                  whileHover={{ scale: 1.05, borderColor: "hsl(var(--primary))" }}
                  className="px-4 py-2 rounded-full border border-border text-sm text-muted-foreground transition-colors"
                >
                  {tag}
                </motion.span>
              )
            )}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};
