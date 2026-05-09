import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, BookOpen, Clock, Layers } from "lucide-react";

export default function InstructorLessons() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [cohorts, setCohorts] = useState<any[]>([]);
  const [selectedCohort, setSelectedCohort] = useState<string>("");
  const [modules, setModules] = useState<any[]>([]);
  const [lessons, setLessons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [moduleDialog, setModuleDialog] = useState(false);
  const [moduleForm, setModuleForm] = useState({ title: "", description: "" });
  const [lessonDialog, setLessonDialog] = useState<string | null>(null); // module_id
  const [lessonForm, setLessonForm] = useState({ title: "", content: "", video_url: "" });

  useEffect(() => {
    if (!user) return;
    supabase.from("cohorts").select("id, name, program_id, programs(name)").eq("instructor_id", user.id)
      .then(({ data }) => {
        setCohorts(data || []);
        if (data && data.length) setSelectedCohort(data[0].id);
        setLoading(false);
      });
  }, [user]);

  const loadContent = async () => {
    if (!selectedCohort) { setModules([]); setLessons([]); return; }
    const [{ data: mods }, { data: less }] = await Promise.all([
      supabase.from("modules").select("*").eq("cohort_id", selectedCohort).order("order_number"),
      supabase.from("lessons").select("*").eq("cohort_id", selectedCohort).order("order_number"),
    ]);
    setModules(mods || []);
    setLessons(less || []);
  };
  useEffect(() => { loadContent(); }, [selectedCohort]);

  const cohort = cohorts.find((c) => c.id === selectedCohort);

  const createModule = async () => {
    if (!moduleForm.title || !cohort || !user) return;
    const { error } = await supabase.from("modules").insert({
      title: moduleForm.title,
      description: moduleForm.description,
      cohort_id: cohort.id,
      program_id: cohort.program_id,
      instructor_id: user.id,
      order_number: modules.length,
    });
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Module created" });
    setModuleForm({ title: "", description: "" });
    setModuleDialog(false);
    loadContent();
  };

  const createLesson = async () => {
    if (!lessonForm.title || !lessonDialog || !cohort || !user) return;
    const moduleLessons = lessons.filter((l) => l.module_id === lessonDialog);
    const { error } = await supabase.from("lessons").insert({
      title: lessonForm.title,
      content: lessonForm.content,
      video_url: lessonForm.video_url || null,
      module_id: lessonDialog,
      cohort_id: cohort.id,
      instructor_id: user.id,
      order_number: moduleLessons.length,
    });
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Lesson added" });
    setLessonForm({ title: "", content: "", video_url: "" });
    setLessonDialog(null);
    loadContent();
  };

  if (loading) return <div className="flex items-center justify-center p-12"><div className="h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent" /></div>;

  if (!cohorts.length) {
    return (
      <Card><CardContent className="p-8 text-center text-muted-foreground">
        You have no assigned cohorts yet. Ask an admin to assign you a cohort before creating modules and lessons.
      </CardContent></Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h2 className="text-2xl font-bold">Modules & Lessons</h2>
        <div className="flex items-center gap-2">
          <Select value={selectedCohort} onValueChange={setSelectedCohort}>
            <SelectTrigger className="w-[260px]"><SelectValue placeholder="Select cohort" /></SelectTrigger>
            <SelectContent>
              {cohorts.map((c) => <SelectItem key={c.id} value={c.id}>{c.name} — {c.programs?.name}</SelectItem>)}
            </SelectContent>
          </Select>
          <Button onClick={() => setModuleDialog(true)} className="bg-accent text-accent-foreground hover:bg-accent/90">
            <Plus className="h-4 w-4 mr-1" /> Add Module
          </Button>
        </div>
      </div>

      {modules.length === 0 ? (
        <Card><CardContent className="p-8 text-center text-muted-foreground">No modules yet for this cohort. Create one to get started.</CardContent></Card>
      ) : (
        <div className="space-y-6">
          {modules.map((m) => {
            const moduleLessons = lessons.filter((l) => l.module_id === m.id);
            return (
              <Card key={m.id} className="rounded-xl">
                <CardHeader className="flex-row items-center justify-between space-y-0">
                  <div className="flex items-center gap-2">
                    <Layers className="h-5 w-5 text-accent" />
                    <CardTitle className="text-lg">{m.title}</CardTitle>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => setLessonDialog(m.id)}>
                    <Plus className="h-4 w-4 mr-1" /> Add Lesson
                  </Button>
                </CardHeader>
                <CardContent>
                  {m.description && <p className="text-sm text-muted-foreground mb-3">{m.description}</p>}
                  {moduleLessons.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No lessons yet.</p>
                  ) : (
                    <div className="grid gap-3 md:grid-cols-2">
                      {moduleLessons.map((l) => (
                        <Card key={l.id} className="rounded-xl border-accent/20 hover:scale-[1.01] transition-transform">
                          <CardContent className="p-4 flex items-start gap-3">
                            <div className="h-9 w-9 rounded-lg bg-accent/20 flex items-center justify-center shrink-0"><BookOpen className="h-4 w-4 text-accent" /></div>
                            <div className="flex-1 min-w-0">
                              <div className="font-semibold truncate">{l.title}</div>
                              {l.content && <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{l.content}</p>}
                              <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1"><Clock className="h-3 w-3" />Lesson {l.order_number + 1}</div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Dialog open={moduleDialog} onOpenChange={setModuleDialog}>
        <DialogContent>
          <DialogHeader><DialogTitle>New Module</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="space-y-2"><Label>Title</Label><Input value={moduleForm.title} onChange={(e) => setModuleForm({ ...moduleForm, title: e.target.value })} /></div>
            <div className="space-y-2"><Label>Description</Label><Textarea rows={3} value={moduleForm.description} onChange={(e) => setModuleForm({ ...moduleForm, description: e.target.value })} /></div>
            <Button onClick={createModule} className="w-full bg-accent text-accent-foreground hover:bg-accent/90">Create Module</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!lessonDialog} onOpenChange={(o) => !o && setLessonDialog(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>New Lesson</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="space-y-2"><Label>Title</Label><Input value={lessonForm.title} onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })} /></div>
            <div className="space-y-2"><Label>Content</Label><Textarea rows={4} value={lessonForm.content} onChange={(e) => setLessonForm({ ...lessonForm, content: e.target.value })} /></div>
            <div className="space-y-2"><Label>Video URL (optional)</Label><Input value={lessonForm.video_url} onChange={(e) => setLessonForm({ ...lessonForm, video_url: e.target.value })} /></div>
            <Button onClick={createLesson} className="w-full bg-accent text-accent-foreground hover:bg-accent/90">Create Lesson</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}