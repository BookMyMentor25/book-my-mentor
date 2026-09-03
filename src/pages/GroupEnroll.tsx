import React, { useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { z } from "zod";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Users,
  Tag,
  X,
  FileText,
  ShieldCheck,
  IndianRupee,
  UserRound,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useCourses, formatPrice } from "@/hooks/useCourses";
import { supabase } from "@/integrations/supabase/client";
import { useCreateGroupEnrollment, splitThreeWays } from "@/hooks/useGroupEnrollment";

const memberSchema = z.object({
  member_name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  member_email: z.string().trim().email("Enter a valid email").max(255),
  member_phone: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number"),
});

const emptyMember = { member_name: "", member_email: "", member_phone: "" };

interface AppliedCoupon {
  code: string;
  discountPercent: number;
  discountAmount: number;
}

const GroupEnroll = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const { user, loading } = useAuth();
  const { data: courses, isLoading: coursesLoading } = useCourses();
  const createGroup = useCreateGroupEnrollment();

  const [courseId, setCourseId] = useState(searchParams.get("courseId") || "");
  const [groupName, setGroupName] = useState("");
  const [members, setMembers] = useState([{ ...emptyMember }, { ...emptyMember }, { ...emptyMember }]);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);
  const [agreed, setAgreed] = useState(false);
  const [validating, setValidating] = useState(false);

  React.useEffect(() => {
    if (!loading && !user) navigate("/auth?redirect=/group-enroll");
  }, [user, loading, navigate]);

  React.useEffect(() => {
    if (user) {
      setMembers((prev) => {
        const next = [...prev];
        next[0] = {
          ...next[0],
          member_name: next[0].member_name || user.user_metadata?.full_name || "",
          member_email: next[0].member_email || user.email || "",
        };
        return next;
      });
    }
  }, [user]);

  const selectedCourse = useMemo(
    () => courses?.find((c) => c.id === courseId) || null,
    [courses, courseId]
  );

  const totals = useMemo(() => {
    const total = selectedCourse?.price ?? 0;
    let discount = 0;
    if (appliedCoupon) {
      if (appliedCoupon.discountPercent > 0) {
        discount += Math.round((total * appliedCoupon.discountPercent) / 100);
      }
      if (appliedCoupon.discountAmount > 0) {
        discount += appliedCoupon.discountAmount * 100; // stored in rupees
      }
      discount = Math.min(discount, total);
    }
    const payable = Math.max(0, total - discount);
    return { total, discount, payable, shares: splitThreeWays(payable) };
  }, [selectedCourse, appliedCoupon]);

  const updateMember = (index: number, field: keyof typeof emptyMember, value: string) => {
    setMembers((prev) => prev.map((m, i) => (i === index ? { ...m, [field]: value } : m)));
  };

  const applyCoupon = async () => {
    const code = couponCode.trim();
    if (!code) return;
    setValidating(true);
    try {
      const { data, error } = await supabase.rpc("validate_coupon", { input_code: code });
      if (error) throw error;
      const result = data?.[0];
      if (!result || !result.is_valid) {
        toast({
          title: "Invalid Code",
          description: result?.error_message || "This referral/coupon code is not valid.",
          variant: "destructive",
        });
        return;
      }

      const { data: meta } = await supabase
        .from("coupons")
        .select("applies_to")
        .ilike("coupon_code", code)
        .maybeSingle();

      if ((meta as any)?.applies_to === "job_subscription") {
        toast({
          title: "Not Applicable",
          description: "This code works only for the Jobs & Internships plan.",
          variant: "destructive",
        });
        return;
      }

      setAppliedCoupon({
        code,
        discountPercent: Number(result.discount_percent) || 0,
        discountAmount: Number(result.discount_amount) || 0,
      });
      toast({ title: "Code Applied", description: "Your batch discount has been applied." });
    } catch (err) {
      console.error("Coupon validation failed");
      toast({
        title: "Validation Error",
        description: "Unable to validate the code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setValidating(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse) {
      toast({ title: "Select a Course", description: "Please choose a course for your batch.", variant: "destructive" });
      return;
    }
    if (groupName.trim().length < 3) {
      toast({ title: "Batch Name Required", description: "Give your batch a name (min 3 characters).", variant: "destructive" });
      return;
    }

    for (let i = 0; i < members.length; i++) {
      const parsed = memberSchema.safeParse(members[i]);
      if (!parsed.success) {
        toast({
          title: `Check Member ${i + 1}`,
          description: parsed.error.issues[0].message,
          variant: "destructive",
        });
        return;
      }
    }

    const emails = members.map((m) => m.member_email.trim().toLowerCase());
    if (new Set(emails).size !== 3) {
      toast({ title: "Duplicate Emails", description: "Each of the 3 members needs a unique email.", variant: "destructive" });
      return;
    }

    try {
      const result = await createGroup.mutateAsync({
        course_id: selectedCourse.id,
        course_title: selectedCourse.title,
        group_name: groupName.trim(),
        total_amount: totals.total,
        discount_amount: totals.discount,
        coupon_applied: appliedCoupon?.code || null,
        members: members.map((m) => ({
          member_name: m.member_name.trim(),
          member_email: m.member_email.trim(),
          member_phone: m.member_phone.trim(),
        })),
      });

      toast({
        title: "Batch Registered!",
        description: `Batch code ${result.groupCode}. Invoices are on the way to all 3 members.`,
      });
      setTimeout(() => navigate("/dashboard"), 1800);
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error?.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Group Enrollment | Split Course Fee 3 Ways | Book My Mentor"
        description="Register as a batch of 3 and split any Book My Mentor course fee equally. Apply a referral code for extra discount on product, project management & startup courses."
        keywords="group enrollment course, batch admission online course, split course fee, group discount product management course, team upskilling India, referral discount course"
        canonicalUrl="https://bookmymentor.com/group-enroll"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            {
              "@type": "Question",
              name: "How does group enrollment work at Book My Mentor?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Form a batch of 3 candidates, pick any course, and the fee is divided equally among the 3 members. Referral or coupon codes apply on top.",
              },
            },
            {
              "@type": "Question",
              name: "Can we use a referral code with a batch registration?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Yes. Apply your referral or coupon code before submitting and the discount is applied to the batch total before the equal 3-way split.",
              },
            },
          ],
        }}
      />
      <Header />

      <main className="container mx-auto px-4 py-8 sm:py-10">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="mr-2" size={16} />
          Back
        </Button>

        <header className="text-center max-w-2xl mx-auto mb-6 space-y-3">
          <Badge className="bg-accent/15 text-accent border border-accent/30">Batch of 3 • Pay 1/3 each</Badge>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
            Group Enrollment — Pay Only 1/3 of the Course Fee
          </h1>
          <p className="text-muted-foreground">
            Join with 2 friends or colleagues in one batch. The course fee is split equally among all 3 members, and a
            referral or coupon code adds an extra discount on top.
          </p>
        </header>

        <ol className="mx-auto mb-8 grid max-w-3xl grid-cols-1 gap-3 sm:mb-10 sm:grid-cols-3">
          {[
            { step: "1", title: "Pick your course", desc: "Choose the program and name your batch." },
            { step: "2", title: "Add 2 members", desc: "Enter name, email and phone for each member." },
            { step: "3", title: "Split & confirm", desc: "See each share instantly, then submit." },
          ].map((item) => (
            <li key={item.step} className="rounded-xl border border-border bg-card p-4 text-left">
              <span className="mb-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                {item.step}
              </span>
              <p className="text-sm font-semibold text-foreground">{item.title}</p>
              <p className="text-xs text-muted-foreground">{item.desc}</p>
            </li>
          ))}
        </ol>

        <div className="mx-auto mb-8 flex max-w-6xl flex-col items-start gap-3 rounded-2xl border-2 border-primary/30 bg-primary/5 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div className="flex items-start gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/15">
              <Users className="h-5 w-5 text-primary" aria-hidden="true" />
            </span>
            <div className="leading-snug">
              <p className="text-base font-bold text-foreground sm:text-lg">
                Don't have 2 members yet?
              </p>
              <p className="text-sm text-muted-foreground">
                Publish a short profile on our teammate board, invite people from LinkedIn, Facebook,
                Instagram, Reddit or Snapchat, or join a candidate already looking for a team.
              </p>
            </div>
          </div>
          <Button
            type="button"
            onClick={() => navigate("/find-teammates")}
            className="w-full sm:w-auto"
          >
            Find Teammates
          </Button>
        </div>


        <div className="grid grid-cols-1 lg:grid-cols-[1.618fr_1fr] gap-6 lg:gap-8 max-w-6xl mx-auto items-start">
          {/* Form — 60% */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Users className="w-5 h-5 text-primary" />
                Batch Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-[1.618rem]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="course">Course *</Label>
                    <Select value={courseId} onValueChange={setCourseId}>
                      <SelectTrigger id="course" aria-label="Select course">
                        <SelectValue placeholder={coursesLoading ? "Loading courses..." : "Choose a course"} />
                      </SelectTrigger>
                      <SelectContent>
                        {courses?.map((c) => (
                          <SelectItem key={c.id} value={c.id}>
                            {c.title} — {formatPrice(c.price)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="groupName">Batch Name *</Label>
                    <Input
                      id="groupName"
                      value={groupName}
                      maxLength={80}
                      onChange={(e) => setGroupName(e.target.value)}
                      placeholder="e.g. Team Trailblazers"
                    />
                  </div>
                </div>

                <Separator />

                {members.map((member, index) => (
                  <fieldset key={index} className="space-y-4 rounded-lg border border-border p-4">
                    <legend className="flex items-center gap-2 px-2 text-sm font-semibold text-foreground">
                      <UserRound className="w-4 h-4 text-primary" />
                      Member {index + 1}
                      {index === 0 && (
                        <span className="text-xs font-normal text-muted-foreground">(you — batch lead)</span>
                      )}
                    </legend>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`name-${index}`}>Full Name *</Label>
                        <Input
                          id={`name-${index}`}
                          value={member.member_name}
                          maxLength={100}
                          onChange={(e) => updateMember(index, "member_name", e.target.value)}
                          placeholder="Full name"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`email-${index}`}>Email *</Label>
                        <Input
                          id={`email-${index}`}
                          type="email"
                          value={member.member_email}
                          maxLength={255}
                          onChange={(e) => updateMember(index, "member_email", e.target.value)}
                          placeholder="name@example.com"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`phone-${index}`}>Mobile *</Label>
                        <Input
                          id={`phone-${index}`}
                          type="tel"
                          inputMode="numeric"
                          value={member.member_phone}
                          maxLength={10}
                          onChange={(e) =>
                            updateMember(index, "member_phone", e.target.value.replace(/\D/g, "").slice(0, 10))
                          }
                          placeholder="10-digit number"
                          required
                        />
                      </div>
                    </div>
                  </fieldset>
                ))}

                {/* Referral / coupon */}
                <div className="space-y-3">
                  <Label htmlFor="coupon">Referral / Coupon Code (Optional)</Label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="relative flex-1">
                      <Tag className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="coupon"
                        value={couponCode}
                        maxLength={40}
                        disabled={!!appliedCoupon}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        placeholder="Enter referral or coupon code"
                        className="pl-10"
                      />
                    </div>
                    {!appliedCoupon ? (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={applyCoupon}
                        disabled={!couponCode.trim() || validating}
                      >
                        {validating ? "Checking..." : "Apply Code"}
                      </Button>
                    ) : (
                      <Button type="button" variant="destructive" onClick={removeCoupon}>
                        <X className="h-4 w-4 mr-1" />
                        Remove
                      </Button>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-lg border border-border bg-muted/50 p-4">
                  <Checkbox
                    id="agree"
                    checked={agreed}
                    onCheckedChange={(checked) => setAgreed(checked as boolean)}
                  />
                  <Label htmlFor="agree" className="text-sm cursor-pointer leading-relaxed">
                    <FileText className="w-4 h-4 inline mr-1 text-primary" />
                    All 3 members have read and agree to the{" "}
                    <Link to="/terms?type=courses" target="_blank" className="text-primary underline font-medium">
                      Terms &amp; Conditions
                    </Link>{" "}
                    for Courses.
                  </Label>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 text-base font-bold cta-primary"
                  disabled={!agreed || !selectedCourse || createGroup.isPending}
                >
                  {createGroup.isPending
                    ? "Registering Batch..."
                    : !agreed
                    ? "Accept Terms to Continue"
                    : "Register Batch & Generate Invoices"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Summary — 30% */}
          <Card className="border-border lg:sticky lg:top-24">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <IndianRupee className="w-5 h-5 text-primary" />
                Fee Split Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Course</span>
                <span className="font-semibold text-right max-w-[55%]">
                  {selectedCourse ? selectedCourse.title : "Not selected"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Course fee</span>
                <span className="font-semibold">{formatPrice(totals.total)}</span>
              </div>
              {totals.discount > 0 && (
                <div className="flex justify-between text-sm text-accent">
                  <span>Discount {appliedCoupon ? `(${appliedCoupon.code})` : ""}</span>
                  <span className="font-semibold">- {formatPrice(totals.discount)}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between font-bold">
                <span>Batch total</span>
                <span className="text-primary">{formatPrice(totals.payable)}</span>
              </div>

              <div className="rounded-lg bg-primary/5 border border-primary/20 p-4 space-y-2">
                <p className="text-sm font-semibold text-foreground">Each member pays</p>
                {totals.shares.map((share, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Member {i + 1}
                      {i === 0 ? " (lead)" : ""}
                    </span>
                    <span className="font-bold">{formatPrice(share)}</span>
                  </div>
                ))}
                <p className="text-xs text-muted-foreground pt-1">
                  Fee is divided equally; any rounding rupee is added to the batch lead's share.
                </p>
              </div>

              <div className="flex items-start gap-2 text-xs text-muted-foreground">
                <ShieldCheck className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <span>
                  Secure registration. Our team confirms payment links for each member within 24 hours. Queries?
                  info@bookmymentor.com
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default GroupEnroll;
