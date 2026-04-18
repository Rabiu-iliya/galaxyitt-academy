import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Award, Loader2, Download, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { generateCertificatePDF, imageUrlToDataUrl } from "@/lib/certificatePdf";
import QRCode from "qrcode";

interface CertRow {
  id: string;
  issued_at: string | null;
  program_id: string;
  user_id: string;
  programs: { name: string } | null;
  profiles?: { full_name: string | null } | null;
}

interface Signature {
  id: string;
  name: string;
  title: string;
  image_url: string | null;
}

const Certificates = () => {
  const { user, profile } = useAuth();
  const [certs, setCerts] = useState<CertRow[]>([]);
  const [signature, setSignature] = useState<Signature | null>(null);
  const [qrMap, setQrMap] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const [certsRes, sigRes] = await Promise.all([
        supabase
          .from("certificates")
          .select("id, issued_at, program_id, user_id, programs(name)")
          .eq("user_id", user.id)
          .order("issued_at", { ascending: false }),
        supabase
          .from("signatures")
          .select("id, name, title, image_url")
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle(),
      ]);
      const rows = (certsRes.data as CertRow[]) || [];
      setCerts(rows);
      setSignature((sigRes.data as Signature | null) ?? null);

      // Build QR codes for each certificate
      const map: Record<string, string> = {};
      await Promise.all(
        rows.map(async (c) => {
          const url = `${window.location.origin}/verify/${c.id}`;
          map[c.id] = await QRCode.toDataURL(url, { margin: 1, width: 240, color: { dark: "#1E3A5F", light: "#FFFFFF" } });
        })
      );
      setQrMap(map);
      setLoading(false);
    })();
  }, [user]);

  const handleDownload = async (c: CertRow) => {
    let imageDataUrl: string | null = null;
    if (signature?.image_url) {
      imageDataUrl = await imageUrlToDataUrl(signature.image_url);
    }
    await generateCertificatePDF({
      studentName: profile?.full_name || "Student",
      programName: c.programs?.name || "—",
      issuedAt: c.issued_at
        ? new Date(c.issued_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
        : new Date().toLocaleDateString(),
      certificateId: c.id.slice(0, 8),
      fullCertificateId: c.id,
      verifyUrl: `${window.location.origin}/verify/${c.id}`,
      signature: signature
        ? { name: signature.name, title: signature.title, imageDataUrl }
        : null,
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Certificates</h2>
        <p className="text-sm text-muted-foreground">Awarded when your final project is approved.</p>
      </div>

      {certs.length === 0 ? (
        <Card>
          <CardContent className="p-10 text-center">
            <Award className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <h3 className="font-semibold">No certificate yet</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">
              Submit your final project from the Projects page and have it approved by an instructor to earn your certificate.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {certs.map((c) => (
            <Card key={c.id} className="overflow-hidden border-2 border-accent/40 bg-gradient-to-br from-background to-accent/5">
              <CardContent className="p-8 md:p-12">
                <div className="text-center space-y-4">
                  <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-accent/10">
                    <Award className="h-10 w-10 text-accent" />
                  </div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                    Certificate of Completion
                  </p>
                  <h3 className="text-2xl md:text-3xl font-bold">GalaxyITT Technology Academy</h3>
                  <div className="h-px w-24 bg-accent/40 mx-auto" />
                  <p className="text-sm text-muted-foreground">This is to certify that</p>
                  <p className="text-2xl md:text-3xl font-bold text-accent">
                    {profile?.full_name || "Student"}
                  </p>
                  <p className="text-sm text-muted-foreground">has successfully completed the program</p>
                  <p className="text-lg md:text-xl font-semibold">{c.programs?.name || "—"}</p>
                  <p className="text-xs text-muted-foreground pt-2">
                    Issued on{" "}
                    {c.issued_at
                      ? new Date(c.issued_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "—"}
                  </p>
                </div>

                {/* Signature + QR */}
                <div className="mt-8 grid gap-6 md:grid-cols-3 items-end">
                  <div className="text-center md:text-left">
                    {qrMap[c.id] && (
                      <div className="inline-block">
                        <img src={qrMap[c.id]} alt="Verification QR" className="h-24 w-24 rounded border bg-white p-1" />
                        <p className="mt-1 text-[10px] text-muted-foreground">Scan to verify</p>
                      </div>
                    )}
                  </div>

                  <div className="text-center text-[10px] text-muted-foreground/70 font-mono">
                    ID: {c.id.slice(0, 8).toUpperCase()}
                  </div>

                  <div className="text-center md:text-right">
                    {signature?.image_url ? (
                      <img
                        src={signature.image_url}
                        alt={signature.name}
                        className="mx-auto md:ml-auto md:mr-0 h-16 object-contain"
                      />
                    ) : (
                      <div className="h-16" />
                    )}
                    <div className="border-t border-foreground/40 mt-1 pt-1 inline-block min-w-[180px]">
                      <p className="text-sm font-semibold italic">
                        {signature?.name || "Authorized Signature"}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {signature?.title || "GalaxyITT Academy"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Button
                    className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90"
                    onClick={() => handleDownload(c)}
                  >
                    <Download className="h-4 w-4" /> Download PDF
                  </Button>
                  <Button asChild variant="outline" className="gap-2">
                    <a href={`/verify/${c.id}`} target="_blank" rel="noopener noreferrer">
                      <ShieldCheck className="h-4 w-4" /> Verify Online
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Certificates;
