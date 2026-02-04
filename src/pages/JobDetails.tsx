import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { useJobs, useJobApplications } from "@/hooks/useJobs";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  MapPin, 
  Briefcase, 
  Clock, 
  Building2, 
  IndianRupee, 
  Globe,
  Users,
  CheckCircle,
  ArrowLeft,
  Send,
  ExternalLink,
  Calendar,
  GraduationCap
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";

const JobDetails = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getJobById } = useJobs();
  const { applyToJob, isApplying } = useJobApplications();
  
  const [isApplyDialogOpen, setIsApplyDialogOpen] = useState(false);
  const [applicationForm, setApplicationForm] = useState({
    applicant_name: '',
    applicant_email: '',
    applicant_phone: '',
    cover_letter: '',
  });

  const { data: job, isLoading, error } = useQuery({
    queryKey: ['job', jobId],
    queryFn: () => getJobById(jobId!),
    enabled: !!jobId,
  });

  // Pre-fill form with user data
  useEffect(() => {
    if (user) {
      setApplicationForm(prev => ({
        ...prev,
        applicant_name: user.user_metadata?.full_name || '',
        applicant_email: user.email || '',
      }));
    }
  }, [user]);

  const formatSalary = (min?: number, max?: number, currency = 'INR') => {
    if (!min && !max) return null;
    const formatter = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 });
    const symbol = currency === 'INR' ? '₹' : '$';
    if (min && max) {
      return `${symbol}${formatter.format(min)} - ${symbol}${formatter.format(max)} per annum`;
    }
    return `${symbol}${formatter.format(min || max || 0)} per annum`;
  };

  const getExperienceLabel = (level?: string) => {
    const labels: Record<string, string> = {
      'entry': 'Entry Level (0-2 years)',
      'mid': 'Mid Level (2-5 years)',
      'senior': 'Senior Level (5+ years)',
    };
    return labels[level || ''] || level;
  };

  const handleApply = () => {
    if (!user) {
      navigate('/auth?redirect=' + encodeURIComponent(`/job/${jobId}`));
      return;
    }
    setIsApplyDialogOpen(true);
  };

  const handleSubmitApplication = () => {
    if (!jobId) return;
    
    applyToJob({
      job_id: jobId,
      ...applicationForm,
    }, {
      onSuccess: () => {
        setIsApplyDialogOpen(false);
      }
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/3" />
            <div className="h-12 bg-muted rounded w-2/3" />
            <div className="h-64 bg-muted rounded" />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Job Not Found</h1>
          <p className="text-muted-foreground mb-6">The job you're looking for doesn't exist or has been removed.</p>
          <Link to="/jobs">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Jobs
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const recruiter = job.recruiters as any;

  return (
    <>
      <SEOHead 
        title={`${job.title} at ${recruiter?.company_name || 'Company'} | Jobs | BookMyMentor`}
        description={`Apply for ${job.title} position at ${recruiter?.company_name}. ${job.job_type} opportunity in ${job.location}. ${job.description?.slice(0, 120)}...`}
        keywords={`${job.title}, ${recruiter?.company_name}, ${job.location} jobs, ${job.job_type} jobs, ${job.skills?.join(', ')}`}
      />
      
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        
        <main className="flex-1">
          {/* Breadcrumb */}
          <div className="bg-muted/30 border-b">
            <div className="container mx-auto px-4 py-3">
              <Link to="/jobs" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Job Listings
              </Link>
            </div>
          </div>

          <div className="container mx-auto px-4 py-8 lg:py-12">
            <div className="max-w-5xl mx-auto">
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Main Content - 61.8% */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Job Header */}
                  <Card>
                    <CardContent className="p-6 lg:p-8">
                      <div className="flex items-start gap-4">
                        {recruiter?.logo_url && (
                          <img 
                            src={recruiter.logo_url} 
                            alt={`${recruiter.company_name} logo`}
                            className="w-16 h-16 lg:w-20 lg:h-20 rounded-xl object-cover border"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-primary font-medium">{recruiter?.company_name}</span>
                            {recruiter?.is_verified && (
                              <Badge variant="secondary" className="gap-1">
                                <CheckCircle className="w-3 h-3" />
                                Verified
                              </Badge>
                            )}
                          </div>
                          <h1 className="text-2xl lg:text-3xl font-bold mb-3">{job.title}</h1>
                          <div className="flex flex-wrap gap-3">
                            <Badge className="bg-primary/10 text-primary border-primary/20">
                              {job.job_type.replace('-', ' ')}
                            </Badge>
                            {job.experience_level && (
                              <Badge variant="outline">
                                {getExperienceLabel(job.experience_level)}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Key Details Grid */}
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-6 border-t">
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          <span>{job.location}</span>
                        </div>
                        {formatSalary(job.salary_min, job.salary_max, job.currency) && (
                          <div className="flex items-center gap-2 text-sm">
                            <IndianRupee className="w-4 h-4 text-muted-foreground" />
                            <span>{formatSalary(job.salary_min, job.salary_max, job.currency)}</span>
                          </div>
                        )}
                        {job.application_deadline && (
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <span>Apply by {new Date(job.application_deadline).toLocaleDateString()}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span>Posted {new Date(job.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Job Description */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Job Description</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="prose prose-sm max-w-none text-muted-foreground">
                        <p className="whitespace-pre-wrap">{job.description}</p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Requirements */}
                  {job.requirements && job.requirements.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <GraduationCap className="w-5 h-5" />
                          Requirements
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {job.requirements.map((req, i) => (
                            <li key={i} className="flex items-start gap-2 text-muted-foreground">
                              <CheckCircle className="w-4 h-4 mt-1 text-primary flex-shrink-0" />
                              <span>{req}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}

                  {/* Skills */}
                  {job.skills && job.skills.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Skills Required</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {job.skills.map((skill, i) => (
                            <Badge key={i} variant="secondary" className="px-3 py-1">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Benefits */}
                  {job.benefits && job.benefits.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Benefits & Perks</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid sm:grid-cols-2 gap-2">
                          {job.benefits.map((benefit, i) => (
                            <div key={i} className="flex items-center gap-2 text-muted-foreground">
                              <CheckCircle className="w-4 h-4 text-accent flex-shrink-0" />
                              <span>{benefit}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>

                {/* Sidebar - 38.2% */}
                <div className="space-y-6">
                  {/* Apply Card */}
                  <Card className="sticky top-24 border-primary/20 shadow-lg">
                    <CardContent className="p-6 space-y-4">
                      <Dialog open={isApplyDialogOpen} onOpenChange={setIsApplyDialogOpen}>
                        <DialogTrigger asChild>
                          <Button 
                            size="lg" 
                            className="w-full cta-primary text-lg gap-2"
                            onClick={handleApply}
                          >
                            <Send className="w-5 h-5" />
                            Apply Now
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-lg">
                          <DialogHeader>
                            <DialogTitle>Apply for {job.title}</DialogTitle>
                            <DialogDescription>
                              Submit your application to {recruiter?.company_name}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 pt-4">
                            <div className="space-y-2">
                              <Label htmlFor="name">Full Name *</Label>
                              <Input
                                id="name"
                                value={applicationForm.applicant_name}
                                onChange={(e) => setApplicationForm(prev => ({ ...prev, applicant_name: e.target.value }))}
                                placeholder="Your full name"
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="email">Email *</Label>
                              <Input
                                id="email"
                                type="email"
                                value={applicationForm.applicant_email}
                                onChange={(e) => setApplicationForm(prev => ({ ...prev, applicant_email: e.target.value }))}
                                placeholder="your.email@example.com"
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="phone">Phone Number</Label>
                              <Input
                                id="phone"
                                value={applicationForm.applicant_phone}
                                onChange={(e) => setApplicationForm(prev => ({ ...prev, applicant_phone: e.target.value }))}
                                placeholder="+91 98765 43210"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="cover">Cover Letter</Label>
                              <Textarea
                                id="cover"
                                value={applicationForm.cover_letter}
                                onChange={(e) => setApplicationForm(prev => ({ ...prev, cover_letter: e.target.value }))}
                                placeholder="Tell the recruiter why you're a great fit..."
                                rows={4}
                              />
                            </div>
                            <Button 
                              onClick={handleSubmitApplication} 
                              className="w-full cta-primary"
                              disabled={isApplying || !applicationForm.applicant_name || !applicationForm.applicant_email}
                            >
                              {isApplying ? 'Submitting...' : 'Submit Application'}
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>

                      <p className="text-sm text-center text-muted-foreground">
                        {job.applications_count || 0} applications received
                      </p>
                    </CardContent>
                  </Card>

                  {/* Company Card */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Building2 className="w-5 h-5" />
                        About the Company
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-3">
                        {recruiter?.logo_url && (
                          <img 
                            src={recruiter.logo_url} 
                            alt={recruiter.company_name}
                            className="w-12 h-12 rounded-lg object-cover border"
                          />
                        )}
                        <div>
                          <h3 className="font-semibold">{recruiter?.company_name}</h3>
                          {recruiter?.industry && (
                            <p className="text-sm text-muted-foreground">{recruiter.industry}</p>
                          )}
                        </div>
                      </div>

                      {recruiter?.company_description && (
                        <p className="text-sm text-muted-foreground line-clamp-4">
                          {recruiter.company_description}
                        </p>
                      )}

                      <div className="space-y-2 text-sm">
                        {recruiter?.location && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <MapPin className="w-4 h-4" />
                            <span>{recruiter.location}</span>
                          </div>
                        )}
                        {recruiter?.company_size && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Users className="w-4 h-4" />
                            <span>{recruiter.company_size} employees</span>
                          </div>
                        )}
                        {recruiter?.website && (
                          <a 
                            href={recruiter.website.startsWith('http') ? recruiter.website : `https://${recruiter.website}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-primary hover:underline"
                          >
                            <Globe className="w-4 h-4" />
                            <span>Visit Website</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default JobDetails;
