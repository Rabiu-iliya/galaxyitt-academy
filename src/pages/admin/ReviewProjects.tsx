import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { FolderKanban, Github, ExternalLink, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface ProjectRow {
  id: string; title: string; description: string | null;
  repo_url: string | null; live_url: string | null;
  status: "pending" | "approved" | "rejected";
  review_notes: string | null; created_at: string;
  student_id: string; program_id: string;
  programs: { name: string } | null;
  profiles: { full_name: string | null } | null;
}

const ReviewProjects = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<ProjectRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [acting, setActing] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("projects")
      .select("*, programs(name)")
      .order("created_at", { ascending: false });
    // Fetch profiles separately
    const items = (data as any[]) || [];
    const ids = [...new Set(items.map((p) => p.student_id))];
    let profMap: Record<string, string> = {};
    if (ids.length) {
      const { data: profs } = await supabase.from("profiles").select("user_id, full_name").in("user_id", ids);
      profMap = Object.fromEntries((profs || []).map((p) => [p.user_id, p.full_name || "Student"]));
    }
    setProjects(items.map((p) => ({ ...p, profiles: { full_name: profMap[p.student_id] || "Student" } })));
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const review = async (id: string, status: "approved" | "rejected") => {
    setActing(id);
    const { error } = await supabase
      .from("projects")
      .update({ status, review_notes: notes[id] || null, reviewed_by: user?.id, reviewed_at: new Date().toISOString() })
      .eq("id", id);
    setActing(null);
    if (error) { toast.error(error.message); return; }
    toast.success(`Project ${status}`);
    load();
  };

  if (loading) {
    return <div className="flex items-center justify-center p-12"><Loader2 className="h-8 w-8 animate-spin text-accent" /></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Project Submissions</h2>
        <p className="text-sm text-muted-foreground">Review student work. Approving issues their certificate.</p>
      </div>

      {projects.length === 0 ? (
        <Card><CardContent className="p-8 text-center"><FolderKanban className="h-12 w-12 mx-auto text-muted-foreground mb-3" /><p className="text-sm text-muted-foreground">No project submissions yet.</p></CardContent></Card>
      ) : (
        <div className="grid gap-4">
          {projects.map((p) => (
            <Card key={p.id}>
              <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0 pb-3">
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg">{p.title}</CardTitle>
                  <p className="text-xs text-muted-foreground mt-1">
                    {p.profiles?.full_name} • {p.programs?.name} • {new Date(p.created_at).toLocaleDateString()}
                  </p>
                </div>
                <Badge variant={p.status === "approved" ? "default" : p.status === "rejected" ? "destructive" : "outline"} className="capitalize">{p.status}</Badge>
              </CardHeader>
              <CardContent className="space-y-3">
                {p.description && <p className="text-sm">{p.description}</p>}
                <div className="flex flex-wrap gap-2">
                  {p.repo_url && <a href={p.repo_url} target="_blank" rel="noreferrer"><Button variant="outline" size="sm" className="gap-2"><Github className="h-4 w-4" />Repo</Button></a>}
                  {p.live_url && <a href={p.live_url} target="_blank" rel="noreferrer"><Button variant="outline" size="sm" className="gap-2"><ExternalLink className="h-4 w-4" />Live Demo</Button></a>}
                </div>
                {p.status === "pending" && (
                  <div className="space-y-2 pt-2 border-t">
                    <Textarea
                      placeholder="Review notes (optional)"
                      value={notes[p.id] || ""}
                      onChange={(e) => setNotes({ ...notes, [p.id]: e.target.value })}
                      rows={2}
                    />
                    <div className="flex gap-2">
                      <Button size="sm" disabled={acting === p.id} onClick={() => review(p.id, "approved")} className="gap-2">
                        <CheckCircle2 className="h-4 w-4" />Approve
                      </Button>
                      <Button size="sm" variant="destructive" disabled={acting === p.id} onClick={() => review(p.id, "rejected")} className="gap-2">
                        <XCircle className="h-4 w-4" />Reject
                      </Button>
                    </div>
                  </div>
                )}
                {p.review_notes && p.status !== "pending" && (
                  <div className="rounded-md bg-muted p-3 text-sm"><strong>Notes:</strong> {p.review_notes}</div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewProjects;
