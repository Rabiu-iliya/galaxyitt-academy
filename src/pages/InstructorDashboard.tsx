import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Users, BookOpen, Video, FileText,
  ClipboardCheck, LogOut, GraduationCap, Menu, Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { cn } from "@/lib/utils";

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/instructor" },
  { icon: Layers, label: "My Cohorts", href: "/instructor/cohorts" },
  { icon: BookOpen, label: "Lessons", href: "/instructor/lessons" },
  { icon: Video, label: "Live Classes", href: "/instructor/live-classes" },
  { icon: FileText, label: "Assignments", href: "/instructor/assignments" },
  { icon: ClipboardCheck, label: "Attendance", href: "/instructor/attendance" },
  { icon: Users, label: "Students", href: "/instructor/students" },
];

const InstructorDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

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
          <Link to="/" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-sidebar-foreground/70 hover:bg-sidebar-accent">
            <LogOut className="h-4 w-4" /> Log Out
          </Link>
        </div>
      </aside>

      {sidebarOpen && <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold">Instructor Dashboard</h1>
        </header>

        <main className="flex-1 p-4 md:p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold">Welcome, Instructor!</h2>
            <p className="text-muted-foreground">Manage your cohorts and students.</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Assigned Cohorts</CardTitle></CardHeader>
              <CardContent><div className="text-2xl font-bold">3</div></CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Total Students</CardTitle></CardHeader>
              <CardContent><div className="text-2xl font-bold">87</div></CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Pending Submissions</CardTitle></CardHeader>
              <CardContent><div className="text-2xl font-bold">12</div></CardContent>
            </Card>
          </div>

          <div className="mt-6">
            <Card>
              <CardHeader><CardTitle>My Cohorts</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {[
                  { name: "AI & ML — Cohort A", students: 30, status: "Active" },
                  { name: "Data Science — Cohort B", students: 28, status: "Active" },
                  { name: "Cybersecurity — Cohort A", students: 29, status: "Upcoming" },
                ].map((c) => (
                  <div key={c.name} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                    <div>
                      <div className="text-sm font-medium">{c.name}</div>
                      <div className="text-xs text-muted-foreground">{c.students} students</div>
                    </div>
                    <span className={cn("text-xs font-medium rounded-full px-2 py-1",
                      c.status === "Active" ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" : "bg-muted text-muted-foreground"
                    )}>{c.status}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default InstructorDashboard;
