import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Loader2, Trash2, Upload, PenLine } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

interface Signature {
  id: string;
  name: string;
  title: string;
  image_url: string | null;
  created_at: string;
}

const ManageSignatures = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<Signature[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("signatures").select("*").order("created_at", { ascending: false });
    setItems((data as Signature[]) || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !name.trim() || !title.trim()) return;
    setSaving(true);
    let image_url: string | null = null;
    if (file) {
      const path = `${user.id}/${Date.now()}-${file.name}`;
      const { error: upErr } = await supabase.storage.from("signatures").upload(path, file, { upsert: true });
      if (upErr) {
        toast({ title: "Upload failed", description: upErr.message, variant: "destructive" });
        setSaving(false);
        return;
      }
      const { data: pub } = supabase.storage.from("signatures").getPublicUrl(path);
      image_url = pub.publicUrl;
    }
    const { error } = await supabase.from("signatures").insert({ name: name.trim(), title: title.trim(), image_url });
    setSaving(false);
    if (error) {
      toast({ title: "Failed to save", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Signature added" });
    setName(""); setTitle(""); setFile(null);
    (document.getElementById("sig-file") as HTMLInputElement | null)?.value && ((document.getElementById("sig-file") as HTMLInputElement).value = "");
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this signature?")) return;
    const { error } = await supabase.from("signatures").delete().eq("id", id);
    if (error) {
      toast({ title: "Delete failed", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Signature deleted" });
    load();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Certificate Signatures</h2>
        <p className="text-sm text-muted-foreground">The most recently added signature appears on issued certificates.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><PenLine className="h-5 w-5 text-accent" /> Add Signature</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="sig-name">Full Name</Label>
              <Input id="sig-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Dr. Jane Doe" required />
            </div>
            <div>
              <Label htmlFor="sig-title">Title</Label>
              <Input id="sig-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Director of Education" required />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="sig-file">Signature Image (PNG with transparent background recommended)</Label>
              <Input id="sig-file" type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
            </div>
            <div className="md:col-span-2">
              <Button type="submit" disabled={saving} className="gap-2">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                Save Signature
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Saved Signatures</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center p-8"><Loader2 className="h-6 w-6 animate-spin text-accent" /></div>
          ) : items.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">No signatures yet. Add one above.</p>
          ) : (
            <div className="space-y-3">
              {items.map((s, i) => (
                <div key={s.id} className="flex items-center justify-between rounded-lg border bg-card p-4">
                  <div className="flex items-center gap-4">
                    {s.image_url ? (
                      <img src={s.image_url} alt={s.name} className="h-12 w-24 object-contain bg-secondary/40 rounded" />
                    ) : (
                      <div className="h-12 w-24 flex items-center justify-center text-xs text-muted-foreground bg-secondary/40 rounded">
                        No image
                      </div>
                    )}
                    <div>
                      <div className="font-semibold flex items-center gap-2">
                        {s.name}
                        {i === 0 && <Badge className="bg-accent text-accent-foreground">Active</Badge>}
                      </div>
                      <div className="text-sm text-muted-foreground">{s.title}</div>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(s.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ManageSignatures;
