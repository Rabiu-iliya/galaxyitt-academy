import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, PlayCircle, FileText, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Lesson {
  id: string;
  title: string;
  content: string | null;
  video_url: string | null;
  order_number: number;
}

const ModuleDetail = () => {
  const { moduleId } = useParams<{ moduleId: string }>();
  const [moduleTitle, setModuleTitle] = useState("");
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!moduleId) return;
    const fetch = async () => {
      const { data: mod } = await supabase
        .from("modules")
        .select("title")
        .eq("id", moduleId)
        .single();
      if (mod) setModuleTitle(mod.title);

      const { data } = await supabase
        .from("lessons")
        .select("id, title, content, video_url, order_number")
        .eq("module_id", moduleId)
        .order("order_number");
      setLessons(data || []);
      setLoading(false);
    };
    fetch();
  }, [moduleId]);

  if (loading) {
    return <div className="flex items-center justify-center p-12"><div className="h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link to="/student/modules">
          <Button variant="ghost" size="icon"><ArrowLeft className="h-5 w-5" /></Button>
        </Link>
        <h2 className="text-2xl font-bold">{moduleTitle}</h2>
      </div>

      {lessons.length === 0 ? (
        <Card><CardContent className="p-8 text-center"><p className="text-muted-foreground">No lessons available yet.</p></CardContent></Card>
      ) : (
        <div className="space-y-3">
          {lessons.map((l, i) => (
            <Link key={l.id} to={`/student/lessons/${l.id}`}>
              <Card className="hover:bg-accent/5 transition-colors cursor-pointer">
                <CardContent className="flex items-center gap-4 p-4">
                  {l.video_url ? (
                    <PlayCircle className="h-6 w-6 text-accent" />
                  ) : (
                    <FileText className="h-6 w-6 text-muted-foreground" />
                  )}
                  <div className="flex-1">
                    <div className="font-semibold">Lesson {i + 1}: {l.title}</div>
                    {l.video_url && <span className="text-xs text-accent">Video lesson</span>}
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

export default ModuleDetail;
