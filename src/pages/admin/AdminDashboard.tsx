import { useEffect, useState } from "react";
import { projectsService, educationService, skillsService, experiencesService, achievementsService } from "@/integrations/firebase/services";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, GraduationCap, Code, Award, TrendingUp, Users, ArrowUpRight, Plus, Settings } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface Stats {
  projects: number;
  education: number;
  skills: number;
  leadership: number;
  achievements: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    projects: 0,
    education: 0,
    skills: 0,
    leadership: 0,
    achievements: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [projects, education, skills, experiences, achievements] = await Promise.all([
        projectsService.getAll(),
        educationService.getAll(),
        skillsService.getAll(),
        experiencesService.getAll(),
        achievementsService.getAll(),
      ]);

      setStats({
        projects: projects.length,
        education: education.length,
        skills: skills.length,
        leadership: experiences.filter(e => e.type === 'leadership').length,
        achievements: achievements.length,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { title: "Projects", value: stats.projects, icon: Briefcase, href: "/admin/projects", trend: "+2 this month" },
    { title: "Education", value: stats.education, icon: GraduationCap, href: "/admin/education", trend: "Current" },
    { title: "Skills", value: stats.skills, icon: Code, href: "/admin/skills", trend: "Updated" },
    { title: "Leadership", value: stats.leadership, icon: Award, href: "/admin/leadership", trend: "Active" },
    { title: "Achievements", value: stats.achievements, icon: TrendingUp, href: "/admin/achievements", trend: "Earned" },
  ];

  const quickActions = [
    { title: "Add Project", description: "Showcase your latest work", icon: Plus, href: "/admin/projects", color: "from-blue-500/20 to-blue-500/5" },
    { title: "Update Profile", description: "Edit your information", icon: Users, href: "/admin/profile", color: "from-purple-500/20 to-purple-500/5" },
    { title: "Manage Skills", description: "Update your skill set", icon: Code, href: "/admin/skills", color: "from-green-500/20 to-green-500/5" },
    { title: "View Settings", description: "Configure portfolio", icon: Settings, href: "/admin/profile", color: "from-orange-500/20 to-orange-500/5" },
  ];

  const activityItems = [
    { timestamp: "Just now", event: "Portfolio is live and active", status: "success" },
    { timestamp: "2 hours ago", event: "All sections configured", status: "success" },
    { timestamp: "Yesterday", event: "Database connected", status: "success" },
    { timestamp: "2 days ago", event: "Admin portal deployed", status: "success" },
    { timestamp: "3 days ago", event: "Project repository created", status: "success" },
  ];

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="space-y-3">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-40" />
          ))}
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-80" />
          <Skeleton className="h-80" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="admin-hero space-y-2">
        <h1 className="text-4xl font-bold text-foreground tracking-tight">Welcome back</h1>
        <p className="text-lg text-muted-foreground">
          Manage and monitor your portfolio content in one place
        </p>
      </div>

      {/* KPI Cards - Premium */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.title} to={stat.href}>
              <Card className="admin-kpi group cursor-pointer h-full overflow-hidden transition-all duration-300 hover:border-primary/50 hover:shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                <CardHeader className="pb-3 relative">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        {stat.title}
                      </CardTitle>
                    </div>
                    <div className="admin-kpi-icon flex-shrink-0 p-2.5 rounded-lg bg-primary/15 group-hover:bg-primary/25 transition-all">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="relative pt-0">
                  <div className="flex items-end justify-between">
                    <div>
                      <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                      <p className="text-xs text-muted-foreground mt-1">{stat.trend}</p>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-primary/50 group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions & Activity Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Quick Actions */}
        <Card className="admin-card border-border/40">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center gap-2">
              <span>Quick Actions</span>
              <span className="text-xs font-normal text-muted-foreground bg-muted/40 px-2 py-1 rounded-full">Popular</span>
            </CardTitle>
            <CardDescription>Common tasks to manage your portfolio</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link key={action.title} to={action.href}>
                  <div className={`admin-action-card group p-4 rounded-xl border border-border/40 transition-all duration-300 cursor-pointer bg-gradient-to-br ${action.color}
                    hover:border-primary/50 hover:bg-opacity-50 hover:shadow-md`}>
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 p-2.5 rounded-lg bg-background/50 group-hover:bg-primary/20 transition-colors">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
                          {action.title}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          {action.description}
                        </p>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary opacity-0 group-hover:opacity-100 transition-all -translate-x-1 group-hover:translate-x-0 group-hover:translate-y-1" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </CardContent>
        </Card>

        {/* Activity Timeline */}
        <Card className="admin-card border-border/40">
          <CardHeader className="pb-6">
            <CardTitle>Activity Timeline</CardTitle>
            <CardDescription>Recent updates to your portfolio</CardDescription>
          </CardHeader>
          <CardContent className="space-y-0">
            {activityItems.map((item, index) => (
              <div key={index} className="admin-timeline-item relative pl-6 pb-6 last:pb-0">
                {/* Timeline line */}
                {index !== activityItems.length - 1 && (
                  <div className="absolute left-2.5 top-6 bottom-0 w-px bg-gradient-to-b from-primary/50 to-primary/5" />
                )}

                {/* Timeline dot */}
                <div className={`absolute left-0 top-1.5 w-5 h-5 rounded-full border-2 transition-all ${
                  index === 0
                    ? "border-primary bg-primary/20 animate-pulse"
                    : "border-primary/40 bg-background"
                }`} />

                <div className="flex flex-col gap-1">
                  <p className="text-sm font-medium text-foreground">{item.event}</p>
                  <span className="text-xs text-muted-foreground">{item.timestamp}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Footer CTA */}
      <div className="admin-cta-section rounded-2xl border border-border/40 bg-gradient-to-br from-primary/10 via-transparent to-gold-dark/5 p-8 text-center">
        <h3 className="text-2xl font-semibold text-foreground mb-2">
          Ready to showcase your portfolio?
        </h3>
        <p className="text-muted-foreground mb-6">
          Visit your live portfolio to see all your content in action
        </p>
        <Link to="/" target="_blank">
          <Button className="gap-2 bg-gradient-to-r from-primary to-gold-dark hover:shadow-lg hover:shadow-primary/20">
            View Portfolio
            <ArrowUpRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
