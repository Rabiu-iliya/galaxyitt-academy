import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  { q: "How long is each program?", a: "Every program runs for 12 weeks in a structured cohort, combining live classes, recorded lessons, assignments and a final project." },
  { q: "How much does it cost?", a: "Each program has a single one-time fee that covers registration and the full 12 weeks. Prices are listed on the pricing section of the homepage and on each program page." },
  { q: "Do I need prior experience?", a: "Most programs start from the fundamentals. Anyone comfortable using a computer can join, and our Digital Literacy program is a great starting point." },
  { q: "Are classes live or recorded?", a: "Both. You attend live instructor-led sessions and can rewatch recorded lessons any time from your student dashboard." },
  { q: "Do I get a certificate?", a: "Yes. Once your final project is approved, a certificate is issued automatically. Each certificate carries a QR code and a public verification page." },
  { q: "Can I apply for a scholarship?", a: "Yes. Create an account and submit a scholarship application with your details and reason. Our team reviews every application and notifies you of the outcome." },
  { q: "What happens after I pay?", a: "You are enrolled into the next available cohort and get immediate access to your dashboard, modules, live class schedule and assignments." },
];

const Faq = () => (
  <div className="min-h-screen bg-background">
    <Navbar />

    <section className="relative overflow-hidden bg-primary py-16">
      <AnimatedBackground />
      <div className="container relative mx-auto px-4 text-center">
        <Badge className="mb-4 border-accent/30 bg-accent/20 text-accent hover:bg-accent/30">FAQ</Badge>
        <h1 className="text-4xl font-bold text-white md:text-5xl">Frequently Asked Questions</h1>
      </div>
    </section>

    <section className="py-16">
      <div className="container mx-auto max-w-3xl px-4">
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((f, i) => (
            <AccordionItem key={f.q} value={`item-${i}`}>
              <AccordionTrigger className="text-left">{f.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="mt-10 text-center">
          <p className="mb-4 text-muted-foreground">Still have a question?</p>
          <Link to="/contact">
            <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">Contact Us</Button>
          </Link>
        </div>
      </div>
    </section>

    <Footer />
  </div>
);

export default Faq;
