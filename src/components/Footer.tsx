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
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
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
              <Link to="/programs" className="hover:text-primary-foreground">Programs</Link>
              <Link to="/#about" className="hover:text-primary-foreground">About Us</Link>
              <Link to="/#scholarship" className="hover:text-primary-foreground">Scholarship</Link>
              <Link to="/#pricing" className="hover:text-primary-foreground">Pricing</Link>
              <Link to="/register" className="hover:text-primary-foreground">Apply Now</Link>
            </div>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-accent">Programs</h4>
            <div className="flex flex-col gap-2 text-sm text-primary-foreground/70">
              {programs.length === 0 ? (
                <span className="text-primary-foreground/50">Loading…</span>
              ) : (
                programs.map((p) => (
                  <Link key={p.id} to={`/programs/${p.slug}`} className="hover:text-primary-foreground">
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
                <MapPin className="h-4 w-4" />
                <span>No. 2 Kiyawa Road, Dutse, Jigawa State</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-primary-foreground/20 pt-8 text-center text-sm text-primary-foreground/50">
          © {new Date().getFullYear()} GalaxyITT Technology Academy. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
