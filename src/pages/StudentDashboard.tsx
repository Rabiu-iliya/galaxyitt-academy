import { Link, useLocation, useNavigate, Routes, Route } from "react-router-dom";
import {
  LayoutDashboard, BookOpen, Layers, Video, FileText,
  FolderKanban, Award, CreditCard, User, LogOut,
  GraduationCap, Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import DashboardHome from "./student/DashboardHome";
import MyProgram from "./student/MyProgram";
import Modules from "./student/Modules";
import ModuleDetail from "./student/ModuleDetail";
import LessonViewer from "./student/LessonViewer";
import LiveClasses from "./student/LiveClasses";
import Assignments from "./student/Assignments";
import Projects from "./student/Projects";
import Certificates from "./student/Certificates";
import Payments from "./student/Payments";
import Profile from "./student/Profile";

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/student" },
  { icon: BookOpen, label: "My Program", href: "/student/program" },
  { icon: Layers, label: "Modules", href: "/student/modules" },
  { icon: Video, label: "Live Classes", href: "/student/live-classes" },
  { icon: FileText, label: "Assignments", href: "/student/assignments" },
  { icon: FolderKanban, label: "Projects", href: "/student/projects" },
  { icon: Award, label: "Certificates", href: "/student/certificates" },
  { icon: CreditCard, label: "Payments", href: "/student/payments" },
  { icon: User, label: "Profile", href: "/student/profile" },
];

const StudentDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className="flex min-h-screen bg-background">
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-sidebar text-sidebar-foreground transition-transform lg:static lg:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-4">
          <GraduationCap className="h-7 w-7 text-sidebar-primary" />
          <span className="font-bold text-sidebar-foreground">Galaxy<span className="text-sidebar-primary">ITT</span></span>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {sidebarItems.map((item) => {
            const active = location.pathname === item.href || (item.href !== "/student" && location.pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                  active
                    ? "bg-sidebar-accent text-sidebar-primary font-medium"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-sidebar-border p-3">
          <button onClick={handleSignOut} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-sidebar-foreground/70 hover:bg-sidebar-accent">
            <LogOut className="h-4 w-4" /> Log Out
          </button>
        </div>
      </aside>

      {sidebarOpen && <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold">Student Dashboard</h1>
        </header>

        <main className="flex-1 p-4 md:p-6">
          <Routes>
            <Route index element={<DashboardHome />} />
            <Route path="program" element={<MyProgram />} />
            <Route path="modules" element={<Modules />} />
            <Route path="modules/:moduleId" element={<ModuleDetail />} />
            <Route path="lessons/:lessonId" element={<LessonViewer />} />
            <Route path="live-classes" element={<LiveClasses />} />
            <Route path="assignments" element={<Assignments />} />
            <Route path="projects" element={<Projects />} />
            <Route path="certificates" element={<Certificates />} />
            <Route path="payments" element={<Payments />} />
            <Route path="profile" element={<Profile />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;
