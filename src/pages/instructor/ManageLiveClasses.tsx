import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Video, Plus, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

interface LiveClass {
  id: string;
  title: string;
  scheduled_at: string;
  meeting_link: string | null;
  program_id: string;
}

interface Program {
  id: string;
  name: string;
}

const ManageLiveClasses = () => {
  const { user } = useAuth();
  const [classes, setClasses] = useState<LiveClass[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [programId, setProgramId] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [meetingLink, setMeetingLink] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchClasses = async () => {
    const { data } = await supabase
      .from("live_classes")
      .select("id, title, scheduled_at, meeting_link, program_id")
      .order("scheduled_at", { ascending: false });
    setClasses(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchClasses();
    supabase.from("programs").select("id, name").then(({ data }) => setPrograms(data || []));
  }, []);

  const handleCreate = async () => {
    if (!title || !programId || !scheduledAt) return;
    const { error } = await supabase.from("live_classes").insert({
      title,
      program_id: programId,
      scheduled_at: new Date(scheduledAt).toISOString(),
      meeting_link: meetingLink || null,
      created_by: user?.id,
    });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Created", description: "Live class scheduled." });
      setShowForm(false);
      setTitle(""); setProgramId(""); setScheduledAt(""); setMeetingLink("");
      fetchClasses();
    }
  };

  const handleDelete = async (id: string) => {
    await supabase.from("live_classes").delete().eq("id", id);
    setClasses(prev => prev.filter(c => c.id !== id));
    toast({ title: "Deleted" });
  };

  if (loading) return <div className="flex items-center justify-center p-12"><div className="h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Live Classes</h2>
        <Button onClick={() => setShowForm(!showForm)}><Plus className="h-4 w-4 mr-1" /> Schedule Class</Button>
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
              <div><Label>Date & Time</Label><Input type="datetime-local" value={scheduledAt} onChange={e => setScheduledAt(e.target.value)} /></div>
              <div><Label>Meeting Link</Label><Input value={meetingLink} onChange={e => setMeetingLink(e.target.value)} placeholder="https://meet.google.com/..." /></div>
            </div>
            <Button onClick={handleCreate}>Create</Button>
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {classes.map(c => (
          <Card key={c.id}>
            <CardContent className="flex items-center gap-4 p-4">
              <Video className="h-6 w-6 text-accent" />
              <div className="flex-1">
                <div className="font-semibold">{c.title}</div>
                <div className="text-sm text-muted-foreground">{new Date(c.scheduled_at).toLocaleString()}</div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => handleDelete(c.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
            </CardContent>
          </Card>
        ))}
        {classes.length === 0 && <p className="text-muted-foreground text-center py-8">No live classes scheduled yet.</p>}
      </div>
    </div>
  );
};

export default ManageLiveClasses;
