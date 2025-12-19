import { useEffect, useState } from "react";
import { projectsService, educationService, skillsService, experiencesService, achievementsService } from "@/integrations/firebase/services";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, GraduationCap, Code, Award, TrendingUp, Users } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

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
    { title: "Projects", value: stats.projects, icon: Briefcase, color: "text-blue-500" },
    { title: "Education", value: stats.education, icon: GraduationCap, color: "text-green-500" },
    { title: "Skills", value: stats.skills, icon: Code, color: "text-purple-500" },
    { title: "Leadership", value: stats.leadership, icon: Award, color: "text-orange-500" },
    { title: "Achievements", value: stats.achievements, icon: TrendingUp, color: "text-pink-500" },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to your portfolio admin panel. Manage all your content from here.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {statCards.map((stat) => (
          <Card key={stat.title} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">Total {stat.title.toLowerCase()}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks to manage your portfolio</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <a
              href="/admin/projects"
              className="block p-3 rounded-lg hover:bg-muted transition-colors"
            >
              <div className="font-medium">Add New Project</div>
              <div className="text-sm text-muted-foreground">Showcase your latest work</div>
            </a>
            <a
              href="/admin/profile"
              className="block p-3 rounded-lg hover:bg-muted transition-colors"
            >
              <div className="font-medium">Update Profile</div>
              <div className="text-sm text-muted-foreground">Edit your personal information</div>
            </a>
            <a
              href="/admin/skills"
              className="block p-3 rounded-lg hover:bg-muted transition-colors"
            >
              <div className="font-medium">Manage Skills</div>
              <div className="text-sm text-muted-foreground">Update your skill set</div>
            </a>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest portfolio updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <div className="text-sm">Portfolio is live and active</div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <div className="text-sm">All sections configured</div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-purple-500" />
                <div className="text-sm">Database connected</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
