import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Award, Loader2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface CertRow {
  id: string;
  issued_at: string | null;
  program_id: string;
  programs: { name: string } | null;
}

const Certificates = () => {
  const { user, profile } = useAuth();
  const [certs, setCerts] = useState<CertRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase
        .from("certificates")
        .select("id, issued_at, program_id, programs(name)")
        .eq("user_id", user.id)
        .order("issued_at", { ascending: false });
      setCerts((data as any) || []);
      setLoading(false);
    })();
  }, [user]);

  if (loading) {
    return <div className="flex items-center justify-center p-12"><Loader2 className="h-8 w-8 animate-spin text-accent" /></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Certificates</h2>
        <p className="text-sm text-muted-foreground">Awarded when your final project is approved.</p>
      </div>

      {certs.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Award className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <h3 className="font-semibold">No certificates yet</h3>
            <p className="text-sm text-muted-foreground mt-1">Complete and submit a project for instructor approval to earn your certificate.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {certs.map((c) => (
            <Card key={c.id} className="overflow-hidden border-2 border-accent/40 bg-gradient-to-br from-background to-accent/5">
              <CardContent className="p-8 md:p-12">
                <div className="text-center space-y-4">
                  <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-accent/10">
                    <Award className="h-10 w-10 text-accent" />
                  </div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">Certificate of Completion</p>
                  <h3 className="text-2xl md:text-3xl font-bold">GalaxyITT Technology Academy</h3>
                  <div className="h-px w-24 bg-accent/40 mx-auto" />
                  <p className="text-sm text-muted-foreground">This is to certify that</p>
                  <p className="text-2xl md:text-3xl font-bold text-accent">{profile?.full_name || "Student"}</p>
                  <p className="text-sm text-muted-foreground">has successfully completed the program</p>
                  <p className="text-lg md:text-xl font-semibold">{c.programs?.name || "—"}</p>
                  <p className="text-xs text-muted-foreground pt-4">
                    Issued on {c.issued_at ? new Date(c.issued_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "—"}
                  </p>
                  <p className="text-[10px] text-muted-foreground/60 font-mono">ID: {c.id.slice(0, 8).toUpperCase()}</p>
                  <Button variant="outline" className="mt-4 gap-2" onClick={() => window.print()}>
                    <Download className="h-4 w-4" />Print / Save
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Certificates;
