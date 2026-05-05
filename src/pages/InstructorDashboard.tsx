import { Link, useLocation, useNavigate, Routes, Route } from "react-router-dom";
import {
  LayoutDashboard, Users, BookOpen, Video, FileText,
  ClipboardCheck, LogOut, GraduationCap, Menu, Layers, FolderKanban,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { NotificationBell } from "@/components/NotificationBell";
import InstructorHome from "./instructor/InstructorHome";
import ManageLiveClasses from "./instructor/ManageLiveClasses";
import ManageAssignments from "./instructor/ManageAssignments";
import ViewSubmissions from "./instructor/ViewSubmissions";
import ReviewProjects from "./admin/ReviewProjects";
import InstructorCohorts from "./instructor/InstructorCohort";
import InstructorLessons from "./instructor/InstructorLessons";
import InstructorStudents from "./instructor/InstructorStudents";

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/instructor" },
  { icon: Layers, label: "My Cohorts", href: "/instructor/cohorts" },
  { icon: BookOpen, label: "Lessons", href: "/instructor/lessons" },
  { icon: Video, label: "Live Classes", href: "/instructor/live-classes" },
  { icon: FileText, label: "Assignments", href: "/instructor/assignments" },
  { icon: ClipboardCheck, label: "Submissions", href: "/instructor/submissions" },
  { icon: FolderKanban, label: "Projects", href: "/instructor/projects" },
  { icon: Users, label: "Students", href: "/instructor/students" },
];

const InstructorDashboard = () => {
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
          <span className="font-bold">Galaxy<span className="text-sidebar-primary">ITT</span> <span className="text-xs text-sidebar-foreground/50">Instructor</span></span>
        </div>
        <nav className="flex-1 space-y-1 p-3">
          {sidebarItems.map((item) => {
            const active = location.pathname === item.href;
            return (
              <Link key={item.href} to={item.href} onClick={() => setSidebarOpen(false)}
                className={cn("flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                  active ? "bg-sidebar-accent text-sidebar-primary font-medium" : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                )}>
                <item.icon className="h-4 w-4" />{item.label}
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
          <h1 className="text-lg font-semibold flex-1">Instructor Dashboard</h1>
          <NotificationBell />
        </header>

        <main className="flex-1 p-4 md:p-6">
          <Routes>
            <Route index element={<InstructorHome />} />
            <Route path="cohorts" element={<InstructorCohorts />} />
            <Route path="lessons" element={<InstructorLessons />} />
            <Route path="live-classes" element={<ManageLiveClasses />} />
            <Route path="assignments" element={<ManageAssignments />} />
            <Route path="submissions" element={<ViewSubmissions />} />
            <Route path="projects" element={<ReviewProjects />} />
            <Route path="students" element={<InstructorStudents />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default InstructorDashboard;
