import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Award, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

interface Application {
  id: string;
  program_id: string;
  reason: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
  review_notes: string | null;
}

const statusVariant = (s: string) =>
  s === "approved" ? "bg-green-100 text-green-700"
  : s === "rejected" ? "bg-red-100 text-red-700"
  : "bg-yellow-100 text-yellow-700";

const Scholarship = () => {
  const { user } = useAuth();
  const [programs, setPrograms] = useState<{ id: string; name: string }[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [programId, setProgramId] = useState("");
  const [reason, setReason] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    if (!user) return;
    const [{ data: progs }, { data: apps }, { data: prof }] = await Promise.all([
      supabase.from("programs").select("id, name").order("name"),
      (supabase as any).from("scholarship_applications")
        .select("id, program_id, reason, status, created_at, review_notes")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false }),
      supabase.from("profiles").select("full_name, phone").eq("user_id", user.id).maybeSingle(),
    ]);
    setPrograms(progs || []);
    setApplications((apps as Application[]) || []);
    setFullName((prof as any)?.full_name || "");
    setPhone((prof as any)?.phone || "");
    setEmail(user.email || "");
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, [user]);

  const handleSubmit = async () => {
    if (!user || !programId || !reason.trim() || !fullName.trim() || !email.trim() || !phone.trim()) {
      toast({ title: "Missing fields", description: "Please fill all fields.", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    const { error } = await (supabase as any).from("scholarship_applications").insert({
      user_id: user.id,
      program_id: programId,
      reason: reason.trim(),
      full_name: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
    });
    setSubmitting(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Application submitted", description: "We'll review and get back to you soon." });
      setShowForm(false);
      setProgramId("");
      setReason("");
      fetchData();
    }
  };

  const programName = (id: string) => programs.find(p => p.id === id)?.name || "Unknown";

  if (loading) return <div className="flex items-center justify-center p-12"><div className="h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2"><Award className="h-6 w-6 text-accent" /> Scholarship</h2>
          <p className="text-sm text-muted-foreground">Apply for financial assistance to fund your learning journey.</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}><Plus className="h-4 w-4 mr-1" /> Apply for Scholarship</Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader><CardTitle>New Scholarship Application</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>Full Name</Label>
                <input className="w-full h-10 px-3 rounded-md border border-input bg-background" value={fullName} onChange={e => setFullName(e.target.value)} maxLength={100} />
              </div>
              <div>
                <Label>Email</Label>
                <input type="email" className="w-full h-10 px-3 rounded-md border border-input bg-background" value={email} onChange={e => setEmail(e.target.value)} maxLength={255} />
              </div>
              <div className="sm:col-span-2">
                <Label>Phone</Label>
                <input className="w-full h-10 px-3 rounded-md border border-input bg-background" value={phone} onChange={e => setPhone(e.target.value)} maxLength={30} placeholder="08039606006" />
              </div>
            </div>
            <div>
              <Label>Program</Label>
              <Select value={programId} onValueChange={setProgramId}>
                <SelectTrigger><SelectValue placeholder="Select a program" /></SelectTrigger>
                <SelectContent>
                  {programs.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Why do you deserve this scholarship?</Label>
              <Textarea
                value={reason}
                onChange={e => setReason(e.target.value)}
                placeholder="Share your background, goals, and why this scholarship would help you..."
                rows={6}
                maxLength={2000}
              />
              <p className="text-xs text-muted-foreground mt-1">{reason.length}/2000 characters</p>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSubmit} disabled={submitting}>
                {submitting ? "Submitting..." : "Submit Application"}
              </Button>
              <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        <h3 className="text-lg font-semibold">My Applications</h3>
        {applications.length === 0 ? (
          <Card><CardContent className="p-8 text-center text-muted-foreground">You haven't applied for any scholarships yet.</CardContent></Card>
        ) : (
          applications.map(app => (
            <Card key={app.id}>
              <CardContent className="p-4 space-y-2">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="font-semibold">{programName(app.program_id)}</div>
                  <Badge className={statusVariant(app.status)}>{app.status}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{app.reason}</p>
                {app.review_notes && (
                  <div className="text-xs bg-muted p-2 rounded">
                    <span className="font-medium">Reviewer notes:</span> {app.review_notes}
                  </div>
                )}
                <p className="text-xs text-muted-foreground">Submitted {new Date(app.created_at).toLocaleDateString()}</p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Scholarship;
