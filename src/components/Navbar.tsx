import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, Moon, Sun, GraduationCap, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const { user, profile, roles, signOut } = useAuth();
  const navigate = useNavigate();

  const toggleDark = () => {
    setDark(!dark);
    document.documentElement.classList.toggle("dark");
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const dashboardPath = roles.includes("admin") || roles.includes("super_admin")
    ? "/admin"
    : roles.includes("instructor")
    ? "/instructor"
    : "/student";

  const links = [
    { label: "Programs", href: "/programs" },
    { label: "About", href: "/#about" },
    { label: "Pricing", href: "/#pricing" },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <GraduationCap className="h-8 w-8 text-accent" />
          <span className="text-lg font-bold text-foreground">
            Galaxy<span className="text-accent">ITT</span>
          </span>
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          {links.map((l) => (
            <Link key={l.href} to={l.href} className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              {l.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <Button variant="ghost" size="icon" onClick={toggleDark}>
            {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <User className="h-4 w-4" />
                  {profile?.full_name || "Account"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => navigate(dashboardPath)}>Dashboard</DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignOut}><LogOut className="mr-2 h-4 w-4" />Log Out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link to="/login"><Button variant="outline" size="sm">Log In</Button></Link>
              <Link to="/register"><Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90">Get Started</Button></Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <Button variant="ghost" size="icon" onClick={toggleDark}>
            {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t bg-background px-4 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            {links.map((l) => (
              <Link key={l.href} to={l.href} className="text-sm font-medium text-muted-foreground" onClick={() => setMobileOpen(false)}>
                {l.label}
              </Link>
            ))}
            {user ? (
              <>
                <Link to={dashboardPath} className="text-sm font-medium text-muted-foreground" onClick={() => setMobileOpen(false)}>Dashboard</Link>
                <Button variant="outline" size="sm" onClick={() => { handleSignOut(); setMobileOpen(false); }}>Log Out</Button>
              </>
            ) : (
              <div className="flex gap-2 pt-2">
                <Link to="/login" className="flex-1"><Button variant="outline" className="w-full" size="sm">Log In</Button></Link>
                <Link to="/register" className="flex-1"><Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90" size="sm">Get Started</Button></Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
