import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Award, Check, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

interface AppRow {
  id: string;
  user_id: string;
  program_id: string;
  reason: string;
  status: "pending" | "approved" | "rejected";
  review_notes: string | null;
  created_at: string;
  student_name: string;
  program_name: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
}

const statusVariant = (s: string) =>
  s === "approved" ? "bg-green-100 text-green-700"
  : s === "rejected" ? "bg-red-100 text-red-700"
  : "bg-yellow-100 text-yellow-700";

const ManageScholarships = () => {
  const { user } = useAuth();
  const [rows, setRows] = useState<AppRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [programFilter, setProgramFilter] = useState<string>("all");
  const [allPrograms, setAllPrograms] = useState<{ id: string; name: string }[]>([]);
  const [notesById, setNotesById] = useState<Record<string, string>>({});

  const fetchData = async () => {
    setLoading(true);
    const { data: apps } = await (supabase as any)
      .from("scholarship_applications")
      .select("id, user_id, program_id, reason, status, review_notes, created_at, full_name, email, phone")
      .order("created_at", { ascending: false });

    if (!apps || apps.length === 0) { setRows([]); setLoading(false); return; }

    const userIds = [...new Set(apps.map((a: any) => a.user_id as string))] as string[];
    const programIds = [...new Set(apps.map((a: any) => a.program_id as string))] as string[];

    const [{ data: profiles }, { data: programs }] = await Promise.all([
      supabase.from("profiles").select("user_id, full_name").in("user_id", userIds),
      supabase.from("programs").select("id, name").in("id", programIds),
    ]);

    const pMap = new Map((profiles || []).map(p => [p.user_id, p.full_name || "Unknown"]));
    const prMap = new Map((programs || []).map(p => [p.id, p.name]));

    setRows(apps.map((a: any) => ({
      ...a,
      student_name: pMap.get(a.user_id) || "Unknown",
      program_name: prMap.get(a.program_id) || "Unknown",
    })));
    setAllPrograms((programs as any) || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleDecision = async (row: AppRow, decision: "approved" | "rejected") => {
    const notes = notesById[row.id] || null;

    const { error } = await (supabase as any)
      .from("scholarship_applications")
      .update({ status: decision, review_notes: notes, reviewed_by: user?.id })
      .eq("id", row.id);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }

    if (decision === "approved") {
      // Find existing enrollment for this user/program; mark as paid. If none, leave a note.
      const { data: enrolls } = await supabase
        .from("enrollments")
        .select("id")
        .eq("user_id", row.user_id)
        .eq("program_id", row.program_id);

      if (enrolls && enrolls.length > 0) {
        await supabase.from("enrollments")
          .update({ is_paid: true, status: "active" })
          .eq("user_id", row.user_id)
          .eq("program_id", row.program_id);
        toast({ title: "Approved", description: "Student enrollment unlocked." });
      } else {
        toast({ title: "Approved", description: "Student must enroll in a cohort to gain access." });
      }
    } else {
      toast({ title: "Rejected", description: "Application marked as rejected." });
    }
    fetchData();
  };

  const filtered = rows.filter(r =>
    (filter === "all" || r.status === filter) &&
    (programFilter === "all" || r.program_id === programFilter)
  );

  if (loading) return <div className="flex items-center justify-center p-12"><div className="h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-2xl font-bold flex items-center gap-2"><Award className="h-6 w-6 text-accent" /> Scholarship Applications</h2>
        <div className="flex flex-wrap gap-2">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
          <Select value={programFilter} onValueChange={setProgramFilter}>
            <SelectTrigger className="w-[200px]"><SelectValue placeholder="Program" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All programs</SelectItem>
              {allPrograms.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <Card><CardContent className="p-8 text-center text-muted-foreground">No applications to review.</CardContent></Card>
      ) : (
        <div className="hidden md:block">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Program</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(r => (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium">{r.student_name}</TableCell>
                    <TableCell>{r.program_name}</TableCell>
                    <TableCell className="max-w-xs">
                      <p className="text-sm line-clamp-3">{r.reason}</p>
                    </TableCell>
                    <TableCell><Badge className={statusVariant(r.status)}>{r.status}</Badge></TableCell>
                    <TableCell>
                      {r.status === "pending" ? (
                        <div className="space-y-2 min-w-[220px]">
                          <Textarea
                            placeholder="Optional review notes"
                            rows={2}
                            value={notesById[r.id] || ""}
                            onChange={e => setNotesById(prev => ({ ...prev, [r.id]: e.target.value }))}
                          />
                          <div className="flex gap-2">
                            <Button size="sm" onClick={() => handleDecision(r, "approved")}><Check className="h-4 w-4 mr-1" />Approve</Button>
                            <Button size="sm" variant="outline" onClick={() => handleDecision(r, "rejected")}><X className="h-4 w-4 mr-1" />Reject</Button>
                          </div>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">{r.review_notes || "—"}</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>
      )}

      {/* Mobile card view */}
      <div className="md:hidden space-y-3">
        {filtered.map(r => (
          <Card key={r.id}>
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="font-semibold">{r.student_name}</div>
                <Badge className={statusVariant(r.status)}>{r.status}</Badge>
              </div>
              <div className="text-sm text-muted-foreground">{r.program_name}</div>
              <p className="text-sm">{r.reason}</p>
              {r.status === "pending" ? (
                <div className="space-y-2 pt-2">
                  <Textarea
                    placeholder="Optional review notes"
                    rows={2}
                    value={notesById[r.id] || ""}
                    onChange={e => setNotesById(prev => ({ ...prev, [r.id]: e.target.value }))}
                  />
                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1" onClick={() => handleDecision(r, "approved")}><Check className="h-4 w-4 mr-1" />Approve</Button>
                    <Button size="sm" variant="outline" className="flex-1" onClick={() => handleDecision(r, "rejected")}><X className="h-4 w-4 mr-1" />Reject</Button>
                  </div>
                </div>
              ) : (
                r.review_notes && <div className="text-xs bg-muted p-2 rounded"><span className="font-medium">Notes:</span> {r.review_notes}</div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ManageScholarships;
