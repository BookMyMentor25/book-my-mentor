import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, FileText, Briefcase, GraduationCap, ShieldCheck } from "lucide-react";

const Terms = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const type = params.get("type"); // 'jobs' | 'courses' | null

  useEffect(() => {
    if (type === "jobs") {
      document.getElementById("jobs-terms")?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else if (type === "courses") {
      document.getElementById("courses-terms")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [type]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <SEOHead
        title="Terms & Conditions | Book My Mentor"
        description="Read the Terms & Conditions for Book My Mentor courses and Jobs & Internships subscription before checkout."
      />

      <main className="flex-1 container mx-auto px-4 py-10 max-w-4xl">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6 gap-2">
          <ArrowLeft className="w-4 h-4" /> Back
        </Button>

        <header className="mb-10 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 mb-4">
            <FileText className="w-7 h-7 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Terms & Conditions</h1>
          <p className="text-muted-foreground">
            Effective Date: 12 May 2026 · Please read carefully before completing your purchase.
          </p>
        </header>

        <div className="grid sm:grid-cols-2 gap-3 mb-10">
          <a href="#courses-terms" className="rounded-xl border border-border p-4 hover:border-primary/50 transition-colors flex items-center gap-3">
            <GraduationCap className="w-5 h-5 text-primary" />
            <span className="font-medium">Courses Terms</span>
          </a>
          <a href="#jobs-terms" className="rounded-xl border border-border p-4 hover:border-primary/50 transition-colors flex items-center gap-3">
            <Briefcase className="w-5 h-5 text-primary" />
            <span className="font-medium">Jobs & Internships Terms</span>
          </a>
        </div>

        {/* Courses */}
        <Card id="courses-terms" className="mb-8 scroll-mt-24">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <GraduationCap className="w-6 h-6 text-primary" />
              Courses — Terms & Conditions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
            <section>
              <h3 className="font-semibold text-foreground mb-1">1. Enrollment & Access</h3>
              <p>
                Course enrollment is confirmed only after full payment is received and verified by our team.
                Access credentials and joining details are shared on the registered email and phone number within 24 hours of payment confirmation.
              </p>
            </section>
            <section>
              <h3 className="font-semibold text-foreground mb-1">2. Pricing, Coupons & Taxes</h3>
              <p>
                Prices displayed are inclusive of applicable platform fees. Coupon discounts are validated at checkout and cannot be combined or applied retroactively.
                Coupons restricted to specific products will not apply to courses.
              </p>
            </section>
            <section>
              <h3 className="font-semibold text-foreground mb-1">3. Refund Policy</h3>
              <p>
                All course purchases are final and non-refundable once access has been granted or content has been delivered.
                In exceptional cases (duplicate payment, technical inability to deliver), refund requests must be raised within 7 days of payment by writing to <a href="mailto:info@bookmymentor.com" className="text-primary underline">info@bookmymentor.com</a>.
              </p>
            </section>
            <section>
              <h3 className="font-semibold text-foreground mb-1">4. Code of Conduct</h3>
              <p>
                Learners must not share account credentials, record live sessions, or redistribute course materials. Violations may result in immediate revocation of access without refund.
              </p>
            </section>
            <section>
              <h3 className="font-semibold text-foreground mb-1">5. Intellectual Property</h3>
              <p>
                All curriculum, recordings, templates and toolkits are the property of Book My Mentor and licensed for personal, non-commercial use only.
              </p>
            </section>
            <section>
              <h3 className="font-semibold text-foreground mb-1">6. Communication</h3>
              <p>
                By enrolling, you consent to receive course-related communications via email, WhatsApp and SMS from <strong>support@bookmymentor.com</strong>. You can opt out of promotional messages at any time.
              </p>
            </section>
            <section>
              <h3 className="font-semibold text-foreground mb-1">7. Liability</h3>
              <p>
                Book My Mentor's total liability for any claim related to a course purchase is limited to the amount paid for that course. We do not guarantee specific career, salary or placement outcomes.
              </p>
            </section>
          </CardContent>
        </Card>

        {/* Jobs */}
        <Card id="jobs-terms" className="mb-8 scroll-mt-24">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Briefcase className="w-6 h-6 text-primary" />
              Jobs & Internships Subscription — Terms & Conditions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
            <section>
              <h3 className="font-semibold text-foreground mb-1">1. Subscription Details</h3>
              <p>
                The Jobs & Internships subscription is priced at <strong>₹299 for 3 months</strong> from the date of admin verification. Activation is manual and may take up to 24 hours after payment is claimed.
              </p>
            </section>
            <section>
              <h3 className="font-semibold text-foreground mb-1">2. What's Included</h3>
              <p>
                Access to view full job & internship details, apply via internal/external/email channels, AI Resume Pro, AI Cover Letter Pro, and recruiter visibility — for the duration of the active subscription only.
              </p>
            </section>
            <section>
              <h3 className="font-semibold text-foreground mb-1">3. Payment Verification</h3>
              <p>
                Subscriptions activate only after a valid UPI Transaction ID is submitted and verified by our admin team. Invalid, duplicate or unmatched transaction IDs will be rejected.
              </p>
            </section>
            <section>
              <h3 className="font-semibold text-foreground mb-1">4. No Job Guarantee</h3>
              <p>
                Book My Mentor is a discovery and enablement platform. We do not guarantee job offers, interview calls, salary outcomes, or response from any recruiter or employer.
                Hiring decisions rest solely with the respective companies.
              </p>
            </section>
            <section>
              <h3 className="font-semibold text-foreground mb-1">5. Refund Policy</h3>
              <p>
                Subscription fees are <strong>non-refundable</strong> once activated. Refunds are considered only when payment is verified but activation cannot be delivered, and must be requested within 7 days at <a href="mailto:info@bookmymentor.com" className="text-primary underline">info@bookmymentor.com</a>.
              </p>
            </section>
            <section>
              <h3 className="font-semibold text-foreground mb-1">6. Acceptable Use</h3>
              <p>
                Subscribers must apply to roles in good faith and must not misrepresent credentials, spam recruiters, or share platform content externally. Misuse may result in suspension without refund.
                Blocked users lose access to all premium features immediately.
              </p>
            </section>
            <section>
              <h3 className="font-semibold text-foreground mb-1">7. Coupons</h3>
              <p>
                Coupons applicable to the Jobs & Internships plan (e.g., <code>CHAMPION</code>) are single-use per user and cannot be combined with other offers.
              </p>
            </section>
            <section>
              <h3 className="font-semibold text-foreground mb-1">8. Communications</h3>
              <p>
                You will receive job alerts, application updates and admin notifications via email from <strong>support@bookmymentor.com</strong>. Reply to <strong>info@bookmymentor.com</strong> for any queries.
              </p>
            </section>
          </CardContent>
        </Card>

        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-5 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            <p className="text-sm text-muted-foreground">
              By proceeding with any purchase or subscription on Book My Mentor, you acknowledge that you have read, understood and agreed to these Terms & Conditions.
            </p>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default Terms;
