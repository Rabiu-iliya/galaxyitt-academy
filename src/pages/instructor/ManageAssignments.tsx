import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Plus, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

interface Assignment {
  id: string;
  title: string;
  description: string | null;
  due_date: string | null;
  program_id: string;
}

const ManageAssignments = () => {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [programs, setPrograms] = useState<{ id: string; name: string }[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [programId, setProgramId] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchAssignments = async () => {
    const { data } = await supabase
      .from("assignments")
      .select("id, title, description, due_date, program_id")
      .order("created_at", { ascending: false });
    setAssignments(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchAssignments();
    supabase.from("programs").select("id, name").then(({ data }) => setPrograms(data || []));
  }, []);

  const handleCreate = async () => {
    if (!title || !programId) return;
    const { error } = await supabase.from("assignments").insert({
      title,
      description: description || null,
      program_id: programId,
      due_date: dueDate ? new Date(dueDate).toISOString() : null,
      created_by: user?.id,
    });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Created", description: "Assignment created." });
      setShowForm(false);
      setTitle(""); setDescription(""); setProgramId(""); setDueDate("");
      fetchAssignments();
    }
  };

  const handleDelete = async (id: string) => {
    await supabase.from("assignments").delete().eq("id", id);
    setAssignments(prev => prev.filter(a => a.id !== id));
    toast({ title: "Deleted" });
  };

  if (loading) return <div className="flex items-center justify-center p-12"><div className="h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Assignments</h2>
        <Button onClick={() => setShowForm(!showForm)}><Plus className="h-4 w-4 mr-1" /> New Assignment</Button>
      </div>

      {showForm && (
        <Card>
          <CardContent className="p-4 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div><Label>Title</Label><Input value={title} onChange={e => setTitle(e.target.value)} /></div>
              <div>
                <Label>Program</Label>
                <Select value={programId} onValueChange={setProgramId}>
                  <SelectTrigger><SelectValue placeholder="Select program" /></SelectTrigger>
                  <SelectContent>{programs.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="sm:col-span-2"><Label>Description</Label><Textarea value={description} onChange={e => setDescription(e.target.value)} /></div>
              <div><Label>Due Date</Label><Input type="datetime-local" value={dueDate} onChange={e => setDueDate(e.target.value)} /></div>
            </div>
            <Button onClick={handleCreate}>Create</Button>
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {assignments.map(a => (
          <Card key={a.id}>
            <CardContent className="flex items-center gap-4 p-4">
              <FileText className="h-6 w-6 text-accent" />
              <div className="flex-1">
                <div className="font-semibold">{a.title}</div>
                {a.due_date && <div className="text-sm text-muted-foreground">Due: {new Date(a.due_date).toLocaleDateString()}</div>}
              </div>
              <Button variant="ghost" size="icon" onClick={() => handleDelete(a.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
            </CardContent>
          </Card>
        ))}
        {assignments.length === 0 && <p className="text-muted-foreground text-center py-8">No assignments created yet.</p>}
      </div>
    </div>
  );
};

export default ManageAssignments;
