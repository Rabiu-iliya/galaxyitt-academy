import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard, BookOpen, Layers, Video, FileText,
  FolderKanban, Award, CreditCard, User, LogOut,
  GraduationCap, Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";
import { cn } from "@/lib/utils";

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

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-sidebar text-sidebar-foreground transition-transform lg:static lg:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-4">
          <GraduationCap className="h-7 w-7 text-sidebar-primary" />
          <span className="font-bold text-sidebar-foreground">Galaxy<span className="text-sidebar-primary">ITT</span></span>
        </div>
        <nav className="flex-1 space-y-1 p-3">
          {sidebarItems.map((item) => {
            const active = location.pathname === item.href;
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
          <Link to="/" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-sidebar-foreground/70 hover:bg-sidebar-accent">
            <LogOut className="h-4 w-4" /> Log Out
          </Link>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main */}
      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold">Student Dashboard</h1>
        </header>

        <main className="flex-1 p-4 md:p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold">Welcome back, Student!</h2>
            <p className="text-muted-foreground">Here's your learning overview.</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Program</CardTitle></CardHeader>
              <CardContent><div className="text-lg font-bold">AI & Machine Learning</div></CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Cohort</CardTitle></CardHeader>
              <CardContent><div className="text-lg font-bold">Cohort A — April 2026</div></CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Progress</CardTitle></CardHeader>
              <CardContent>
                <div className="text-lg font-bold">35%</div>
                <Progress value={35} className="mt-2 h-2" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Payment</CardTitle></CardHeader>
              <CardContent><Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">Paid</Badge></CardContent>
            </Card>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader><CardTitle>Next Live Class</CardTitle></CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <Video className="h-8 w-8 text-accent" />
                  <div>
                    <div className="font-semibold">Introduction to Neural Networks</div>
                    <div className="text-sm text-muted-foreground">Tomorrow, 10:00 AM WAT</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Upcoming Assignments</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Linear Regression Project</span>
                  <Badge variant="outline">Due in 3 days</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Data Preprocessing Quiz</span>
                  <Badge variant="outline">Due in 5 days</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;
