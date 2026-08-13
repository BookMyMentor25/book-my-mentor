import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Rocket, Briefcase, Sparkles, ArrowRight, Clock, ShieldCheck } from "lucide-react";

const paths = [
  {
    id: "learn",
    icon: Rocket,
    eyebrow: "I want experience",
    title: "Build a Live Project",
    copy: "Pick a real industry brief in SaaS, Fintech, EdTech or E-Commerce and ship it with a 1:1 mentor.",
    cta: "See Live Project programs",
    href: "/#courses",
    meta: "Starts in 48 hours • Certificate + portfolio proof",
    primary: true,
  },
  {
    id: "hired",
    icon: Briefcase,
    eyebrow: "I want a job",
    title: "Apply to Verified Jobs",
    copy: "Browse verified jobs and internships posted by recruiters and apply in a single click.",
    cta: "Browse jobs & internships",
    href: "/jobs",
    meta: "New roles every week • Recruiter-verified",
  },
  {
    id: "tools",
    icon: Sparkles,
    eyebrow: "I want to prepare",
    title: "Use the Free AI Toolkit",
    copy: "Resume, cover letter, finance and product tools built for live project work — free to start.",
    cta: "Open the free toolkit",
    href: "/ai-tools",
    meta: "No payment needed • 30+ tools",
  },
];

const PathFinderSection = () => {
  const navigate = useNavigate();

  const go = (href: string) => {
    if (href.startsWith("/#")) {
      const id = href.slice(2);
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        return;
      }
    }
    navigate(href);
  };

  return (
    <section
      id="get-started"
      aria-labelledby="pathfinder-heading"
      className="py-[2.618rem] md:py-[4.236rem] bg-secondary/40"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center mb-[1.618rem] md:mb-[2.618rem]">
          <Badge className="mb-3 bg-primary/10 text-primary hover:bg-primary/10 border-0">
            Start in 3 clicks
          </Badge>
          <h2
            id="pathfinder-heading"
            className="text-[1.618rem] md:text-[2.618rem] font-extrabold leading-tight mb-3"
          >
            What do you want to achieve first?
          </h2>
          <p className="text-muted-foreground text-base md:text-lg">
            Choose one path below. Every path keeps you on a real live project — no long browsing, no guesswork.
          </p>
        </div>

        <div className="grid gap-[1rem] md:gap-[1.618rem] md:grid-cols-3 max-w-6xl mx-auto">
          {paths.map((path, i) => (
            <Card
              key={path.id}
              onClick={() => go(path.href)}
              role="link"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  go(path.href);
                }
              }}
              className={`animate-hidden animate-slide-up cursor-pointer group flex flex-col p-[1.618rem] rounded-2xl border-2 transition-all duration-300 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                path.primary
                  ? "border-accent/50 bg-card shadow-lg hover:shadow-2xl"
                  : "border-border bg-card hover:border-primary/40 hover:shadow-xl"
              }`}
              style={{ animationDelay: `${0.1 + i * 0.1}s` }}
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                  path.primary
                    ? "bg-gradient-to-br from-accent to-accent-light text-accent-foreground"
                    : "bg-gradient-to-br from-primary to-primary-light text-primary-foreground"
                } group-hover:scale-110 transition-transform duration-300`}
              >
                <path.icon className="w-6 h-6" aria-hidden="true" />
              </div>

              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">
                {path.eyebrow}
              </span>
              <h3 className="text-[1.2rem] md:text-[1.618rem] font-bold mb-2 leading-snug">
                {path.title}
              </h3>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-4 flex-1">
                {path.copy}
              </p>

              <p className="flex items-center gap-1.5 text-xs text-muted-foreground mb-4">
                <Clock className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                {path.meta}
              </p>

              <Button
                className={`w-full rounded-xl font-semibold ${path.primary ? "cta-primary" : "cta-secondary"}`}
                tabIndex={-1}
              >
                {path.cta}
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
              </Button>
            </Card>
          ))}
        </div>

        <p className="flex items-center justify-center gap-2 text-xs md:text-sm text-muted-foreground mt-[1.618rem]">
          <ShieldCheck className="w-4 h-4 text-primary shrink-0" aria-hidden="true" />
          Secure payments, transparent pricing and mentor support on every path.
        </p>
      </div>
    </section>
  );
};

export default PathFinderSection;
