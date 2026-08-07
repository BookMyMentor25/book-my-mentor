import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useCourses } from "@/hooks/useCourses";
import {
  Rocket,
  ShoppingCart,
  GraduationCap,
  HeartPulse,
  Banknote,
  Cloud,
  ClipboardCheck,
  UserCheck,
  FileBadge,
  ArrowRight,
} from "lucide-react";

const domains = [
  { icon: Cloud, label: "SaaS", brief: "Onboarding funnel, pricing & retention roadmap" },
  { icon: ShoppingCart, label: "E-Commerce", brief: "Checkout conversion & catalogue discovery" },
  { icon: GraduationCap, label: "EdTech", brief: "Learner engagement & course completion" },
  { icon: HeartPulse, label: "Healthcare", brief: "Patient journey & appointment workflows" },
  { icon: Banknote, label: "Fintech", brief: "KYC flow, payments & risk dashboards" },
  { icon: Rocket, label: "Startup MVP", brief: "0→1 discovery, MVP scope & GTM plan" },
];

const steps = [
  {
    icon: ClipboardCheck,
    title: "1. Get a real brief",
    copy: "You receive an industry problem statement with real constraints, users and success metrics.",
  },
  {
    icon: UserCheck,
    title: "2. Build with a mentor",
    copy: "Weekly 1:1 reviews with practising product & project leaders until your work is industry-grade.",
  },
  {
    icon: FileBadge,
    title: "3. Ship a portfolio proof",
    copy: "Walk away with a documented live project, certificate and interview-ready story recruiters trust.",
  },
];

const LiveProjectsSection = () => {
  const navigate = useNavigate();
  const { data: courses } = useCourses();
  const projectCourseCount = courses?.length ?? 0;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Live Project Domains at Book My Mentor",
    itemListElement: domains.map((d, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: `${d.label} Live Project`,
      description: d.brief,
    })),
  };

  return (
    <section
      id="live-projects"
      className="relative overflow-hidden py-[2.618rem] md:py-[4.236rem] bg-background"
      aria-labelledby="live-projects-heading"
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />

      {/* 10% accent ambience */}
      <div className="pointer-events-none absolute -top-24 right-0 h-64 w-64 rounded-full bg-accent/10 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-56 w-56 rounded-full bg-primary/10 blur-3xl" aria-hidden="true" />

      <div className="container relative z-10 mx-auto px-4">
        {/* Header — 5-second clarity */}
        <div className="mx-auto max-w-3xl text-center mb-[1.618rem] md:mb-[2.618rem]">
          <Badge className="mb-4 bg-accent text-accent-foreground px-3 py-1 text-xs font-bold tracking-wide">
            LIVE PROJECTS AT THE CORE
          </Badge>
          <h2 id="live-projects-heading" className="font-extrabold text-foreground mb-4">
            Learn by Building Real Live Projects
          </h2>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
            Every program at Book My Mentor is built around live industry projects — real briefs from SaaS,
            E-Commerce, EdTech, Healthcare and Fintech teams, guided by mentors, so you graduate with proven
            experience instead of only theory.
          </p>
        </div>

        {/* Golden-ratio split: 61.8% domains / 38.2% process */}
        <div className="grid gap-[1.618rem] lg:grid-cols-[1.618fr_1fr] items-start">
          {/* Domains */}
          <div>
            <h3 className="mb-[1rem] font-bold text-foreground">Choose your live project domain</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-[0.618rem] md:gap-[1rem]">
              {domains.map((d) => (
                <Card
                  key={d.label}
                  className="group border-border/70 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg"
                >
                  <CardContent className="flex items-start gap-3 p-[1rem]">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110">
                      <d.icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <span className="flex flex-col">
                      <span className="text-sm font-bold text-foreground">{d.label}</span>
                      <span className="text-xs text-muted-foreground leading-snug">{d.brief}</span>
                    </span>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Conversion strip — 3-click navigation */}
            <div className="mt-[1.618rem] flex flex-col sm:flex-row gap-3">
              <Button
                size="lg"
                className="cta-primary w-full sm:w-auto rounded-xl px-8"
                onClick={() => document.getElementById("courses")?.scrollIntoView({ behavior: "smooth" })}
                aria-label="Explore mentorship programs that include live projects"
              >
                Start a Live Project
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto rounded-xl px-8 border-2 border-primary/30 text-primary hover:bg-primary/10"
                onClick={() => navigate("/jobs")}
                aria-label="See jobs and internships that value live project experience"
              >
                Jobs & Internships
              </Button>
            </div>
            {projectCourseCount > 0 && (
              <p className="mt-3 text-xs text-muted-foreground">
                {projectCourseCount} mentorship program{projectCourseCount > 1 ? "s" : ""} currently include live projects,
                1:1 reviews and a verified certificate.
              </p>
            )}
          </div>

          {/* How it works */}
          <div className="rounded-2xl border border-border bg-secondary/60 p-[1.618rem]">
            <h3 className="mb-[1rem] font-bold text-foreground">How your live project runs</h3>
            <ol className="space-y-[1rem]">
              {steps.map((s) => (
                <li key={s.title} className="flex gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent">
                    <s.icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block text-sm font-bold text-foreground">{s.title}</span>
                    <span className="block text-xs text-muted-foreground leading-relaxed">{s.copy}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LiveProjectsSection;
