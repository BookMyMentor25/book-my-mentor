import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { useAuth } from "@/hooks/useAuth";
import { useJobSubscription } from "@/hooks/useJobSubscription";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  CheckCircle, Shield, Sparkles, Briefcase, FileText, Mail,
  ArrowLeft, Crown, Clock, Zap, Send, CreditCard, Smartphone, Tag, X
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const ORIGINAL_PRICE = 299;

const JobSubscription = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { hasActiveSubscription, purchaseSubscription, isPurchasing, subscription } = useJobSubscription();
  const [orderId, setOrderId] = useState("");
  const [step, setStep] = useState<"scan" | "confirm">("scan");
  const [sendingEmail, setSendingEmail] = useState(false);
  const [notifyingAdmin, setNotifyingAdmin] = useState(false);

  // Coupon state
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discountPercent: number; discountAmount: number } | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);

  const finalPrice = appliedCoupon ? Math.round(ORIGINAL_PRICE - appliedCoupon.discountAmount) : ORIGINAL_PRICE;

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-pulse space-y-3 text-center">
            <div className="w-12 h-12 rounded-full bg-primary/20 mx-auto" />
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!user) {
    navigate('/auth?redirect=/jobs/subscribe');
    return null;
  }

  if (hasActiveSubscription) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <SEOHead title="Jobs Subscription | BookMyMentor" description="Your active subscription details" />
        <main className="flex-1 container mx-auto px-4 py-16">
          <div className="max-w-xl mx-auto text-center space-y-6">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto animate-fade-in">
              <Crown className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-3xl font-bold animate-fade-in animate-delay-100">You're a Premium Member! 🎉</h1>
            <p className="text-muted-foreground animate-fade-in animate-delay-200">
              Your subscription is active until{" "}
              <strong>{new Date(subscription?.expires_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</strong>
            </p>
            <Button onClick={() => navigate('/jobs')} className="cta-primary gap-2 animate-fade-in animate-delay-300">
              <Briefcase className="w-4 h-4" /> Browse Jobs
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const features = [
    { icon: Briefcase, label: "Apply to all job listings & internships" },
    { icon: FileText, label: "AI Resume Builder tailored per Job Description" },
    { icon: Mail, label: "Direct access to application channels (email/portal)" },
    { icon: Shield, label: "Priority visibility to recruiters" },
  ];

  const applyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    try {
      // Validate coupon via backend function
      const { data, error } = await supabase.rpc('validate_coupon', { input_code: couponCode.trim() });
      if (error) throw error;
      const result = data?.[0];
      if (!result?.is_valid) {
        toast({ title: "Invalid Coupon", description: result?.error_message || "This coupon code is not valid.", variant: "destructive" });
        setCouponLoading(false);
        return;
      }

      // Check applies_to — must be 'job_subscription'
      const { data: couponData } = await (supabase
        .from('coupons' as any)
        .select('applies_to, is_reusable')
        .ilike('coupon_code', couponCode.trim())
        .maybeSingle());

      if ((couponData as any)?.applies_to && (couponData as any).applies_to !== 'job_subscription') {
        toast({ title: "Not Applicable", description: "This coupon is not valid for Jobs & Internships subscription.", variant: "destructive" });
        setCouponLoading(false);
        return;
      }

      // Check one-time usage per user
      if ((couponData as any)?.is_reusable === false) {
        const { data: usageData } = await (supabase
          .from('job_subscription_coupon_usage' as any)
          .select('id')
          .eq('user_id', user.id)
          .ilike('coupon_code', couponCode.trim())
          .maybeSingle());

        if (usageData) {
          toast({ title: "Already Used", description: "You have already used this coupon code.", variant: "destructive" });
          setCouponLoading(false);
          return;
        }
      }

      const discountAmt = Math.round((result.discount_percent / 100) * ORIGINAL_PRICE) + (result.discount_amount || 0);
      setAppliedCoupon({
        code: couponCode.trim().toUpperCase(),
        discountPercent: result.discount_percent,
        discountAmount: Math.min(discountAmt, ORIGINAL_PRICE),
      });
      toast({ title: "Coupon Applied! 🎉", description: `You get ${result.discount_percent}% off!` });
    } catch (err) {
      toast({ title: "Error", description: "Could not validate coupon. Try again.", variant: "destructive" });
    } finally {
      setCouponLoading(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
  };

  const handlePaymentClaimed = async () => {
    if (!orderId.trim()) {
      toast({ title: "Please enter your UPI Transaction ID", variant: "destructive" });
      return;
    }

    setNotifyingAdmin(true);
    try {
      // Record coupon usage if applied
      if (appliedCoupon) {
        await (supabase
          .from('job_subscription_coupon_usage' as any)
          .insert({ user_id: user.id, coupon_code: appliedCoupon.code }));
      }

      await supabase.functions.invoke('notify-payment-claim', {
        body: {
          user_email: user.email,
          user_name: user.user_metadata?.full_name || user.email,
          user_id: user.id,
          order_id: orderId.trim(),
          amount: finalPrice,
          plan: 'Jobs & Internships Premium (3 months)',
          coupon_applied: appliedCoupon?.code || null,
          discount_amount: appliedCoupon?.discountAmount || 0,
        },
      });
    } catch (err) {
      console.error('Admin notification failed:', err);
    } finally {
      setNotifyingAdmin(false);
    }

    purchaseSubscription(orderId.trim());
  };

  const handleSendPaymentEmail = async () => {
    if (!user?.email) return;
    setSendingEmail(true);
    try {
      const { error } = await supabase.functions.invoke('send-payment-details', {
        body: {
          user_email: user.email,
          user_name: user.user_metadata?.full_name || user.email,
          plan: 'Jobs & Internships Premium',
          amount: finalPrice,
          duration: '3 months',
          coupon_applied: appliedCoupon?.code || null,
          original_amount: ORIGINAL_PRICE,
          discount_amount: appliedCoupon?.discountAmount || 0,
        },
      });
      if (error) throw error;
      toast({ title: "Payment details sent! 📧", description: `Check your inbox at ${user.email}` });
    } catch (err) {
      toast({ title: "Couldn't send email", description: "Please try again or contact support.", variant: "destructive" });
    } finally {
      setSendingEmail(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <SEOHead
        title="Jobs & Internships Premium - ₹299/3 Months | BookMyMentor"
        description="Get full access to job applications, AI Resume Builder, and direct recruiter channels for just ₹299 for 3 months."
        keywords="job subscription India, resume builder, ATS resume, job portal premium, internship access"
      />

      <main className="flex-1">
        <section className="py-12 lg:py-20">
          <div className="container mx-auto px-4">
            <Button variant="ghost" onClick={() => navigate('/jobs')} className="mb-6 gap-2 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-4 h-4" /> Back to Jobs
            </Button>

            <div className="max-w-4xl mx-auto grid lg:grid-cols-2 gap-8">
              {/* Plan Card */}
              <Card className="border-primary/20 shadow-xl relative overflow-hidden animate-fade-in">
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-primary/15 to-transparent rounded-full blur-3xl" />
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge className="bg-primary/10 text-primary border-primary/20 gap-1">
                      <Sparkles className="w-3 h-3" /> Premium Access
                    </Badge>
                  </div>
                  <CardTitle className="text-2xl">Jobs & Internships</CardTitle>
                  <div className="flex items-baseline gap-2 mt-4">
                    {appliedCoupon ? (
                      <>
                        <span className="text-2xl line-through text-muted-foreground">₹{ORIGINAL_PRICE}</span>
                        <span className="text-5xl font-bold text-primary">₹{finalPrice}</span>
                      </>
                    ) : (
                      <span className="text-5xl font-bold text-primary">₹{ORIGINAL_PRICE}</span>
                    )}
                    <span className="text-muted-foreground">/ 3 months</span>
                  </div>
                  {appliedCoupon && (
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary" className="gap-1 text-xs bg-green-100 text-green-700 border-green-200">
                        <Tag className="w-3 h-3" /> {appliedCoupon.code} — {appliedCoupon.discountPercent}% OFF
                      </Badge>
                      <button onClick={removeCoupon} className="text-muted-foreground hover:text-destructive transition-colors">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  <p className="text-sm text-muted-foreground mt-2">
                    {appliedCoupon
                      ? `You save ₹${appliedCoupon.discountAmount}!`
                      : "That's less than ₹100/month!"}
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {features.map((f, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{f.label}</span>
                    </div>
                  ))}

                  {/* Coupon Code Section */}
                  {!appliedCoupon && (
                    <div className="pt-4 border-t space-y-3">
                      <Label htmlFor="couponInput" className="text-sm font-medium flex items-center gap-1.5">
                        <Tag className="w-3.5 h-3.5 text-primary" /> Have a Referral / Coupon Code?
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          id="couponInput"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                          placeholder="Enter code"
                          className="font-mono uppercase"
                        />
                        <Button
                          variant="outline"
                          onClick={applyCoupon}
                          disabled={couponLoading || !couponCode.trim()}
                          className="shrink-0"
                        >
                          {couponLoading ? "..." : "Apply"}
                        </Button>
                      </div>
                    </div>
                  )}

                  <div className="pt-4 border-t space-y-2">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" /> Instant activation after payment
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Zap className="w-3 h-3" /> Valid for 3 months from activation
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Section */}
              <Card className="shadow-xl animate-fade-in animate-delay-100">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-primary" />
                    {step === "scan" ? "Complete Payment" : "Activate Subscription"}
                  </CardTitle>
                  <div className="flex items-center gap-3 mt-3">
                    <div className={`flex items-center gap-1.5 text-xs font-medium ${step === "scan" ? "text-primary" : "text-muted-foreground"}`}>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${step === "scan" ? "bg-primary text-primary-foreground" : "bg-primary/20 text-primary"}`}>1</div>
                      Pay
                    </div>
                    <div className="flex-1 h-px bg-border" />
                    <div className={`flex items-center gap-1.5 text-xs font-medium ${step === "confirm" ? "text-primary" : "text-muted-foreground"}`}>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${step === "confirm" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>2</div>
                      Activate
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-5">
                  {step === "scan" ? (
                    <div className="space-y-5">
                      <div className="rounded-2xl bg-gradient-to-br from-primary/5 via-background to-accent/5 border-2 border-primary/20 p-6 space-y-4 relative overflow-hidden">
                        {/* Decorative corner accents */}
                        <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-primary/30 rounded-tl-2xl" />
                        <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-primary/30 rounded-br-2xl" />
                        
                        <div className="flex items-center justify-center gap-2 text-sm font-semibold">
                          <Shield className="w-4 h-4 text-primary" />
                          <span>Secure UPI Payment</span>
                        </div>

                        {/* QR Code with protective frame */}
                        <div className="relative mx-auto w-fit">
                          <div className="absolute -inset-1 bg-gradient-to-br from-primary/20 via-accent/10 to-primary/20 rounded-2xl blur-sm" />
                          <div className="relative bg-card rounded-2xl p-5 border-2 border-primary/10 shadow-lg">
                            <img
                              src="/lovable-uploads/QR_Book_My_Mentor.jpeg"
                              alt="BookMyMentor Verified Payment QR Code — Scan to pay securely"
                              className="w-48 h-48 rounded-lg object-contain select-none pointer-events-none"
                              draggable={false}
                              onContextMenu={(e) => e.preventDefault()}
                            />
                          </div>
                        </div>

                        {/* Amount badge */}
                        <div className="flex justify-center">
                          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5">
                            <span className="text-xs text-muted-foreground">Pay</span>
                            <span className="text-lg font-bold text-primary">₹{finalPrice}</span>
                            {appliedCoupon && <span className="text-xs line-through text-muted-foreground/60">₹{ORIGINAL_PRICE}</span>}
                          </div>
                        </div>

                        {/* Trust indicators */}
                        <div className="flex items-center justify-center gap-4 text-[10px] text-muted-foreground pt-1">
                          <span className="flex items-center gap-1"><Shield className="w-3 h-3 text-green-500" /> Verified Merchant</span>
                          <span className="flex items-center gap-1"><CheckCircle className="w-3 h-3 text-green-500" /> UPI Secured</span>
                        </div>
                      </div>
                      
                      <div className="rounded-lg bg-muted/50 p-4 space-y-2">
                        <p className="text-xs font-medium text-foreground">How to pay:</p>
                        <ol className="text-xs text-muted-foreground space-y-1.5 list-decimal list-inside">
                          <li>Open any UPI app (GPay, PhonePe, Paytm)</li>
                          <li>Scan the QR code above and pay ₹{finalPrice}</li>
                          <li>Note the Transaction ID from confirmation</li>
                          <li>Click below and enter it to activate</li>
                        </ol>
                      </div>

                      <Button onClick={() => setStep("confirm")} className="w-full cta-primary gap-2 h-12 text-base">
                        <CheckCircle className="w-5 h-5" /> I've Made the Payment
                      </Button>
                      <Button variant="outline" onClick={handleSendPaymentEmail} disabled={sendingEmail} className="w-full gap-2">
                        <Send className="w-4 h-4" /> {sendingEmail ? "Sending..." : "Send Payment Details to My Email"}
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-5">
                      <div className="space-y-2">
                        <Label htmlFor="orderId" className="text-sm font-medium">UPI Transaction ID / Reference Number *</Label>
                        <Input
                          id="orderId"
                          value={orderId}
                          onChange={(e) => setOrderId(e.target.value)}
                          placeholder="e.g. T2403041234567890"
                          className="font-mono h-12 text-base"
                        />
                        <p className="text-xs text-muted-foreground">
                          Find this in your UPI app's transaction history
                        </p>
                      </div>
                      <div className="rounded-xl bg-muted/50 p-4 space-y-1 text-sm">
                        <p><span className="text-muted-foreground">Name:</span> <strong>{user.user_metadata?.full_name || user.email}</strong></p>
                        <p><span className="text-muted-foreground">Email:</span> <strong>{user.email}</strong></p>
                        <p><span className="text-muted-foreground">Amount:</span> <strong className="text-primary">₹{finalPrice}</strong>
                          {appliedCoupon && <span className="ml-1 text-xs line-through text-muted-foreground">₹{ORIGINAL_PRICE}</span>}
                        </p>
                        {appliedCoupon && (
                          <p><span className="text-muted-foreground">Coupon:</span> <strong className="text-green-600">{appliedCoupon.code} ({appliedCoupon.discountPercent}% off)</strong></p>
                        )}
                        <p><span className="text-muted-foreground">Plan:</span> <strong>3 Months Premium</strong></p>
                      </div>
                      <Button
                        onClick={handlePaymentClaimed}
                        disabled={isPurchasing || notifyingAdmin || !orderId.trim()}
                        className="w-full cta-primary gap-2 h-12 text-base"
                      >
                        {isPurchasing || notifyingAdmin ? "Activating..." : "🚀 Activate Subscription"}
                      </Button>
                      <Button variant="ghost" onClick={() => setStep("scan")} className="w-full text-muted-foreground">
                        ← Back to Payment
                      </Button>
                    </div>
                  )}
                  <p className="text-xs text-center text-muted-foreground">
                    🔒 Secure payment. Subscription activates instantly.
                    Issues? Contact support@bookmymentor.com
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default JobSubscription;
