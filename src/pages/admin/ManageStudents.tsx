import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

const ManageStudents = () => {
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("enrollments")
      .select("*, profiles!enrollments_user_id_fkey(full_name), programs(name), cohorts(name)")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        // If the join fails, fetch without profile join
        if (error) {
          supabase.from("enrollments").select("*, programs(name), cohorts(name)")
            .order("created_at", { ascending: false })
            .then(({ data: d }) => { setEnrollments(d || []); setLoading(false); });
        } else {
          setEnrollments(data || []);
          setLoading(false);
        }
      });
  }, []);

  if (loading) return <div className="flex items-center justify-center p-12"><div className="h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent" /></div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Students & Enrollments</h2>
      {enrollments.length === 0 ? (
        <Card><CardContent className="p-8 text-center text-muted-foreground">No enrollments yet.</CardContent></Card>
      ) : (
        <div className="space-y-3">
          {enrollments.map((e) => (
            <Card key={e.id}>
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <div className="font-semibold">{(e.profiles as any)?.full_name || "Student"}</div>
                  <div className="text-sm text-muted-foreground">{(e.programs as any)?.name} — {(e.cohorts as any)?.name}</div>
                </div>
                <Badge variant="outline" className="capitalize">{e.status}</Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageStudents;
