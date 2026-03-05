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
  ArrowLeft, Crown, Clock, Zap, Send
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const JobSubscription = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { hasActiveSubscription, purchaseSubscription, isPurchasing, subscription } = useJobSubscription();
  const [orderId, setOrderId] = useState("");
  const [step, setStep] = useState<"info" | "payment">("info");
  const [sendingEmail, setSendingEmail] = useState(false);

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
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <Crown className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-3xl font-bold">You're a Premium Member! 🎉</h1>
            <p className="text-muted-foreground">
              Your subscription is active until{" "}
              <strong>{new Date(subscription?.expires_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</strong>
            </p>
            <Button onClick={() => navigate('/jobs')} className="cta-primary gap-2">
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

  const handlePayment = () => {
    if (!orderId.trim()) {
      toast({ title: "Please enter your UPI Transaction ID", variant: "destructive" });
      return;
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
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <Button variant="ghost" onClick={() => navigate('/jobs')} className="mb-8 gap-2">
              <ArrowLeft className="w-4 h-4" /> Back to Jobs
            </Button>

            <div className="max-w-4xl mx-auto grid lg:grid-cols-2 gap-8">
              {/* Plan Card */}
              <Card className="border-primary/30 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/20 to-transparent rounded-full blur-2xl" />
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-2 mb-2">
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
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl">Complete Payment</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {step === "info" ? (
                    <div className="space-y-6">
                      <div className="rounded-lg bg-primary/5 border border-primary/20 p-4 space-y-3">
                        <h4 className="font-semibold text-sm">Scan QR Code to Pay ₹299</h4>
                        <div className="bg-card rounded-lg p-4 border flex justify-center">
                          <img
                            src="/lovable-uploads/QR_Book_My_Mentor.jpeg"
                            alt="BookMyMentor Payment QR Code"
                            className="w-48 h-48 rounded-lg object-contain"
                          />
                        </div>
                        <p className="text-xs text-center text-muted-foreground">Amount: <strong className="text-primary">₹299</strong></p>
                        <ol className="text-xs text-muted-foreground space-y-1 list-decimal list-inside">
                          <li>Open any UPI app (GPay, PhonePe, Paytm)</li>
                          <li>Scan the QR code above and pay ₹299</li>
                          <li>Copy the Transaction ID from payment confirmation</li>
                          <li>Paste it below and activate your subscription</li>
                        </ol>
                      </div>
                      <Button onClick={() => setStep("payment")} className="w-full cta-primary gap-2">
                        <CheckCircle className="w-4 h-4" /> I've Made the Payment
                      </Button>
                      <Button variant="outline" onClick={handleSendPaymentEmail} disabled={sendingEmail} className="w-full gap-2">
                        <Send className="w-4 h-4" /> {sendingEmail ? "Sending..." : "Send Payment Details to My Email"}
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="orderId">UPI Transaction ID / Reference Number *</Label>
                        <Input
                          id="orderId"
                          value={orderId}
                          onChange={(e) => setOrderId(e.target.value)}
                          placeholder="e.g. T2403041234567890"
                          className="font-mono"
                        />
                        <p className="text-xs text-muted-foreground">
                          You can find this in your UPI app's transaction history
                        </p>
                      </div>
                      <div className="rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground">
                        <p><strong>Name:</strong> {user.user_metadata?.full_name || user.email}</p>
                        <p><strong>Email:</strong> {user.email}</p>
                        <p><strong>Amount:</strong> ₹299</p>
                        <p><strong>Plan:</strong> 3 Months Premium Access</p>
                      </div>
                      <Button
                        onClick={handlePayment}
                        disabled={isPurchasing || !orderId.trim()}
                        className="w-full cta-primary gap-2"
                      >
                        {isPurchasing ? "Activating..." : "Activate Subscription"}
                      </Button>
                      <Button variant="ghost" onClick={() => setStep("info")} className="w-full">
                        ← Back to Payment Instructions
                      </Button>
                    </div>
                  )}
                  <p className="text-xs text-center text-muted-foreground">
                    🔒 Your payment will be verified and subscription activated instantly.
                    For issues, contact support@bookmymentor.com
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
