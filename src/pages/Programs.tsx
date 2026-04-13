import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ProgramCard } from "@/components/ProgramCard";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const Programs = () => {
  const [programs, setPrograms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("programs").select("*").order("name").then(({ data }) => {
      setPrograms(data || []);
      setLoading(false);
    });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="bg-primary py-16">
        <div className="container mx-auto px-4 text-center">
          <Badge className="mb-4 bg-accent/20 text-accent border-accent/30">{programs.length} Programs</Badge>
          <h1 className="text-3xl font-bold text-primary-foreground md:text-5xl">Our Programs</h1>
          <p className="mx-auto mt-4 max-w-2xl text-primary-foreground/70">
            Industry-aligned, cohort-based programs designed to launch your tech career in 12 weeks.
          </p>
        </div>
      </section>
      <section className="py-16">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="flex justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent" /></div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {programs.map((p) => (
                <ProgramCard key={p.id} program={p} />
              ))}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Programs;
