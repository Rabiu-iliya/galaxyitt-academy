import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const MyProgram = () => {
  const { user } = useAuth();
  const [enrollment, setEnrollment] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("enrollments")
      .select("*, programs(*), cohorts(*)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .single()
      .then(({ data }) => { setEnrollment(data); setLoading(false); });
  }, [user]);

  if (loading) return <div className="flex items-center justify-center p-12"><div className="h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent" /></div>;

  if (!enrollment) return (
    <Card><CardContent className="p-8 text-center">
      <h3 className="text-lg font-semibold">No Program Enrolled</h3>
      <p className="text-muted-foreground mt-2">Visit <a href="/programs" className="text-accent hover:underline">Programs</a> to enroll.</p>
    </CardContent></Card>
  );

  const program = enrollment.programs;
  const cohort = enrollment.cohorts;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">My Program</h2>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">{program.name}</CardTitle>
            <Badge className="capitalize">{enrollment.status}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">{program.description}</p>
          <div className="grid grid-cols-3 gap-4">
            <div className="flex items-center gap-2 text-sm"><Clock className="h-4 w-4 text-accent" /> {program.duration}</div>
            <div className="flex items-center gap-2 text-sm"><Users className="h-4 w-4 text-accent" /> Cohort-based</div>
            <div className="text-sm font-semibold text-accent">₦{Number(program.price).toLocaleString()}</div>
          </div>
          {program.highlights && (
            <div>
              <h4 className="font-semibold mb-2">What You'll Learn</h4>
              <div className="grid gap-2 sm:grid-cols-2">
                {program.highlights.map((h: string) => (
                  <div key={h} className="flex items-center gap-2 text-sm"><CheckCircle2 className="h-4 w-4 text-accent" />{h}</div>
                ))}
              </div>
            </div>
          )}
          <div className="border-t pt-4">
            <h4 className="font-semibold mb-1">Cohort: {cohort.name}</h4>
            <p className="text-sm text-muted-foreground">Starts: {new Date(cohort.start_date).toLocaleDateString()} — Ends: {new Date(cohort.end_date).toLocaleDateString()}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MyProgram;
