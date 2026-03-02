import { useState } from 'react';
import { useAdminJobs, useAdminRecruiters } from '@/hooks/useAdminRecruiters';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { format } from 'date-fns';
import { Briefcase, CheckCircle, XCircle, Search, MapPin, Building2, Plus, Globe, Mail } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';

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

const JobManagement = () => {
  const { jobs, isLoadingJobs, toggleJob, isToggling } = useAdminJobs();
  const { recruiters } = useAdminRecruiters();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [isPostOpen, setIsPostOpen] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [postMode, setPostMode] = useState<'recruiter' | 'direct'>('direct');
  const [adminJobForm, setAdminJobForm] = useState({
    recruiter_id: '',
    company_name: '',
    company_website: '',
    contact_email: '',
    title: '',
    description: '',
    location: '',
    job_type: 'full-time',
    experience_level: 'entry',
    salary_min: '',
    salary_max: '',
    salary_period: 'per_annum',
    application_deadline: '',
    apply_url: '',
    attachment_url: '',
    requirements: '',
    skills: '',
    benefits: '',
  });

  const filteredJobs = jobs?.filter(j => 
    j.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (j.recruiters as any)?.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (j as any).company_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const resetForm = () => {
    setAdminJobForm({
      recruiter_id: '', company_name: '', company_website: '', contact_email: '',
      title: '', description: '', location: '', job_type: 'full-time',
      experience_level: 'entry', salary_min: '', salary_max: '', salary_period: 'per_annum',
      application_deadline: '', apply_url: '', attachment_url: '', requirements: '', skills: '', benefits: '',
    });
    setPostMode('direct');
  };

  const handleAdminPostJob = async () => {
    if (!adminJobForm.title || !adminJobForm.description || !adminJobForm.location) {
      toast({ title: "Missing fields", description: "Please fill all required fields.", variant: "destructive" });
      return;
    }
    if (postMode === 'recruiter' && !adminJobForm.recruiter_id) {
      toast({ title: "Missing recruiter", description: "Please select a recruiter.", variant: "destructive" });
      return;
    }
    if (postMode === 'direct' && !adminJobForm.company_name) {
      toast({ title: "Missing company name", description: "Please enter company name.", variant: "destructive" });
      return;
    }

    setIsPosting(true);
    try {
      const insertData: any = {
        title: adminJobForm.title,
        description: adminJobForm.description,
        location: adminJobForm.location,
        job_type: adminJobForm.job_type,
        experience_level: adminJobForm.experience_level,
        salary_min: adminJobForm.salary_min ? parseInt(adminJobForm.salary_min) : null,
        salary_max: adminJobForm.salary_max ? parseInt(adminJobForm.salary_max) : null,
        salary_period: adminJobForm.salary_period as any,
        application_deadline: adminJobForm.application_deadline || null,
        apply_url: adminJobForm.apply_url || null,
        attachment_url: adminJobForm.attachment_url || null,
        contact_email: adminJobForm.contact_email || null,
        requirements: adminJobForm.requirements ? adminJobForm.requirements.split('\n').filter(r => r.trim()) : null,
        skills: adminJobForm.skills ? adminJobForm.skills.split(',').map(s => s.trim()).filter(s => s) : null,
        benefits: adminJobForm.benefits ? adminJobForm.benefits.split('\n').filter(b => b.trim()) : null,
        is_active: true,
      };

      if (postMode === 'recruiter') {
        insertData.recruiter_id = adminJobForm.recruiter_id;
      } else {
        insertData.company_name = adminJobForm.company_name;
        insertData.company_website = adminJobForm.company_website || null;
      }

      const { error } = await supabase.from('job_postings').insert(insertData);
      if (error) throw error;
      toast({ title: "Job Posted", description: "Job posted successfully." });
      setIsPostOpen(false);
      resetForm();
      queryClient.invalidateQueries({ queryKey: ['admin-jobs'] });
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    } catch (err: any) {
      toast({ title: "Failed", description: err.message, variant: "destructive" });
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="w-5 h-5" />
              Job Listings Management
            </CardTitle>
            <CardDescription>Manage jobs and post on behalf of any company</CardDescription>
          </div>
          <Dialog open={isPostOpen} onOpenChange={(open) => { setIsPostOpen(open); if (!open) resetForm(); }}>
            <DialogTrigger asChild>
              <Button className="gap-2"><Plus className="w-4 h-4" />Post Job (Admin)</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Post Job on Behalf of Company</DialogTitle>
                <DialogDescription>Post for a registered recruiter or enter company details directly.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                {/* Post mode selection */}
                <Tabs value={postMode} onValueChange={(v) => setPostMode(v as any)}>
                  <TabsList className="w-full">
                    <TabsTrigger value="direct" className="flex-1 gap-1"><Building2 className="w-3 h-3" />New Company</TabsTrigger>
                    <TabsTrigger value="recruiter" className="flex-1 gap-1"><CheckCircle className="w-3 h-3" />Existing Recruiter</TabsTrigger>
                  </TabsList>
                </Tabs>

                {postMode === 'recruiter' ? (
                  <div className="space-y-2">
                    <Label>Select Recruiter/Company *</Label>
                    <Select value={adminJobForm.recruiter_id} onValueChange={(v) => setAdminJobForm(prev => ({ ...prev, recruiter_id: v }))}>
                      <SelectTrigger><SelectValue placeholder="Choose a recruiter..." /></SelectTrigger>
                      <SelectContent>
                        {recruiters?.map(r => (
                          <SelectItem key={r.id} value={r.id}>{r.company_name} — {r.contact_person}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ) : (
                  <div className="space-y-4 rounded-lg border p-4 bg-muted/30">
                    <h4 className="font-medium text-sm flex items-center gap-2"><Building2 className="w-4 h-4" />Company Details</h4>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Company Name *</Label>
                        <Input value={adminJobForm.company_name} onChange={(e) => setAdminJobForm(prev => ({ ...prev, company_name: e.target.value }))} placeholder="e.g., Acme Corp" />
                      </div>
                      <div className="space-y-2">
                        <Label>Company Website</Label>
                        <Input value={adminJobForm.company_website} onChange={(e) => setAdminJobForm(prev => ({ ...prev, company_website: e.target.value }))} placeholder="www.company.com" />
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Contact Email (for email resume)</Label>
                  <Input type="email" value={adminJobForm.contact_email} onChange={(e) => setAdminJobForm(prev => ({ ...prev, contact_email: e.target.value }))} placeholder="hr@company.com — candidates can email resumes here" />
                  <p className="text-xs text-muted-foreground">If provided, a "Email Your Resume" button will be shown instead of the apply form.</p>
                </div>

                <div className="space-y-2">
                  <Label>Job Title *</Label>
                  <Input value={adminJobForm.title} onChange={(e) => setAdminJobForm(prev => ({ ...prev, title: e.target.value }))} placeholder="e.g., Product Manager" />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Job Type *</Label>
                    <Select value={adminJobForm.job_type} onValueChange={(v) => setAdminJobForm(prev => ({ ...prev, job_type: v }))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>{jobTypes.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Experience Level</Label>
                    <Select value={adminJobForm.experience_level} onValueChange={(v) => setAdminJobForm(prev => ({ ...prev, experience_level: v }))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>{experienceLevels.map(l => <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Location *</Label>
                  <Input value={adminJobForm.location} onChange={(e) => setAdminJobForm(prev => ({ ...prev, location: e.target.value }))} placeholder="e.g., Mumbai, India or Remote" />
                </div>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Min Salary (₹)</Label>
                    <Input type="number" value={adminJobForm.salary_min} onChange={(e) => setAdminJobForm(prev => ({ ...prev, salary_min: e.target.value }))} placeholder="500000" />
                  </div>
                  <div className="space-y-2">
                    <Label>Max Salary (₹)</Label>
                    <Input type="number" value={adminJobForm.salary_max} onChange={(e) => setAdminJobForm(prev => ({ ...prev, salary_max: e.target.value }))} placeholder="800000" />
                  </div>
                  <div className="space-y-2">
                    <Label>Salary Period</Label>
                    <Select value={adminJobForm.salary_period} onValueChange={(v) => setAdminJobForm(prev => ({ ...prev, salary_period: v }))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="per_annum">Per Annum</SelectItem>
                        <SelectItem value="per_month">Per Month</SelectItem>
                        <SelectItem value="hourly">Hourly</SelectItem>
                        <SelectItem value="contract">Contract</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Application Deadline</Label>
                  <Input type="date" value={adminJobForm.application_deadline} onChange={(e) => setAdminJobForm(prev => ({ ...prev, application_deadline: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>Job Description *</Label>
                  <Textarea value={adminJobForm.description} onChange={(e) => setAdminJobForm(prev => ({ ...prev, description: e.target.value }))} placeholder="Describe the role..." rows={4} />
                </div>
                <div className="space-y-2">
                  <Label>Requirements (one per line)</Label>
                  <Textarea value={adminJobForm.requirements} onChange={(e) => setAdminJobForm(prev => ({ ...prev, requirements: e.target.value }))} placeholder="Bachelor's degree..." rows={3} />
                </div>
                <div className="space-y-2">
                  <Label>Skills (comma separated)</Label>
                  <Input value={adminJobForm.skills} onChange={(e) => setAdminJobForm(prev => ({ ...prev, skills: e.target.value }))} placeholder="React, SQL, PM" />
                </div>
                <div className="space-y-2">
                  <Label>Benefits (one per line)</Label>
                  <Textarea value={adminJobForm.benefits} onChange={(e) => setAdminJobForm(prev => ({ ...prev, benefits: e.target.value }))} placeholder="Health insurance..." rows={3} />
                </div>
                <div className="space-y-2">
                  <Label>External Apply Link (optional)</Label>
                  <Input value={adminJobForm.apply_url} onChange={(e) => setAdminJobForm(prev => ({ ...prev, apply_url: e.target.value }))} placeholder="https://company.com/careers" />
                </div>
                <div className="space-y-2">
                  <Label>Attachment URL (optional)</Label>
                  <Input value={adminJobForm.attachment_url} onChange={(e) => setAdminJobForm(prev => ({ ...prev, attachment_url: e.target.value }))} placeholder="Link to PDF/document" />
                </div>
                <Button onClick={handleAdminPostJob} className="w-full cta-primary" disabled={isPosting}>
                  {isPosting ? 'Posting...' : 'Post Job (Active)'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search jobs..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
          </div>
        </div>

        {isLoadingJobs ? (
          <p className="text-muted-foreground">Loading jobs...</p>
        ) : (
          <div className="space-y-4">
            {filteredJobs?.map((job) => {
              const companyName = (job.recruiters as any)?.company_name || (job as any).company_name || 'Unknown';
              const companyWebsite = (job.recruiters as any)?.website || (job as any).company_website;
              return (
                <div key={job.id} className="border rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-semibold">{job.title}</h4>
                      {job.is_active ? (
                        <Badge className="bg-primary/10 text-primary"><CheckCircle className="w-3 h-3 mr-1" />Active</Badge>
                      ) : (
                        <Badge variant="secondary"><XCircle className="w-3 h-3 mr-1" />Inactive</Badge>
                      )}
                      <Badge variant="outline">{job.job_type}</Badge>
                      {!(job.recruiters as any)?.id && <Badge variant="outline" className="text-xs">Admin Posted</Badge>}
                    </div>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p className="flex items-center gap-2">
                        <Building2 className="w-3 h-3" />{companyName}
                        {(job.recruiters as any)?.is_verified && <Badge variant="secondary" className="text-xs">Verified</Badge>}
                      </p>
                      {companyWebsite && (
                        <p className="flex items-center gap-2">
                          <Globe className="w-3 h-3" />
                          <a href={companyWebsite.startsWith('http') ? companyWebsite : `https://${companyWebsite}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-xs">{companyWebsite}</a>
                        </p>
                      )}
                      <p className="flex items-center gap-2"><MapPin className="w-3 h-3" />{job.location}</p>
                      {(job as any).contact_email && (
                        <p className="flex items-center gap-2"><Mail className="w-3 h-3" />{(job as any).contact_email}</p>
                      )}
                      <p className="text-xs">Posted: {format(new Date(job.created_at), 'MMM dd, yyyy')}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {job.is_active ? (
                      <Button variant="outline" size="sm" onClick={() => toggleJob({ id: job.id, is_active: false })} disabled={isToggling}>
                        <XCircle className="w-4 h-4 mr-1" />Deactivate
                      </Button>
                    ) : (
                      <Button size="sm" className="bg-primary hover:bg-primary/90" onClick={() => toggleJob({ id: job.id, is_active: true })} disabled={isToggling}>
                        <CheckCircle className="w-4 h-4 mr-1" />Activate
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
            {filteredJobs?.length === 0 && (
              <p className="text-center text-muted-foreground py-8">No jobs found</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default JobManagement;
