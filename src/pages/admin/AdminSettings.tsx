import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function AdminSettings() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => { load(); }, []);

  const load = async () => {
    const { data } = await supabase.from("app_settings").select("*").limit(1).maybeSingle();
    setSettings(data || { site_name: "", contact_email: "", contact_phone: "", scholarship_open: true });
    setLoading(false);
  };

  const save = async () => {
    if (!settings?.id) {
      toast({ title: "Error", description: "Settings row missing.", variant: "destructive" });
      return;
    }
    setSaving(true);
    const { error } = await supabase.from("app_settings").update({
      site_name: settings.site_name,
      contact_email: settings.contact_email,
      contact_phone: settings.contact_phone,
      scholarship_open: settings.scholarship_open,
    }).eq("id", settings.id);
    setSaving(false);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Settings saved" });
  };

  if (loading) return <div className="flex items-center justify-center p-12"><div className="h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent" /></div>;

  return (
    <div className="space-y-6 max-w-2xl">
      <h2 className="text-2xl font-bold">Settings</h2>
      <Card>
        <CardHeader><CardTitle>Platform Settings</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2"><Label>Site Name</Label><Input value={settings.site_name || ""} onChange={(e) => setSettings({ ...settings, site_name: e.target.value })} /></div>
          <div className="space-y-2"><Label>Contact Email</Label><Input type="email" value={settings.contact_email || ""} onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })} /></div>
          <div className="space-y-2"><Label>Contact Phone</Label><Input value={settings.contact_phone || ""} onChange={(e) => setSettings({ ...settings, contact_phone: e.target.value })} /></div>
          <div className="flex items-center justify-between rounded-lg border p-3">
            <div><Label>Scholarship Applications Open</Label><p className="text-xs text-muted-foreground">Toggle off to disable new applications.</p></div>
            <Switch checked={!!settings.scholarship_open} onCheckedChange={(v) => setSettings({ ...settings, scholarship_open: v })} />
          </div>
          <Button onClick={save} disabled={saving} className="bg-accent text-accent-foreground hover:bg-accent/90">{saving ? "Saving..." : "Save Settings"}</Button>
        </CardContent>
      </Card>
    </div>
  );
}