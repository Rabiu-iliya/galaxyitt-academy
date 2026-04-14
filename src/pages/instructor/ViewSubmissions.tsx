import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, ExternalLink, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface SubmissionView {
  id: string;
  file_url: string | null;
  grade: string | null;
  submitted_at: string;
  student_name: string;
  assignment_title: string;
}

const ViewSubmissions = () => {
  const [submissions, setSubmissions] = useState<SubmissionView[]>([]);
  const [assignments, setAssignments] = useState<{ id: string; title: string }[]>([]);
  const [selectedAssignment, setSelectedAssignment] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      // Fetch all assignments
      const { data: asgn } = await supabase.from("assignments").select("id, title").order("created_at", { ascending: false });
      setAssignments(asgn || []);

      // Fetch submissions with student profiles
      const { data: subs } = await supabase
        .from("submissions")
        .select("id, file_url, grade, submitted_at, assignment_id, student_id")
        .order("submitted_at", { ascending: false });

      if (subs && subs.length > 0) {
        const studentIds = [...new Set(subs.map(s => s.student_id))];
        const { data: profiles } = await supabase
          .from("profiles")
          .select("user_id, full_name")
          .in("user_id", studentIds);

        const profileMap = new Map((profiles || []).map(p => [p.user_id, p.full_name || "Unknown"]));
        const asgnMap = new Map((asgn || []).map(a => [a.id, a.title]));

        setSubmissions(subs.map(s => ({
          id: s.id,
          file_url: s.file_url,
          grade: s.grade,
          submitted_at: s.submitted_at,
          student_name: profileMap.get(s.student_id) || "Unknown",
          assignment_title: asgnMap.get(s.assignment_id) || "Unknown",
        })));
      }
      setLoading(false);
    };
    fetch();
  }, []);

  const filtered = selectedAssignment === "all"
    ? submissions
    : submissions.filter(s => s.assignment_title === assignments.find(a => a.id === selectedAssignment)?.title);

  if (loading) return <div className="flex items-center justify-center p-12"><div className="h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Submissions</h2>
        <Select value={selectedAssignment} onValueChange={setSelectedAssignment}>
          <SelectTrigger className="w-[220px]"><SelectValue placeholder="Filter by assignment" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Assignments</SelectItem>
            {assignments.map(a => <SelectItem key={a.id} value={a.id}>{a.title}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        {filtered.map(s => (
          <Card key={s.id}>
            <CardContent className="flex items-center gap-4 p-4">
              <User className="h-6 w-6 text-accent" />
              <div className="flex-1">
                <div className="font-semibold">{s.student_name}</div>
                <div className="text-sm text-muted-foreground">{s.assignment_title} · {new Date(s.submitted_at).toLocaleDateString()}</div>
              </div>
              {s.file_url && (
                <a href={s.file_url} target="_blank" rel="noopener noreferrer">
                  <Badge variant="outline" className="cursor-pointer"><ExternalLink className="h-3 w-3 mr-1" />View</Badge>
                </a>
              )}
              {s.grade ? (
                <Badge className="bg-green-100 text-green-700">{s.grade}</Badge>
              ) : (
                <Badge variant="outline">Pending</Badge>
              )}
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && <p className="text-muted-foreground text-center py-8">No submissions yet.</p>}
      </div>
    </div>
  );
};

export default ViewSubmissions;
