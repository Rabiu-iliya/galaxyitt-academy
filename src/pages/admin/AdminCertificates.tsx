import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Award } from "lucide-react";

export default function AdminCertificates() {
  const [certs, setCerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  const load = async () => {
    const { data: rows } = await supabase
      .from("certificates")
      .select("id, issued_at, user_id, program_id")
      .order("issued_at", { ascending: false });
    const userIds = Array.from(new Set((rows || []).map((r) => r.user_id).filter(Boolean)));
    const programIds = Array.from(new Set((rows || []).map((r) => r.program_id).filter(Boolean)));
    const [{ data: profs }, { data: progs }] = await Promise.all([
      userIds.length ? supabase.from("profiles").select("user_id, full_name").in("user_id", userIds) : Promise.resolve({ data: [] as any[] }),
      programIds.length ? supabase.from("programs").select("id, name").in("id", programIds) : Promise.resolve({ data: [] as any[] }),
    ]);
    const profMap = new Map((profs || []).map((p: any) => [p.user_id, p.full_name]));
    const progMap = new Map((progs || []).map((p: any) => [p.id, p.name]));
    setCerts((rows || []).map((r: any) => ({ ...r, student_name: profMap.get(r.user_id), program_name: progMap.get(r.program_id) })));
    setLoading(false);
  };

  if (loading) return <div className="flex items-center justify-center p-12"><div className="h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent" /></div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Certificates</h2>
      {certs.length === 0 ? (
        <Card><CardContent className="p-8 text-center text-muted-foreground">No certificates issued yet.</CardContent></Card>
      ) : (
        <div className="space-y-2">
          {certs.map((c) => (
            <Card key={c.id}>
              <CardContent className="p-4 flex items-center gap-3">
                <Award className="h-5 w-5 text-accent" />
                <div className="flex-1">
                  <div className="font-semibold">{c.student_name || "—"}</div>
                  <div className="text-xs text-muted-foreground">{c.program_name || "—"} · {new Date(c.issued_at).toLocaleDateString()}</div>
                </div>
                <code className="text-xs text-muted-foreground">{c.id.slice(0, 8)}</code>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}