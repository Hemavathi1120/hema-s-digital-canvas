import { AnimatedSection } from "./AnimatedSection";
import { motion } from "framer-motion";
import { ExternalLink, Github, Folder } from "lucide-react";
import { useProjects } from "@/hooks/usePortfolioData";
import { Skeleton } from "@/components/ui/skeleton";

export const ProjectsSection = () => {
  const { data: projects = [], isLoading } = useProjects();
  return (
    <section id="projects" className="py-32 relative">
      <div className="section-container">
        <AnimatedSection>
          <div className="flex items-center gap-4 mb-4">
            <div className="line-accent" />
            <span className="text-sm font-medium text-primary uppercase tracking-widest">Projects</span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
            Featured <span className="text-gradient-gold">Work</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mb-16">
            A collection of projects that demonstrate my expertise in full-stack development 
            and passion for creating impactful digital solutions.
          </p>
        </AnimatedSection>

        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-96 rounded-3xl" />
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => (
            <AnimatedSection key={project.id} delay={index * 0.15}>
              <motion.div
                whileHover={{ y: -8 }}
                className="group card-premium overflow-hidden h-full"
              >
                {/* Project Image/Video */}
                <div className="relative h-48 bg-gradient-to-br from-primary/20 to-gold-dark/20 overflow-hidden">
                  {project.image_url ? (
                    project.image_url.includes('.mp4') || project.image_url.includes('.webm') ? (
                      <video
                        src={project.image_url}
                        className="w-full h-full object-cover"
                        muted
                        loop
                        playsInline
                        onMouseEnter={(e) => e.currentTarget.play()}
                        onMouseLeave={(e) => {
                          e.currentTarget.pause();
                          e.currentTarget.currentTime = 0;
                        }}
                      />
                    ) : (
                      <img
                        src={project.image_url}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    )
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Folder className="w-12 h-12 text-primary/50" />
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background/80 to-transparent">
                    <div className="flex items-center gap-3">
                      {project.is_featured && (
                        <span className="px-3 py-1 bg-primary/90 backdrop-blur-sm text-white text-xs font-medium rounded-full">
                          Featured
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="font-display text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-6 line-clamp-3">
                    {project.description}
                  </p>

                  {/* Tags */}
                  {project.tech_stack && project.tech_stack.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.tech_stack.map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="px-2 py-1 bg-muted text-xs text-muted-foreground rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-4 pt-4 border-t border-border">
                    {project.github_url && (
                      <motion.a
                        href={project.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-2 text-muted-foreground hover:text-primary transition-colors"
                      >
                        <Github className="w-5 h-5" />
                      </motion.a>
                    )}
                    {project.live_url && (
                      <motion.a
                        href={project.live_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-2 text-muted-foreground hover:text-primary transition-colors"
                      >
                        <ExternalLink className="w-5 h-5" />
                      </motion.a>
                    )}
                    <span className="ml-auto text-xs text-muted-foreground">View Project →</span>
                  </div>
                </div>
              </motion.div>
            </AnimatedSection>
            ))}
          </div>
        )}

        <AnimatedSection delay={0.5}>
          <div className="text-center mt-12">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-4 border border-border text-foreground font-medium rounded-full hover:border-primary/50 hover:bg-primary/5 transition-all duration-300"
            >
              View All Projects
            </motion.button>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};
