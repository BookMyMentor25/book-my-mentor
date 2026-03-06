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
  ArrowLeft, Crown, Clock, Zap, Send, CreditCard, Smartphone
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const JobSubscription = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { hasActiveSubscription, purchaseSubscription, isPurchasing, subscription } = useJobSubscription();
  const [orderId, setOrderId] = useState("");
  const [step, setStep] = useState<"scan" | "confirm">("scan");
  const [sendingEmail, setSendingEmail] = useState(false);
  const [notifyingAdmin, setNotifyingAdmin] = useState(false);

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

  const handlePaymentClaimed = async () => {
    if (!orderId.trim()) {
      toast({ title: "Please enter your UPI Transaction ID", variant: "destructive" });
      return;
    }

    setNotifyingAdmin(true);
    try {
      await supabase.functions.invoke('notify-payment-claim', {
        body: {
          user_email: user.email,
          user_name: user.user_metadata?.full_name || user.email,
          user_id: user.id,
          order_id: orderId.trim(),
          amount: 299,
          plan: 'Jobs & Internships Premium (3 months)',
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
          amount: 299,
          duration: '3 months',
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
                    <span className="text-5xl font-bold text-primary">₹299</span>
                    <span className="text-muted-foreground">/ 3 months</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">That's less than ₹100/month!</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {features.map((f, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{f.label}</span>
                    </div>
                  ))}
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
                  {/* Step indicator */}
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
                      <div className="rounded-xl bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/15 p-5 space-y-4">
                        <div className="flex items-center gap-2 text-sm font-semibold">
                          <Smartphone className="w-4 h-4 text-primary" />
                          Scan QR Code to Pay ₹299
                        </div>
                        <div className="bg-card rounded-xl p-4 border shadow-sm flex justify-center">
                          <img
                            src="/lovable-uploads/QR_Book_My_Mentor.jpeg"
                            alt="BookMyMentor Payment QR Code"
                            className="w-52 h-52 rounded-lg object-contain"
                          />
                        </div>
                        <p className="text-xs text-center text-muted-foreground">Amount: <strong className="text-primary text-sm">₹299</strong></p>
                      </div>
                      
                      <div className="rounded-lg bg-muted/50 p-4 space-y-2">
                        <p className="text-xs font-medium text-foreground">How to pay:</p>
                        <ol className="text-xs text-muted-foreground space-y-1.5 list-decimal list-inside">
                          <li>Open any UPI app (GPay, PhonePe, Paytm)</li>
                          <li>Scan the QR code above and pay ₹299</li>
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
                        <p><span className="text-muted-foreground">Amount:</span> <strong className="text-primary">₹299</strong></p>
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
