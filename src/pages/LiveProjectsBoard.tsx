import { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import {
  ENGAGEMENT_TYPES,
  LIVE_PROJECT_DOMAINS,
  useCreateLiveProject,
  useLiveProjectAccess,
  useLiveProjects,
  useRedeemProjectCode,
} from "@/hooks/useLiveProjects";
import {
  Building2,
  Rocket,
  Search,
  ShieldCheck,
  Users,
  Clock,
  MapPin,
  Wallet,
  ArrowRight,
  Plus,
  Lock,
  KeyRound,
  ExternalLink,
  Mail,
} from "lucide-react";

const projectSchema = z.object({
  company_name: z.string().trim().min(2, "Company name is too short").max(120),
  company_website: z.string().trim().url("Enter a valid URL").max(255).optional().or(z.literal("")),
  contact_person: z.string().trim().min(2, "Contact person is required").max(100),
  contact_email: z.string().trim().email("Enter a valid email").max(255),
  title: z.string().trim().min(8, "Title must be at least 8 characters").max(140),
  summary: z
    .string()
    .trim()
    .min(60, "Please describe the project in at least 60 characters")
    .max(1200, "Keep the summary under 1200 characters"),
  domain: z.string().min(1, "Choose a domain"),
  engagement_type: z.string().min(1, "Choose a project type"),
  duration: z.string().trim().max(60).optional().or(z.literal("")),
  location: z.string().trim().max(80).optional().or(z.literal("")),
  stipend: z.string().trim().max(80).optional().or(z.literal("")),
  apply_url: z.string().trim().url("Enter a valid URL").max(255).optional().or(z.literal("")),
  openings: z.coerce.number().int().min(1, "At least 1 opening").max(50, "Maximum 50 openings"),
  skills: z.string().trim().max(300).optional().or(z.literal("")),
});

const emptyForm: Record<string, string> = {
  company_name: "",
  company_website: "",
  contact_person: "",
  contact_email: "",
  title: "",
  summary: "",
  domain: "",
  engagement_type: ENGAGEMENT_TYPES[0] as string,
  duration: "",
  location: "",
  stipend: "",
  apply_url: "",
  openings: "1",
  skills: "",
};

const LiveProjectsBoard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: projects, isLoading } = useLiveProjects();
  const createProject = useCreateLiveProject();

  const [search, setSearch] = useState("");
  const [domainFilter, setDomainFilter] = useState<string>("all");
  const [open, setOpen] = useState(false);
  const [codeOpen, setCodeOpen] = useState(false);
  const [codeInput, setCodeInput] = useState("");
  const [form, setForm] = useState({ ...emptyForm });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { data: hasAccess } = useLiveProjectAccess();
  const redeemCode = useRedeemProjectCode();

  const handleRedeem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate("/auth?redirect=/live-projects");
      return;
    }
    redeemCode.mutate(codeInput.trim(), {
      onSuccess: () => {
        setCodeInput("");
        setCodeOpen(false);
      },
    });
  };

  // Bot protection: hidden honeypot + minimum dwell time on the form
  const [honeypot, setHoneypot] = useState("");
  const formOpenedAt = useRef<number>(0);

  const setField = (key: string, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return (projects || []).filter((p) => {
      const matchesDomain = domainFilter === "all" || p.domain === domainFilter;
      if (!matchesDomain) return false;
      if (!q) return true;
      const haystack = [
        p.title || "",
        p.summary,
        p.company_name || "",
        p.domain,
        p.engagement_type,
        p.location || "",
        ...(p.skills || []),
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [projects, search, domainFilter]);


  const handleOpenChange = (next: boolean) => {
    if (next && !user) {
      navigate("/auth?redirect=/live-projects");
      return;
    }
    if (next) formOpenedAt.current = Date.now();
    setOpen(next);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (honeypot.trim().length > 0) {
      toast({ title: "Submission blocked", description: "Automated submission detected.", variant: "destructive" });
      return;
    }
    if (Date.now() - formOpenedAt.current < 6000) {
      toast({
        title: "Just a moment",
        description: "Please take a few seconds to review your project details before publishing.",
        variant: "destructive",
      });
      return;
    }

    const parsed = projectSchema.safeParse(form);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        fieldErrors[String(issue.path[0])] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    const v = parsed.data;
    createProject.mutate(
      {
        company_name: v.company_name,
        company_website: v.company_website || undefined,
        contact_person: v.contact_person,
        contact_email: v.contact_email,
        title: v.title,
        summary: v.summary,
        domain: v.domain,
        engagement_type: v.engagement_type,
        duration: v.duration || undefined,
        location: v.location || undefined,
        stipend: v.stipend || undefined,
        apply_url: v.apply_url || undefined,
        openings: v.openings,
        skills: (v.skills || "")
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
          .slice(0, 15),
      },
      {
        onSuccess: () => {
          setForm({ ...emptyForm });
          setOpen(false);
        },
      }
    );
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Live Projects from companies and startups",
    itemListElement: (projects || []).slice(0, 20).map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: p.title,
      description: p.summary.slice(0, 200),
    })),
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Live Projects for Students | Company Live Project Board"
        description="Browse real live projects posted by companies and startups in SaaS, EdTech, Fintech, E-Commerce and Healthcare. Companies can post a live project free."
        keywords="live projects for students, industry live project, live project internship, post a live project, startup live project, SaaS live project, fintech live project"
        canonicalUrl="https://bookmymentor.com/live-projects"
        structuredData={structuredData}
      />
      <Header />

      <main>
        {/* Hero — 5-second clarity */}
        <section className="relative overflow-hidden border-b border-border bg-secondary/40 py-[2.618rem] md:py-[4.236rem]">
          <div className="pointer-events-none absolute -top-24 right-0 h-64 w-64 rounded-full bg-accent/10 blur-3xl" aria-hidden="true" />
          <div className="container relative z-10 mx-auto px-4">
            <div className="grid items-center gap-[1.618rem] lg:grid-cols-[1.618fr_1fr]">
              <div>
                <Badge className="mb-4 bg-accent px-3 py-1 text-xs font-bold tracking-wide text-accent-foreground">
                  LIVE PROJECT BOARD
                </Badge>
                <h1 className="mb-4 text-3xl font-extrabold text-foreground md:text-4xl">
                  Real Live Projects from Companies &amp; Startups
                </h1>
                <p className="max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
                  Pick an industry brief, build it with mentor reviews and walk into interviews with proof of
                  work. Companies post a short project summary and every member is notified by email instantly.
                </p>
                <div className="mt-[1.618rem] flex flex-col gap-3 sm:flex-row">
                  <Dialog open={open} onOpenChange={handleOpenChange}>
                    <DialogTrigger asChild>
                      <Button size="lg" className="cta-primary w-full rounded-xl px-8 sm:w-auto">
                        <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
                        Post a Live Project
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Post a Live Project</DialogTitle>
                        <DialogDescription>
                          Share a short summary of the project. Once published, every registered member receives
                          an email about it.
                        </DialogDescription>
                      </DialogHeader>

                      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                        {/* Honeypot — hidden from humans, filled by bots */}
                        <div className="hidden" aria-hidden="true">
                          <label htmlFor="lp_company_url_confirm">Do not fill</label>
                          <input
                            id="lp_company_url_confirm"
                            name="lp_company_url_confirm"
                            tabIndex={-1}
                            autoComplete="off"
                            value={honeypot}
                            onChange={(e) => setHoneypot(e.target.value)}
                          />
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                          <div>
                            <Label htmlFor="company_name">Company / Startup name *</Label>
                            <Input
                              id="company_name"
                              value={form.company_name}
                              onChange={(e) => setField("company_name", e.target.value)}
                              maxLength={120}
                            />
                            {errors.company_name && <p className="mt-1 text-xs text-destructive">{errors.company_name}</p>}
                          </div>
                          <div>
                            <Label htmlFor="company_website">Website</Label>
                            <Input
                              id="company_website"
                              placeholder="https://example.com"
                              value={form.company_website}
                              onChange={(e) => setField("company_website", e.target.value)}
                              maxLength={255}
                            />
                            {errors.company_website && <p className="mt-1 text-xs text-destructive">{errors.company_website}</p>}
                          </div>
                          <div>
                            <Label htmlFor="contact_person">Contact person *</Label>
                            <Input
                              id="contact_person"
                              value={form.contact_person}
                              onChange={(e) => setField("contact_person", e.target.value)}
                              maxLength={100}
                            />
                            {errors.contact_person && <p className="mt-1 text-xs text-destructive">{errors.contact_person}</p>}
                          </div>
                          <div>
                            <Label htmlFor="contact_email">Contact email *</Label>
                            <Input
                              id="contact_email"
                              type="email"
                              value={form.contact_email}
                              onChange={(e) => setField("contact_email", e.target.value)}
                              maxLength={255}
                            />
                            {errors.contact_email && <p className="mt-1 text-xs text-destructive">{errors.contact_email}</p>}
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="title">Project title *</Label>
                          <Input
                            id="title"
                            placeholder="Improve checkout conversion for a D2C store"
                            value={form.title}
                            onChange={(e) => setField("title", e.target.value)}
                            maxLength={140}
                          />
                          {errors.title && <p className="mt-1 text-xs text-destructive">{errors.title}</p>}
                        </div>

                        <div>
                          <Label htmlFor="summary">Short project summary *</Label>
                          <Textarea
                            id="summary"
                            rows={5}
                            placeholder="The problem, the users, what the team will deliver and how success is measured."
                            value={form.summary}
                            onChange={(e) => setField("summary", e.target.value)}
                            maxLength={1200}
                          />
                          <p className="mt-1 text-xs text-muted-foreground">{form.summary.length}/1200</p>
                          {errors.summary && <p className="mt-1 text-xs text-destructive">{errors.summary}</p>}
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                          <div>
                            <Label>Domain *</Label>
                            <Select value={form.domain} onValueChange={(v) => setField("domain", v)}>
                              <SelectTrigger>
                                <SelectValue placeholder="Choose a domain" />
                              </SelectTrigger>
                              <SelectContent>
                                {LIVE_PROJECT_DOMAINS.map((d) => (
                                  <SelectItem key={d} value={d}>
                                    {d}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            {errors.domain && <p className="mt-1 text-xs text-destructive">{errors.domain}</p>}
                          </div>
                          <div>
                            <Label>Project type *</Label>
                            <Select value={form.engagement_type} onValueChange={(v) => setField("engagement_type", v)}>
                              <SelectTrigger>
                                <SelectValue placeholder="Choose a type" />
                              </SelectTrigger>
                              <SelectContent>
                                {ENGAGEMENT_TYPES.map((t) => (
                                  <SelectItem key={t} value={t}>
                                    {t}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="duration">Duration</Label>
                            <Input
                              id="duration"
                              placeholder="6 weeks"
                              value={form.duration}
                              onChange={(e) => setField("duration", e.target.value)}
                              maxLength={60}
                            />
                          </div>
                          <div>
                            <Label htmlFor="location">Location</Label>
                            <Input
                              id="location"
                              placeholder="Remote / Bengaluru"
                              value={form.location}
                              onChange={(e) => setField("location", e.target.value)}
                              maxLength={80}
                            />
                          </div>
                          <div>
                            <Label htmlFor="openings">Openings *</Label>
                            <Input
                              id="openings"
                              type="number"
                              min={1}
                              max={50}
                              value={form.openings}
                              onChange={(e) => setField("openings", e.target.value)}
                            />
                            {errors.openings && <p className="mt-1 text-xs text-destructive">{errors.openings}</p>}
                          </div>
                          <div>
                            <Label htmlFor="stipend">Stipend / budget</Label>
                            <Input
                              id="stipend"
                              placeholder="Unpaid / ₹10,000 per month"
                              value={form.stipend}
                              onChange={(e) => setField("stipend", e.target.value)}
                              maxLength={80}
                            />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="skills">Skills (comma separated)</Label>
                          <Input
                            id="skills"
                            placeholder="Product Discovery, SQL, Figma"
                            value={form.skills}
                            onChange={(e) => setField("skills", e.target.value)}
                            maxLength={300}
                          />
                        </div>

                        <div>
                          <Label htmlFor="apply_url">Application link</Label>
                          <Input
                            id="apply_url"
                            placeholder="https://forms.gle/..."
                            value={form.apply_url}
                            onChange={(e) => setField("apply_url", e.target.value)}
                            maxLength={255}
                          />
                          {errors.apply_url && <p className="mt-1 text-xs text-destructive">{errors.apply_url}</p>}
                        </div>

                        <p className="flex items-start gap-2 rounded-xl bg-secondary/60 p-3 text-xs text-muted-foreground">
                          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                          Your contact details are shown only to signed-in members and are protected by
                          server-side access rules and automated bot checks.
                        </p>

                        <Button type="submit" size="lg" className="cta-primary w-full rounded-xl" disabled={createProject.isPending}>
                          {createProject.isPending ? "Publishing…" : "Publish & Notify Members"}
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>

                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full rounded-xl border-2 border-primary/30 px-8 text-primary hover:bg-primary/10 sm:w-auto"
                    onClick={() => navigate("/find-teammates")}
                  >
                    <Users className="mr-2 h-4 w-4" aria-hidden="true" />
                    Find Teammates
                  </Button>
                </div>

                {/* Project code gate — 5-second clarity, one click to unlock */}
                <Dialog open={codeOpen} onOpenChange={setCodeOpen}>
                  {user && !hasAccess && (
                    <div className="mt-[1.618rem] flex flex-col gap-3 rounded-2xl border border-accent/30 bg-accent/5 p-[1rem] sm:flex-row sm:items-center sm:justify-between">
                      <p className="flex items-start gap-2 text-sm text-muted-foreground">
                        <Lock className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
                        <span>
                          <span className="font-bold text-foreground">Project details are locked.</span>{" "}
                          Enter the Project code you received after enrolling in a program to unlock company
                          details and apply.
                        </span>
                      </p>
                      <DialogTrigger asChild>
                        <Button className="cta-primary shrink-0 rounded-xl">
                          <KeyRound className="mr-2 h-4 w-4" aria-hidden="true" />
                          Enter Project Code
                        </Button>
                      </DialogTrigger>
                    </div>
                  )}
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Enter your Project code</DialogTitle>
                      <DialogDescription>
                        Book My Mentor shares this code with you once you enrol in a program. It unlocks Live
                        Project applications only.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleRedeem} className="space-y-4" noValidate>
                      <div>
                        <Label htmlFor="project_code">Project code *</Label>
                        <Input
                          id="project_code"
                          value={codeInput}
                          onChange={(e) => setCodeInput(e.target.value.toUpperCase())}
                          maxLength={32}
                          autoComplete="off"
                          className="tracking-widest"
                          placeholder="XXXXXXXX"
                        />
                      </div>
                      <Button
                        type="submit"
                        size="lg"
                        className="cta-primary w-full rounded-xl"
                        disabled={redeemCode.isPending || codeInput.trim().length < 4}
                      >
                        {redeemCode.isPending ? "Checking…" : "Unlock Live Projects"}
                      </Button>
                      <p className="text-center text-xs text-muted-foreground">
                        Don't have a code? Enrol in a program to receive one.
                      </p>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>


              <div className="rounded-2xl border border-border bg-background p-[1.618rem]">
                <h2 className="mb-3 text-base font-bold text-foreground">How it works</h2>
                <ol className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">1</span>
                    A company posts a short project summary.
                  </li>
                  <li className="flex gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">2</span>
                    Every registered member gets an email alert.
                  </li>
                  <li className="flex gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent/15 text-xs font-bold text-accent">3</span>
                    Candidates apply solo or as a batch and ship it with mentor reviews.
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </section>

        {/* Board */}
        <section className="container mx-auto px-4 py-[2.618rem]" aria-labelledby="board-heading">
          <div className="mb-[1.618rem] flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 id="board-heading" className="text-xl font-bold text-foreground">
              Open Live Projects{filtered.length ? ` (${filtered.length})` : ""}
            </h2>
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                <Input
                  className="pl-9 sm:w-72"
                  placeholder="Search projects, skills, companies"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  aria-label="Search live projects"
                />
              </div>
              <Select value={domainFilter} onValueChange={setDomainFilter}>
                <SelectTrigger className="sm:w-48" aria-label="Filter by domain">
                  <SelectValue placeholder="All domains" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All domains</SelectItem>
                  {LIVE_PROJECT_DOMAINS.map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {isLoading ? (
            <div className="grid gap-[1rem] sm:grid-cols-2 lg:grid-cols-3">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-56 animate-pulse rounded-2xl bg-secondary/60" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center gap-3 p-[2.618rem] text-center">
                <Rocket className="h-8 w-8 text-primary" aria-hidden="true" />
                <p className="font-bold text-foreground">No live projects match your search yet</p>
                <p className="max-w-md text-sm text-muted-foreground">
                  Companies post new briefs regularly. Clear the filters, or post the first project in this
                  domain.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-[1rem] sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((p) => (
                <Card key={p.id} className="group flex flex-col border-border/70 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg">
                  <CardContent className="flex flex-1 flex-col p-[1.618rem]">
                    <div className="mb-3 flex items-center justify-between gap-2">
                      <Badge variant="secondary" className="text-xs font-semibold">{p.domain}</Badge>
                      <span className="text-xs text-muted-foreground">{p.engagement_type}</span>
                    </div>
                    <h3 className="mb-1 text-base font-bold leading-snug text-foreground">
                      {p.unlocked && p.title ? (
                        p.title
                      ) : (
                        <span className="flex items-center gap-1.5 text-muted-foreground">
                          <Lock className="h-3.5 w-3.5" aria-hidden="true" />
                          Project title locked
                        </span>
                      )}
                    </h3>
                    <p className="mb-3 flex items-center gap-1.5 text-sm font-medium text-primary">
                      <Building2 className="h-3.5 w-3.5" aria-hidden="true" />
                      {p.unlocked && p.company_name ? p.company_name : "Company revealed with Project code"}
                    </p>
                    <p className="mb-4 line-clamp-4 text-sm leading-relaxed text-muted-foreground">{p.summary}</p>

                    <ul className="mb-4 space-y-1.5 text-xs text-muted-foreground">
                      {p.duration && (
                        <li className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5" aria-hidden="true" /> {p.duration}
                        </li>
                      )}
                      {p.location && (
                        <li className="flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5" aria-hidden="true" /> {p.location}
                        </li>
                      )}
                      {p.stipend && (
                        <li className="flex items-center gap-1.5">
                          <Wallet className="h-3.5 w-3.5" aria-hidden="true" /> {p.stipend}
                        </li>
                      )}
                      <li className="flex items-center gap-1.5">
                        <Users className="h-3.5 w-3.5" aria-hidden="true" /> {p.openings} opening{p.openings > 1 ? "s" : ""}
                      </li>
                    </ul>

                    {p.skills?.length > 0 && (
                      <div className="mb-4 flex flex-wrap gap-1.5">
                        {p.skills.slice(0, 5).map((s) => (
                          <span key={s} className="rounded-full border border-border bg-secondary/60 px-2 py-0.5 text-[11px] text-muted-foreground">
                            {s}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="mt-auto">
                      {!user ? (
                        <Button
                          variant="outline"
                          className="w-full rounded-xl border-2 border-primary/30 text-primary hover:bg-primary/10"
                          onClick={() => navigate("/auth?redirect=/live-projects")}
                        >
                          <Lock className="mr-2 h-3.5 w-3.5" aria-hidden="true" />
                          Sign in to Apply
                        </Button>
                      ) : !p.unlocked ? (
                        <Button
                          variant="outline"
                          className="w-full rounded-xl border-2 border-accent/40 text-accent hover:bg-accent/10"
                          onClick={() => setCodeOpen(true)}
                        >
                          <KeyRound className="mr-2 h-3.5 w-3.5" aria-hidden="true" />
                          Unlock &amp; Apply with Project Code
                        </Button>
                      ) : (
                        <div className="flex flex-col gap-2">
                          {p.apply_url ? (
                            <Button asChild className="cta-primary w-full rounded-xl">
                              <a href={p.apply_url} target="_blank" rel="noopener noreferrer">
                                Apply Now <ExternalLink className="ml-2 h-3.5 w-3.5" aria-hidden="true" />
                              </a>
                            </Button>
                          ) : (
                            <Button asChild className="cta-primary w-full rounded-xl">
                              <a href={`mailto:${p.contact_email}?subject=${encodeURIComponent(`Application: ${p.title}`)}`}>
                                Apply via Email <Mail className="ml-2 h-3.5 w-3.5" aria-hidden="true" />
                              </a>
                            </Button>
                          )}
                          <p className="text-center text-[11px] text-muted-foreground">
                            Contact: {p.contact_person}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}

            </div>
          )}

          <div className="mt-[2.618rem] rounded-2xl border border-border bg-secondary/50 p-[1.618rem] text-center">
            <h2 className="mb-2 text-lg font-bold text-foreground">Want mentor guidance on your Live Project?</h2>
            <p className="mx-auto mb-4 max-w-xl text-sm text-muted-foreground">
              Join a mentorship program to get weekly 1:1 reviews, a documented project and a verified
              certificate.
            </p>
            <Button size="lg" className="cta-primary rounded-xl px-8" onClick={() => navigate("/#courses")}>
              Explore Programs <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default LiveProjectsBoard;
