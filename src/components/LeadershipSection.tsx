import { AnimatedSection } from "./AnimatedSection";
import { motion } from "framer-motion";
import { Mic, Users, Award, Calendar, Star } from "lucide-react";

const achievements = [
  {
    icon: Users,
    title: "Secretary",
    subtitle: "KIET Toastmasters Club",
    description: "Leading club operations and coordinating events since April 2025",
  },
  {
    icon: Mic,
    title: "Public Speaking",
    subtitle: "Toastmaster Member",
    description: "Developing communication and leadership skills through structured programs",
  },
  {
    icon: Award,
    title: "Leadership",
    subtitle: "Club Management",
    description: "Managing club activities, meetings, and member communications",
  },
];

const timeline = [
  {
    date: "April 2025",
    title: "Joined KIET Toastmasters",
    description: "Began the journey of personal development through public speaking",
  },
  {
    date: "Present",
    title: "Serving as Secretary",
    description: "Taking responsibility for club documentation and member coordination",
  },
];

export const LeadershipSection = () => {
  return (
    <section id="leadership" className="py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-gold-dark/5" />
      
      <div className="section-container relative">
        <AnimatedSection>
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="line-accent" />
              <span className="text-sm font-medium text-primary uppercase tracking-widest">Leadership</span>
              <div className="line-accent rotate-180" />
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
              Beyond <span className="text-gradient-gold">Code</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Leadership isn't just about giving orders—it's about inspiring others, 
              facilitating growth, and building communities.
            </p>
          </div>
        </AnimatedSection>

        {/* Toastmasters Feature Card */}
        <AnimatedSection delay={0.2}>
          <motion.div
            whileHover={{ y: -4 }}
            className="card-premium p-8 md:p-12 mb-16 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px]" />
            
            <div className="relative grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 rounded-xl bg-primary/10">
                    <Mic className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-display text-2xl font-bold text-foreground">KIET Toastmasters Club</h3>
                  </div>
                </div>
                
                <p className="text-muted-foreground leading-relaxed mb-8">
                  As a member of KIET Toastmasters Club, I am actively pursuing the Dynamic Leadership pathway, 
                  developing essential skills in public speaking, team collaboration, and strategic leadership. 
                  Through this pathway, I manage club communications, coordinate meetings, and lead initiatives 
                  that foster a collaborative environment. This journey has significantly enhanced my 
                  organizational abilities, communication effectiveness, and capacity to inspire and guide teams 
                  toward achieving collective goals.
                </p>

                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span className="text-sm text-muted-foreground">Since April 2025</span>
                </div>
              </div>

              {/* Visual Element */}
              <div className="hidden md:flex items-center justify-center">
                <div className="relative w-64 h-64">
                  <img 
                    src="/logos/toastmasters-logo.png" 
                    alt="Toastmasters International Logo"
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
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {achievements.map((achievement, index) => (
            <AnimatedSection key={index} delay={0.3 + index * 0.1}>
              <motion.div
                whileHover={{ y: -4, borderColor: "hsl(var(--primary)/0.5)" }}
                className="p-6 rounded-2xl border border-border bg-card/50 text-center"
              >
                <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-primary/10 flex items-center justify-center">
                  <achievement.icon className="w-6 h-6 text-primary" />
                </div>
                <h4 className="font-display text-lg font-bold text-foreground mb-1">
                  {achievement.title}
                </h4>
                <p className="text-primary text-sm font-medium mb-3">{achievement.subtitle}</p>
                <p className="text-muted-foreground text-sm">{achievement.description}</p>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>

        {/* Timeline */}
        <AnimatedSection delay={0.6}>
          <div className="max-w-2xl mx-auto">
            <h3 className="font-display text-xl font-bold text-foreground text-center mb-8">
              My Toastmasters Journey
            </h3>
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />
              {timeline.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className="relative pl-12 pb-8 last:pb-0"
                >
                  <div className="absolute left-2 top-1 w-4 h-4 rounded-full bg-primary" />
                  <span className="text-xs text-primary font-medium uppercase tracking-wider">
                    {item.date}
                  </span>
                  <h4 className="font-display text-lg font-bold text-foreground mt-1 mb-2">
                    {item.title}
                  </h4>
                  <p className="text-muted-foreground text-sm">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};
