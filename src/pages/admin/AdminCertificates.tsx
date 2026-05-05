import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export default function AdminCertificates() {
  const [certs, setCerts] = useState<any[]>([]);

  useEffect(() => {
    supabase
      .from("certificates")
      .select("id, issued_at, programs(name), profiles(full_name)")
      .order("issued_at", { ascending: false })
      .then(({ data }) => setCerts(data || []));
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Certificates</h1>
      {certs.length === 0 ? (
        <p className="text-muted-foreground">No certificates issued yet.</p>
      ) : (
        <ul className="space-y-2">
          {certs.map((c) => (
            <li key={c.id} className="p-3 border rounded flex justify-between">
              <span>{c.profiles?.full_name || "—"} — {c.programs?.name || "—"}</span>
              <span className="text-xs text-muted-foreground">{new Date(c.issued_at).toLocaleDateString()}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}