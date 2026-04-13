import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Users, BookOpen, Layers, CreditCard } from "lucide-react";
import { CardHeader, CardTitle } from "@/components/ui/card";

const AdminHome = () => {
  const [stats, setStats] = useState({ students: 0, programs: 0, cohorts: 0, revenue: 0 });
  const [recentEnrollments, setRecentEnrollments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const [progs, cohorts, enrollments, payments] = await Promise.all([
        supabase.from("programs").select("id", { count: "exact", head: true }),
        supabase.from("cohorts").select("id", { count: "exact", head: true }),
        supabase.from("enrollments").select("id, created_at, programs(name)").order("created_at", { ascending: false }).limit(5),
        supabase.from("payments").select("amount").eq("status", "completed"),
      ]);
      const uniqueStudents = new Set((enrollments.data || []).map((e: any) => e.user_id)).size;
      const totalRevenue = (payments.data || []).reduce((sum: number, p: any) => sum + Number(p.amount), 0);
      setStats({
        students: enrollments.count || enrollments.data?.length || 0,
        programs: progs.count || 0,
        cohorts: cohorts.count || 0,
        revenue: totalRevenue,
      });
      setRecentEnrollments(enrollments.data || []);
      setLoading(false);
    };
    fetch();
  }, []);

  if (loading) return <div className="flex items-center justify-center p-12"><div className="h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent" /></div>;

  const statCards = [
    { label: "Enrollments", value: stats.students, icon: Users },
    { label: "Programs", value: stats.programs, icon: BookOpen },
    { label: "Cohorts", value: stats.cohorts, icon: Layers },
    { label: "Revenue", value: `₦${stats.revenue.toLocaleString()}`, icon: CreditCard },
  ];

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Admin Overview</h2>
        <p className="text-muted-foreground">Manage your academy from one place.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((s) => (
          <Card key={s.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{s.label}</CardTitle>
              <s.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent><div className="text-2xl font-bold">{s.value}</div></CardContent>
          </Card>
        ))}
      </div>
      <div className="mt-6">
        <Card>
          <CardHeader><CardTitle>Recent Enrollments</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {recentEnrollments.length === 0 ? (
              <p className="text-muted-foreground text-sm">No enrollments yet.</p>
            ) : recentEnrollments.map((e) => (
              <div key={e.id} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                <span className="text-sm">{(e.programs as any)?.name || "Program"}</span>
                <span className="text-xs text-muted-foreground">{new Date(e.created_at).toLocaleDateString()}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminHome;
