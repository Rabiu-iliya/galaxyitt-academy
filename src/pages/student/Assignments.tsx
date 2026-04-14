import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Upload, Lock, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useEnrollment } from "@/hooks/useEnrollment";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

interface Assignment {
  id: string;
  title: string;
  description: string | null;
  due_date: string | null;
}

interface Submission {
  id: string;
  assignment_id: string;
  file_url: string | null;
  grade: string | null;
  submitted_at: string;
}

const Assignments = () => {
  const { user } = useAuth();
  const { enrollment, loading: enrollLoading } = useEnrollment();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [submittingId, setSubmittingId] = useState<string | null>(null);
  const [fileUrl, setFileUrl] = useState("");

  useEffect(() => {
    if (!enrollment || !user) { setLoading(false); return; }
    const fetch = async () => {
      const { data: asgn } = await supabase
        .from("assignments")
        .select("id, title, description, due_date")
        .eq("program_id", enrollment.program_id)
        .order("due_date");
      setAssignments(asgn || []);

      const { data: subs } = await supabase
        .from("submissions")
        .select("id, assignment_id, file_url, grade, submitted_at")
        .eq("student_id", user.id);
      setSubmissions(subs || []);
      setLoading(false);
    };
    fetch();
  }, [enrollment, user]);

  const handleSubmit = async (assignmentId: string) => {
    if (!user || !fileUrl.trim()) return;
    const { error } = await supabase.from("submissions").insert({
      assignment_id: assignmentId,
      student_id: user.id,
      file_url: fileUrl.trim(),
    });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Submitted!", description: "Your assignment has been submitted." });
      setSubmissions(prev => [...prev, { id: crypto.randomUUID(), assignment_id: assignmentId, file_url: fileUrl.trim(), grade: null, submitted_at: new Date().toISOString() }]);
      setSubmittingId(null);
      setFileUrl("");
    }
  };

  const getSubmission = (aid: string) => submissions.find(s => s.assignment_id === aid);

  if (enrollLoading || loading) {
    return <div className="flex items-center justify-center p-12"><div className="h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent" /></div>;
  }

  if (!enrollment) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Assignments</h2>
        <Card><CardContent className="p-8 text-center"><p className="text-muted-foreground">Enroll in a program to access assignments.</p></CardContent></Card>
      </div>
    );
  }

  if (!enrollment.is_paid) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Assignments</h2>
        <Card><CardContent className="p-8 text-center">
          <Lock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold">Payment Required</h3>
          <p className="text-muted-foreground mt-2">Complete your payment to access assignments.</p>
        </CardContent></Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Assignments</h2>
      {assignments.length === 0 ? (
        <Card><CardContent className="p-8 text-center"><p className="text-muted-foreground">No assignments available yet.</p></CardContent></Card>
      ) : (
        <div className="space-y-3">
          {assignments.map(a => {
            const sub = getSubmission(a.id);
            return (
              <Card key={a.id}>
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center gap-4">
                    <FileText className="h-6 w-6 text-accent" />
                    <div className="flex-1">
                      <div className="font-semibold">{a.title}</div>
                      {a.description && <div className="text-sm text-muted-foreground">{a.description}</div>}
                      {a.due_date && <div className="text-xs text-muted-foreground">Due: {new Date(a.due_date).toLocaleDateString()}</div>}
                    </div>
                    {sub ? (
                      <div className="flex items-center gap-2">
                        {sub.grade && <span className="text-sm font-semibold text-green-600">{sub.grade}</span>}
                        <Badge className="bg-green-100 text-green-700"><CheckCircle className="h-3 w-3 mr-1" />Submitted</Badge>
                      </div>
                    ) : (
                      <Button size="sm" variant="outline" onClick={() => setSubmittingId(submittingId === a.id ? null : a.id)}>
                        <Upload className="h-4 w-4 mr-1" /> Submit
                      </Button>
                    )}
                  </div>
                  {submittingId === a.id && !sub && (
                    <div className="flex gap-2 pl-10">
                      <Input
                        placeholder="Paste file link or URL..."
                        value={fileUrl}
                        onChange={e => setFileUrl(e.target.value)}
                      />
                      <Button size="sm" onClick={() => handleSubmit(a.id)} disabled={!fileUrl.trim()}>
                        Submit
                      </Button>
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

export default Assignments;
