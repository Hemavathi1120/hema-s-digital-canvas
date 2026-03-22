import { AnimatedSection } from "./AnimatedSection";
import { motion } from "framer-motion";
import { Code2, Award, BookOpen, Briefcase } from "lucide-react";
import { useProfile, useEducation, useSkills, useLeadership } from "@/hooks/usePortfolioData";

export const AboutSection = () => {
  const { data: profile } = useProfile();
  const { data: education } = useEducation();
  const { data: skills } = useSkills();
  const { data: leadership } = useLeadership();

  return (
    <section id="about" className="py-10 md:py-16 lg:py-20 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-medium/30 to-transparent" />

      <div className="section-container relative">
        <AnimatedSection>
          <div className="flex items-center gap-4 mb-4">
            <div className="line-accent" />
            <span className="text-sm font-medium text-primary uppercase tracking-widest">About Me</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-8 md:mb-12 lg:mb-16">
            Passionate About Creating<br />
            <span className="text-gradient-gold">Digital Excellence</span>
          </h2>
        </AnimatedSection>

        <div className="grid lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12 items-center">
          {/* Image/Visual Side */}
          <AnimatedSection delay={0.2}>
            <div className="relative w-full max-w-sm">
              <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-gradient-to-br from-primary/20 via-slate-medium to-slate-dark border border-white/10 shadow-xl shadow-primary/10">
                {profile?.avatar_url ? (
                  <div className="w-full h-full overflow-hidden bg-gradient-to-br from-slate-medium to-slate-dark">
                    <img
                      src={profile.avatar_url}
                      alt="Hemavathi Saidhu"
                      className="w-full h-full object-cover"
                      loading="lazy"
                      decoding="async"
                      fetchPriority="high"
                    />
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="w-24 h-24 mx-auto mb-4 rounded-full border-2 border-dashed border-primary/30 flex items-center justify-center"
                      >
                        <span className="font-display text-4xl font-bold text-gradient-gold">HS</span>
                      </motion.div>
                      <p className="text-muted-foreground text-xs">
                        Full Stack Developer
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Floating Element */}
              <motion.div
                animate={{ y: [-8, 8, -8] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -top-4 -right-4 p-3 rounded-xl bg-gradient-to-br from-primary to-gold-dark shadow-lg"
              >
                <Code2 className="w-6 h-6 text-white" />
              </motion.div>
            </div>
          </AnimatedSection>

          {/* Content Side */}
          <AnimatedSection delay={0.4}>
            <div className="space-y-3 md:space-y-4">
              {/* Main Introduction */}
              <div className="space-y-3">
                <div className="flex items-baseline gap-2">
                  <span className="text-sm font-semibold text-primary uppercase tracking-widest">Meet</span>
                  <h3 className="text-3xl md:text-4xl font-bold text-gradient-gold">
                    {profile?.full_name || "Hemavathi Saidhu"}
                  </h3>
                </div>
                <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                  A <span className="text-foreground font-semibold">B.Tech student</span> at KIET Group of Engineering & Technology with a deep passion for building exceptional digital experiences. My journey in tech began with curiosity and has evolved into a commitment to excellence in creating solutions that make a meaningful difference.
                </p>
                {profile?.subtitle && (
                  <p className="text-base text-primary font-medium">{profile.subtitle}</p>
                )}
              </div>

              {/* Role/Title & Description Section */}
              {profile?.title && (
                <div className="relative pl-5 border-l-2 border-primary/30">
                  <div className="absolute -left-3 top-1 w-4 h-4 rounded-full bg-gradient-to-r from-primary to-gold-dark" />
                  <div className="space-y-1">
                    <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                      Beyond coding, I serve as <span className="text-primary font-semibold">{profile.title}</span>, where I blend technical expertise with leadership and strategic thinking. This unique combination allows me to approach challenges with both analytical precision and creative problem-solving.
                    </p>
                    {profile?.bio && (
                      <p className="text-base text-muted-foreground leading-relaxed pt-1">
                        {profile.bio}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Education Highlights */}
              {education && education.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-primary" />
                    <h4 className="text-lg font-semibold text-foreground">Education</h4>
                  </div>
                  {education.slice(0, 2).map((edu, index) => (
                    <div key={index} className="pl-7 space-y-0.5">
                      <div className="font-semibold text-foreground">{edu.degree}</div>
                      <div className="text-sm text-muted-foreground">{edu.institution}</div>
                      {edu.field_of_study && (
                        <div className="text-sm text-primary">{edu.field_of_study}</div>
                      )}
                      {edu.grade && (
                        <div className="text-sm text-muted-foreground">Grade: {edu.grade}</div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Technical Skills Highlights */}
              {skills && skills.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Code2 className="w-5 h-5 text-primary" />
                    <h4 className="text-lg font-semibold text-foreground">Core Skills</h4>
                  </div>
                  <div className="flex flex-wrap gap-2 pl-7">
                    {skills.slice(0, 8).map((skill, index) => (
                      <span key={index} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Leadership/Experience Highlights */}
              {leadership && leadership.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-primary" />
                    <h4 className="text-lg font-semibold text-foreground">Leadership</h4>
                  </div>
                  {leadership.slice(0, 1).map((exp, index) => (
                    <div key={index} className="pl-7 space-y-0.5">
                      <div className="font-semibold text-foreground">{exp.title}</div>
                      <div className="text-sm text-muted-foreground">{exp.organization}</div>
                      {exp.description && (
                        <div className="text-sm text-muted-foreground leading-relaxed pt-0.5">
                          {exp.description}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 pt-3 border-t border-white/5">
                {[
                  { value: "3+", label: "Projects" },
                  { value: "95.6%", label: "10th Grade" },
                  { value: "92%", label: "Intermediate" },
                ].map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="font-display text-2xl font-bold text-gradient-gold mb-1">
                      {stat.value}
                    </div>
                    <div className="text-xs text-muted-foreground">{stat.label}</div>
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
