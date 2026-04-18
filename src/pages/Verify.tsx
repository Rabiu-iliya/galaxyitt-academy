import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Award, CheckCircle2, XCircle, Loader2, GraduationCap, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface VerifyResult {
  certificate_id: string;
  student_name: string | null;
  program_name: string | null;
  issued_at: string | null;
}

const Verify = () => {
  const { id } = useParams<{ id: string }>();
  const [result, setResult] = useState<VerifyResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    (async () => {
      const { data, error } = await supabase.rpc("verify_certificate", { cert_id: id });
      if (error) {
        setError(error.message);
      } else if (!data || data.length === 0) {
        setError("not_found");
      } else {
        setResult(data[0] as VerifyResult);
      }
      setLoading(false);
    })();
  }, [id]);

  return (
    <div className="min-h-screen bg-secondary/40">
      <header className="border-b bg-background">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2">
            <GraduationCap className="h-7 w-7 text-accent" />
            <span className="font-bold">Galaxy<span className="text-accent">ITT</span></span>
          </Link>
          <Link to="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" /> Home
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 md:py-20">
        <div className="mx-auto max-w-2xl">
          <div className="mb-8 text-center">
            <Badge variant="outline" className="mb-3">Certificate Verification</Badge>
            <h1 className="text-3xl font-bold md:text-4xl">Authenticity Check</h1>
            <p className="mt-2 text-muted-foreground">
              Verify the authenticity of a certificate issued by GalaxyITT Technology Academy.
            </p>
          </div>

          {loading ? (
            <Card>
              <CardContent className="flex items-center justify-center p-16">
                <Loader2 className="h-8 w-8 animate-spin text-accent" />
              </CardContent>
            </Card>
          ) : error ? (
            <Card className="border-destructive/40">
              <CardContent className="p-10 text-center space-y-4">
                <div className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
                  <XCircle className="h-8 w-8 text-destructive" />
                </div>
                <h2 className="text-xl font-bold">Certificate Not Found</h2>
                <p className="text-sm text-muted-foreground">
                  We could not verify this certificate ID. It may be invalid, revoked, or the link may be incorrect.
                </p>
                <p className="text-xs font-mono text-muted-foreground/70">ID: {id}</p>
              </CardContent>
            </Card>
          ) : result ? (
            <Card className="border-2 border-accent/40 bg-gradient-to-br from-background to-accent/5">
              <CardContent className="p-8 md:p-12 space-y-6">
                <div className="text-center space-y-3">
                  <div className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
                    <CheckCircle2 className="h-8 w-8 text-accent" />
                  </div>
                  <h2 className="text-2xl font-bold">Certificate Verified ✓</h2>
                  <p className="text-sm text-muted-foreground">This certificate is valid and was issued by GalaxyITT Technology Academy.</p>
                </div>

                <div className="h-px bg-border" />

                <div className="space-y-4">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-muted-foreground">Awarded to</p>
                    <p className="text-xl font-bold text-accent">{result.student_name || "—"}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-muted-foreground">Program</p>
                    <p className="text-lg font-semibold">{result.program_name || "—"}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-muted-foreground">Date of Issue</p>
                    <p className="text-base">
                      {result.issued_at
                        ? new Date(result.issued_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
                        : "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-muted-foreground">Certificate ID</p>
                    <p className="font-mono text-sm">{result.certificate_id}</p>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-2 pt-2 text-xs text-muted-foreground">
                  <Award className="h-4 w-4 text-accent" />
                  <span>GalaxyITT Technology Academy · Verified Credential</span>
                </div>
              </CardContent>
            </Card>
          ) : null}
        </div>
      </main>
    </div>
  );
};

export default Verify;
