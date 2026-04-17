import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { FolderKanban, Plus, ExternalLink, Github, Loader2, CheckCircle2, XCircle, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useEnrollment } from "@/hooks/useEnrollment";
import { toast } from "sonner";

interface Project {
  id: string;
  title: string;
  description: string | null;
  repo_url: string | null;
  live_url: string | null;
  status: "pending" | "approved" | "rejected";
  review_notes: string | null;
  created_at: string;
}

const statusConfig = {
  pending: { icon: Clock, color: "bg-muted text-muted-foreground", label: "Pending Review" },
  approved: { icon: CheckCircle2, color: "bg-green-500/10 text-green-700 dark:text-green-400", label: "Approved" },
  rejected: { icon: XCircle, color: "bg-destructive/10 text-destructive", label: "Needs Revision" },
};

const Projects = () => {
  const { user } = useAuth();
  const { enrollment, loading: enrollLoading } = useEnrollment();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", repo_url: "", live_url: "" });

  const load = async () => {
    if (!user) return;
    setLoading(true);
    const { data } = await supabase
      .from("projects")
      .select("*")
      .eq("student_id", user.id)
      .order("created_at", { ascending: false });
    setProjects((data as Project[]) || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, [user]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !enrollment) return;
    if (!form.title.trim() || (!form.repo_url.trim() && !form.live_url.trim())) {
      toast.error("Title and at least one URL (repo or live) are required");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("projects").insert({
      student_id: user.id,
      program_id: enrollment.program_id,
      title: form.title.trim(),
      description: form.description.trim() || null,
      repo_url: form.repo_url.trim() || null,
      live_url: form.live_url.trim() || null,
    });
    setSubmitting(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Project submitted for review");
    setOpen(false);
    setForm({ title: "", description: "", repo_url: "", live_url: "" });
    load();
  };

  if (enrollLoading || loading) {
    return <div className="flex items-center justify-center p-12"><Loader2 className="h-8 w-8 animate-spin text-accent" /></div>;
  }

  if (!enrollment) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <FolderKanban className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
          <h3 className="font-semibold">Enroll in a program first</h3>
          <p className="text-sm text-muted-foreground mt-1">You need an active enrollment to submit projects.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h2 className="text-2xl font-bold">Projects</h2>
          <p className="text-sm text-muted-foreground">Submit your work to earn your certificate.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2"><Plus className="h-4 w-4" />Submit Project</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Submit New Project</DialogTitle></DialogHeader>
            <form onSubmit={submit} className="space-y-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input id="title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} maxLength={200} required />
              </div>
              <div>
                <Label htmlFor="desc">Description</Label>
                <Textarea id="desc" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} maxLength={1000} rows={3} />
              </div>
              <div>
                <Label htmlFor="repo">Repository URL</Label>
                <Input id="repo" type="url" placeholder="https://github.com/..." value={form.repo_url} onChange={(e) => setForm({ ...form, repo_url: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="live">Live URL</Label>
                <Input id="live" type="url" placeholder="https://..." value={form.live_url} onChange={(e) => setForm({ ...form, live_url: e.target.value })} />
              </div>
              <DialogFooter>
                <Button type="submit" disabled={submitting}>{submitting && <Loader2 className="h-4 w-4 animate-spin" />}Submit</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {projects.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <FolderKanban className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
            <h3 className="font-semibold">No projects yet</h3>
            <p className="text-sm text-muted-foreground mt-1">Submit your first project to get reviewed by an instructor.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {projects.map((p) => {
            const cfg = statusConfig[p.status];
            const Icon = cfg.icon;
            return (
              <Card key={p.id}>
                <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0 pb-3">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{p.title}</CardTitle>
                    {p.description && <p className="text-sm text-muted-foreground mt-1">{p.description}</p>}
                  </div>
                  <Badge className={cfg.color} variant="outline"><Icon className="h-3 w-3 mr-1" />{cfg.label}</Badge>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {p.repo_url && <a href={p.repo_url} target="_blank" rel="noreferrer"><Button variant="outline" size="sm" className="gap-2"><Github className="h-4 w-4" />Repo</Button></a>}
                    {p.live_url && <a href={p.live_url} target="_blank" rel="noreferrer"><Button variant="outline" size="sm" className="gap-2"><ExternalLink className="h-4 w-4" />Live</Button></a>}
                  </div>
                  {p.review_notes && (
                    <div className="rounded-md bg-muted p-3 text-sm">
                      <strong>Reviewer notes:</strong> {p.review_notes}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Projects;
