import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useCourses, formatPrice } from "@/hooks/useCourses";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { ArrowLeft, Clock, Award, Users, Star, CheckCircle, Target, BookOpen, Trophy } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SEOHead, generateCourseSchema, generateBreadcrumbSchema } from "@/components/SEOHead";
import { useQuizByCourse, useQuizQuestions, useUserQuizAttempts, useStartQuiz } from "@/hooks/useQuiz";
import QuizCard from "@/components/quiz/QuizCard";
import QuizModal from "@/components/quiz/QuizModal";

// Course metadata for SEO and display - synced with backend
const courseMetadata: Record<string, {
  bestFor: string;
  shortDescription: string;
  outcome: string;
  seoKeywords: string[];
}> = {
  'product management foundations program': {
    bestFor: 'Students, freshers, beginners exploring Product Management',
    shortDescription: 'The Product Management Foundations Program is designed for learners who want to build a strong, structured base in Product Management. This program helps you understand core Product Management concepts and frameworks, how real-world products are built and evolved, and how PMs think, communicate, and prioritize problems. If you are starting your Product Management journey or preparing for competitions, interviews, or internships, this program gives you the clarity and confidence to move forward.',
    outcome: 'Build strong fundamentals and understand how Product Managers operate in real scenarios.',
    seoKeywords: ['product management course', 'product manager training', 'PM fundamentals', 'product management certification', 'learn product management']
  },
  'product manager career accelerator': {
    bestFor: 'Competition participants, early professionals, PM aspirants preparing for roles',
    shortDescription: 'The Product Manager Career Accelerator is built for candidates who already understand the basics and want to become job-ready. This program focuses on applying Product Management frameworks to real problems, working on live projects and case-based scenarios, improving product thinking, prioritization, and decision-making, and preparing for interviews with structured guidance. If you\'ve participated in Product Management competitions and want to move closer to actual hiring readiness, this program bridges that gap.',
    outcome: 'Transition from theory to execution with hands-on exposure and structured guidance.',
    seoKeywords: ['product manager career', 'PM interview preparation', 'product management jobs', 'become product manager', 'product manager certification']
  },
  'product manager mentorship & hiring program': {
    bestFor: 'Career switchers, serious PM aspirants, candidates targeting hiring outcomes',
    shortDescription: 'The Product Manager Mentorship & Hiring Program is our most comprehensive offering, designed for candidates who want personalized mentorship and real-world exposure. This program includes 1:1 mentorship from experienced professionals, deep-dive live projects with feedback, resume and interview readiness support, and industry-aligned problem-solving guidance. If you are serious about building a long-term Product Management career and want guided support at every step, this program is designed for you.',
    outcome: 'Become hiring-ready with mentorship, execution depth, and confidence.',
    seoKeywords: ['product manager mentorship', 'PM hiring program', 'product management placement', 'product manager job placement', 'PM career switch']
  },
  'lean startup & business strategy program': {
    bestFor: 'Founders, product thinkers, strategy enthusiasts, Entrepreneurs',
    shortDescription: 'The Lean Startup & Business Strategy Program helps you understand how successful products and businesses are built from scratch. This program covers Lean Startup principles and validation techniques, market discovery and problem-solution fit, business strategy and experimentation, and decision-making under uncertainty. Whether you are a founder, aspiring entrepreneur, or Product Manager, this program sharpens your business and strategic thinking.',
    outcome: 'Learn to validate ideas, build scalable products, and think strategically.',
    seoKeywords: ['lean startup course', 'business strategy training', 'startup validation', 'entrepreneurship course', 'lean methodology']
  },
  'project management for tech & startup roles': {
    bestFor: 'Aspiring project managers, operations professionals, tech team leads',
    shortDescription: 'The Project Management for Tech & Startup Roles program focuses on managing projects in fast-paced, real-world environments. You will learn project planning, execution, and delivery, stakeholder management and coordination, Agile and modern project workflows, and managing timelines, risks, and outcomes. This program is ideal if you want to move into project or operations roles within startups or technology-driven organizations.',
    outcome: 'Gain practical project management skills aligned with modern tech teams.',
    seoKeywords: ['project management course', 'agile project management', 'tech project manager', 'startup project management', 'PMP training']
  }
};

// Course weekly details
const courseDetails = {
  'product management foundations program': [
    {
      week: 1,
      topics: [
        "Why does the Product fail?",
        "Force Fitting process",
        "Lean Management",
        "Experimentation Board",
        "Business Model and BMC",
        "Project Orientation 1"
      ]
    },
    {
      week: 2,
      topics: [
        "Product Design",
        "Market Type for the Product",
        "Market Size for the Product",
        "Value Proposition",
        "Users' Pain Map Journey",
        "Project Orientation 2"
      ]
    },
    {
      week: 3,
      topics: [
        "Customer Archetypes",
        "Strategies",
        "Competitor Analysis",
        "Competitive Advantages and Landscape",
        "Project Orientation 3"
      ]
    },
    {
      week: 4,
      topics: [
        "Core and non-core skills required for a Product Manager",
        "UI / UX Design",
        "Project Management Basics",
        "Risk Management",
        "Agile Methodology and Framework",
        "Project Orientation 4",
        "Live Project: (SaaS)/ (Ecommerce) / (Edtech) / (Healthcare)"
      ]
    }
  ],
  'product manager career accelerator': [
    {
      week: 1,
      topics: [
        "Why does the Product fail?",
        "Force Fitting process",
        "Lean Management",
        "Experimentation Board",
        "Business Model and BMC",
        "Project Orientation 1"
      ]
    },
    {
      week: 2,
      topics: [
        "Product Design",
        "Market Type for the Product",
        "Market Size for the Product",
        "Value Proposition",
        "Users' Pain Map Journey",
        "Project Orientation 2"
      ]
    },
    {
      week: 3,
      topics: [
        "Customer Archetypes",
        "Strategies",
        "Competitor Analysis",
        "Competitive Advantages and Landscape",
        "Project Orientation 3"
      ]
    },
    {
      week: 4,
      topics: [
        "Core and non-core skills required for a Product Manager",
        "UI / UX Design",
        "Project Management Basics",
        "Risk Management",
        "Agile Methodology and Framework",
        "Project Orientation 4"
      ]
    },
    {
      week: "5-8",
      topics: [
        "2 Live Projects from (SaaS)/ (Ecommerce) / (Edtech) / (Healthcare)",
        "Case Studies",
        "Placement Assistance",
        "Mock Interviews"
      ]
    }
  ],
  'product manager mentorship & hiring program': [
    {
      week: 1,
      topics: [
        "Why does the Product fail?",
        "Force Fitting process",
        "Lean Management",
        "Experimentation Board",
        "Business Model and BMC",
        "Project Orientation 1"
      ]
    },
    {
      week: 2,
      topics: [
        "Product Design",
        "Market Type for the Product",
        "Market Size for the Product",
        "Value Proposition",
        "Users' Pain Map Journey",
        "Project Orientation 2"
      ]
    },
    {
      week: 3,
      topics: [
        "Customer Archetypes",
        "Strategies",
        "Competitor Analysis",
        "Competitive Advantages and Landscape",
        "Project Orientation 3"
      ]
    },
    {
      week: 4,
      topics: [
        "Core and non-core skills required for a Product Manager",
        "UI / UX Design",
        "Project Management Basics",
        "Risk Management",
        "Agile Methodology and Framework",
        "Project Orientation 4"
      ]
    },
    {
      week: "5-12",
      topics: [
        "3 Live Projects from (SaaS)/ (Ecommerce) / (Edtech) / (Healthcare)",
        "Case Studies",
        "Placement Assistance",
        "Mock Interviews"
      ]
    }
  ],
  'lean startup & business strategy program': [
    {
      week: 1,
      title: "Introduction to Lean Thinking",
      topics: [
        "Why Do Startups Fail?",
        "Problem-Solution Fit vs Force-Fitting Ideas",
        "Lean Startup Principles & Mindset",
        "Experimentation Board: Designing Lean Experiments",
        "Introduction to Business Model Canvas (BMC)",
        "Project Orientation 1"
      ]
    },
    {
      week: 2,
      title: "Validating the Idea",
      topics: [
        "Product Design for Rapid Validation",
        "Identifying the Right Market Type",
        "Estimating Market Size (TAM, SAM, SOM)",
        "Crafting a Strong Value Proposition",
        "Mapping the User Pain Journey",
        "Project Orientation 2"
      ]
    },
    {
      week: 3,
      title: "Customer Discovery & Market Fit",
      topics: [
        "Defining Customer Archetypes & Segmentation",
        "Go-to-Market Strategies",
        "Competitor Benchmarking & Market Analysis",
        "Identifying Sustainable Competitive Advantage",
        "Project Orientation 3"
      ]
    },
    {
      week: 4,
      title: "Execution with Agility",
      topics: [
        "Key Skills for Founders and Startup Teams",
        "MVP Design and UI/UX Fundamentals",
        "Project Planning & Resource Management",
        "Identifying and Managing Startup Risks",
        "Agile Methodology & Lean Feedback Loops (Build-Measure-Learn)",
        "Project Orientation 4",
        "Experience working on 2 Live projects from (SaaS, Edtech, E-Commerce, Healthcare domain)"
      ]
    }
  ],
  'project management for tech & startup roles': [
    {
      phase: "Phase 1: Mentorship & Training",
      weeks: "Week 1-4",
      description: "Learn core concepts through live mentorship sessions, assignments, case studies and Live Project",
      details: [
        {
          week: 1,
          title: "Introduction to Project Management & Initiation",
          topics: ["Project Life Cycle", "Stakeholder Engagement", "Scope Definition"]
        },
        {
          week: 2,
          title: "Project Planning & Scheduling",
          topics: ["Work Breakdown Structure", "Gantt Charts", "Budgeting", "Risk Management"]
        },
        {
          week: 3,
          title: "Execution, Monitoring & Control",
          topics: ["Agile vs Waterfall", "Change Management", "Performance Metrics", "Reporting"]
        },
        {
          week: 4,
          title: "Project Closure & Best Practices",
          topics: ["Project Review", "Documentation", "Stakeholder Feedback", "Career Paths"]
        }
      ]
    },
    {
      phase: "Phase 2: Live Project",
      weeks: "Week 5-8",
      description: "Apply knowledge to a real-world project under mentorship",
      details: [
        {
          week: 5,
          title: "Project Kickoff & Team Formation",
          topics: ["Define Scope", "Assign Roles"]
        },
        {
          week: 6,
          title: "Planning & Execution",
          topics: ["Develop WBS", "Timeline", "Budget", "Risk Plan"]
        },
        {
          week: 7,
          title: "Monitoring & Mid-Project Review",
          topics: ["Track Progress", "Implement Feedback"]
        },
        {
          week: 8,
          title: "Final Submission & Presentation",
          topics: ["Project Report", "Lessons Learned", "Career Guidance", "2 live Projects from (SaaS, Edtech, E-commerce, Healthcare domains)"]
        }
      ]
    }
  ]
};

const CourseDetails = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: courses, isLoading } = useCourses();
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [currentAttempt, setCurrentAttempt] = useState<any>(null);
  
  const course = courses?.find(c => c.id === courseId);
  
  // Quiz hooks
  const { data: quiz } = useQuizByCourse(courseId);
  const { data: quizQuestions = [] } = useQuizQuestions(quiz?.id);
  const { data: quizAttempts = [] } = useUserQuizAttempts(quiz?.id);
  const startQuiz = useStartQuiz();

  const handleStartQuiz = async () => {
    if (!quiz) return;
    try {
      const attempt = await startQuiz.mutateAsync(quiz.id);
      setCurrentAttempt(attempt);
      setShowQuizModal(true);
    } catch (error) {
      console.error('Failed to start quiz:', error);
    }
  };

  const handleEnrollNow = () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    if (course) {
      const courseTitle = course.title;
      const price = formatPrice(course.price);
      navigate(`/checkout?course=${encodeURIComponent(courseTitle)}&price=${encodeURIComponent(price)}&courseId=${encodeURIComponent(course.id)}`);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading course details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Course Not Found</h1>
            <p className="text-muted-foreground mb-8">The course you're looking for doesn't exist.</p>
            <Button onClick={() => navigate('/')} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Get course metadata by matching title
  const courseTitleLower = course.title.toLowerCase();
  const metadata = courseMetadata[courseTitleLower];
  const currentCourseDetails = courseDetails[courseTitleLower as keyof typeof courseDetails];
  const isProjectManagement = courseTitleLower.includes('project management');
  const hasWeeklyBreakdown = currentCourseDetails !== undefined;

  // Use backend success_rate and job_placement if available
  const successRate = course.success_rate || 95;
  const jobPlacement = course.job_placement || 85;

  // Generate SEO data for this course
  const seoKeywords = metadata?.seoKeywords?.join(', ') || `${course.title.toLowerCase()}, online course, certification`;
  
  const courseSchema = generateCourseSchema({
    name: course.title,
    description: course.description || metadata?.shortDescription || '',
    price: course.price,
    currency: 'INR',
    rating: course.rating || 4.9,
    reviewCount: course.student_count || 500,
    duration: course.duration || '4 weeks',
    url: `https://book-my-mentor.lovable.app/course/${courseId}`
  });

  const breadcrumbData = generateBreadcrumbSchema([
    { name: 'Home', url: 'https://book-my-mentor.lovable.app/' },
    { name: 'Courses', url: 'https://book-my-mentor.lovable.app/#courses' },
    { name: course.title, url: `https://book-my-mentor.lovable.app/course/${courseId}` }
  ]);

  const combinedSchema = {
    "@context": "https://schema.org",
    "@graph": [courseSchema, breadcrumbData]
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead 
        title={`${course.title} - Online Certification Course | BookMyMentor`}
        description={`${metadata?.shortDescription?.substring(0, 155) || course.description || 'Master ' + course.title + ' with expert mentors'}. ${course.rating || 4.9}★ rating, ${course.student_count || 2500}+ students enrolled. Get certified with 100% placement support.`}
        keywords={seoKeywords}
        canonicalUrl={`https://book-my-mentor.lovable.app/course/${courseId}`}
        structuredData={combinedSchema}
      />
      <Header />
      
      {/* Hero Section - Golden Ratio Proportions */}
      <section className="py-[var(--space-2xl)] bg-gradient-to-br from-primary via-primary-light to-primary-dark text-primary-foreground relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-[38.2%] h-[38.2%] bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4 animate-float"></div>
        <div className="absolute bottom-0 left-0 w-[23.6%] h-[23.6%] bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4 animate-float-reverse"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <Button 
            onClick={() => navigate('/')} 
            variant="ghost" 
            className="mb-[var(--space-lg)] text-primary-foreground/90 hover:bg-white/10 hover:text-primary-foreground transition-all"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Courses
          </Button>
          
          <div className="grid lg:grid-cols-5 gap-[var(--space-xl)] items-start">
            {/* Main Content - 61.8% */}
            <div className="lg:col-span-3 animate-slide-up">
              <Badge className="bg-accent text-accent-foreground font-bold mb-[var(--space-md)] px-4 py-1.5 text-sm animate-bounce-in">
                ⭐ BESTSELLER
              </Badge>
              
              <h1 className="text-3xl md:text-4xl lg:text-[2.618rem] font-bold mb-[var(--space-md)] leading-tight">
                {course.title}
              </h1>
              
              {/* Best For Badge */}
              {metadata?.bestFor && (
                <div className="flex items-center gap-2 mb-[var(--space-md)] animate-fade-in animate-delay-200">
                  <Target className="w-5 h-5 text-accent" />
                  <span className="text-primary-foreground/90 font-medium">
                    Best for: {metadata.bestFor}
                  </span>
                </div>
              )}
              
              {/* Trust Indicators */}
              <div className="flex flex-wrap gap-[var(--space-md)] mb-[var(--space-lg)] animate-fade-in animate-delay-300">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-accent text-accent" />
                  ))}
                  <span className="text-primary-foreground/90 ml-2 font-semibold">
                    {course.rating || 4.9} Rating
                  </span>
                </div>
                <div className="flex items-center gap-2 text-primary-foreground/80">
                  <Users className="w-5 h-5" />
                  <span className="font-medium">{course.student_count || 2500}+ students</span>
                </div>
                {course.duration && (
                  <div className="flex items-center gap-2 text-primary-foreground/80">
                    <Clock className="w-5 h-5" />
                    <span className="font-medium">{course.duration}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-primary-foreground/80">
                  <Award className="w-5 h-5" />
                  <span className="font-medium">Certificate Included</span>
                </div>
              </div>
            </div>
            
            {/* Price Card - 38.2% */}
            <div className="lg:col-span-2 animate-scale-in animate-delay-300">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-[var(--space-lg)] border border-white/20 shadow-2xl">
                <div className="text-center mb-[var(--space-lg)]">
                  <div className="text-primary-foreground/60 text-lg line-through mb-1">
                    ₹{((course.price / 100) * 1.5).toLocaleString('en-IN')}
                  </div>
                  <div className="text-[2.618rem] font-bold text-primary-foreground mb-2">
                    {formatPrice(course.price)}
                  </div>
                  <Badge className="bg-accent/90 text-accent-foreground font-bold px-3 py-1">
                    🔥 33% OFF - Limited Time!
                  </Badge>
                </div>
                
                <Button 
                  onClick={handleEnrollNow}
                  className="w-full h-14 text-lg font-bold cta-primary rounded-xl mb-[var(--space-md)]"
                >
                  {user ? 'Enroll Now - Secure Your Spot' : 'Sign In to Enroll'}
                </Button>
                
                <div className="text-center text-primary-foreground/70 text-sm">
                  <p>Secure Payment • 24/7 Support</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Course Content - 3 Click Navigation */}
      <section className="py-[var(--space-2xl)]">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-[var(--space-xl)]">
            {/* Main Content - 2/3 */}
            <div className="lg:col-span-2 space-[var(--space-xl)]">
              
              {/* Program Overview - Key Info in 5 Seconds */}
              {metadata && (
                <Card className="mb-[var(--space-lg)] border-2 border-primary/20 shadow-lg overflow-hidden animate-fade-in">
                  <CardHeader className="bg-gradient-to-r from-primary/5 to-primary-light/5 border-b border-primary/10">
                    <CardTitle className="text-[1.618rem] font-bold text-foreground flex items-center gap-3">
                      <BookOpen className="w-7 h-7 text-primary" />
                      Program Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-[var(--space-lg)] space-y-[var(--space-lg)]">
                    {/* Best For Section */}
                    <div className="flex items-start gap-4 p-[var(--space-md)] bg-accent/5 rounded-xl border border-accent/20">
                      <div className="p-2 bg-accent/10 rounded-lg">
                        <Target className="w-6 h-6 text-accent" />
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground mb-1">Best For</h4>
                        <p className="text-muted-foreground">{metadata.bestFor}</p>
                      </div>
                    </div>
                    
                    {/* Description Section */}
                    <div className="space-y-3">
                      <h4 className="font-bold text-foreground text-lg">About This Program</h4>
                      <p className="text-muted-foreground leading-relaxed">
                        {metadata.shortDescription}
                      </p>
                    </div>
                    
                    {/* Outcome Section */}
                    <div className="flex items-start gap-4 p-[var(--space-md)] bg-primary/5 rounded-xl border border-primary/20">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Trophy className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground mb-1">Expected Outcome</h4>
                        <p className="text-muted-foreground">{metadata.outcome}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* What You'll Learn */}
              <Card className="mb-[var(--space-lg)] shadow-lg animate-fade-in animate-delay-200">
                <CardHeader>
                  <CardTitle className="text-[1.618rem] font-bold text-foreground flex items-center gap-3">
                    <CheckCircle className="w-7 h-7 text-primary" />
                    What You'll Master
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {course.features?.map((feature, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors">
                        <div className="p-1 bg-primary/10 rounded-full">
                          <CheckCircle className="w-4 h-4 text-primary" />
                        </div>
                        <span className="text-foreground/80">{feature}</span>
                      </div>
                    )) || []}
                  </div>
                </CardContent>
              </Card>

              {/* Quiz Section - Available for All Users */}
              {quiz && quizQuestions.length > 0 && (
                <div className="mb-[var(--space-lg)] animate-fade-in animate-delay-300">
                  <QuizCard 
                    quiz={quiz} 
                    attempts={quizAttempts} 
                    onStartQuiz={handleStartQuiz} 
                  />
                </div>
              )}

              {/* Course Breakdown */}
              {hasWeeklyBreakdown && (
                <Card className="shadow-lg animate-fade-in animate-delay-400">
                  <CardHeader className="bg-gradient-to-r from-secondary/50 to-secondary/30">
                    <CardTitle className="text-[1.618rem] font-bold text-foreground">
                      📚 Course Breakdown
                    </CardTitle>
                    <p className="text-muted-foreground">
                      Comprehensive program with hands-on learning and real-world projects
                    </p>
                  </CardHeader>
                  <CardContent className="p-[var(--space-lg)]">
                    <div className="space-y-[var(--space-lg)]">
                      {isProjectManagement ? (
                        // Project Management specific layout
                        (currentCourseDetails as any[]).map((phase, phaseIndex) => (
                          <div key={phaseIndex} className="border-l-4 border-primary pl-[var(--space-lg)]">
                            <div className="mb-[var(--space-md)]">
                              <h3 className="text-xl font-bold text-foreground mb-2">
                                📌 {phase.phase}
                              </h3>
                              <p className="text-primary font-semibold mb-2">
                                {phase.weeks}
                              </p>
                              <p className="text-muted-foreground mb-[var(--space-md)]">
                                <strong>Objective:</strong> {phase.description}
                              </p>
                            </div>
                            <div className="space-y-[var(--space-md)]">
                              {phase.details.map((weekData: any, weekIndex: number) => (
                                <div key={weekIndex} className="bg-secondary/30 p-[var(--space-md)] rounded-xl">
                                  <h4 className="text-lg font-semibold text-foreground mb-2">
                                    Week {weekData.week}: {weekData.title}
                                  </h4>
                                  <div className="grid gap-2">
                                    {weekData.topics.map((topic: string, index: number) => (
                                      <div key={index} className="flex items-start gap-3">
                                        <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-2"></div>
                                        <span className="text-muted-foreground leading-relaxed">{topic}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))
                      ) : (
                        // Standard weekly layout for other courses
                        (currentCourseDetails as any[]).map((weekData, index) => (
                          <div key={index} className="border-l-4 border-primary pl-[var(--space-lg)]">
                            <h3 className="text-xl font-bold text-foreground mb-3">
                              Week {weekData.week}
                              {weekData.title && (
                                <span className="text-lg font-medium text-muted-foreground block mt-1">
                                  {weekData.title}
                                </span>
                              )}
                            </h3>
                            <div className="grid gap-3">
                              {weekData.topics.map((topic: string, topicIndex: number) => (
                                <div key={topicIndex} className="flex items-start gap-3">
                                  <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-2"></div>
                                  <span className="text-muted-foreground leading-relaxed">{topic}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar - 1/3 Golden Ratio */}
            <div className="lg:col-span-1">
              <Card className="sticky top-6 shadow-xl border-2 border-primary/10 animate-fade-in animate-delay-500">
                <CardHeader className="bg-gradient-to-br from-primary/5 to-accent/5">
                  <CardTitle className="text-xl font-bold text-foreground">
                    🎯 Course Highlights
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-[var(--space-lg)] p-[var(--space-lg)]">
                  {/* Success Metrics */}
                  <div className="bg-gradient-to-r from-primary/5 to-accent/5 p-[var(--space-md)] rounded-xl border border-primary/10">
                    <div className="flex items-center justify-between text-sm mb-3">
                      <span className="text-muted-foreground flex items-center gap-2">
                        🎯 Success Rate
                      </span>
                      <span className="font-bold text-primary text-lg">{successRate}%</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2 mb-4">
                      <div 
                        className="bg-gradient-to-r from-primary to-primary-light h-2 rounded-full transition-all duration-1000"
                        style={{ width: `${successRate}%` }}
                      ></div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground flex items-center gap-2">
                        💼 Job Placement
                      </span>
                      <span className="font-bold text-accent text-lg">{jobPlacement}%</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2 mt-2">
                      <div 
                        className="bg-gradient-to-r from-accent to-accent-light h-2 rounded-full transition-all duration-1000"
                        style={{ width: `${jobPlacement}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  {/* Course Details */}
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-border">
                      <span className="text-muted-foreground">📅 Duration</span>
                      <span className="font-semibold text-foreground">{course.duration || "4 weeks"}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-border">
                      <span className="text-muted-foreground">📊 Level</span>
                      <span className="font-semibold text-foreground">All Levels</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-border">
                      <span className="text-muted-foreground">🏆 Certificate</span>
                      <span className="font-semibold text-primary">Yes</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-muted-foreground">👥 Students</span>
                      <span className="font-semibold text-foreground">{course.student_count || 2500}+</span>
                    </div>
                  </div>
                  
                  {/* CTA Button */}
                  <Button 
                    onClick={handleEnrollNow}
                    className="w-full h-14 text-lg font-bold cta-primary rounded-xl"
                  >
                    {user ? 'Enroll Now' : 'Sign In to Enroll'}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Quiz Modal */}
      {quiz && currentAttempt && quizQuestions.length > 0 && (
        <QuizModal
          open={showQuizModal}
          onOpenChange={setShowQuizModal}
          quiz={quiz}
          questions={quizQuestions}
          attempt={currentAttempt}
        />
      )}

      <Footer />
    </div>
  );
};

export default CourseDetails;
