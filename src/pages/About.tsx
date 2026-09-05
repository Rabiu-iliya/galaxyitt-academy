import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Target, Eye, HeartHandshake, ArrowRight } from "lucide-react";

const About = () => (
  <div className="min-h-screen bg-background">
    <Navbar />

    <section className="relative overflow-hidden bg-primary py-20">
      <AnimatedBackground />
      <div className="container relative mx-auto px-4 text-center">
        <Badge className="mb-4 border-accent/30 bg-accent/20 text-accent hover:bg-accent/30">About Us</Badge>
        <h1 className="mx-auto max-w-3xl text-4xl font-bold text-white md:text-5xl">
          Building Africa's Next Generation of Tech Leaders
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-white/80">
          GalaxyITT Technology Academy is a premium, cohort-based learning institution dedicated to
          producing world-class technology professionals.
        </p>
      </div>
    </section>

    <section className="py-16">
      <div className="container mx-auto grid gap-6 px-4 md:grid-cols-3">
        {[
          { icon: Target, title: "Our Mission", text: "To equip learners with practical, job-ready technology skills through structured, mentor-led programs." },
          { icon: Eye, title: "Our Vision", text: "To become the leading technology academy producing globally competitive tech talent from Africa." },
          { icon: HeartHandshake, title: "Our Values", text: "Excellence, integrity, inclusion and a relentless focus on real outcomes for every student." },
        ].map((v) => (
          <Card key={v.title}>
            <CardContent className="pt-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
                <v.icon className="h-6 w-6 text-accent" />
              </div>
              <h2 className="mb-2 text-lg font-semibold">{v.title}</h2>
              <p className="text-sm text-muted-foreground">{v.text}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>

    <section className="bg-secondary py-16">
      <div className="container mx-auto px-4">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div>
            <h2 className="text-3xl font-bold">How We Teach</h2>
            <p className="mt-4 text-muted-foreground">
              Our 12-week programs combine live instruction, recorded lessons, hands-on projects and
              industry mentorship. Small cohorts mean every student gets attention, feedback and a
              portfolio-ready project before graduating.
            </p>
            <p className="mt-4 text-muted-foreground">
              Every graduate earns a verifiable certificate, complete with a public verification page
              so employers can confirm it in seconds.
            </p>
            <Link to="/programs" className="mt-6 inline-block">
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                Explore Programs <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
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

    <Footer />
  </div>
);

export default About;
