import { Link, useLocation, useNavigate, Routes,           Route } from "react-router-dom";
import {
  LayoutDashboard, BookOpen, Users, UserCheck, CreditCard,
  BarChart3, Award, Megaphone, Settings, LogOut,
  GraduationCap, Menu, Layers, Sparkles, FolderKanban, LifeBuoy, PenLine,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { NotificationBell } from "@/components/NotificationBell";
import AdminHome from "./admin/AdminHome";
import ManagePrograms from "./admin/ManagePrograms";
import ManageCohorts from "./admin/ManageCohorts";
import ManageStudents from "./admin/ManageStudents";
import AdminPayments from "./admin/AdminPayments";
import ManageScholarships from "./admin/ManageScholarships";
import ReviewProjects from "./admin/ReviewProjects";
import ManageSupport from "./admin/ManageSupport";
import ManageSignatures from "./admin/ManageSignatures";
import PlaceholderPage from "./shared/PlaceholderPage";
import AdminInstructors from "./AdminInstructors";
import AdminAnalytics from "./AdminAnalytics";
import AdminSettings from "./AdminSettings";
import AdminCertificates from "./AdminCertificates";
import AdminAnnouncements from "./AdminAnnouncements";

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
  { icon: BookOpen, label: "Programs", href: "/admin/programs" },
  { icon: Layers, label: "Cohorts", href: "/admin/cohorts" },
  { icon: Users, label: "Students", href: "/admin/students" },
  { icon: UserCheck, label: "Instructors", href: "/admin/instructors" },
  { icon: FolderKanban, label: "Projects", href: "/admin/projects" },
  { icon: CreditCard, label: "Payments", href: "/admin/payments" },
  { icon: Sparkles, label: "Scholarships", href: "/admin/scholarships" },
  { icon: LifeBuoy, label: "Support", href: "/admin/support" },
  { icon: BarChart3, label: "Analytics", href: "/admin/analytics" },
  { icon: Award, label: "Certificates", href: "/admin/certificates" },
  { icon: PenLine, label: "Signatures", href: "/admin/signatures" },
  { icon: Megaphone, label: "Announcements", href: "/admin/announcements" },
  { icon: Settings, label: "Settings", href: "/admin/settings" },
];

const AdminDashboard = () => {
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
          <span className="font-bold">Galaxy<span className="text-sidebar-primary">ITT</span> <span className="text-xs text-sidebar-foreground/50">Admin</span></span>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
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
          <h1 className="text-lg font-semibold flex-1">Admin Dashboard</h1>
          <NotificationBell />
        </header>

        <main className="flex-1 p-4 md:p-6">
          <Routes>
            <Route index element={<AdminHome />} />
            <Route path="programs" element={<ManagePrograms />} />
            <Route path="cohorts" element={<ManageCohorts />} />
            <Route path="students" element={<ManageStudents />} />

  /* ✅ REPLACE placeholder with real page */
            <Route path="instructors" element={<AdminInstructors />} />
            <Route path="projects" element={<ReviewProjects />} />
            <Route path="payments" element={<AdminPayments />} />
            <Route path="scholarships" element={<ManageScholarships />} />
            <Route path="support" element={<ManageSupport />} />

  /* ✅ NEW WORKING PAGES */
            <Route path="analytics" element={<AdminAnalytics />} />
            <Route path="certificates" element={<AdminCertificates />} />
            <Route path="announcements" element={<AdminAnnouncements />} />
            <Route path="settings" element={<AdminSettings />} />
</Routes>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
