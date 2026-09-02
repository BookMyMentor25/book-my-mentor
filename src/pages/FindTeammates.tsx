import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  Users,
  Search,
  Rocket,
  Lock,
  ShieldCheck,
  MapPin,
  Clock,
  Share2,
  Linkedin,
  Facebook,
  Instagram,
  Copy,
  Send,
  UserPlus,
  Mail,
  Phone,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useCourses } from "@/hooks/useCourses";
import {
  useTeammateProfiles,
  useMyTeammateProfile,
  useCreateTeammateProfile,
  useUpdateTeammateProfileStatus,
  useSendJoinRequest,
  useMyJoinRequests,
  type TeammateProfile,
} from "@/hooks/useTeammates";

const profileSchema = z.object({
  display_name: z.string().trim().min(2, "Name must be at least 2 characters").max(80),
  headline: z.string().trim().min(10, "Write a headline of at least 10 characters").max(140),
  about: z.string().trim().max(600).optional(),
  experience_level: z.string(),
  contact_email: z.string().trim().email("Enter a valid email").max(255),
  contact_phone: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number")
    .optional()
    .or(z.literal("")),
  linkedin_url: z
    .string()
    .trim()
    .url("Enter a valid LinkedIn URL")
    .max(255)
    .optional()
    .or(z.literal("")),
});

const DOMAINS = ["SaaS", "EdTech", "Fintech", "E-Commerce", "HealthTech", "AI / GenAI", "D2C Brand"];
const LEVELS = ["beginner", "intermediate", "advanced"];

const SHARE_TEXT =
  "I'm forming a team of 3 to build a real Live Project with Book My Mentor (mentor-led, industry-grade). Looking for 2 motivated teammates — we split the program fee equally. Join me:";
const SHARE_URL = "https://www.bookmymentor.com/find-teammates";

const FindTeammates = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, loading } = useAuth();
  const { data: courses } = useCourses();
  const { data: profiles, isLoading } = useTeammateProfiles();
  const { data: myProfile } = useMyTeammateProfile();
  const { data: myRequests } = useMyJoinRequests();
  const createProfile = useCreateTeammateProfile();
  const updateStatus = useUpdateTeammateProfileStatus();
  const sendJoin = useSendJoinRequest();

  const [search, setSearch] = useState("");
  const [domainFilter, setDomainFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [joinTarget, setJoinTarget] = useState<TeammateProfile | null>(null);
  const [joinMessage, setJoinMessage] = useState("");

  const [form, setForm] = useState({
    display_name: "",
    headline: "",
    about: "",
    course_id: "",
    preferred_domain: "",
    skills: "",
    experience_level: "beginner",
    city: "",
    availability: "",
    contact_email: "",
    contact_phone: "",
    linkedin_url: "",
  });

  React.useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        display_name: prev.display_name || user.user_metadata?.full_name || "",
        contact_email: prev.contact_email || user.email || "",
      }));
    }
  }, [user]);

  const requestedIds = useMemo(
    () => new Set((myRequests || []).map((r: any) => r.profile_id)),
    [myRequests]
  );

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();
    return (profiles || [])
      .filter((p) => p.status === "open")
      .filter((p) => (domainFilter === "all" ? true : p.preferred_domain === domainFilter))
      .filter((p) => {
        if (!term) return true;
        const haystack = [
          p.display_name,
          p.headline,
          p.about || "",
          p.city || "",
          p.preferred_domain || "",
          p.courses?.title || "",
          ...(p.skills || []),
        ]
          .join(" ")
          .toLowerCase();
        return haystack.includes(term);
      });
  }, [profiles, search, domainFilter]);

  const share = (network: "linkedin" | "facebook" | "reddit" | "whatsapp") => {
    const text = encodeURIComponent(SHARE_TEXT);
    const url = encodeURIComponent(SHARE_URL);
    const links: Record<string, string> = {
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`,
      reddit: `https://www.reddit.com/submit?url=${url}&title=${text}`,
      whatsapp: `https://wa.me/?text=${text}%20${url}`,
    };
    window.open(links[network], "_blank", "noopener,noreferrer");
  };

  const copyInvite = async () => {
    try {
      await navigator.clipboard.writeText(`${SHARE_TEXT} ${SHARE_URL}`);
      toast({
        title: "Invite copied",
        description: "Paste it on Instagram, Snapchat, Reddit or any group chat.",
      });
    } catch {
      toast({ title: "Copy failed", description: "Please copy the link manually.", variant: "destructive" });
    }
  };

  const submitProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = profileSchema.safeParse(form);
    if (!parsed.success) {
      toast({
        title: "Check your details",
        description: parsed.error.issues[0].message,
        variant: "destructive",
      });
      return;
    }

    try {
      await createProfile.mutateAsync({
        display_name: form.display_name.trim(),
        headline: form.headline.trim(),
        about: form.about.trim() || null,
        course_id: form.course_id || null,
        preferred_domain: form.preferred_domain || null,
        skills: form.skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
          .slice(0, 10),
        experience_level: form.experience_level,
        city: form.city.trim() || null,
        availability: form.availability.trim() || null,
        contact_email: form.contact_email.trim().toLowerCase(),
        contact_phone: form.contact_phone.trim() || null,
        linkedin_url: form.linkedin_url.trim() || null,
      });
      setShowForm(false);
      toast({
        title: "Profile published",
        description: "Every member is being notified by email. Share it on LinkedIn for faster matches.",
      });
    } catch (error: any) {
      toast({
        title: "Could not publish",
        description: error?.message || "Please try again.",
        variant: "destructive",
      });
    }
  };

  const submitJoin = async () => {
    if (!joinTarget || !user) return;
    try {
      await sendJoin.mutateAsync({
        profile_id: joinTarget.id,
        requester_name: user.user_metadata?.full_name || user.email || "Member",
        requester_email: user.email || "",
        message: joinMessage.trim() || null,
      });
      setJoinTarget(null);
      setJoinMessage("");
      toast({
        title: "Request sent",
        description: "The candidate can now see your request and contact details.",
      });
    } catch (error: any) {
      toast({
        title: "Could not send request",
        description: error?.message || "Please try again.",
        variant: "destructive",
      });
    }
  };

  const seo = (
    <SEOHead
      title="Find Live Project Teammates | Team Up & Split Fees | Book My Mentor"
      description="Find teammates for a mentor-led Live Project. Post your candidate profile, invite friends from LinkedIn or Instagram, form a batch of 3 and split the program fee equally."
      keywords="find live project teammates, project team partner online, form a batch of 3, live project internship team, group enrollment live project, hackathon teammate finder India, collaborate on real projects"
      canonicalUrl="https://bookmymentor.com/find-teammates"
      structuredData={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "How do I find teammates for a Live Project?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Publish a short candidate profile on the Book My Mentor teammate board. Every signed-in member is notified by email and can send you a join request. You can also share your invite on LinkedIn, Facebook, Reddit, Instagram or Snapchat.",
            },
          },
          {
            "@type": "Question",
            name: "Can I enroll for a Live Project alone?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes. You can enroll solo, join a candidate already listed on the board, or form your own batch of 3 and split the fee equally.",
            },
          },
          {
            "@type": "Question",
            name: "Is my contact information safe?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Candidate profiles are visible only to signed-in members. Visitors who are not signed in cannot see any candidate details, and email or phone details are never publicly listed.",
            },
          },
        ],
      }}
    />
  );

  // ---- Gate for unsigned visitors: no candidate data reaches the page ----
  if (!loading && !user) {
    return (
      <div className="min-h-screen bg-background">
        {seo}
        <Header />
        <main className="container mx-auto px-4 py-12 sm:py-16">
          <div className="mx-auto max-w-xl text-center">
            <span className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
              <Lock className="h-7 w-7 text-primary" aria-hidden="true" />
            </span>
            <h1 className="mb-3 text-3xl font-bold text-foreground sm:text-4xl">
              Find Live Project Teammates
            </h1>
            <p className="mb-6 text-muted-foreground">
              To protect our candidates' data, teammate profiles are visible only to signed-in
              members. Sign in free to browse candidates, join a team, or publish your own profile.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button size="lg" onClick={() => navigate("/auth?redirect=/find-teammates")}>
                Sign In / Sign Up Free
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/#live-projects">Explore Live Projects</Link>
              </Button>
            </div>
          </div>
        </main>
        <Footer />
        <WhatsAppButton />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {seo}
      <Header />

      <main className="container mx-auto px-4 py-8 sm:py-10">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="mr-2" size={16} />
          Back
        </Button>

        {/* Hero — 5-second clarity */}
        <header className="mx-auto mb-8 max-w-3xl space-y-3 text-center">
          <Badge className="border border-accent/30 bg-accent/15 text-accent">
            Live Project Team-Up • Members only
          </Badge>
          <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
            Find Teammates for Your Live Project
          </h1>
          <p className="text-muted-foreground">
            No team yet? Publish a short profile, invite people from LinkedIn and Instagram, or join a
            candidate already looking for members. Form a batch of 3 and each of you pays only 1/3.
          </p>
        </header>

        {/* 3-click paths */}
        <div className="mx-auto mb-8 grid max-w-5xl grid-cols-1 gap-3 sm:mb-10 sm:grid-cols-3">
          {[
            {
              icon: UserPlus,
              title: "Join a candidate",
              desc: "Browse open profiles below and send a join request.",
            },
            {
              icon: Users,
              title: "Form a batch of 3",
              desc: "Already have 2 friends? Register together and split the fee.",
              action: () => navigate("/group-enroll"),
              cta: "Batch of 3",
            },
            {
              icon: Rocket,
              title: "Enroll solo",
              desc: "Prefer to start alone? Enroll and we place you in a project pod.",
              action: () => navigate("/#courses"),
              cta: "Enroll Solo",
            },
          ].map((item) => (
            <div key={item.title} className="rounded-xl border border-border bg-card p-4">
              <item.icon className="mb-2 h-5 w-5 text-primary" aria-hidden="true" />
              <p className="text-sm font-semibold text-foreground">{item.title}</p>
              <p className="mb-2 text-xs text-muted-foreground">{item.desc}</p>
              {item.action && (
                <Button size="sm" variant="outline" onClick={item.action}>
                  {item.cta}
                </Button>
              )}
            </div>
          ))}
        </div>

        <div className="mx-auto grid max-w-6xl grid-cols-1 items-start gap-6 lg:grid-cols-[1.618fr_1fr] lg:gap-8">
          {/* 60% — candidate board */}
          <section aria-labelledby="board-heading" className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h2 id="board-heading" className="text-xl font-bold text-foreground">
                Candidates looking for teammates
              </h2>
              <span className="text-sm text-muted-foreground">
                {visible.length} open profile{visible.length === 1 ? "" : "s"}
              </span>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" aria-hidden="true" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by skill, city, domain or program"
                  aria-label="Search candidate profiles"
                  className="pl-10"
                />
              </div>
              <Select value={domainFilter} onValueChange={setDomainFilter}>
                <SelectTrigger className="sm:w-48" aria-label="Filter by domain">
                  <SelectValue placeholder="All domains" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All domains</SelectItem>
                  {DOMAINS.map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {isLoading ? (
              <div className="space-y-3">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="h-36 animate-pulse rounded-xl border border-border bg-muted/40" />
                ))}
              </div>
            ) : visible.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border bg-card p-8 text-center">
                <Users className="mx-auto mb-3 h-8 w-8 text-muted-foreground" aria-hidden="true" />
                <p className="font-semibold text-foreground">No open profiles match your search</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Be the first — publish your profile and every member gets notified by email.
                </p>
              </div>
            ) : (
              <ul className="space-y-4">
                {visible.map((p) => {
                  const mine = p.user_id === user?.id;
                  const already = requestedIds.has(p.id);
                  return (
                    <li key={p.id}>
                      <article className="rounded-xl border border-border bg-card p-5 transition-shadow hover:shadow-lg">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div className="min-w-0">
                            <h3 className="truncate text-lg font-bold text-foreground">{p.display_name}</h3>
                            <p className="text-sm font-medium text-primary">{p.headline}</p>
                          </div>
                          <Badge variant="outline" className="capitalize">
                            {p.experience_level}
                          </Badge>
                        </div>

                        {p.about && (
                          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.about}</p>
                        )}

                        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                          {p.courses?.title && (
                            <span className="inline-flex items-center gap-1">
                              <Rocket className="h-3.5 w-3.5" aria-hidden="true" /> {p.courses.title}
                            </span>
                          )}
                          {p.preferred_domain && (
                            <span className="inline-flex items-center gap-1">
                              <Users className="h-3.5 w-3.5" aria-hidden="true" /> {p.preferred_domain}
                            </span>
                          )}
                          {p.city && (
                            <span className="inline-flex items-center gap-1">
                              <MapPin className="h-3.5 w-3.5" aria-hidden="true" /> {p.city}
                            </span>
                          )}
                          {p.availability && (
                            <span className="inline-flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5" aria-hidden="true" /> {p.availability}
                            </span>
                          )}
                        </div>

                        {!!p.skills?.length && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {p.skills.slice(0, 8).map((s) => (
                              <span
                                key={s}
                                className="rounded-full border border-primary/20 bg-primary/5 px-2.5 py-1 text-xs text-primary"
                              >
                                {s}
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="mt-4 flex flex-wrap gap-2">
                          {mine ? (
                            <>
                              <Badge className="bg-accent/15 text-accent">Your profile</Badge>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateStatus.mutate({ id: p.id, status: "closed" })}
                              >
                                Close profile
                              </Button>
                            </>
                          ) : (
                            <Button
                              size="sm"
                              disabled={already}
                              onClick={() => setJoinTarget(p)}
                              className="gap-2"
                            >
                              <Send className="h-4 w-4" aria-hidden="true" />
                              {already ? "Request sent" : "Join this team"}
                            </Button>
                          )}
                          <Button size="sm" variant="ghost" onClick={copyInvite} className="gap-2">
                            <Share2 className="h-4 w-4" aria-hidden="true" />
                            Share
                          </Button>
                        </div>
                      </article>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>

          {/* 30% — publish + share sidebar */}
          <aside className="space-y-4 lg:sticky lg:top-24">
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <UserPlus className="h-5 w-5 text-primary" aria-hidden="true" />
                  {myProfile ? "Your teammate profile" : "Looking for teammates?"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {myProfile ? (
                  <>
                    <p className="text-sm text-muted-foreground">
                      Your profile is <strong className="capitalize">{myProfile.status}</strong>. Members can
                      send you join requests, and you get {myProfile.join_requests_count} so far.
                    </p>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() =>
                        updateStatus.mutate({
                          id: myProfile.id,
                          status: myProfile.status === "open" ? "closed" : "open",
                        })
                      }
                    >
                      {myProfile.status === "open" ? "Close my profile" : "Reopen my profile"}
                    </Button>
                  </>
                ) : (
                  <>
                    <p className="text-sm text-muted-foreground">
                      Publish a short profile in under a minute. Every signed-in member is emailed and can
                      ask to join your team.
                    </p>
                    <Button className="w-full" onClick={() => setShowForm(true)}>
                      Publish My Profile
                    </Button>
                  </>
                )}

                <div className="rounded-lg border border-border bg-muted/40 p-3">
                  <p className="mb-2 flex items-center gap-2 text-xs font-semibold text-foreground">
                    <Share2 className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                    Invite from your network
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" variant="outline" className="gap-1.5" onClick={() => share("linkedin")}>
                      <Linkedin className="h-4 w-4" aria-hidden="true" /> LinkedIn
                    </Button>
                    <Button size="sm" variant="outline" className="gap-1.5" onClick={() => share("facebook")}>
                      <Facebook className="h-4 w-4" aria-hidden="true" /> Facebook
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => share("reddit")}>
                      Reddit
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => share("whatsapp")}>
                      WhatsApp
                    </Button>
                    <Button size="sm" variant="outline" className="gap-1.5" onClick={copyInvite}>
                      <Instagram className="h-4 w-4" aria-hidden="true" /> Instagram / Snapchat
                    </Button>
                    <Button size="sm" variant="ghost" className="gap-1.5" onClick={copyInvite}>
                      <Copy className="h-4 w-4" aria-hidden="true" /> Copy invite
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardContent className="space-y-2 p-5 text-sm text-muted-foreground">
                <p className="flex items-center gap-2 font-semibold text-foreground">
                  <ShieldCheck className="h-4 w-4 text-primary" aria-hidden="true" />
                  Your data stays protected
                </p>
                <p>Profiles are hidden from visitors who are not signed in.</p>
                <p>Email and phone are shared only with candidates you accept.</p>
                <p>You can close or reopen your profile at any time.</p>
              </CardContent>
            </Card>
          </aside>
        </div>
      </main>

      {/* Publish profile dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Publish your Live Project profile</DialogTitle>
            <DialogDescription>
              Visible only to signed-in members. All members get an email so you find teammates faster.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={submitProfile} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="display_name">Display Name *</Label>
              <Input
                id="display_name"
                value={form.display_name}
                maxLength={80}
                onChange={(e) => setForm({ ...form, display_name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="headline">Headline *</Label>
              <Input
                id="headline"
                value={form.headline}
                maxLength={140}
                placeholder="e.g. Aspiring PM looking for 2 teammates for a Fintech Live Project"
                onChange={(e) => setForm({ ...form, headline: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="about">About You</Label>
              <Textarea
                id="about"
                value={form.about}
                maxLength={600}
                rows={3}
                placeholder="Your background, what you want to build, and how you like to work."
                onChange={(e) => setForm({ ...form, about: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="program">Program of Interest</Label>
                <Select value={form.course_id} onValueChange={(v) => setForm({ ...form, course_id: v })}>
                  <SelectTrigger id="program">
                    <SelectValue placeholder="Choose a program" />
                  </SelectTrigger>
                  <SelectContent>
                    {courses?.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="domain">Preferred Domain</Label>
                <Select
                  value={form.preferred_domain}
                  onValueChange={(v) => setForm({ ...form, preferred_domain: v })}
                >
                  <SelectTrigger id="domain">
                    <SelectValue placeholder="Choose a domain" />
                  </SelectTrigger>
                  <SelectContent>
                    {DOMAINS.map((d) => (
                      <SelectItem key={d} value={d}>
                        {d}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="skills">Skills (comma separated)</Label>
              <Input
                id="skills"
                value={form.skills}
                maxLength={200}
                placeholder="Product Strategy, Figma, SQL"
                onChange={(e) => setForm({ ...form, skills: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="level">Level</Label>
                <Select
                  value={form.experience_level}
                  onValueChange={(v) => setForm({ ...form, experience_level: v })}
                >
                  <SelectTrigger id="level" className="capitalize">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LEVELS.map((l) => (
                      <SelectItem key={l} value={l} className="capitalize">
                        {l}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={form.city}
                  maxLength={60}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="availability">Availability</Label>
                <Input
                  id="availability"
                  value={form.availability}
                  maxLength={60}
                  placeholder="10 hrs / week"
                  onChange={(e) => setForm({ ...form, availability: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="contact_email" className="flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5" aria-hidden="true" /> Contact Email *
                </Label>
                <Input
                  id="contact_email"
                  type="email"
                  value={form.contact_email}
                  maxLength={255}
                  onChange={(e) => setForm({ ...form, contact_email: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact_phone" className="flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5" aria-hidden="true" /> Mobile (optional)
                </Label>
                <Input
                  id="contact_phone"
                  inputMode="numeric"
                  value={form.contact_phone}
                  maxLength={10}
                  onChange={(e) =>
                    setForm({ ...form, contact_phone: e.target.value.replace(/\D/g, "").slice(0, 10) })
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="linkedin_url">LinkedIn Profile (optional)</Label>
              <Input
                id="linkedin_url"
                value={form.linkedin_url}
                maxLength={255}
                placeholder="https://linkedin.com/in/your-profile"
                onChange={(e) => setForm({ ...form, linkedin_url: e.target.value })}
              />
            </div>

            <p className="text-xs text-muted-foreground">
              Never share bank details, passwords or IDs here. Contact details stay members-only.
            </p>

            <Button type="submit" className="w-full" disabled={createProfile.isPending}>
              {createProfile.isPending ? "Publishing..." : "Publish & Notify Members"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Join request dialog */}
      <Dialog open={!!joinTarget} onOpenChange={(open) => !open && setJoinTarget(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Join {joinTarget?.display_name}'s team</DialogTitle>
            <DialogDescription>
              Your name and email are shared with this candidate so they can reach you.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="joinMessage">Message (optional)</Label>
              <Textarea
                id="joinMessage"
                rows={4}
                maxLength={500}
                value={joinMessage}
                onChange={(e) => setJoinMessage(e.target.value)}
                placeholder="Tell them what you bring to the project."
              />
            </div>
            <Button className="w-full" onClick={submitJoin} disabled={sendJoin.isPending}>
              {sendJoin.isPending ? "Sending..." : "Send Join Request"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default FindTeammates;
