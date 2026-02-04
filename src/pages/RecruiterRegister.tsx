import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { useAuth } from "@/hooks/useAuth";
import { useRecruiters } from "@/hooks/useRecruiters";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Building2, 
  Users, 
  Briefcase, 
  CheckCircle,
  ArrowRight,
  Shield,
  Zap,
  TrendingUp,
  Award
} from "lucide-react";

const industries = [
  "Technology",
  "Finance & Banking",
  "Consulting",
  "E-commerce",
  "Healthcare",
  "Education",
  "Manufacturing",
  "Retail",
  "Media & Entertainment",
  "Real Estate",
  "Automotive",
  "FMCG",
  "Telecommunications",
  "Startup",
  "Other"
];

const companySizes = [
  "1-10",
  "11-50",
  "51-200",
  "201-500",
  "501-1000",
  "1001-5000",
  "5000+"
];

const RecruiterRegister = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { createRecruiter, isCreating, isRecruiter, recruiterProfile } = useRecruiters();
  
  const [formData, setFormData] = useState({
    company_name: '',
    contact_person: '',
    email: user?.email || '',
    phone: '',
    website: '',
    company_description: '',
    industry: '',
    company_size: '',
    location: '',
  });

  // Redirect if already a recruiter
  if (recruiterProfile) {
    navigate('/recruiter/dashboard');
    return null;
  }

  // Redirect to auth if not logged in
  if (!authLoading && !user) {
    navigate('/auth?redirect=/recruiter/register');
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createRecruiter(formData, {
      onSuccess: () => {
        navigate('/recruiter/dashboard');
      }
    });
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const benefits = [
    {
      icon: Users,
      title: "Access Top Talent",
      description: "Connect with skilled candidates from IITs, IIMs, and premier institutions"
    },
    {
      icon: Zap,
      title: "Quick Hiring",
      description: "Post jobs in minutes and receive applications from qualified candidates"
    },
    {
      icon: Shield,
      title: "Verified Profiles",
      description: "All candidates are verified students and professionals"
    },
    {
      icon: TrendingUp,
      title: "Track Applications",
      description: "Manage and track all applications from a single dashboard"
    }
  ];

  return (
    <>
      <SEOHead 
        title="Register as Recruiter | Post Jobs & Hire Talent | BookMyMentor"
        description="Register as a recruiter on BookMyMentor. Post job openings, internships, and connect with top talent from IITs, IIMs, and premier institutions. Start hiring today!"
        keywords="recruiter registration, post jobs, hire talent, campus hiring, internship hiring, tech hiring India, MBA hiring, product manager hiring"
      />
      
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        
        <main className="flex-1">
          {/* Hero Section */}
          <section className="relative py-12 lg:py-20 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
            <div className="absolute top-0 right-0 w-[61.8%] h-[61.8%] bg-gradient-to-bl from-primary/10 to-transparent rounded-full blur-3xl" />
            
            <div className="container mx-auto px-4 relative z-10">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                {/* Left Content */}
                <div className="space-y-6">
                  <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 text-sm font-medium text-primary">
                    <Award className="w-4 h-4" />
                    Trusted by 500+ Companies
                  </div>
                  
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
                    Find Your Next{" "}
                    <span className="text-gradient bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                      Star Employee
                    </span>
                  </h1>
                  
                  <p className="text-lg text-muted-foreground max-w-lg">
                    Post job openings and internships on BookMyMentor. Connect with skilled candidates 
                    from top universities and hire the best talent for your organization.
                  </p>

                  {/* Benefits Grid */}
                  <div className="grid sm:grid-cols-2 gap-4 pt-4">
                    {benefits.map((benefit, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-card border">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <benefit.icon className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium text-sm">{benefit.title}</h3>
                          <p className="text-xs text-muted-foreground">{benefit.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Registration Form */}
                <Card className="shadow-xl border-primary/10">
                  <CardHeader className="text-center pb-2">
                    <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Building2 className="w-7 h-7 text-primary" />
                    </div>
                    <CardTitle className="text-2xl">Register as Recruiter</CardTitle>
                    <CardDescription>
                      Create your company profile and start posting jobs
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="company_name">Company Name *</Label>
                          <Input
                            id="company_name"
                            value={formData.company_name}
                            onChange={(e) => handleChange('company_name', e.target.value)}
                            placeholder="Your company name"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="contact_person">Contact Person *</Label>
                          <Input
                            id="contact_person"
                            value={formData.contact_person}
                            onChange={(e) => handleChange('contact_person', e.target.value)}
                            placeholder="HR Manager name"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="email">Email *</Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleChange('email', e.target.value)}
                            placeholder="hr@company.com"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input
                            id="phone"
                            value={formData.phone}
                            onChange={(e) => handleChange('phone', e.target.value)}
                            placeholder="+91 98765 43210"
                          />
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="industry">Industry</Label>
                          <Select value={formData.industry} onValueChange={(v) => handleChange('industry', v)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select industry" />
                            </SelectTrigger>
                            <SelectContent>
                              {industries.map(ind => (
                                <SelectItem key={ind} value={ind}>{ind}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="company_size">Company Size</Label>
                          <Select value={formData.company_size} onValueChange={(v) => handleChange('company_size', v)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select size" />
                            </SelectTrigger>
                            <SelectContent>
                              {companySizes.map(size => (
                                <SelectItem key={size} value={size}>{size} employees</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="location">Location</Label>
                          <Input
                            id="location"
                            value={formData.location}
                            onChange={(e) => handleChange('location', e.target.value)}
                            placeholder="Mumbai, India"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="website">Website</Label>
                          <Input
                            id="website"
                            value={formData.website}
                            onChange={(e) => handleChange('website', e.target.value)}
                            placeholder="www.company.com"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description">Company Description</Label>
                        <Textarea
                          id="description"
                          value={formData.company_description}
                          onChange={(e) => handleChange('company_description', e.target.value)}
                          placeholder="Brief description about your company, culture, and what makes you a great place to work..."
                          rows={3}
                        />
                      </div>

                      <Button 
                        type="submit" 
                        size="lg"
                        className="w-full cta-primary text-lg gap-2"
                        disabled={isCreating || !formData.company_name || !formData.contact_person || !formData.email}
                      >
                        {isCreating ? 'Creating Profile...' : 'Register & Start Hiring'}
                        <ArrowRight className="w-5 h-5" />
                      </Button>

                      <p className="text-xs text-center text-muted-foreground">
                        By registering, you agree to our Terms of Service and Privacy Policy
                      </p>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* Trust Indicators */}
          <section className="py-12 bg-muted/30 border-t">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                <div>
                  <div className="text-3xl font-bold text-primary">500+</div>
                  <div className="text-sm text-muted-foreground">Companies Trust Us</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary">10,000+</div>
                  <div className="text-sm text-muted-foreground">Active Candidates</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-accent">1,000+</div>
                  <div className="text-sm text-muted-foreground">Jobs Posted</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary">95%</div>
                  <div className="text-sm text-muted-foreground">Satisfaction Rate</div>
                </div>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default RecruiterRegister;
