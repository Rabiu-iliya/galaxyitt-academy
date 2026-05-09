import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserCheck, Phone } from "lucide-react";

export default function AdminInstructors() {
  const [instructors, setInstructors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  const load = async () => {
    const { data: roles } = await supabase
      .from("user_roles")
      .select("user_id")
      .eq("role", "instructor");
    const ids = (roles || []).map((r) => r.user_id);
    if (!ids.length) { setInstructors([]); setLoading(false); return; }

    const [{ data: profs }, { data: cohorts }] = await Promise.all([
      supabase.from("profiles").select("user_id, full_name, phone").in("user_id", ids),
      supabase.from("cohorts").select("instructor_id").in("instructor_id", ids),
    ]);

    const counts = (cohorts || []).reduce<Record<string, number>>((acc, c: any) => {
      acc[c.instructor_id] = (acc[c.instructor_id] || 0) + 1;
      return acc;
    }, {});

    setInstructors((profs || []).map((p: any) => ({ ...p, cohort_count: counts[p.user_id] || 0 })));
    setLoading(false);
  };

  if (loading) return <div className="flex items-center justify-center p-12"><div className="h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent" /></div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Instructors</h2>
      {instructors.length === 0 ? (
        <Card><CardContent className="p-8 text-center text-muted-foreground">No instructors yet. Assign the instructor role to a user from Students.</CardContent></Card>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {instructors.map((i) => (
            <Card key={i.user_id}>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-accent/20 flex items-center justify-center"><UserCheck className="h-5 w-5 text-accent" /></div>
                <div className="flex-1">
                  <div className="font-semibold">{i.full_name || "Unnamed"}</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1"><Phone className="h-3 w-3" />{i.phone || "—"}</div>
                </div>
                <Badge variant="outline">{i.cohort_count} cohorts</Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}