import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User } from "lucide-react";

export default function InstructorStudents() {
  const { user } = useAuth();
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data: cohorts } = await supabase.from("cohorts").select("id, name").eq("instructor_id", user.id);
      const cohortIds = (cohorts || []).map((c) => c.id);
      if (!cohortIds.length) { setStudents([]); setLoading(false); return; }
      const cohortMap = new Map((cohorts || []).map((c: any) => [c.id, c.name]));

      const { data: enrolls } = await supabase.from("enrollments").select("user_id, cohort_id, status").in("cohort_id", cohortIds);
      const userIds = Array.from(new Set((enrolls || []).map((e) => e.user_id)));
      if (!userIds.length) { setStudents([]); setLoading(false); return; }

      const { data: profs } = await supabase.from("profiles").select("user_id, full_name, phone").in("user_id", userIds);
      const profMap = new Map((profs || []).map((p: any) => [p.user_id, p]));

      setStudents((enrolls || []).map((e: any) => ({
        ...e,
        profile: profMap.get(e.user_id),
        cohort_name: cohortMap.get(e.cohort_id),
      })));
      setLoading(false);
    })();
  }, [user]);

  if (loading) return <div className="flex items-center justify-center p-12"><div className="h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent" /></div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">My Students</h2>
      {students.length === 0 ? (
        <Card><CardContent className="p-8 text-center text-muted-foreground">No students enrolled in your cohorts yet.</CardContent></Card>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {students.map((s, idx) => (
            <Card key={`${s.user_id}-${s.cohort_id}-${idx}`}>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-accent/20 flex items-center justify-center"><User className="h-5 w-5 text-accent" /></div>
                <div className="flex-1">
                  <div className="font-semibold">{s.profile?.full_name || "Unnamed"}</div>
                  <div className="text-xs text-muted-foreground">{s.cohort_name} · {s.profile?.phone || "—"}</div>
                </div>
                <Badge variant="outline" className="capitalize">{s.status}</Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}