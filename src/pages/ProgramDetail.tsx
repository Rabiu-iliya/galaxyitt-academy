import { useParams, Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { getProgramBySlug, formatPrice } from "@/lib/programs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Users, CheckCircle2, ArrowLeft, Calendar } from "lucide-react";

const ProgramDetail = () => {
  const { slug } = useParams();
  const program = getProgramBySlug(slug || "");

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

  const sampleCohorts = [
    { name: "Cohort A — April 2026", start: "April 7, 2026", spots: 12 },
    { name: "Cohort B — July 2026", start: "July 6, 2026", spots: 20 },
  ];

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
              <div className="text-3xl font-bold text-accent">{formatPrice(program.price)}</div>
              <div className="text-sm text-primary-foreground/50">One-time payment</div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-8">
              {/* Key Info */}
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

              {/* Highlights */}
              <div>
                <h2 className="mb-4 text-xl font-bold">What You'll Learn</h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {program.highlights.map((h) => (
                    <div key={h} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-accent" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Curriculum */}
              <div>
                <h2 className="mb-4 text-xl font-bold">Curriculum Outline</h2>
                <div className="space-y-3">
                  {curriculum.map((week, i) => (
                    <div key={i} className="flex items-center gap-3 rounded-lg border p-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/10 text-sm font-semibold text-accent">
                        {i + 1}
                      </div>
                      <span className="text-sm">{week}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar — Enrollment */}
            <div>
              <Card className="sticky top-20">
                <CardContent className="p-6 space-y-6">
                  <div>
                    <h3 className="mb-1 text-lg font-bold">Enroll Now</h3>
                    <p className="text-sm text-muted-foreground">Select a cohort to get started</p>
                  </div>
                  <div className="space-y-3">
                    {sampleCohorts.map((c) => (
                      <div key={c.name} className="rounded-lg border p-3">
                        <div className="font-medium text-sm">{c.name}</div>
                        <div className="text-xs text-muted-foreground">Starts {c.start} · {c.spots} spots left</div>
                      </div>
                    ))}
                  </div>
                  <div className="border-t pt-4">
                    <div className="mb-4 flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Total</span>
                      <span className="text-xl font-bold text-accent">{formatPrice(program.price)}</span>
                    </div>
                    <Link to="/register">
                      <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                        Apply & Enroll
                      </Button>
                    </Link>
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
