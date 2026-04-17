import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { LifeBuoy, Loader2, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface Msg {
  id: string; subject: string; message: string; status: string;
  admin_reply: string | null; created_at: string; replied_at: string | null;
}

const Support = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ subject: "", message: "" });

  const load = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("support_messages")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    setMessages((data as Msg[]) || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, [user]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !form.subject.trim() || !form.message.trim()) return;
    setSubmitting(true);
    const { error } = await supabase.from("support_messages").insert({
      user_id: user.id,
      subject: form.subject.trim(),
      message: form.message.trim(),
    });
    setSubmitting(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Message sent. We'll respond soon.");
    setForm({ subject: "", message: "" });
    load();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2"><LifeBuoy className="h-6 w-6 text-accent" />Help & Support</h2>
        <p className="text-sm text-muted-foreground">Send a message and our team will get back to you.</p>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">New Message</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-4">
            <div>
              <Label htmlFor="subject">Subject</Label>
              <Input id="subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} maxLength={200} required />
            </div>
            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} maxLength={2000} rows={5} required />
            </div>
            <Button type="submit" disabled={submitting} className="gap-2">
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}Send Message
            </Button>
          </form>
        </CardContent>
      </Card>

      <div>
        <h3 className="text-lg font-semibold mb-3">My Messages</h3>
        {loading ? (
          <div className="flex items-center justify-center p-12"><Loader2 className="h-6 w-6 animate-spin text-accent" /></div>
        ) : messages.length === 0 ? (
          <Card><CardContent className="p-8 text-center text-sm text-muted-foreground">No messages yet.</CardContent></Card>
        ) : (
          <div className="space-y-3">
            {messages.map((m) => (
              <Card key={m.id}>
                <CardContent className="p-4 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className="font-semibold">{m.subject}</p>
                      <p className="text-sm text-muted-foreground mt-1 whitespace-pre-wrap">{m.message}</p>
                    </div>
                    <Badge variant={m.status === "resolved" ? "default" : "outline"} className="capitalize">{m.status}</Badge>
                  </div>
                  {m.admin_reply && (
                    <div className="mt-3 rounded-md bg-accent/10 border border-accent/20 p-3">
                      <p className="text-xs font-semibold text-accent mb-1">Admin Reply</p>
                      <p className="text-sm whitespace-pre-wrap">{m.admin_reply}</p>
                    </div>
                  )}
                  <p className="text-[11px] text-muted-foreground">{new Date(m.created_at).toLocaleString()}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Support;
