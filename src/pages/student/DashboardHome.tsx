import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Video, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface EnrollmentData {
  id: string;
  status: string;
  program: { name: string; price: number; duration: string };
  cohort: { name: string; start_date: string };
}

const DashboardHome = () => {
  const { user } = useAuth();
  const { profile } = useAuth();
  const [enrollment, setEnrollment] = useState<EnrollmentData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      const { data } = await supabase
        .from("enrollments")
        .select("id, status, programs(name, price, duration), cohorts(name, start_date)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();
      if (data) {
        setEnrollment({
          id: data.id,
          status: data.status,
          program: data.programs as any,
          cohort: data.cohorts as any,
        });
      }
      setLoading(false);
    };
    fetch();
  }, [user]);

  if (loading) return <div className="flex items-center justify-center p-12"><div className="h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent" /></div>;

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Welcome back, {profile?.full_name || "Student"}!</h2>
        <p className="text-muted-foreground">Here's your learning overview.</p>
      </div>

      {!enrollment ? (
        <Card>
          <CardContent className="p-8 text-center">
            <h3 className="text-lg font-semibold mb-2">No Program Enrolled</h3>
            <p className="text-muted-foreground mb-4">You haven't enrolled in any program yet. Browse our programs to get started.</p>
            <a href="/programs" className="text-accent hover:underline font-medium">Browse Programs →</a>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Program</CardTitle></CardHeader>
              <CardContent><div className="text-lg font-bold">{enrollment.program.name}</div></CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Cohort</CardTitle></CardHeader>
              <CardContent><div className="text-lg font-bold">{enrollment.cohort.name}</div></CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Progress</CardTitle></CardHeader>
              <CardContent>
                <div className="text-lg font-bold">0%</div>
                <Progress value={0} className="mt-2 h-2" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Status</CardTitle></CardHeader>
              <CardContent>
                <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 capitalize">{enrollment.status}</Badge>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader><CardTitle>Next Live Class</CardTitle></CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <Video className="h-8 w-8 text-accent" />
                  <div>
                    <div className="font-semibold">Introduction to {enrollment.program.name}</div>
                    <div className="text-sm text-muted-foreground">Coming soon</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Upcoming Assignments</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Foundation Project</span>
                  <Badge variant="outline">Coming soon</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardHome;
