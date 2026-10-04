import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { LIVE_PROJECT_DOMAINS } from "@/hooks/useLiveProjects";
import { LP_MRP, LP_PRICE, useCreateLPSubscription, useMyLPSubscription } from "@/hooks/useLiveProjectSubscription";
import { Briefcase, FileBadge, FileCheck2, BadgeCheck, ShieldCheck, Clock, CheckCircle2, KeyRound } from "lucide-react";

const schema = z.object({
  full_name: z.string().trim().min(2, "Enter your full name").max(100),
  email: z.string().trim().email("Enter a valid email").max(255),
  phone: z.string().trim().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number"),
  preferred_domain: z.string().optional(),
  motivation: z.string().trim().max(600).optional(),
});

const perks = [
  { icon: Briefcase, title: "Work on real Live Projects", copy: "Access every open brief from companies and startups." },
  { icon: FileCheck2, title: "Offer Letter", copy: "Issued when you are selected for a Live Project." },
  { icon: FileBadge, title: "Completion Certificate", copy: "Live Project Completion Certificate on finishing." },
  { icon: BadgeCheck, title: "CV Pointers Approval", copy: "Verified resume points you can show recruiters." },
];

const statusText: Record<string, { label: string; copy: string }> = {
  pending_review: { label: "Order received", copy: "We're checking Live Project slot availability. You'll get an email with payment details if a slot is open." },
  awaiting_payment: { label: "Slot confirmed — payment due", copy: "A slot is reserved for you. Check your email for payment details to confirm your enrolment." },
  active: { label: "Subscription active", copy: "Your plan is active. Enter the Project Accessible Code shared by our team on the Live Projects board." },
  rejected: { label: "No slots right now", copy: "Slots are full at the moment. You can place a new order later." },
  expired: { label: "Subscription expired", copy: "Your 3-month plan has ended. Place a new order to continue." },
};

const steps = ["Place your order", "We confirm slot & email payment details", "Pay ₹2,999 & get your Access Code"];

const LiveProjectSubscription = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: sub } = useMyLPSubscription();
  const create = useCreateLPSubscription();
  const [form, setForm] = useState({ full_name: "", email: user?.email || "", phone: "", preferred_domain: "", motivation: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [agree, setAgree] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const startedAt = useRef(Date.now());

  const active = sub && sub.status === "active" && sub.expires_at && new Date(sub.expires_at) > new Date();
  const open = sub && (sub.status === "pending_review" || sub.status === "awaiting_payment" || active);
  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return navigate("/auth?redirect=/live-projects/subscribe");
    if (honeypot) return;
    if (Date.now() - startedAt.current < 5000) {
      toast({ title: "Just a moment", description: "Please review your details before placing the order.", variant: "destructive" });
      return;
    }
    if (!agree) {
      toast({ title: "Please accept the Terms", variant: "destructive" });
      return;
    }
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const fe: Record<string, string> = {};
      parsed.error.issues.forEach((i) => (fe[String(i.path[0])] = i.message));
      setErrors(fe);
      return;
    }
    setErrors({});
    const v = parsed.data;
    create.mutate({ full_name: v.full_name, email: v.email, phone: v.phone, preferred_domain: v.preferred_domain || undefined, motivation: v.motivation || undefined });
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Live Projects Subscription ₹2,999 | Book My Mentor"
        description="Work on real industry live projects for 3 months. Get an offer letter, live project completion certificate and CV pointers approval for ₹2,999."
        keywords="live projects for students, live project certificate, live project internship, industry live project subscription, offer letter live project"
        canonicalUrl="https://bookmymentor.com/live-projects/subscribe"
      />
      <Header />
      <main className="container mx-auto px-4 py-[2.618rem] md:py-[4.236rem]">
        <div className="grid gap-[1.618rem] lg:grid-cols-[1.618fr_1fr] items-start">
          <section>
            <Badge className="mb-4 bg-accent px-3 py-1 text-xs font-bold tracking-wide text-accent-foreground">LIVE PROJECTS PLAN · 3 MONTHS</Badge>
            <h1 className="mb-4 text-3xl font-extrabold text-foreground md:text-4xl">Work on Real Live Projects. Get Certified.</h1>
            <p className="mb-[1.618rem] text-base text-muted-foreground md:text-lg">
              One plan to access Live Projects from companies and startups — with an offer letter, completion certificate and verified CV pointers.
            </p>
            <div className="mb-[1.618rem] flex items-end gap-3">
              <span className="text-4xl font-extrabold text-primary">₹{LP_PRICE.toLocaleString("en-IN")}</span>
              <span className="pb-1 text-lg text-muted-foreground line-through">₹{LP_MRP.toLocaleString("en-IN")}</span>
              <Badge variant="secondary" className="mb-1">70% off · valid 3 months</Badge>
            </div>
            <div className="grid gap-[0.618rem] sm:grid-cols-2">
              {perks.map((p) => (
                <Card key={p.title} className="border-border/70">
                  <CardContent className="flex gap-3 p-[1rem]">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"><p.icon className="h-5 w-5" /></span>
                    <span>
                      <span className="block text-sm font-bold text-foreground">{p.title}</span>
                      <span className="block text-xs text-muted-foreground">{p.copy}</span>
                    </span>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="mt-[1.618rem] rounded-2xl border border-border bg-secondary/50 p-[1rem] text-sm text-muted-foreground">
              <p className="mb-2 font-bold text-foreground">Interviews</p>
              Some companies shortlist candidates through an interview. If you're not selected, simply pick another company's Live Project where no interview is needed.
            </div>
            <ol className="mt-[1.618rem] grid gap-3 sm:grid-cols-3">
              {steps.map((s, i) => (
                <li key={s} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent/15 text-xs font-bold text-accent">{i + 1}</span>
                  {s}
                </li>
              ))}
            </ol>
          </section>

          <aside>
            <Card className="border-2 border-primary/20 shadow-lg">
              <CardContent className="p-[1.618rem]">
                {!user ? (
                  <div className="text-center">
                    <ShieldCheck className="mx-auto mb-3 h-10 w-10 text-primary" />
                    <h2 className="mb-2 text-lg font-bold">Registered members only</h2>
                    <p className="mb-4 text-sm text-muted-foreground">Sign in or create a free account to order the Live Projects plan.</p>
                    <Button className="cta-primary w-full rounded-xl" size="lg" onClick={() => navigate("/auth?redirect=/live-projects/subscribe")}>Sign in to Continue</Button>
                  </div>
                ) : open ? (
                  <div>
                    <div className="mb-3 flex items-center gap-2">
                      {active ? <CheckCircle2 className="h-6 w-6 text-primary" /> : <Clock className="h-6 w-6 text-accent" />}
                      <h2 className="text-lg font-bold">{statusText[sub!.status].label}</h2>
                    </div>
                    <p className="mb-4 text-sm text-muted-foreground">{statusText[sub!.status].copy}</p>
                    {active && (
                      <p className="mb-4 text-xs text-muted-foreground">Valid until {new Date(sub!.expires_at!).toLocaleDateString("en-IN")}</p>
                    )}
                    <Button className="cta-primary w-full rounded-xl" onClick={() => navigate("/live-projects")}>
                      <KeyRound className="mr-2 h-4 w-4" /> Go to Live Projects
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={submit} className="space-y-4" noValidate>
                    <h2 className="text-lg font-bold">Place your order</h2>
                    {sub && statusText[sub.status] && <p className="text-xs text-muted-foreground">Last order: {statusText[sub.status].label}</p>}
                    <div className="hidden" aria-hidden="true">
                      <input tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
                    </div>
                    <div>
                      <Label htmlFor="full_name">Full name *</Label>
                      <Input id="full_name" value={form.full_name} maxLength={100} onChange={(e) => set("full_name", e.target.value)} />
                      {errors.full_name && <p className="mt-1 text-xs text-destructive">{errors.full_name}</p>}
                    </div>
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input id="email" type="email" value={form.email} maxLength={255} onChange={(e) => set("email", e.target.value)} />
                      {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email}</p>}
                    </div>
                    <div>
                      <Label htmlFor="phone">Mobile number *</Label>
                      <Input id="phone" inputMode="numeric" maxLength={10} value={form.phone} onChange={(e) => set("phone", e.target.value.replace(/\D/g, ""))} />
                      {errors.phone && <p className="mt-1 text-xs text-destructive">{errors.phone}</p>}
                    </div>
                    <div>
                      <Label>Preferred domain</Label>
                      <Select value={form.preferred_domain} onValueChange={(v) => set("preferred_domain", v)}>
                        <SelectTrigger><SelectValue placeholder="Any domain" /></SelectTrigger>
                        <SelectContent>
                          {LIVE_PROJECT_DOMAINS.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="motivation">Why do you want a Live Project?</Label>
                      <Textarea id="motivation" rows={3} maxLength={600} value={form.motivation} onChange={(e) => set("motivation", e.target.value)} />
                    </div>
                    <label className="flex items-start gap-2 text-xs text-muted-foreground">
                      <Checkbox checked={agree} onCheckedChange={(c) => setAgree(!!c)} className="mt-0.5" />
                      <span>I agree to the <Link to="/terms#live-projects-terms" className="font-semibold text-primary underline">Live Projects Terms & Conditions</Link>.</span>
                    </label>
                    <Button type="submit" size="lg" className="cta-primary w-full rounded-xl" disabled={create.isPending}>
                      {create.isPending ? "Placing order…" : "Place Order — Pay Later"}
                    </Button>
                    <p className="text-center text-xs text-muted-foreground">No payment now. We email payment details only after a slot is confirmed.</p>
                  </form>
                )}
              </CardContent>
            </Card>
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LiveProjectSubscription;
