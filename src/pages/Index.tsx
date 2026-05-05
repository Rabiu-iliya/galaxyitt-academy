import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ProgramCard } from "@/components/ProgramCard";
import { supabase } from "@/integrations/supabase/client";
import { formatPrice } from "@/lib/programs";
import {
  GraduationCap, Users, Video, Award, ArrowRight,
  CheckCircle2, Star, Quote, Sparkles,
} from "lucide-react";

interface DbProgram {
  id: string;
  name: string;
  slug: string;
  description: string;
  duration: string;
  price: number;
  icon: string | null;
  highlights: string[] | null;
}

const Index = () => {
  const [programs, setPrograms] = useState<DbProgram[]>([]);

  useEffect(() => {
    supabase.from("programs").select("*").order("name").then(({ data }) => {
      setPrograms((data as DbProgram[]) || []);
    });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden bg-primary py-20 md:py-32">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 25% 25%, hsl(41 56% 55% / 0.25) 0%, transparent 50%), radial-gradient(circle at 75% 75%, hsl(213 55% 34% / 0.4) 0%, transparent 50%)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/60" />
        <div className="container relative mx-auto px-4 text-center">
          <Badge className="mb-6 bg-accent/20 text-accent hover:bg-accent/30 border-accent/30">
            Now Enrolling — Cohort 2026
          </Badge>
          <h1 className="mx-auto max-w-4xl text-4xl font-bold tracking-tight text-white md:text-6xl">
            Launch Your Tech Career at{" "}
            <span className="text-accent">GalaxyITT</span>{" "}
            Technology Academy
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-white/80">
            Premium cohort-based programs in AI, Cybersecurity, Software Engineering, and more.
            Learn from industry experts through live classes, hands-on projects, and structured mentorship.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link to="/programs">
              <Button size="lg" className="bg-accent text-white hover:bg-accent/90 text-base px-8 py-3">
                Explore Programs <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/register">
              <Button size="lg" className="bg-white text-black hover:bg-white/90 text-base px-8 py-3">
                Apply Now
              </Button>
            </Link>
          </div>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-white/70">
            <div className="flex items-center gap-2"><Users className="h-5 w-5 text-accent" /><span className="text-sm">5,000+ Graduates</span></div>
            <div className="flex items-center gap-2"><Video className="h-5 w-5 text-accent" /><span className="text-sm">Live Classes</span></div>
            <div className="flex items-center gap-2"><Award className="h-5 w-5 text-accent" /><span className="text-sm">Certified Programs</span></div>
            <div className="flex items-center gap-2"><GraduationCap className="h-5 w-5 text-accent" /><span className="text-sm">{programs.length || "—"} Programs</span></div>
          </div>
        </div>
      </section>

      {/* Programs */}
      <section className="py-20" id="programs">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <Badge variant="outline" className="mb-4">Our Programs</Badge>
            <h2 className="text-3xl font-bold md:text-4xl">World-Class Technology Programs</h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Choose from {programs.length || "our"} industry-aligned programs designed to take you from beginner to job-ready.
            </p>
          </div>
          {programs.length === 0 ? (
            <div className="text-center text-muted-foreground py-12">No programs available yet. Check back soon.</div>
          ) : (
            <>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {programs.slice(0, 8).map((p) => (
                  <ProgramCard key={p.id} program={p} />
                ))}
              </div>
              <div className="mt-8 text-center">
                <Link to="/programs">
                  <Button variant="outline" size="lg">
                    View All {programs.length} Programs <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Scholarship — public CTA */}
      <section className="py-20 bg-gradient-to-br from-accent/10 via-background to-accent/5" id="scholarship">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <Badge className="mb-4 bg-accent/20 text-accent border-accent/30 hover:bg-accent/30">
              <Sparkles className="mr-1 h-3 w-3" /> Scholarship Program
            </Badge>
            <h2 className="text-3xl font-bold md:text-4xl">Apply for Scholarship</h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Get access to premium tech programs through our scholarship opportunities.
              We support driven learners from underrepresented backgrounds with full and partial program funding.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link to="/register">
                <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 px-8">
                  Apply for Scholarship <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="px-8">
                  I have an account
                </Button>
              </Link>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              Already enrolled? Submit your scholarship application from your student dashboard.
            </p>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="bg-secondary py-20" id="about">
        <div className="container mx-auto px-4">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div>
              <Badge variant="outline" className="mb-4">About Us</Badge>
              <h2 className="text-3xl font-bold md:text-4xl">Building Africa's Next Generation of Tech Leaders</h2>
              <p className="mt-4 text-muted-foreground">
                GalaxyITT Technology Academy is a premium, cohort-based learning institution dedicated to producing
                world-class technology professionals. Our structured 12-week programs combine live instruction,
                hands-on projects, and industry mentorship.
              </p>
              <p className="mt-4 text-muted-foreground">
                We believe in quality over quantity — small cohorts, dedicated instructors, and personalized
                learning paths ensure every student gets the attention they deserve.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { num: "14", label: "Programs" },
                { num: "12", label: "Week Duration" },
                { num: "5K+", label: "Graduates" },
                { num: "95%", label: "Completion Rate" },
              ].map((s) => (
                <Card key={s.label} className="text-center">
                  <CardContent className="pt-6">
                    <div className="text-3xl font-bold text-accent">{s.num}</div>
                    <div className="mt-1 text-sm text-muted-foreground">{s.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <Badge variant="outline" className="mb-4">Why GalaxyITT</Badge>
            <h2 className="text-3xl font-bold md:text-4xl">Why Choose Us?</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: Users, title: "Cohort-Based Learning", desc: "Learn alongside peers in structured cohorts with collaborative projects and group activities." },
              { icon: Video, title: "Live + Recorded Classes", desc: "Hybrid learning with live instructor-led sessions and on-demand recorded content." },
              { icon: Award, title: "Industry Certificates", desc: "Earn recognized certificates upon program completion to boost your career." },
              { icon: GraduationCap, title: "Expert Instructors", desc: "Learn from industry professionals with real-world experience in top tech companies." },
              { icon: CheckCircle2, title: "Hands-On Projects", desc: "Build real-world projects that you can showcase in your professional portfolio." },
              { icon: Star, title: "Career Support", desc: "Get career guidance, resume reviews, and interview preparation to land your dream job." },
            ].map((f) => (
              <Card key={f.title} className="text-center">
                <CardContent className="pt-6">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
                    <f.icon className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="mb-2 font-semibold">{f.title}</h3>
                  <p className="text-sm text-muted-foreground">{f.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-secondary py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <Badge variant="outline" className="mb-4">How It Works</Badge>
            <h2 className="text-3xl font-bold md:text-4xl">Your Journey Starts Here</h2>
          </div>
          <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-4">
            {[
              { step: "01", title: "Register", desc: "Create your account" },
              { step: "02", title: "Choose Program", desc: "Select from 14 programs" },
              { step: "03", title: "Pay & Enroll", desc: "One-time payment" },
              { step: "04", title: "Start Learning", desc: "Access your dashboard" },
            ].map((s, i) => (
              <div key={s.step} className="text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-accent text-accent-foreground font-bold text-lg">
                  {s.step}
                </div>
                <h3 className="font-semibold">{s.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <Badge variant="outline" className="mb-4">Testimonials</Badge>
            <h2 className="text-3xl font-bold md:text-4xl">What Our Students Say</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { name: "Adaeze Okafor", program: "AI & Machine Learning", text: "GalaxyITT transformed my career. The cohort-based approach and live classes made all the difference. I landed a role at a top AI startup within weeks of completing the program." },
              { name: "Ibrahim Yusuf", program: "Cybersecurity", text: "The instructors are world-class and the curriculum is current. I went from zero cybersecurity knowledge to passing my CompTIA Security+ certification." },
              { name: "Chidinma Eze", program: "Full Stack Web Dev", text: "The hands-on projects and portfolio building were exactly what I needed. I now work as a full-stack developer at a leading fintech company." },
            ].map((t) => (
              <Card key={t.name}>
                <CardContent className="pt-6">
                  <Quote className="mb-4 h-8 w-8 text-accent/30" />
                  <p className="mb-4 text-sm text-muted-foreground">{t.text}</p>
                  <div>
                    <div className="font-semibold">{t.name}</div>
                    <div className="text-xs text-accent">{t.program}</div>
                  </div>
                  <div className="mt-2 flex gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="bg-secondary py-20" id="pricing">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <Badge variant="outline" className="mb-4">Pricing</Badge>
            <h2 className="text-3xl font-bold md:text-4xl">Transparent, One-Time Pricing</h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              No hidden fees. No subscriptions. One payment covers your entire 12-week program including registration.
            </p>
          </div>
          <div className="mx-auto max-w-4xl overflow-hidden rounded-lg border bg-card">
            <div className="grid grid-cols-3 gap-4 border-b bg-muted/50 p-4 font-semibold text-sm">
              <span>Program</span>
              <span className="text-center">Duration</span>
              <span className="text-right">Price</span>
            </div>
            {programs.map((p) => (
              <div key={p.id} className="grid grid-cols-3 gap-4 border-b p-4 text-sm last:border-0">
                <span className="font-medium">{p.name}</span>
                <span className="text-center text-muted-foreground">{p.duration}</span>
                <span className="text-right font-semibold text-accent">{formatPrice(p.price)}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-primary-foreground md:text-4xl">Ready to Start Your Tech Journey?</h2>
          <p className="mx-auto mt-4 max-w-2xl text-primary-foreground/70">
            Join thousands of successful graduates. Enroll in our next cohort today.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link to="/register">
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 px-8">
                Apply Now <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/programs">
              <Button size="lg" className="bg-white text-black hover:bg-white/90 px-8">
                Browse Programs
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
