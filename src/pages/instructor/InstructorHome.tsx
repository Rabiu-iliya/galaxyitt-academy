import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Users, Layers, ClipboardCheck } from "lucide-react";

const InstructorHome = () => {
  const { profile, user } = useAuth();
  const [stats, setStats] = useState({ cohorts: 0, students: 0, submissions: 0 });

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data: cohorts } = await supabase.from("cohorts").select("id").eq("instructor_id", user.id);
      const cohortIds = (cohorts || []).map((c) => c.id);

      let students = 0;
      if (cohortIds.length) {
        const { data: enr } = await supabase.from("enrollments").select("user_id").in("cohort_id", cohortIds);
        students = new Set((enr || []).map((e) => e.user_id)).size;
      }

      // Pending submissions on assignments created by this instructor
      const { data: assignments } = await supabase.from("assignments").select("id").eq("created_by", user.id);
      const aIds = (assignments || []).map((a) => a.id);
      let submissions = 0;
      if (aIds.length) {
        const { count } = await supabase.from("submissions").select("*", { count: "exact", head: true }).in("assignment_id", aIds).is("grade", null);
        submissions = count || 0;
      }

      setStats({ cohorts: cohortIds.length, students, submissions });
    })();
  }, [user]);

  const cards = [
    { label: "My Cohorts", value: stats.cohorts, icon: Layers },
    { label: "My Students", value: stats.students, icon: Users },
    { label: "Pending Submissions", value: stats.submissions, icon: ClipboardCheck },
  ];

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Welcome, {profile?.full_name || "Instructor"}!</h2>
        <p className="text-muted-foreground">Manage your cohorts and students.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map(({ label, value, icon: Icon }) => (
          <Card key={label}>
            <CardHeader className="pb-2 flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
              <Icon className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent><div className="text-2xl font-bold">{value}</div></CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default InstructorHome;
