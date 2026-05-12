import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  FileText,
  Briefcase,
  GraduationCap,
  ShieldCheck,
  CheckCircle2,
  List,
  ChevronRight,
} from "lucide-react";

const sections = [
  { id: "courses-terms", label: "Courses Terms", icon: GraduationCap },
  { id: "jobs-terms", label: "Jobs & Internships Terms", icon: Briefcase },
];

const Terms = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const type = params.get("type");
  const [activeSection, setActiveSection] = useState<string>("courses-terms");
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (type === "jobs") {
      setTimeout(() => {
        document.getElementById("jobs-terms")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } else if (type === "courses") {
      setTimeout(() => {
        document.getElementById("courses-terms")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  }, [type]);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-20% 0px -60% 0px" }
    );

    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observerRef.current?.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const CourseClauses = [
    {
      title: "1. Enrollment & Access",
      text: "Course enrollment is confirmed only after full payment is received and verified by our team. Access credentials and joining details are shared on the registered email and phone number within 24 hours of payment confirmation.",
    },
    {
      title: "2. Pricing, Coupons & Taxes",
      text: "Prices displayed are inclusive of applicable platform fees. Coupon discounts are validated at checkout and cannot be combined or applied retroactively. Coupons restricted to specific products will not apply to courses.",
    },
    {
      title: "3. Refund Policy",
      text: "All course purchases are final and non-refundable once access has been granted or content has been delivered. In exceptional cases (duplicate payment, technical inability to deliver), refund requests must be raised within 7 days of payment by writing to info@bookmymentor.com.",
    },
    {
      title: "4. Code of Conduct",
      text: "Learners must not share account credentials, record live sessions, or redistribute course materials. Violations may result in immediate revocation of access without refund.",
    },
    {
      title: "5. Intellectual Property",
      text: "All curriculum, recordings, templates and toolkits are the property of Book My Mentor and licensed for personal, non-commercial use only.",
    },
    {
      title: "6. Communication",
      text: "By enrolling, you consent to receive course-related communications via email, WhatsApp and SMS from support@bookmymentor.com. You can opt out of promotional messages at any time.",
    },
    {
      title: "7. Liability",
      text: "Book My Mentor's total liability for any claim related to a course purchase is limited to the amount paid for that course. We do not guarantee specific career, salary or placement outcomes.",
    },
  ];

  const JobClauses = [
    {
      title: "1. Subscription Details",
      text: "The Jobs & Internships subscription is priced at ₹299 for 3 months from the date of admin verification. Activation is manual and may take up to 24 hours after payment is claimed.",
    },
    {
      title: "2. What's Included",
      text: "Access to view full job & internship details, apply via internal/external/email channels, AI Resume Pro, AI Cover Letter Pro, and recruiter visibility — for the duration of the active subscription only.",
    },
    {
      title: "3. Payment Verification",
      text: "Subscriptions activate only after a valid UPI Transaction ID is submitted and verified by our admin team. Invalid, duplicate or unmatched transaction IDs will be rejected.",
    },
    {
      title: "4. No Job Guarantee",
      text: "Book My Mentor is a discovery and enablement platform. We do not guarantee job offers, interview calls, salary outcomes, or response from any recruiter or employer. Hiring decisions rest solely with the respective companies.",
    },
    {
      title: "5. Refund Policy",
      text: "Subscription fees are non-refundable once activated. Refunds are considered only when payment is verified but activation cannot be delivered, and must be requested within 7 days at info@bookmymentor.com.",
    },
    {
      title: "6. Acceptable Use",
      text: "Subscribers must apply to roles in good faith and must not misrepresent credentials, spam recruiters, or share platform content externally. Misuse may result in suspension without refund. Blocked users lose access to all premium features immediately.",
    },
    {
      title: "7. Coupons",
      text: "Coupons applicable to the Jobs & Internships plan are single-use per user and cannot be combined with other offers.",
    },
    {
      title: "8. Communications",
      text: "You will receive job alerts, application updates and admin notifications via email from support@bookmymentor.com. Reply to info@bookmymentor.com for any queries.",
    },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <SEOHead
        title="Terms & Conditions | Book My Mentor"
        description="Read the Terms & Conditions for Book My Mentor courses and Jobs & Internships subscription before checkout."
      />

      <main className="flex-1 container mx-auto px-4 py-[2.618rem] max-w-6xl">
        {/* Back button */}
        <div className="animate-slide-down animate-delay-100 mb-[1.618rem]">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="gap-2 hover:bg-primary/10"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>
        </div>

        {/* Hero header */}
        <header className="mb-[2.618rem] text-center animate-slide-up animate-delay-200">
          <div className="inline-flex items-center justify-center w-[3.5rem] h-[3.5rem] rounded-2xl bg-gradient-to-br from-primary/20 to-primary-dark/10 mb-[1rem]">
            <FileText className="w-7 h-7 text-primary" />
          </div>
          <h1 className="text-[2.618rem] md:text-[4.236rem] font-bold mb-[0.618rem] leading-tight bg-gradient-to-r from-primary via-primary-dark to-accent bg-clip-text text-transparent">
            Terms & Conditions
          </h1>
          <p className="text-muted-foreground text-sm md:text-base max-w-xl mx-auto">
            Effective Date: 12 May 2026 · Please read carefully before completing your purchase.
          </p>
        </header>

        <div className="grid lg:grid-cols-[260px_1fr] gap-[1.618rem]">
          {/* Sticky sidebar nav */}
          <aside className="hidden lg:block animate-slide-up animate-delay-300">
            <nav className="sticky top-[100px] bg-card border border-border rounded-2xl p-[1rem] shadow-sm">
              <div className="flex items-center gap-2 mb-[0.618rem] px-2">
                <List className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold">On this page</span>
              </div>
              <ul className="space-y-1">
                {sections.map((s) => {
                  const Icon = s.icon;
                  const isActive = activeSection === s.id;
                  return (
                    <li key={s.id}>
                      <button
                        onClick={() => scrollTo(s.id)}
                        className={`w-full flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition-all duration-200 text-left ${
                          isActive
                            ? "bg-gradient-to-r from-primary/10 to-primary-dark/5 text-primary font-medium shadow-sm"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        }`}
                      >
                        <Icon className="w-4 h-4 flex-shrink-0" />
                        <span className="leading-snug">{s.label}</span>
                        {isActive && (
                          <ChevronRight className="w-3 h-3 ml-auto flex-shrink-0" />
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </aside>

          {/* Main content */}
          <div className="space-y-[1.618rem]">
            {/* Mobile quick-jump cards */}
            <div className="grid sm:grid-cols-2 gap-[0.618rem] lg:hidden animate-fade-in animate-delay-300">
              {sections.map((s) => {
                const Icon = s.icon;
                return (
                  <button
                    key={s.id}
                    onClick={() => scrollTo(s.id)}
                    className="rounded-xl border border-border bg-card p-[1rem] hover:border-primary/40 hover:shadow-md transition-all duration-200 flex items-center gap-3 text-left"
                  >
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <span className="font-medium text-sm">{s.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Courses Terms */}
            <div
              id="courses-terms"
              className="scroll-mt-[100px] animate-hidden animate-fade-in"
            >
              <Card className="border border-border shadow-sm overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-primary/[0.06] to-transparent border-b border-border/60 pb-[1.2rem] pt-[1.5rem]">
                  <CardTitle className="flex items-center gap-3 text-[1.618rem] md:text-[2rem]">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <GraduationCap className="w-5 h-5 text-primary" />
                    </div>
                    Courses — Terms & Conditions
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-[1.5rem] md:p-[2rem] space-y-[1.2rem]">
                  {CourseClauses.map((clause, i) => (
                    <div
                      key={clause.title}
                      className="animate-hidden animate-fade-in group"
                      style={{
                        animationDelay: `${(i + 1) * 80}ms`,
                        animationFillMode: "forwards",
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-accent mt-0.5 flex-shrink-0 opacity-80 group-hover:opacity-100 transition-opacity" />
                        <div>
                          <h3 className="font-semibold text-foreground mb-1 text-[1.05rem]">
                            {clause.title}
                          </h3>
                          <p className="text-sm leading-[1.7] text-muted-foreground">
                            {clause.text.split("info@bookmymentor.com").map((part, idx, arr) =>
                              idx < arr.length - 1 ? (
                                <span key={idx}>
                                  {part}
                                  <a
                                    href="mailto:info@bookmymentor.com"
                                    className="text-primary underline hover:text-primary-dark transition-colors"
                                  >
                                    info@bookmymentor.com
                                  </a>
                                </span>
                              ) : (
                                <span key={idx}>{part}</span>
                              )
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Jobs Terms */}
            <div
              id="jobs-terms"
              className="scroll-mt-[100px] animate-hidden animate-fade-in"
            >
              <Card className="border border-border shadow-sm overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-primary/[0.06] to-transparent border-b border-border/60 pb-[1.2rem] pt-[1.5rem]">
                  <CardTitle className="flex items-center gap-3 text-[1.618rem] md:text-[2rem]">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Briefcase className="w-5 h-5 text-primary" />
                    </div>
                    Jobs & Internships Subscription — Terms & Conditions
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-[1.5rem] md:p-[2rem] space-y-[1.2rem]">
                  {JobClauses.map((clause, i) => (
                    <div
                      key={clause.title}
                      className="animate-hidden animate-fade-in group"
                      style={{
                        animationDelay: `${(i + 1) * 80}ms`,
                        animationFillMode: "forwards",
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-accent mt-0.5 flex-shrink-0 opacity-80 group-hover:opacity-100 transition-opacity" />
                        <div>
                          <h3 className="font-semibold text-foreground mb-1 text-[1.05rem]">
                            {clause.title}
                          </h3>
                          <p className="text-sm leading-[1.7] text-muted-foreground">
                            {clause.text.split("info@bookmymentor.com").map((part, idx, arr) =>
                              idx < arr.length - 1 ? (
                                <span key={idx}>
                                  {part}
                                  <a
                                    href="mailto:info@bookmymentor.com"
                                    className="text-primary underline hover:text-primary-dark transition-colors"
                                  >
                                    info@bookmymentor.com
                                  </a>
                                </span>
                              ) : (
                                <span key={idx}>{part}</span>
                              )
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Acknowledgment banner */}
            <div className="animate-hidden animate-fade-in" style={{ animationDelay: "400ms", animationFillMode: "forwards" }}>
              <Card className="bg-gradient-to-r from-primary/5 via-primary/[0.03] to-accent/5 border border-primary/20 shadow-sm">
                <CardContent className="p-[1.5rem] md:p-[1.8rem] flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <ShieldCheck className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm md:text-base text-foreground font-medium mb-1">
                      Acknowledgment
                    </p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      By proceeding with any purchase or subscription on Book My Mentor, you acknowledge that you have read, understood and agreed to these Terms & Conditions.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Terms;
