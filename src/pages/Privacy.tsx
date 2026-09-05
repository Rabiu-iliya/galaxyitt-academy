import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const Privacy = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <section className="container mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-bold md:text-4xl">Privacy Policy</h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated {new Date().getFullYear()}</p>

      <div className="mt-8 space-y-6 text-sm leading-relaxed text-muted-foreground">
        <div>
          <h2 className="mb-2 text-lg font-semibold text-foreground">Information we collect</h2>
          <p>We collect the name, email address and phone number you provide when registering, along with the coursework, assignments and applications you submit.</p>
        </div>
        <div>
          <h2 className="mb-2 text-lg font-semibold text-foreground">How we use it</h2>
          <p>Your information is used to run your program: enrolment, class access, assignment feedback, certificates, scholarship review and support conversations.</p>
        </div>
        <div>
          <h2 className="mb-2 text-lg font-semibold text-foreground">Sharing</h2>
          <p>We do not sell your data. Information is only visible to you, your instructors and academy administrators, except for certificate details shown on the public verification page.</p>
        </div>
        <div>
          <h2 className="mb-2 text-lg font-semibold text-foreground">Security</h2>
          <p>Accounts are protected by password authentication and per-user access rules, so students can only view their own records.</p>
        </div>
        <div>
          <h2 className="mb-2 text-lg font-semibold text-foreground">Your choices</h2>
          <p>You can update your profile at any time from your dashboard, or email info@galaxyitt.com.ng to request deletion of your account.</p>
        </div>
      </div>
    </section>
    <Footer />
  </div>
);

export default Privacy;
