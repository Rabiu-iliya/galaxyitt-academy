import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export default function AdminAnalytics() {
  const [stats, setStats] = useState({
    students: 0,
    instructors: 0,
    programs: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    const { count: students } = await supabase
      .from("user_roles")
      .select("*", { count: "exact", head: true })
      .eq("role", "student");

    const { count: instructors } = await supabase
      .from("user_roles")
      .select("*", { count: "exact", head: true })
      .eq("role", "instructor");

    const { count: programs } = await supabase
      .from("programs")
      .select("*", { count: "exact", head: true });

    setStats({
      students: students || 0,
      instructors: instructors || 0,
      programs: programs || 0,
    });
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Analytics</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 border rounded">Students: {stats.students}</div>
        <div className="p-4 border rounded">Instructors: {stats.instructors}</div>
        <div className="p-4 border rounded">Programs: {stats.programs}</div>
      </div>
    </div>
  );
}