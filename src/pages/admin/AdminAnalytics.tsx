import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCheck, BookOpen, Award } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export default function AdminAnalytics() {
  const [stats, setStats] = useState({ students: 0, instructors: 0, programs: 0, certificates: 0 });
  const [growth, setGrowth] = useState<{ month: string; users: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  const load = async () => {
    const [s, i, p, c, profiles] = await Promise.all([
      supabase.from("user_roles").select("*", { count: "exact", head: true }).eq("role", "student"),
      supabase.from("user_roles").select("*", { count: "exact", head: true }).eq("role", "instructor"),
      supabase.from("programs").select("*", { count: "exact", head: true }),
      supabase.from("certificates").select("*", { count: "exact", head: true }),
      supabase.from("profiles").select("created_at").order("created_at", { ascending: true }),
    ]);

    setStats({
      students: s.count || 0,
      instructors: i.count || 0,
      programs: p.count || 0,
      certificates: c.count || 0,
    });

    // Aggregate users per month (last 6 months)
    const buckets: Record<string, number> = {};
    const now = new Date();
    for (let k = 5; k >= 0; k--) {
      const d = new Date(now.getFullYear(), now.getMonth() - k, 1);
      const key = d.toLocaleString("default", { month: "short" });
      buckets[key] = 0;
    }
    (profiles.data || []).forEach((row: any) => {
      const d = new Date(row.created_at);
      const key = d.toLocaleString("default", { month: "short" });
      if (key in buckets) buckets[key]++;
    });
    setGrowth(Object.entries(buckets).map(([month, users]) => ({ month, users })));
    setLoading(false);
  };

  if (loading) return <div className="flex items-center justify-center p-12"><div className="h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent" /></div>;

  const cards = [
    { label: "Students", value: stats.students, icon: Users },
    { label: "Instructors", value: stats.instructors, icon: UserCheck },
    { label: "Programs", value: stats.programs, icon: BookOpen },
    { label: "Certificates", value: stats.certificates, icon: Award },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Analytics</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(({ label, value, icon: Icon }) => (
          <Card key={label}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-accent/20 flex items-center justify-center"><Icon className="h-5 w-5 text-accent" /></div>
              <div>
                <div className="text-xs text-muted-foreground">{label}</div>
                <div className="text-2xl font-bold">{value}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader><CardTitle>User Growth (last 6 months)</CardTitle></CardHeader>
        <CardContent className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={growth}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="month" className="text-xs" />
              <YAxis allowDecimals={false} className="text-xs" />
              <Tooltip />
              <Line type="monotone" dataKey="users" stroke="hsl(var(--accent))" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}