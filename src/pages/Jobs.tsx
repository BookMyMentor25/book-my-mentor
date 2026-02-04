import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { useJobs } from "@/hooks/useJobs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search, 
  MapPin, 
  Briefcase, 
  Clock, 
  Building2, 
  IndianRupee, 
  Filter,
  Users,
  TrendingUp,
  Award,
  ChevronRight,
  Sparkles
} from "lucide-react";

const Jobs = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [jobTypeFilter, setJobTypeFilter] = useState("all");
  const [experienceFilter, setExperienceFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("");

  const { jobs, isLoading } = useJobs({
    search: searchTerm,
    job_type: jobTypeFilter,
    experience_level: experienceFilter,
    location: locationFilter,
  });

  // Stats for trust building
  const stats = useMemo(() => ({
    totalJobs: jobs?.length || 0,
    companies: new Set(jobs?.map(j => j.recruiter_id)).size,
    internships: jobs?.filter(j => j.job_type === 'internship').length || 0,
  }), [jobs]);

  const formatSalary = (min?: number, max?: number, currency = 'INR') => {
    if (!min && !max) return null;
    const formatter = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 });
    if (min && max) {
      return `${currency === 'INR' ? '₹' : '$'}${formatter.format(min)} - ${formatter.format(max)}`;
    }
    return `${currency === 'INR' ? '₹' : '$'}${formatter.format(min || max || 0)}`;
  };

  const getJobTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'full-time': 'bg-primary/10 text-primary border-primary/20',
      'part-time': 'bg-accent/10 text-accent border-accent/20',
      'internship': 'bg-secondary text-secondary-foreground border-secondary',
      'contract': 'bg-muted text-muted-foreground border-muted',
    };
    return colors[type] || 'bg-muted text-muted-foreground';
  };

  const getExperienceLabel = (level?: string) => {
    const labels: Record<string, string> = {
      'entry': 'Entry Level (0-2 yrs)',
      'mid': 'Mid Level (2-5 yrs)',
      'senior': 'Senior Level (5+ yrs)',
    };
    return labels[level || ''] || level;
  };

  return (
    <>
      <SEOHead 
        title="Jobs & Internships | Product Management, MBA, & Tech Careers | BookMyMentor"
        description="Find top Product Management jobs, MBA internships, tech careers, and startup opportunities. Apply to verified companies hiring for PM roles, business analyst, and management positions in India."
        keywords="product management jobs, MBA internships, tech jobs India, startup careers, PM jobs, business analyst jobs, management trainee, product manager hiring, fresher jobs, campus placements"
      />
      
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        
        {/* Hero Section - 5-second clarity with golden ratio */}
        <section className="relative py-16 lg:py-24 overflow-hidden">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
          <div className="absolute top-0 right-0 w-[61.8%] h-[61.8%] bg-gradient-to-bl from-primary/10 to-transparent rounded-full blur-3xl" />
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center space-y-6">
              {/* Trust badge */}
              <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 text-sm font-medium text-primary animate-fade-in">
                <Sparkles className="w-4 h-4" />
                Verified Opportunities from Top Companies
              </div>
              
              {/* Main heading - Golden ratio sizing */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight animate-fade-in animate-delay-100">
                Find Your <span className="text-gradient bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Dream Career</span>
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-in animate-delay-200">
                Discover top jobs and internships in Product Management, Business Analytics, Tech, and Startups. 
                Start your career journey today.
              </p>

              {/* Stats row - 60-30-10 visual hierarchy */}
              <div className="flex flex-wrap justify-center gap-8 pt-6 animate-fade-in animate-delay-300">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">{stats.totalJobs}+</div>
                  <div className="text-sm text-muted-foreground">Active Jobs</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">{stats.companies}+</div>
                  <div className="text-sm text-muted-foreground">Companies</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-accent">{stats.internships}+</div>
                  <div className="text-sm text-muted-foreground">Internships</div>
                </div>
              </div>
            </div>

            {/* Search & Filter Section */}
            <div className="max-w-5xl mx-auto mt-12">
              <Card className="shadow-xl border-primary/10 bg-card/80 backdrop-blur-sm">
                <CardContent className="p-6">
                  {/* Main search */}
                  <div className="flex flex-col lg:flex-row gap-4">
                    <div className="flex-1 relative">
                      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                      <Input
                        placeholder="Search jobs, skills, or companies..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-12 h-12 text-base"
                      />
                    </div>
                    <div className="relative lg:w-64">
                      <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5 z-10" />
                      <Input
                        placeholder="Location"
                        value={locationFilter}
                        onChange={(e) => setLocationFilter(e.target.value)}
                        className="pl-12 h-12"
                      />
                    </div>
                  </div>

                  {/* Filter row */}
                  <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-border">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Filter className="w-4 h-4" />
                      <span className="text-sm font-medium">Filters:</span>
                    </div>
                    
                    <Select value={jobTypeFilter} onValueChange={setJobTypeFilter}>
                      <SelectTrigger className="w-40 h-10">
                        <Briefcase className="w-4 h-4 mr-2" />
                        <SelectValue placeholder="Job Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="full-time">Full Time</SelectItem>
                        <SelectItem value="part-time">Part Time</SelectItem>
                        <SelectItem value="internship">Internship</SelectItem>
                        <SelectItem value="contract">Contract</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={experienceFilter} onValueChange={setExperienceFilter}>
                      <SelectTrigger className="w-44 h-10">
                        <TrendingUp className="w-4 h-4 mr-2" />
                        <SelectValue placeholder="Experience" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Levels</SelectItem>
                        <SelectItem value="entry">Entry Level</SelectItem>
                        <SelectItem value="mid">Mid Level</SelectItem>
                        <SelectItem value="senior">Senior Level</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Job Listings */}
        <section className="py-12 lg:py-16 flex-1">
          <div className="container mx-auto px-4">
            {/* Results header */}
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold">
                {isLoading ? 'Loading...' : `${jobs?.length || 0} Jobs Found`}
              </h2>
              <Link to="/recruiter/register">
                <Button variant="outline" className="gap-2">
                  <Building2 className="w-4 h-4" />
                  Post a Job
                </Button>
              </Link>
            </div>

            {isLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader className="space-y-3">
                      <div className="h-6 bg-muted rounded w-3/4" />
                      <div className="h-4 bg-muted rounded w-1/2" />
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="h-4 bg-muted rounded w-full" />
                      <div className="h-4 bg-muted rounded w-2/3" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : jobs && jobs.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {jobs.map((job) => (
                  <Link key={job.id} to={`/job/${job.id}`}>
                    <Card className="h-full hover:shadow-lg hover:border-primary/30 transition-all duration-300 group cursor-pointer">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
                              {job.title}
                            </h3>
                            <div className="flex items-center gap-2 mt-1 text-muted-foreground">
                              <Building2 className="w-4 h-4 flex-shrink-0" />
                              <span className="text-sm truncate">
                                {(job.recruiters as any)?.company_name || 'Company'}
                              </span>
                              {(job.recruiters as any)?.is_verified && (
                                <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                                  Verified
                                </Badge>
                              )}
                            </div>
                          </div>
                          {(job.recruiters as any)?.logo_url && (
                            <img 
                              src={(job.recruiters as any).logo_url} 
                              alt="Company logo"
                              className="w-12 h-12 rounded-lg object-cover border"
                            />
                          )}
                        </div>
                      </CardHeader>
                      
                      <CardContent className="space-y-3">
                        <div className="flex flex-wrap gap-2">
                          <Badge className={getJobTypeColor(job.job_type)}>
                            {job.job_type.replace('-', ' ')}
                          </Badge>
                          {job.experience_level && (
                            <Badge variant="outline" className="text-xs">
                              {getExperienceLabel(job.experience_level)}
                            </Badge>
                          )}
                        </div>

                        <div className="space-y-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 flex-shrink-0" />
                            <span className="truncate">{job.location}</span>
                          </div>
                          
                          {formatSalary(job.salary_min, job.salary_max, job.currency) && (
                            <div className="flex items-center gap-2">
                              <IndianRupee className="w-4 h-4 flex-shrink-0" />
                              <span>{formatSalary(job.salary_min, job.salary_max, job.currency)}</span>
                            </div>
                          )}
                          
                          {job.application_deadline && (
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 flex-shrink-0" />
                              <span>Apply by {new Date(job.application_deadline).toLocaleDateString()}</span>
                            </div>
                          )}
                        </div>

                        {job.skills && job.skills.length > 0 && (
                          <div className="flex flex-wrap gap-1 pt-2">
                            {job.skills.slice(0, 3).map((skill, i) => (
                              <Badge key={i} variant="secondary" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                            {job.skills.length > 3 && (
                              <Badge variant="secondary" className="text-xs">
                                +{job.skills.length - 3}
                              </Badge>
                            )}
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-3 border-t border-border">
                          <span className="text-xs text-muted-foreground">
                            Posted {new Date(job.created_at).toLocaleDateString()}
                          </span>
                          <span className="text-primary text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                            View Details <ChevronRight className="w-4 h-4" />
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <Card className="p-12 text-center">
                <div className="max-w-md mx-auto space-y-4">
                  <Briefcase className="w-16 h-16 mx-auto text-muted-foreground" />
                  <h3 className="text-xl font-semibold">No jobs found</h3>
                  <p className="text-muted-foreground">
                    {searchTerm || jobTypeFilter !== 'all' || experienceFilter !== 'all' || locationFilter
                      ? "Try adjusting your filters or search terms."
                      : "Be the first to post a job opportunity!"}
                  </p>
                  <Link to="/recruiter/register">
                    <Button className="cta-primary mt-4">
                      <Building2 className="w-4 h-4 mr-2" />
                      Post a Job Opening
                    </Button>
                  </Link>
                </div>
              </Card>
            )}
          </div>
        </section>

        {/* CTA Section for Recruiters */}
        <section className="py-16 bg-gradient-to-r from-primary/10 via-background to-accent/10">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-3xl mx-auto space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">
                Hiring? Find Top Talent Here
              </h2>
              <p className="text-lg text-muted-foreground">
                Post your job openings and connect with skilled candidates from IITs, IIMs, and top universities. 
                Reach thousands of qualified professionals and students.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/recruiter/register">
                  <Button size="lg" className="cta-primary gap-2">
                    <Users className="w-5 h-5" />
                    Register as Recruiter
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button size="lg" variant="outline" className="gap-2">
                    <Award className="w-5 h-5" />
                    Partner With Us
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default Jobs;
