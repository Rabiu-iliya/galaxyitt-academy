import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { LifeBuoy, Loader2, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface Msg {
  id: string; user_id: string; subject: string; message: string;
  status: string; admin_reply: string | null; created_at: string;
  full_name: string | null;
}

const ManageSupport = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<Msg[]>([]);
  const [loading, setLoading] = useState(true);
  const [replies, setReplies] = useState<Record<string, string>>({});
  const [acting, setActing] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("support_messages").select("*").order("created_at", { ascending: false });
    const rows = (data as any[]) || [];
    const ids = [...new Set(rows.map((r) => r.user_id))];
    let map: Record<string, string> = {};
    if (ids.length) {
      const { data: profs } = await supabase.from("profiles").select("user_id, full_name").in("user_id", ids);
      map = Object.fromEntries((profs || []).map((p) => [p.user_id, p.full_name || "User"]));
    }
    setItems(rows.map((r) => ({ ...r, full_name: map[r.user_id] || "User" })));
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const reply = async (id: string) => {
    if (!replies[id]?.trim()) return;
    setActing(id);
    const { error } = await supabase
      .from("support_messages")
      .update({ admin_reply: replies[id].trim(), status: "resolved", replied_by: user?.id, replied_at: new Date().toISOString() })
      .eq("id", id);
    setActing(null);
    if (error) { toast.error(error.message); return; }

    // Send notification to user
    const item = items.find((i) => i.id === id);
    if (item) {
      await supabase.from("notifications").insert({
        user_id: item.user_id,
        title: "Support Reply",
        message: `Your message "${item.subject}" has been answered.`,
        type: "info",
        link: "/student/support",
      });
    }

    toast.success("Reply sent");
    setReplies({ ...replies, [id]: "" });
    load();
  };

  if (loading) {
    return <div className="flex items-center justify-center p-12"><Loader2 className="h-8 w-8 animate-spin text-accent" /></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2"><LifeBuoy className="h-6 w-6 text-accent" />Support Messages</h2>
        <p className="text-sm text-muted-foreground">Respond to user inquiries.</p>
      </div>

      {items.length === 0 ? (
        <Card><CardContent className="p-8 text-center text-sm text-muted-foreground">No support messages yet.</CardContent></Card>
      ) : (
        <div className="grid gap-4">
          {items.map((m) => (
            <Card key={m.id}>
              <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0 pb-3">
                <div className="flex-1">
                  <CardTitle className="text-base">{m.subject}</CardTitle>
                  <p className="text-xs text-muted-foreground mt-1">{m.full_name} • {new Date(m.created_at).toLocaleString()}</p>
                </div>
                <Badge variant={m.status === "resolved" ? "default" : "outline"} className="capitalize">{m.status}</Badge>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm whitespace-pre-wrap">{m.message}</p>
                {m.admin_reply ? (
                  <div className="rounded-md bg-accent/10 border border-accent/20 p-3">
                    <p className="text-xs font-semibold text-accent mb-1">Your Reply</p>
                    <p className="text-sm whitespace-pre-wrap">{m.admin_reply}</p>
                  </div>
                ) : (
                  <div className="space-y-2 pt-2 border-t">
                    <Textarea
                      placeholder="Type your reply..."
                      value={replies[m.id] || ""}
                      onChange={(e) => setReplies({ ...replies, [m.id]: e.target.value })}
                      rows={3}
                    />
                    <Button size="sm" onClick={() => reply(m.id)} disabled={acting === m.id || !replies[m.id]?.trim()} className="gap-2">
                      {acting === m.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}Send Reply
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageSupport;
