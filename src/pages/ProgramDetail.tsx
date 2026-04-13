import { useParams, Link, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Users, CheckCircle2, ArrowLeft, Calendar } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

const ProgramDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [program, setProgram] = useState<any>(null);
  const [cohorts, setCohorts] = useState<any[]>([]);
  const [selectedCohort, setSelectedCohort] = useState<string | null>(null);
  const [enrolling, setEnrolling] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data: prog } = await supabase
        .from("programs")
        .select("*")
        .eq("slug", slug)
        .single();
      setProgram(prog);
      if (prog) {
        const { data: c } = await supabase
          .from("cohorts")
          .select("*")
          .eq("program_id", prog.id)
          .in("status", ["upcoming", "active"])
          .order("start_date");
        setCohorts(c || []);
      }
      setLoading(false);
    };
    fetch();
  }, [slug]);

  const handleEnroll = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (!selectedCohort) {
      toast({ title: "Select a cohort", description: "Please select a cohort to enroll.", variant: "destructive" });
      return;
    }
    setEnrolling(true);

    // Check if already enrolled
    const { data: existing } = await supabase
      .from("enrollments")
      .select("id")
      .eq("user_id", user.id)
      .eq("program_id", program.id)
      .limit(1);

    if (existing && existing.length > 0) {
      toast({ title: "Already enrolled", description: "You are already enrolled in this program." });
      setEnrolling(false);
      navigate("/student");
      return;
    }

    // Create enrollment
    const { data: enrollment, error: enrollError } = await supabase
      .from("enrollments")
      .insert({
        user_id: user.id,
        program_id: program.id,
        cohort_id: selectedCohort,
        status: "active",
      })
      .select()
      .single();

    if (enrollError) {
      toast({ title: "Enrollment failed", description: enrollError.message, variant: "destructive" });
      setEnrolling(false);
      return;
    }

    // Create mock payment
    await supabase.from("payments").insert({
      user_id: user.id,
      enrollment_id: enrollment.id,
      amount: program.price,
      status: "completed",
      method: "mock",
    });

    toast({ title: "Enrolled successfully!", description: `Welcome to ${program.name}!` });
    setEnrolling(false);
    navigate("/student");
  };

  if (loading) return (
    <div className="min-h-screen bg-background"><Navbar /><div className="flex items-center justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent" /></div><Footer /></div>
  );

  if (!program) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold">Program Not Found</h1>
          <Link to="/programs"><Button className="mt-4">Back to Programs</Button></Link>
        </div>
        <Footer />
      </div>
    );
  }

  const curriculum = [
    "Week 1–2: Foundations & Setup",
    "Week 3–4: Core Concepts Deep Dive",
    "Week 5–6: Intermediate Techniques",
    "Week 7–8: Advanced Topics",
    "Week 9–10: Real-World Projects",
    "Week 11–12: Capstone Project & Certification",
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="bg-primary py-16">
        <div className="container mx-auto px-4">
          <Link to="/programs" className="mb-4 inline-flex items-center gap-2 text-sm text-primary-foreground/70 hover:text-primary-foreground">
            <ArrowLeft className="h-4 w-4" /> Back to Programs
          </Link>
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <Badge className="mb-3 bg-accent/20 text-accent border-accent/30">{program.duration}</Badge>
              <h1 className="text-3xl font-bold text-primary-foreground md:text-5xl">{program.name}</h1>
              <p className="mt-4 max-w-2xl text-primary-foreground/70">{program.description}</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-accent">₦{Number(program.price).toLocaleString()}</div>
              <div className="text-sm text-primary-foreground/50">One-time payment</div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-8">
              <div className="grid grid-cols-3 gap-4">
                {[
                  { icon: Clock, label: "Duration", value: program.duration },
                  { icon: Users, label: "Format", value: "Cohort-based" },
                  { icon: Calendar, label: "Type", value: "Hybrid" },
                ].map((item) => (
                  <Card key={item.label}>
                    <CardContent className="flex flex-col items-center pt-6 text-center">
                      <item.icon className="mb-2 h-6 w-6 text-accent" />
                      <div className="text-xs text-muted-foreground">{item.label}</div>
                      <div className="font-semibold text-sm">{item.value}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {program.highlights && program.highlights.length > 0 && (
                <div>
                  <h2 className="mb-4 text-xl font-bold">What You'll Learn</h2>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {program.highlights.map((h: string) => (
                      <div key={h} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-accent" /><span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h2 className="mb-4 text-xl font-bold">Curriculum Outline</h2>
                <div className="space-y-3">
                  {curriculum.map((week, i) => (
                    <div key={i} className="flex items-center gap-3 rounded-lg border p-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/10 text-sm font-semibold text-accent">{i + 1}</div>
                      <span className="text-sm">{week}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <Card className="sticky top-20">
                <CardContent className="p-6 space-y-6">
                  <div>
                    <h3 className="mb-1 text-lg font-bold">Enroll Now</h3>
                    <p className="text-sm text-muted-foreground">Select a cohort to get started</p>
                  </div>
                  {cohorts.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No cohorts available currently. Check back soon!</p>
                  ) : (
                    <div className="space-y-3">
                      {cohorts.map((c) => (
                        <button
                          key={c.id}
                          onClick={() => setSelectedCohort(c.id)}
                          className={`w-full rounded-lg border p-3 text-left transition-colors ${selectedCohort === c.id ? "border-accent bg-accent/5" : "hover:border-accent/50"}`}
                        >
                          <div className="font-medium text-sm">{c.name}</div>
                          <div className="text-xs text-muted-foreground">Starts {new Date(c.start_date).toLocaleDateString()} · {c.max_students} max students</div>
                        </button>
                      ))}
                    </div>
                  )}
                  <div className="border-t pt-4">
                    <div className="mb-4 flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Total</span>
                      <span className="text-xl font-bold text-accent">₦{Number(program.price).toLocaleString()}</span>
                    </div>
                    <Button
                      className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                      onClick={handleEnroll}
                      disabled={enrolling}
                    >
                      {enrolling ? "Enrolling..." : user ? "Enroll Now (Mock Payment)" : "Login to Enroll"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default ProgramDetail;
