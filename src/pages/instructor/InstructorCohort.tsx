import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Layers, Calendar } from "lucide-react";

export default function InstructorCohorts() {
  const { user } = useAuth();
  const [cohorts, setCohorts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    supabase.from("cohorts").select("*, programs(name)").eq("instructor_id", user.id)
      .order("start_date", { ascending: false })
      .then(({ data }) => { setCohorts(data || []); setLoading(false); });
  }, [user]);

  if (loading) return <div className="flex items-center justify-center p-12"><div className="h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent" /></div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">My Cohorts</h2>
      {cohorts.length === 0 ? (
        <Card><CardContent className="p-8 text-center text-muted-foreground">No cohorts assigned yet. Ask an admin to assign you a cohort.</CardContent></Card>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {cohorts.map((c) => (
            <Card key={c.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-accent/20 flex items-center justify-center"><Layers className="h-5 w-5 text-accent" /></div>
                <div className="flex-1">
                  <div className="font-semibold">{c.name}</div>
                  <div className="text-xs text-muted-foreground">{c.programs?.name}</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1"><Calendar className="h-3 w-3" />{c.start_date} → {c.end_date}</div>
                </div>
                <Badge variant="outline" className="capitalize">{c.status}</Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}