import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, BookOpen, Users, UserCheck, CreditCard,
  BarChart3, Award, Megaphone, Settings, LogOut,
  GraduationCap, Menu, Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
  { icon: BookOpen, label: "Programs", href: "/admin/programs" },
  { icon: Layers, label: "Cohorts", href: "/admin/cohorts" },
  { icon: Users, label: "Students", href: "/admin/students" },
  { icon: UserCheck, label: "Instructors", href: "/admin/instructors" },
  { icon: CreditCard, label: "Payments", href: "/admin/payments" },
  { icon: BarChart3, label: "Analytics", href: "/admin/analytics" },
  { icon: Award, label: "Certificates", href: "/admin/certificates" },
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
          <h1 className="text-lg font-semibold">Admin Dashboard</h1>
        </header>

        <main className="flex-1 p-4 md:p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold">Admin Overview</h2>
            <p className="text-muted-foreground">Manage your academy from one place.</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Total Students", value: "1,247", icon: Users },
              { label: "Active Cohorts", value: "8", icon: Layers },
              { label: "Programs", value: "14", icon: BookOpen },
              { label: "Revenue", value: "₦48.2M", icon: CreditCard },
            ].map((s) => (
              <Card key={s.label}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{s.label}</CardTitle>
                  <s.icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{s.value}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader><CardTitle>Recent Enrollments</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {["Adaeze Okafor — AI & ML", "Ibrahim Yusuf — Cybersecurity", "Chidinma Eze — Full Stack Web Dev"].map((e) => (
                  <div key={e} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                    <span className="text-sm">{e}</span>
                    <span className="text-xs text-muted-foreground">Today</span>
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Recent Payments</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {[
                  { name: "Adaeze Okafor", amount: "₦220,000" },
                  { name: "Ibrahim Yusuf", amount: "₦200,000" },
                  { name: "Chidinma Eze", amount: "₦150,000" },
                ].map((p) => (
                  <div key={p.name} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                    <span className="text-sm">{p.name}</span>
                    <span className="text-sm font-semibold text-accent">{p.amount}</span>
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

export default AdminDashboard;
