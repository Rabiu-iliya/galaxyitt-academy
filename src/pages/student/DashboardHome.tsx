import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Video, FileText, Calendar, Award } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useEnrollment } from "@/hooks/useEnrollment";
import { Link } from "react-router-dom";

const DashboardHome = () => {
  const { profile, user } = useAuth();
  const { enrollment, loading } = useEnrollment();
  const [nextClass, setNextClass] = useState<{ title: string; scheduled_at: string } | null>(null);
  const [assignmentCount, setAssignmentCount] = useState(0);
  const [latestApp, setLatestApp] = useState<{ status: string; created_at: string } | null>(null);

  useEffect(() => {
    if (user) {
      (supabase as any)
        .from("scholarship_applications")
        .select("status, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle()
        .then(({ data }: any) => setLatestApp(data || null));
    }
    if (!enrollment) return;
    // Fetch next live class
    supabase
      .from("live_classes")
      .select("title, scheduled_at")
      .eq("program_id", enrollment.program_id)
      .gte("scheduled_at", new Date().toISOString())
      .order("scheduled_at")
      .limit(1)
      .single()
      .then(({ data }) => { if (data) setNextClass(data); });

    // Fetch assignment count
    supabase
      .from("assignments")
      .select("id", { count: "exact", head: true })
      .eq("program_id", enrollment.program_id)
      .then(({ count }) => setAssignmentCount(count || 0));
  }, [enrollment]);

  if (loading) return <div className="flex items-center justify-center p-12"><div className="h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent" /></div>;

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Welcome back, {profile?.full_name || "Student"}!</h2>
        <p className="text-muted-foreground">Here's your learning overview.</p>
      </div>

      {latestApp && (
        <Link to="/student/scholarship" className="block mb-4">
          <div className={`rounded-lg p-4 border flex items-center gap-3 ${
            latestApp.status === "approved" ? "bg-green-50 border-green-200 dark:bg-green-950/30 dark:border-green-900"
            : latestApp.status === "rejected" ? "bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-900"
            : "bg-yellow-50 border-yellow-200 dark:bg-yellow-950/30 dark:border-yellow-900"
          }`}>
            <Award className="h-5 w-5 text-accent flex-shrink-0" />
            <div className="flex-1 text-sm">
              <span className="font-semibold">Scholarship application:</span>{" "}
              <span className="capitalize">{latestApp.status}</span>
              {latestApp.status === "pending" && " — under review"}
              {latestApp.status === "approved" && " — congratulations! 🎉"}
              {latestApp.status === "rejected" && " — view notes"}
            </div>
          </div>
        </Link>
      )}

      {!enrollment ? (
        <Card>
          <CardContent className="p-8 text-center">
            <h3 className="text-lg font-semibold mb-2">No Program Enrolled</h3>
            <p className="text-muted-foreground mb-4">You haven't enrolled in any program yet.</p>
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
                {nextClass ? (
                  <div className="flex items-center gap-3">
                    <Video className="h-8 w-8 text-accent" />
                    <div>
                      <div className="font-semibold">{nextClass.title}</div>
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(nextClass.scheduled_at).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground">No upcoming classes scheduled.</p>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Assignments</CardTitle></CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <FileText className="h-8 w-8 text-accent" />
                  <div>
                    <div className="font-semibold">{assignmentCount} assignment{assignmentCount !== 1 ? "s" : ""}</div>
                    <div className="text-sm text-muted-foreground">Check your assignments page for details</div>
                  </div>
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
