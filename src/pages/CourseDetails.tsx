import { useParams, useNavigate } from "react-router-dom";
import { useCourses, formatPrice } from "@/hooks/useCourses";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { ArrowLeft, Clock, Award, Users, Star, CheckCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const CourseDetails = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: courses, isLoading } = useCourses();
  
  const course = courses?.find(c => c.id === courseId);

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

  // Product Management course weekly details
  const productManagementWeeks = [
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
  ];

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

  const isProductManagement = course.title.toLowerCase().includes('product management');

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

              {/* Weekly Breakdown for Product Management */}
              {isProductManagement && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold text-gray-800">
                      Weekly Course Breakdown
                    </CardTitle>
                    <p className="text-gray-600">
                      Comprehensive 4-week program covering all aspects of Product Management
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {productManagementWeeks.map((weekData) => (
                        <div key={weekData.week} className="border-l-4 border-blue-500 pl-6">
                          <h3 className="text-xl font-bold text-gray-800 mb-3">
                            Week {weekData.week}
                          </h3>
                          <div className="grid gap-3">
                            {weekData.topics.map((topic, index) => (
                              <div key={index} className="flex items-start space-x-3">
                                <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2"></div>
                                <span className="text-gray-700 leading-relaxed">{topic}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
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

      <Footer />
    </div>
  );
};

export default CourseDetails;