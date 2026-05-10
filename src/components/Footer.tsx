import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { GraduationCap, Mail, Phone, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface FooterProgram { id: string; name: string; slug: string; }

export function Footer() {
  const [programs, setPrograms] = useState<FooterProgram[]>([]);

  useEffect(() => {
    supabase
      .from("programs")
      .select("id, name, slug")
      .order("name")
      .limit(6)
      .then(({ data }) => setPrograms(data || []));
  }, []);

  return (
    <footer className="border-t bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-10">
        <div className="grid gap-8 sm:grid-cols-2 md:gap-6 lg:grid-cols-4">
          <div>
            <div className="mb-4 flex items-center gap-2">
              <GraduationCap className="h-8 w-8 text-accent" />
              <span className="text-lg font-bold">
                Galaxy<span className="text-accent">ITT</span>
              </span>
            </div>
            <p className="text-sm text-primary-foreground/70">
              A premium, cohort-based technology learning academy building the next generation of tech professionals.
            </p>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-accent">Quick Links</h4>
            <div className="flex flex-col gap-2 text-sm text-primary-foreground/70">
              <Link to="/programs" className="transition-colors hover:text-accent">Programs</Link>
              <Link to="/#about" className="transition-colors hover:text-accent">About Us</Link>
              <Link to="/#scholarship" className="transition-colors hover:text-accent">Scholarship</Link>
              <Link to="/#pricing" className="transition-colors hover:text-accent">Pricing</Link>
              <Link to="/register" className="transition-colors hover:text-accent">Apply Now</Link>
              <Link to="/login" className="transition-colors hover:text-accent">Log In</Link>
            </div>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-accent">Programs</h4>
            <div className="flex flex-col gap-2 text-sm text-primary-foreground/70">
              {programs.length === 0 ? (
                <span className="text-primary-foreground/50">Loading…</span>
              ) : (
                programs.map((p) => (
                  <Link key={p.id} to={`/programs/${p.slug}`} className="transition-colors hover:text-accent">
                    {p.name}
                  </Link>
                ))
              )}
            </div>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-accent">Contact</h4>
            <div className="flex flex-col gap-3 text-sm text-primary-foreground/70">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>info@galaxyitt.com.ng</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>08039606006</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                <span>No. 2 Kiyawa Road, Dutse, Jigawa State</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-primary-foreground/20 pt-6 text-center text-xs sm:text-sm text-primary-foreground/50">
          © {new Date().getFullYear()} GalaxyITT Technology Academy. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
