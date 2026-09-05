import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";

const steps = [
  { title: "Create an account", desc: "Register as a student — it takes less than a minute." },
  { title: "Submit your application", desc: "Tell us your details, the program you want and why you need support." },
  { title: "Review", desc: "Our admissions team reviews every application carefully." },
  { title: "Decision", desc: "You are notified in your dashboard once a decision is made." },
];

const criteria = [
  "Demonstrated passion for technology",
  "Financial need",
  "Commitment to complete the full 12-week program",
  "Applicants from underrepresented backgrounds are encouraged",
];

const ScholarshipInfo = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="relative overflow-hidden bg-primary py-20">
        <AnimatedBackground />
        <div className="container relative mx-auto px-4 text-center">
          <Badge className="mb-4 border-accent/30 bg-accent/20 text-accent hover:bg-accent/30">
            <Sparkles className="mr-1 h-3 w-3" /> Scholarship Program
          </Badge>
          <h1 className="mx-auto max-w-3xl text-4xl font-bold text-white md:text-5xl">
            Study With Us on a Scholarship
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-white/80">
            We support driven learners with full and partial funding across all our programs.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link to={user ? "/student/scholarship" : "/register"}>
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 px-8">
                {user ? "Apply Now" : "Create Account & Apply"} <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            {!user && (
              <Link to="/login">
                <Button size="lg" className="bg-white px-8 text-black hover:bg-white/90">I have an account</Button>
              </Link>
            )}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-10 text-center text-3xl font-bold">How It Works</h2>
          <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-4">
            {steps.map((s, i) => (
              <div key={s.title} className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent font-bold text-accent-foreground">
                  {i + 1}
                </div>
                <h3 className="font-semibold">{s.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-secondary py-16">
        <div className="container mx-auto max-w-3xl px-4">
          <Card>
            <CardContent className="pt-6">
              <h2 className="mb-4 text-2xl font-bold">Who We Look For</h2>
              <ul className="space-y-3">
                {criteria.map((c) => (
                  <li key={c} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                    {c}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ScholarshipInfo;
