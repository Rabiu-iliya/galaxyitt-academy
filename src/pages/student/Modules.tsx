import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lock, PlayCircle, CheckCircle, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useEnrollment } from "@/hooks/useEnrollment";
import { Link } from "react-router-dom";

interface Module {
  id: string;
  title: string;
  description: string | null;
  order_number: number;
  lesson_count: number;
}

const Modules = () => {
  const { enrollment, loading: enrollLoading } = useEnrollment();
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!enrollment) return;
    const fetchModules = async () => {
      const { data: mods } = await supabase
        .from("modules")
        .select("id, title, description, order_number")
        .eq("program_id", enrollment.program_id)
        .order("order_number");

      if (mods) {
        // Fetch lesson counts per module
        const modulesWithCounts = await Promise.all(
          mods.map(async (m) => {
            const { count } = await supabase
              .from("lessons")
              .select("id", { count: "exact", head: true })
              .eq("module_id", m.id);
            return { ...m, lesson_count: count || 0 };
          })
        );
        setModules(modulesWithCounts);
      }
      setLoading(false);
    };
    fetchModules();
  }, [enrollment]);

  if (enrollLoading || loading) {
    return <div className="flex items-center justify-center p-12"><div className="h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent" /></div>;
  }

  if (!enrollment) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Modules</h2>
        <Card><CardContent className="p-8 text-center"><p className="text-muted-foreground">Enroll in a program to access modules.</p></CardContent></Card>
      </div>
    );
  }

  if (!enrollment.is_paid) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Modules</h2>
        <Card><CardContent className="p-8 text-center">
          <Lock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold">Payment Required</h3>
          <p className="text-muted-foreground mt-2">Complete your payment to access course modules.</p>
        </CardContent></Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Modules</h2>
      {modules.length === 0 ? (
        <Card><CardContent className="p-8 text-center"><p className="text-muted-foreground">No modules available yet for this program.</p></CardContent></Card>
      ) : (
        <div className="space-y-3">
          {modules.map((m, i) => (
            <Link key={m.id} to={`/student/modules/${m.id}`}>
              <Card className="hover:bg-accent/5 transition-colors cursor-pointer">
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 text-accent font-bold">
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold">{m.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {m.lesson_count} lesson{m.lesson_count !== 1 ? "s" : ""}
                      {m.description && ` · ${m.description}`}
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Modules;
