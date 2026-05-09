import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ManageCohorts = () => {
  const { toast } = useToast();
  const [cohorts, setCohorts] = useState<any[]>([]);
  const [programs, setPrograms] = useState<any[]>([]);
  const [instructors, setInstructors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ name: "", program_id: "", instructor_id: "", start_date: "", end_date: "", max_students: "30" });

  const fetchData = async () => {
    const [c, p, i] = await Promise.all([
      supabase.from("cohorts").select("*, programs(name)").order("start_date", { ascending: false }),
      supabase.from("programs").select("id, name").order("name"),
      supabase.from("user_roles").select("user_id, profiles!inner(full_name)").eq("role", "instructor"),
    ]);
    setCohorts(c.data || []);
    setPrograms(p.data || []);
    setInstructors(i.data || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleCreate = async () => {
    const { error } = await supabase.from("cohorts").insert({
      name: form.name,
      program_id: form.program_id,
      instructor_id: form.instructor_id || null,
      start_date: form.start_date,
      end_date: form.end_date,
      max_students: Number(form.max_students),
    });
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Cohort created!" });
    setDialogOpen(false);
    fetchData();
  };

  const handleAssignInstructor = async (cohortId: string, instructorId: string) => {
    const { error } = await supabase.from("cohorts").update({ instructor_id: instructorId || null }).eq("id", cohortId);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Instructor assigned" });
    fetchData();
  };

  if (loading) return <div className="flex items-center justify-center p-12"><div className="h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Manage Cohorts</h2>
        <Button onClick={() => setDialogOpen(true)} className="bg-accent text-accent-foreground hover:bg-accent/90">
          <Plus className="h-4 w-4 mr-1" /> Add Cohort
        </Button>
      </div>

      <div className="space-y-3">
        {cohorts.map((c) => (
          <Card key={c.id}>
            <CardContent className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 p-4">
              <div>
                <div className="font-semibold">{c.name}</div>
                <div className="text-sm text-muted-foreground">{(c.programs as any)?.name} · {c.max_students} max students</div>
                <div className="text-xs text-muted-foreground">{c.start_date} → {c.end_date}</div>
              </div>
              <div className="flex items-center gap-2">
                <Select value={c.instructor_id || ""} onValueChange={(v) => handleAssignInstructor(c.id, v)}>
                  <SelectTrigger className="w-[200px]"><SelectValue placeholder="Assign instructor" /></SelectTrigger>
                  <SelectContent>
                    {instructors.map((i) => (
                      <SelectItem key={i.user_id} value={i.user_id}>{i.profiles?.full_name || "Unnamed"}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Badge variant="outline" className="capitalize">{c.status}</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Create Cohort</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2"><Label>Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Cohort A — July 2026" /></div>
            <div className="space-y-2">
              <Label>Program</Label>
              <Select value={form.program_id} onValueChange={(v) => setForm({ ...form, program_id: v })}>
                <SelectTrigger><SelectValue placeholder="Select program" /></SelectTrigger>
                <SelectContent>{programs.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Instructor (optional)</Label>
              <Select value={form.instructor_id} onValueChange={(v) => setForm({ ...form, instructor_id: v })}>
                <SelectTrigger><SelectValue placeholder="Assign instructor" /></SelectTrigger>
                <SelectContent>
                  {instructors.map((i) => <SelectItem key={i.user_id} value={i.user_id}>{i.profiles?.full_name || "Unnamed"}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Start Date</Label><Input type="date" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} /></div>
              <div className="space-y-2"><Label>End Date</Label><Input type="date" value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })} /></div>
            </div>
            <div className="space-y-2"><Label>Max Students</Label><Input type="number" value={form.max_students} onChange={(e) => setForm({ ...form, max_students: e.target.value })} /></div>
            <Button onClick={handleCreate} className="w-full bg-accent text-accent-foreground hover:bg-accent/90">Create Cohort</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageCohorts;
