import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const Terms = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <section className="container mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-bold md:text-4xl">Terms of Service</h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated {new Date().getFullYear()}</p>

      <div className="mt-8 space-y-6 text-sm leading-relaxed text-muted-foreground">
        <div>
          <h2 className="mb-2 text-lg font-semibold text-foreground">1. Enrolment</h2>
          <p>Enrolment is confirmed once the one-time program fee is received. A place is reserved in the next available cohort and access to the learning dashboard is granted immediately.</p>
        </div>
        <div>
          <h2 className="mb-2 text-lg font-semibold text-foreground">2. Program delivery</h2>
          <p>Programs run for 12 weeks and combine live sessions, recorded lessons, assignments and a final project. Schedules may be adjusted with advance notice.</p>
        </div>
        <div>
          <h2 className="mb-2 text-lg font-semibold text-foreground">3. Student conduct</h2>
          <p>Students are expected to participate respectfully, submit their own work and refrain from sharing course materials or account access with others.</p>
        </div>
        <div>
          <h2 className="mb-2 text-lg font-semibold text-foreground">4. Certificates</h2>
          <p>Certificates are issued after the final project is approved. Each certificate carries a unique identifier that can be checked on our public verification page.</p>
        </div>
        <div>
          <h2 className="mb-2 text-lg font-semibold text-foreground">5. Refunds</h2>
          <p>Refund requests made before the cohort start date are considered on a case-by-case basis. Fees are non-refundable once the cohort has begun.</p>
        </div>
        <div>
          <h2 className="mb-2 text-lg font-semibold text-foreground">6. Contact</h2>
          <p>Questions about these terms can be sent to info@galaxyitt.com.ng.</p>
        </div>
      </div>
    </section>
    <Footer />
  </div>
);

export default Terms;
