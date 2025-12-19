import { AnimatedSection } from "./AnimatedSection";
import { motion } from "framer-motion";
import { ExternalLink, Github, Folder, MessageSquare, Send, Star, ThumbsUp } from "lucide-react";
import { useProjects } from "@/hooks/usePortfolioData";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button, type ButtonProps } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { projectQuestionsService, projectFeedbackService } from "@/integrations/firebase/services";
import { useToast } from "@/hooks/use-toast";
import type { Project } from "@/integrations/firebase/types";

export const ProjectsSection = () => {
  const { data: projects = [], isLoading } = useProjects();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [questionForm, setQuestionForm] = useState({ name: "", email: "", question: "" });
  const [feedbackForm, setFeedbackForm] = useState({ name: "", email: "", feedback: "", rating: 0 });
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleViewProject = (project: Project) => {
    setSelectedProject(project);
    setIsDialogOpen(true);
  };

  const handleSubmitQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject) return;

    setIsSubmitting(true);
    try {
      await projectQuestionsService.create({
        projectId: selectedProject.id,
        projectTitle: selectedProject.title,
        name: questionForm.name,
        email: questionForm.email,
        question: questionForm.question,
      });

      toast({
        title: "Question Submitted!",
        description: "Thank you for your interest. We'll get back to you soon.",
      });

      setQuestionForm({ name: "", email: "", question: "" });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject) return;

    if (feedbackForm.rating === 0) {
      toast({
        title: "Rating Required",
        description: "Please select a star rating before submitting.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await projectFeedbackService.create({
        projectId: selectedProject.id,
        projectTitle: selectedProject.title,
        name: feedbackForm.name,
        email: feedbackForm.email,
        feedback: feedbackForm.feedback,
        rating: feedbackForm.rating,
      });

      toast({
        title: "Feedback Submitted!",
        description: "Thank you for your valuable feedback!",
      });

      setFeedbackForm({ name: "", email: "", feedback: "", rating: 0 });
      setIsDialogOpen(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
                        loading="lazy"
                        decoding="async"
                        fetchPriority="high"
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
                  <div className="flex items-center gap-2 pt-4 border-t border-border">
                    {project.github_url && (
                      <motion.button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          window.open(project.github_url, '_blank');
                        }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-2 text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                        title="View on GitHub"
                      >
                        <Github className="w-5 h-5" />
                      </motion.button>
                    )}
                    {project.live_url && (
                      <motion.button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          window.open(project.live_url, '_blank');
                        }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-2 text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                        title="View Live Site"
                      >
                        <ExternalLink className="w-5 h-5" />
                      </motion.button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-auto gap-2"
                      onClick={() => handleViewProject(project)}
                    >
                      <MessageSquare className="w-4 h-4" />
                      View Details
                    </Button>
                  </div>
                </div>
              </motion.div>
            </AnimatedSection>
            ))}
          </div>
        )}

        {/* Project Details Modal */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">{selectedProject?.title}</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Project Image */}
              {selectedProject?.image_url && (
                <div className="relative h-64 rounded-lg overflow-hidden bg-gradient-to-br from-primary/20 to-gold-dark/20">
                  {selectedProject.image_url.includes('.mp4') || selectedProject.image_url.includes('.webm') ? (
                    <video
                      src={selectedProject.image_url}
                      className="w-full h-full object-cover"
                      muted
                      loop
                      autoPlay
                    />
                  ) : (
                    <img
                      src={selectedProject.image_url}
                      alt={selectedProject.title}
                      className="w-full h-full object-cover"
                      loading="eager"
                      decoding="async"
                      fetchPriority="high"
                    />
                  )}
                </div>
              )}

              {/* Project Description */}
              <div>
                <h3 className="text-lg font-semibold mb-2">About This Project</h3>
                <p className="text-muted-foreground">{selectedProject?.long_description || selectedProject?.description}</p>
              </div>

              {/* Tech Stack */}
              {selectedProject?.tech_stack && selectedProject.tech_stack.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Technologies Used</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.tech_stack.map((tech, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Project Links */}
              <div className="flex gap-4">
                {selectedProject?.live_url && (
                  <Button
                    variant="default"
                    onClick={() => window.open(selectedProject.live_url, '_blank')}
                    className="flex-1"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Live Project
                  </Button>
                )}
                {selectedProject?.github_url && (
                  <Button
                    variant="outline"
                    onClick={() => window.open(selectedProject.github_url, '_blank')}
                    className="flex-1"
                  >
                    <Github className="w-4 h-4 mr-2" />
                    View Source Code
                  </Button>
                )}
              </div>

              {/* Questions & Feedback Tabs */}
              <div className="border-t border-border pt-6">
                <Tabs defaultValue="questions" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="questions" className="gap-2">
                      <MessageSquare className="w-4 h-4" />
                      Ask Questions
                    </TabsTrigger>
                    <TabsTrigger value="feedback" className="gap-2">
                      <ThumbsUp className="w-4 h-4" />
                      Give Feedback
                    </TabsTrigger>
                  </TabsList>

                  {/* Questions Tab */}
                  <TabsContent value="questions" className="space-y-4 mt-6">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <MessageSquare className="w-5 h-5" />
                      Have Questions About This Project?
                    </h3>
                    <form onSubmit={handleSubmitQuestion} className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="q-name">Your Name *</Label>
                          <Input
                            id="q-name"
                            value={questionForm.name}
                            onChange={(e) => setQuestionForm({ ...questionForm, name: e.target.value })}
                            required
                            placeholder="John Doe"
                          />
                        </div>
                        <div>
                          <Label htmlFor="q-email">Your Email *</Label>
                          <Input
                            id="q-email"
                            type="email"
                            value={questionForm.email}
                            onChange={(e) => setQuestionForm({ ...questionForm, email: e.target.value })}
                            required
                            placeholder="john@example.com"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="question">Your Question *</Label>
                        <Textarea
                          id="question"
                          value={questionForm.question}
                          onChange={(e) => setQuestionForm({ ...questionForm, question: e.target.value })}
                          required
                          rows={4}
                          placeholder="What would you like to know about this project?"
                        />
                      </div>
                      <Button type="submit" disabled={isSubmitting} className="w-full">
                        <Send className="w-4 h-4 mr-2" />
                        {isSubmitting ? "Submitting..." : "Submit Question"}
                      </Button>
                    </form>
                  </TabsContent>

                  {/* Feedback Tab */}
                  <TabsContent value="feedback" className="space-y-4 mt-6">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <ThumbsUp className="w-5 h-5" />
                      Share Your Feedback
                    </h3>
                    <form onSubmit={handleSubmitFeedback} className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="f-name">Your Name *</Label>
                          <Input
                            id="f-name"
                            value={feedbackForm.name}
                            onChange={(e) => setFeedbackForm({ ...feedbackForm, name: e.target.value })}
                            required
                            placeholder="John Doe"
                          />
                        </div>
                        <div>
                          <Label htmlFor="f-email">Your Email *</Label>
                          <Input
                            id="f-email"
                            type="email"
                            value={feedbackForm.email}
                            onChange={(e) => setFeedbackForm({ ...feedbackForm, email: e.target.value })}
                            required
                            placeholder="john@example.com"
                          />
                        </div>
                      </div>
                      <div>
                        <Label>Rate This Project *</Label>
                        <div className="flex items-center gap-2 mt-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <motion.button
                              key={star}
                              type="button"
                              whileHover={{ scale: 1.2 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => setFeedbackForm({ ...feedbackForm, rating: star })}
                              onMouseEnter={() => setHoveredRating(star)}
                              onMouseLeave={() => setHoveredRating(0)}
                              className="focus:outline-none"
                            >
                              <Star
                                className={`w-8 h-8 transition-colors ${
                                  star <= (hoveredRating || feedbackForm.rating)
                                    ? "fill-primary text-primary"
                                    : "text-muted-foreground"
                                }`}
                              />
                            </motion.button>
                          ))}
                          <span className="ml-2 text-sm text-muted-foreground">
                            {feedbackForm.rating > 0 && `${feedbackForm.rating} star${feedbackForm.rating > 1 ? "s" : ""}`}
                          </span>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="feedback">Your Feedback *</Label>
                        <Textarea
                          id="feedback"
                          value={feedbackForm.feedback}
                          onChange={(e) => setFeedbackForm({ ...feedbackForm, feedback: e.target.value })}
                          required
                          rows={4}
                          placeholder="Tell us what you think about this project..."
                        />
                      </div>
                      <Button type="submit" disabled={isSubmitting} className="w-full">
                        <Send className="w-4 h-4 mr-2" />
                        {isSubmitting ? "Submitting..." : "Submit Feedback"}
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </DialogContent>
        </Dialog>

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
