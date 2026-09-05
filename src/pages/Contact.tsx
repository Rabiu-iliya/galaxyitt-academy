import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin } from "lucide-react";
import { useState } from "react";

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Website enquiry from ${name || "a visitor"}`);
    const body = encodeURIComponent(`${message}\n\nFrom: ${name}\nEmail: ${email}`);
    window.location.href = `mailto:info@galaxyitt.com.ng?subject=${subject}&body=${body}`;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="relative overflow-hidden bg-primary py-16">
        <AnimatedBackground />
        <div className="container relative mx-auto px-4 text-center">
          <Badge className="mb-4 border-accent/30 bg-accent/20 text-accent hover:bg-accent/30">Contact</Badge>
          <h1 className="text-4xl font-bold text-white md:text-5xl">Get in Touch</h1>
          <p className="mx-auto mt-4 max-w-2xl text-white/80">
            Questions about programs, admissions or scholarships? We usually reply within one working day.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto grid gap-8 px-4 lg:grid-cols-3">
          <div className="space-y-4">
            {[
              { icon: Mail, label: "Email", value: "info@galaxyitt.com.ng" },
              { icon: Phone, label: "Phone", value: "08039606006" },
              { icon: MapPin, label: "Address", value: "No. 2 Kiyawa Road, Dutse, Jigawa State" },
            ].map((c) => (
              <Card key={c.label}>
                <CardContent className="flex items-start gap-3 pt-6">
                  <c.icon className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                  <div>
                    <div className="text-sm font-semibold">{c.label}</div>
                    <div className="text-sm text-muted-foreground">{c.value}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="lg:col-span-2">
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full name</Label>
                    <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea id="message" rows={6} value={message} onChange={(e) => setMessage(e.target.value)} required />
                </div>
                <Button type="submit" size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
