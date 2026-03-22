import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { auth } from "@/integrations/firebase/config";
import { signOut } from "firebase/auth";
import { Button, type ButtonProps } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  LayoutDashboard,
  User,
  Briefcase,
  GraduationCap,
  Code,
  Award,
  TrendingUp,
  LogOut,
  Menu,
  X,
  MessageSquare,
  Mail,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Profile", href: "/admin/profile", icon: User },
  { name: "Projects", href: "/admin/projects", icon: Briefcase },
  { name: "Education", href: "/admin/education", icon: GraduationCap },
  { name: "Skills", href: "/admin/skills", icon: Code },
  { name: "Leadership", href: "/admin/leadership", icon: Award },
  { name: "Achievements", href: "/admin/achievements", icon: TrendingUp },
  { name: "Questions", href: "/admin/questions", icon: MessageSquare },
  { name: "Connections", href: "/admin/connections", icon: Mail },
];

export const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/admin/login");
      toast({
        title: "Logged out",
        description: "You have been logged out successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const currentPageName = navigation.find((item) => item.href === location.pathname)?.name || "Dashboard";

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-screen w-72 bg-card border-r border-border/40
          transform transition-transform duration-300 ease-in-out
          lg:translate-x-0 admin-sidebar
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo - Premium */}
          <div className="flex items-center justify-between h-20 px-6 border-b border-border/30">
            <Link to="/admin" className="flex items-center gap-3 group">
              <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-primary via-gold-dark to-primary flex items-center justify-center group-hover:shadow-lg transition-all duration-300">
                <span className="text-primary-foreground font-bold text-lg">HS</span>
              </div>
              <div>
                <h1 className="font-bold text-sm leading-tight text-foreground">Admin</h1>
                <p className="text-xs text-muted-foreground">CMS Portal</p>
              </div>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden h-8 w-8"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Navigation */}
          <ScrollArea className="flex-1 py-6">
            <nav className="space-y-1 px-3">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`
                      admin-nav-item group relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                      transition-all duration-200
                      ${
                        isActive
                          ? "admin-nav-active bg-primary/15 text-primary"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      }
                    `}
                  >
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-primary via-gold-dark to-primary rounded-r-full" />
                    )}
                    <div
                      className={`flex-shrink-0 p-2 rounded-lg transition-all duration-200 ${
                        isActive
                          ? "bg-primary/30 text-primary"
                          : "group-hover:bg-primary/10"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="flex-1">{item.name}</span>
                    {isActive && <ChevronRight className="w-4 h-4 opacity-50" />}
                  </Link>
                );
              })}
            </nav>
          </ScrollArea>

          {/* Logout Button - Premium */}
          <div className="p-4 border-t border-border/30 space-y-3">
            <div className="px-3 py-2 rounded-lg bg-muted/40 border border-border/30">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Manage</p>
              <p className="text-xs text-muted-foreground mt-1">Portfolio content</p>
            </div>
            <Button
              variant="outline"
              className="w-full justify-start gap-3 h-10 border-border/30 hover:bg-destructive/10 hover:border-destructive/30 hover:text-destructive"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:pl-72">
        {/* Top Bar - Premium */}
        <header className="sticky top-0 z-30 h-20 border-b border-border/40 bg-gradient-to-b from-background via-background to-background/95 backdrop-blur-sm">
          <div className="flex items-center justify-between h-full px-4 sm:px-6 lg:px-8 gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden h-9 w-9"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </Button>

            {/* Breadcrumb & Title */}
            <div className="flex-1 flex flex-col justify-center">
              <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground mb-1">
                <span>Admin</span>
                <ChevronRight className="w-3 h-3" />
                <span className="text-primary font-medium">{currentPageName}</span>
              </div>
              <h2 className="text-lg font-semibold text-foreground leading-tight">
                {currentPageName}
              </h2>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <div className="hidden sm:block w-px h-6 bg-border/40" />
              <Link to="/" target="_blank">
                <Button variant="outline" size="sm" className="gap-2 border-border/40">
                  View Site
                  <ChevronRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="admin-surface p-6 sm:p-8 lg:p-10 min-h-[calc(100vh-80px)]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
