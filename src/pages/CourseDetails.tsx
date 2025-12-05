import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useCourses, formatPrice } from "@/hooks/useCourses";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { ArrowLeft, Clock, Award, Users, Star, CheckCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useQuizByCourse, useQuizQuestions, useUserQuizAttempts, useStartQuiz } from "@/hooks/useQuiz";
import QuizCard from "@/components/quiz/QuizCard";
import QuizModal from "@/components/quiz/QuizModal";

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

  // Course weekly details
  const courseDetails = {
    // Product Management - Regular Plan
    regular: [
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
    // Product Management - Advance Plan
    advance: [
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
    // Product Management - Premium Plan
    premium: [
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
    // Lean Startup
    leanStartup: [
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
    // Project Management
    projectManagement: [
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading course details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Course Not Found</h1>
            <p className="text-gray-600 mb-8">The course you're looking for doesn't exist.</p>
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

  // Determine course type and get appropriate details
  const courseTitle = course.title.toLowerCase();
  let currentCourseDetails = null;
  let courseType = '';
  
  if (courseTitle.includes('product management')) {
    if (courseTitle.includes('regular')) {
      currentCourseDetails = courseDetails.regular;
      courseType = 'Product Management - Regular Plan';
    } else if (courseTitle.includes('advance')) {
      currentCourseDetails = courseDetails.advance;
      courseType = 'Product Management - Advance Plan';
    } else if (courseTitle.includes('premium')) {
      currentCourseDetails = courseDetails.premium;
      courseType = 'Product Management - Premium Plan';
    } else {
      // Default to regular if no specific plan mentioned
      currentCourseDetails = courseDetails.regular;
      courseType = 'Product Management';
    }
  } else if (courseTitle.includes('lean startup')) {
    currentCourseDetails = courseDetails.leanStartup;
    courseType = 'Lean Startup';
  } else if (courseTitle.includes('project management')) {
    currentCourseDetails = courseDetails.projectManagement;
    courseType = 'Project Management';
  }
  
  const hasWeeklyBreakdown = currentCourseDetails !== null;

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="py-12 bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="container mx-auto px-4">
          <Button 
            onClick={() => navigate('/')} 
            variant="ghost" 
            className="mb-6 text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Courses
          </Button>
          
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <Badge className="bg-amber-500 text-white font-bold mb-4">
                BESTSELLER
              </Badge>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                {course.title}
              </h1>
              <p className="text-xl text-white/90 mb-6">
                {course.description}
              </p>
              
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                  <span className="text-white/90 ml-2">(4.9)</span>
                </div>
                <div className="flex items-center space-x-1 text-white/80">
                  <Users className="w-5 h-5" />
                  <span>2,500+ students</span>
                </div>
                {course.duration && (
                  <div className="flex items-center space-x-1 text-white/80">
                    <Clock className="w-5 h-5" />
                    <span>{course.duration}</span>
                  </div>
                )}
                <div className="flex items-center space-x-1 text-white/80">
                  <Award className="w-5 h-5" />
                  <span>Certificate</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="text-center mb-6">
                <div className="text-white/70 text-lg line-through mb-2">
                  ₹{((course.price / 100) * 1.5).toLocaleString('en-IN')}
                </div>
                <div className="text-4xl font-bold text-white mb-2">
                  {formatPrice(course.price)}
                </div>
                <div className="text-green-300 text-lg font-semibold mb-6">
                  33% OFF - Limited Time!
                </div>
              </div>
              
              <Button 
                onClick={handleEnrollNow}
                className="w-full h-12 text-lg font-bold bg-white text-purple-700 hover:bg-gray-100"
              >
                {user ? 'Enroll Now - Secure Your Spot!' : 'Sign In to Enroll'}
              </Button>
              
              <div className="text-center text-white/80 text-sm mt-4">
                💳 Secure Payment • 📞 24/7 Support
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Course Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* What You'll Learn */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-gray-800">
                    What You'll Master
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {course.features?.map((feature, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    )) || []}
                  </div>
                </CardContent>
              </Card>

              {/* Quiz Section */}
              {quiz && quizQuestions.length > 0 && (
                <div className="mb-8">
                  <QuizCard 
                    quiz={quiz} 
                    attempts={quizAttempts} 
                    onStartQuiz={handleStartQuiz} 
                  />
                </div>
              )}

              {/* Learning Outcomes */}
              {(courseType === 'Lean Startup' || courseType === 'Product Management - Advance Plan' || courseType === 'Product Management - Premium Plan') && (
                <Card className="mb-8">
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold text-gray-800">
                      Learning Outcomes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl border border-blue-200">
                      <p className="text-gray-700 leading-relaxed">
                        {courseType === 'Lean Startup' && 
                          "This Lean Startup course teaches you how to build and validate business ideas through rapid experimentation and customer feedback. You'll learn to apply tools like the Lean Canvas, MVP development, and the Build-Measure-Learn loop. Live projects help you test real hypotheses in dynamic markets. By the end, you'll be equipped to launch and scale ideas with minimal risk and maximum impact."
                        }
                        {courseType === 'Product Management - Advance Plan' && 
                          "This Product Management course provides you with hands-on skills in lean thinking, user-centric design, market analysis, and strategic product positioning. You'll learn to identify real user problems, craft impactful solutions, and drive product development using Agile frameworks. Through live projects in domains like SaaS, Ecommerce, and Edtech, you'll apply concepts in real-world settings. By the end, you'll be well-prepared to take on industry roles with confidence and practical experience."
                        }
                        {courseType === 'Product Management - Premium Plan' && 
                          "This Product Management course equips you with practical skills in lean thinking, product design, market sizing, and strategic positioning. You'll learn to identify user pain points, build value-driven solutions, and manage product development using Agile methodologies. Real-world live projects across domains like SaaS, Ecommerce, and Edtech help apply your learning. By the end, you'll gain hands-on experience and be industry-ready for product roles."
                        }
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Course Breakdown */}
              {hasWeeklyBreakdown && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold text-gray-800">
                      Course Breakdown
                    </CardTitle>
                    <p className="text-gray-600">
                      {courseType === 'Project Management' 
                        ? 'This program provides strong foundation in project management concepts followed by hands-on experience'
                        : courseType === 'Lean Startup'
                        ? 'Tentative schedule blending theory with hands-on learning through live projects'
                        : `Comprehensive program covering all aspects of ${courseType}`
                      }
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {courseType === 'Project Management' ? (
                        // Project Management specific layout
                        currentCourseDetails.map((phase, phaseIndex) => (
                          <div key={phaseIndex} className="border-l-4 border-purple-500 pl-6">
                            <div className="mb-4">
                              <h3 className="text-xl font-bold text-gray-800 mb-2">
                                📌 {phase.phase}
                              </h3>
                              <p className="text-gray-600 mb-2">
                                <strong>{phase.weeks}</strong>
                              </p>
                              <p className="text-gray-700 mb-4">
                                <strong>Objective:</strong> {phase.description}
                              </p>
                            </div>
                            <div className="space-y-4">
                              {phase.details.map((weekData, weekIndex) => (
                                <div key={weekIndex} className="bg-gray-50 p-4 rounded-lg">
                                  <h4 className="text-lg font-semibold text-gray-800 mb-2">
                                    Week {weekData.week}: {weekData.title}
                                  </h4>
                                  <div className="grid gap-2">
                                    {weekData.topics.map((topic, index) => (
                                      <div key={index} className="flex items-start space-x-3">
                                        <div className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0 mt-2"></div>
                                        <span className="text-gray-700 leading-relaxed">{topic}</span>
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
                        currentCourseDetails.map((weekData, index) => (
                          <div key={index} className="border-l-4 border-blue-500 pl-6">
                            <h3 className="text-xl font-bold text-gray-800 mb-3">
                              Week {weekData.week}
                              {weekData.title && (
                                <span className="text-lg font-medium text-gray-600 block mt-1">
                                  {weekData.title}
                                </span>
                              )}
                            </h3>
                            <div className="grid gap-3">
                              {weekData.topics.map((topic, topicIndex) => (
                                <div key={topicIndex} className="flex items-start space-x-3">
                                  <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2"></div>
                                  <span className="text-gray-700 leading-relaxed">{topic}</span>
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

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card className="sticky top-6">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-gray-800">
                    Course Highlights
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-xl border border-green-200">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-gray-600">🎯 Success Rate:</span>
                      <span className="font-bold text-green-600">95%</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">💼 Job Placement:</span>
                      <span className="font-bold text-blue-600">85%</span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Duration:</span>
                      <span className="font-semibold">{course.duration || "4 weeks"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Level:</span>
                      <span className="font-semibold">All Levels</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Certificate:</span>
                      <span className="font-semibold">Yes</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Students:</span>
                      <span className="font-semibold">2,500+</span>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={handleEnrollNow}
                    className="w-full h-12 text-lg font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700"
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