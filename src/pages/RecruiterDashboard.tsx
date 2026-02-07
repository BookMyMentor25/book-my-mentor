import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { useAuth } from "@/hooks/useAuth";
import { useRecruiters } from "@/hooks/useRecruiters";
import { useRecruiterJobs, JobInput } from "@/hooks/useJobs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Building2, 
  Plus, 
  Briefcase, 
  Eye, 
  Users,
  MapPin,
  Clock,
  Pencil,
  Trash2,
  ToggleLeft,
  ToggleRight,
  ExternalLink,
  IndianRupee,
  Calendar,
  CheckCircle,
  XCircle
} from "lucide-react";

const jobTypes = [
  { value: 'full-time', label: 'Full Time' },
  { value: 'part-time', label: 'Part Time' },
  { value: 'internship', label: 'Internship' },
  { value: 'contract', label: 'Contract' },
];

const experienceLevels = [
  { value: 'entry', label: 'Entry Level (0-2 years)' },
  { value: 'mid', label: 'Mid Level (2-5 years)' },
  { value: 'senior', label: 'Senior Level (5+ years)' },
];

const RecruiterDashboard = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { recruiterProfile, isLoadingProfile } = useRecruiters();
  const { jobs, isLoading: isLoadingJobs, createJob, updateJob, deleteJob, toggleJobStatus, isCreating } = useRecruiterJobs(recruiterProfile?.id);
  
  const [isPostJobOpen, setIsPostJobOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<string | null>(null);
  const [jobForm, setJobForm] = useState<JobInput>({
    title: '',
    description: '',
    location: '',
    job_type: 'full-time',
    experience_level: 'entry',
    salary_min: undefined,
    salary_max: undefined,
    salary_period: 'per_annum',
    requirements: [],
    skills: [],
    benefits: [],
    application_deadline: '',
  });
  const [requirementsText, setRequirementsText] = useState('');
  const [skillsText, setSkillsText] = useState('');
  const [benefitsText, setBenefitsText] = useState('');

  // Redirect to register if not a recruiter
  useEffect(() => {
    if (!authLoading && !isLoadingProfile) {
      if (!user) {
        navigate('/auth?redirect=/recruiter/dashboard');
      } else if (!recruiterProfile) {
        navigate('/recruiter/register');
      }
    }
  }, [user, recruiterProfile, authLoading, isLoadingProfile, navigate]);

  const resetForm = () => {
    setJobForm({
      title: '',
      description: '',
      location: '',
      job_type: 'full-time',
      experience_level: 'entry',
      salary_min: undefined,
      salary_max: undefined,
      salary_period: 'per_annum',
      requirements: [],
      skills: [],
      benefits: [],
      application_deadline: '',
    });
    setRequirementsText('');
    setSkillsText('');
    setBenefitsText('');
    setEditingJob(null);
  };

  const handlePostJob = () => {
    if (!recruiterProfile?.id) return;

    const jobData = {
      ...jobForm,
      recruiter_id: recruiterProfile.id,
      requirements: requirementsText.split('\n').filter(r => r.trim()),
      skills: skillsText.split(',').map(s => s.trim()).filter(s => s),
      benefits: benefitsText.split('\n').filter(b => b.trim()),
      // Include recruiter info for email notification
      recruiter_email: recruiterProfile.email,
      recruiter_name: recruiterProfile.contact_person,
      company_name: recruiterProfile.company_name,
    };

    if (editingJob) {
      updateJob({ id: editingJob, ...jobData }, {
        onSuccess: () => {
          setIsPostJobOpen(false);
          resetForm();
        }
      });
    } else {
      createJob(jobData, {
        onSuccess: () => {
          setIsPostJobOpen(false);
          resetForm();
        }
      });
    }
  };

  const handleEditJob = (job: any) => {
    setJobForm({
      title: job.title,
      description: job.description,
      location: job.location,
      job_type: job.job_type,
      experience_level: job.experience_level || 'entry',
      salary_min: job.salary_min,
      salary_max: job.salary_max,
      salary_period: job.salary_period || 'per_annum',
      application_deadline: job.application_deadline || '',
    });
    setRequirementsText(job.requirements?.join('\n') || '');
    setSkillsText(job.skills?.join(', ') || '');
    setBenefitsText(job.benefits?.join('\n') || '');
    setEditingJob(job.id);
    setIsPostJobOpen(true);
  };

  const handleDeleteJob = (jobId: string) => {
    if (window.confirm('Are you sure you want to delete this job posting?')) {
      deleteJob(jobId);
    }
  };

  if (authLoading || isLoadingProfile) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/3" />
            <div className="h-64 bg-muted rounded" />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!recruiterProfile) return null;

  const activeJobs = jobs?.filter(j => j.is_active) || [];
  const inactiveJobs = jobs?.filter(j => !j.is_active) || [];

  return (
    <>
      <SEOHead 
        title="Recruiter Dashboard | Manage Job Postings | BookMyMentor"
        description="Manage your job postings, view applications, and track hiring progress on BookMyMentor Recruiter Dashboard."
      />
      
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        
        <main className="flex-1 py-8 lg:py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold">Recruiter Dashboard</h1>
                  <p className="text-muted-foreground">
                    Welcome back, {recruiterProfile.contact_person} from {recruiterProfile.company_name}
                  </p>
                </div>
                
                <Dialog open={isPostJobOpen} onOpenChange={(open) => {
                  setIsPostJobOpen(open);
                  if (!open) resetForm();
                }}>
                  <DialogTrigger asChild>
                    <Button className="cta-primary gap-2">
                      <Plus className="w-4 h-4" />
                      Post New Job
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>{editingJob ? 'Edit Job Posting' : 'Create New Job Posting'}</DialogTitle>
                      <DialogDescription>
                        Fill in the details for your job opening
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4 pt-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Job Title *</Label>
                        <Input
                          id="title"
                          value={jobForm.title}
                          onChange={(e) => setJobForm(prev => ({ ...prev, title: e.target.value }))}
                          placeholder="e.g., Product Manager, Business Analyst"
                          required
                        />
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Job Type *</Label>
                          <Select value={jobForm.job_type} onValueChange={(v) => setJobForm(prev => ({ ...prev, job_type: v }))}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {jobTypes.map(type => (
                                <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Experience Level</Label>
                          <Select value={jobForm.experience_level} onValueChange={(v) => setJobForm(prev => ({ ...prev, experience_level: v }))}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {experienceLevels.map(level => (
                                <SelectItem key={level.value} value={level.value}>{level.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="location">Location *</Label>
                        <Input
                          id="location"
                          value={jobForm.location}
                          onChange={(e) => setJobForm(prev => ({ ...prev, location: e.target.value }))}
                          placeholder="e.g., Mumbai, India or Remote"
                          required
                        />
                      </div>

                      <div className="grid sm:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="salary_min">Minimum Salary (₹)</Label>
                          <Input
                            id="salary_min"
                            type="number"
                            value={jobForm.salary_min || ''}
                            onChange={(e) => setJobForm(prev => ({ ...prev, salary_min: e.target.value ? parseInt(e.target.value) : undefined }))}
                            placeholder="e.g., 500000"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="salary_max">Maximum Salary (₹)</Label>
                          <Input
                            id="salary_max"
                            type="number"
                            value={jobForm.salary_max || ''}
                            onChange={(e) => setJobForm(prev => ({ ...prev, salary_max: e.target.value ? parseInt(e.target.value) : undefined }))}
                            placeholder="e.g., 800000"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Salary Period</Label>
                          <Select value={jobForm.salary_period || 'per_annum'} onValueChange={(v) => setJobForm(prev => ({ ...prev, salary_period: v }))}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="per_annum">Per Annum</SelectItem>
                              <SelectItem value="per_month">Per Month</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="deadline">Application Deadline</Label>
                        <Input
                          id="deadline"
                          type="date"
                          value={jobForm.application_deadline}
                          onChange={(e) => setJobForm(prev => ({ ...prev, application_deadline: e.target.value }))}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description">Job Description *</Label>
                        <Textarea
                          id="description"
                          value={jobForm.description}
                          onChange={(e) => setJobForm(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Describe the role, responsibilities, and what you're looking for..."
                          rows={4}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="requirements">Requirements (one per line)</Label>
                        <Textarea
                          id="requirements"
                          value={requirementsText}
                          onChange={(e) => setRequirementsText(e.target.value)}
                          placeholder="Bachelor's degree in Computer Science&#10;2+ years of experience&#10;Strong communication skills"
                          rows={3}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="skills">Skills (comma separated)</Label>
                        <Input
                          id="skills"
                          value={skillsText}
                          onChange={(e) => setSkillsText(e.target.value)}
                          placeholder="React, Node.js, SQL, Communication"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="benefits">Benefits & Perks (one per line)</Label>
                        <Textarea
                          id="benefits"
                          value={benefitsText}
                          onChange={(e) => setBenefitsText(e.target.value)}
                          placeholder="Health insurance&#10;Flexible work hours&#10;Stock options"
                          rows={3}
                        />
                      </div>

                      <Button 
                        onClick={handlePostJob}
                        className="w-full cta-primary"
                        disabled={isCreating || !jobForm.title || !jobForm.description || !jobForm.location}
                      >
                        {isCreating ? 'Saving...' : editingJob ? 'Update Job' : 'Post Job'}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <Card>
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Briefcase className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{jobs?.length || 0}</div>
                      <div className="text-xs text-muted-foreground">Total Jobs</div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{activeJobs.length}</div>
                      <div className="text-xs text-muted-foreground">Active Jobs</div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                      <Eye className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{jobs?.reduce((acc, j) => acc + (j.views_count || 0), 0) || 0}</div>
                      <div className="text-xs text-muted-foreground">Total Views</div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Users className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{jobs?.reduce((acc, j) => acc + (j.applications_count || 0), 0) || 0}</div>
                      <div className="text-xs text-muted-foreground">Applications</div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Company Info Card */}
              <Card className="mb-8">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Building2 className="w-5 h-5" />
                      Company Profile
                    </CardTitle>
                    {recruiterProfile.is_verified ? (
                      <Badge variant="secondary" className="gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Verified
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="gap-1 text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        Pending Verification
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground">Company</div>
                      <div className="font-medium">{recruiterProfile.company_name}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Industry</div>
                      <div className="font-medium">{recruiterProfile.industry || 'Not specified'}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Location</div>
                      <div className="font-medium">{recruiterProfile.location || 'Not specified'}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Size</div>
                      <div className="font-medium">{recruiterProfile.company_size ? `${recruiterProfile.company_size} employees` : 'Not specified'}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Jobs List */}
              <Tabs defaultValue="active" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="active" className="gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Active ({activeJobs.length})
                  </TabsTrigger>
                  <TabsTrigger value="inactive" className="gap-2">
                    <XCircle className="w-4 h-4" />
                    Inactive ({inactiveJobs.length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="active" className="space-y-4">
                  {isLoadingJobs ? (
                    <div className="space-y-4">
                      {[...Array(3)].map((_, i) => (
                        <Card key={i} className="animate-pulse">
                          <CardContent className="p-6">
                            <div className="h-6 bg-muted rounded w-1/3 mb-4" />
                            <div className="h-4 bg-muted rounded w-1/2" />
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : activeJobs.length > 0 ? (
                    activeJobs.map(job => (
                      <Card key={job.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-semibold text-lg">{job.title}</h3>
                                <Badge>{job.job_type.replace('-', ' ')}</Badge>
                              </div>
                              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-4 h-4" />
                                  {job.location}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Eye className="w-4 h-4" />
                                  {job.views_count || 0} views
                                </span>
                                <span className="flex items-center gap-1">
                                  <Users className="w-4 h-4" />
                                  {job.applications_count || 0} applications
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  Posted {new Date(job.created_at).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Link to={`/job/${job.id}`} target="_blank">
                                <Button variant="ghost" size="icon" title="View">
                                  <ExternalLink className="w-4 h-4" />
                                </Button>
                              </Link>
                              <Button variant="ghost" size="icon" title="Edit" onClick={() => handleEditJob(job)}>
                                <Pencil className="w-4 h-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                title="Deactivate"
                                onClick={() => toggleJobStatus({ id: job.id, is_active: false })}
                              >
                                <ToggleRight className="w-4 h-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                title="Delete"
                                className="text-destructive hover:text-destructive"
                                onClick={() => handleDeleteJob(job.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <Card className="p-12 text-center">
                      <Briefcase className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="font-semibold mb-2">No active job postings</h3>
                      <p className="text-muted-foreground mb-4">Create your first job posting to start receiving applications.</p>
                      <Button onClick={() => setIsPostJobOpen(true)} className="cta-primary gap-2">
                        <Plus className="w-4 h-4" />
                        Post Your First Job
                      </Button>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="inactive" className="space-y-4">
                  {inactiveJobs.length > 0 ? (
                    inactiveJobs.map(job => (
                      <Card key={job.id} className="opacity-75 hover:opacity-100 transition-opacity">
                        <CardContent className="p-6">
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-semibold text-lg">{job.title}</h3>
                                <Badge variant="secondary">{job.job_type.replace('-', ' ')}</Badge>
                                <Badge variant="outline" className="text-muted-foreground">Inactive</Badge>
                              </div>
                              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-4 h-4" />
                                  {job.location}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Eye className="w-4 h-4" />
                                  {job.views_count || 0} views
                                </span>
                                <span className="flex items-center gap-1">
                                  <Users className="w-4 h-4" />
                                  {job.applications_count || 0} applications
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="gap-1"
                                onClick={() => toggleJobStatus({ id: job.id, is_active: true })}
                              >
                                <ToggleLeft className="w-4 h-4" />
                                Reactivate
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                title="Delete"
                                className="text-destructive hover:text-destructive"
                                onClick={() => handleDeleteJob(job.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <Card className="p-12 text-center">
                      <XCircle className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="font-semibold">No inactive jobs</h3>
                      <p className="text-muted-foreground">All your job postings are currently active.</p>
                    </Card>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default RecruiterDashboard;
