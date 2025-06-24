import { ArrowRight, CheckCircle, Users, Briefcase, GraduationCap, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CourseCard from "@/components/CourseCard";
import PartnersSection from "@/components/PartnersSection";
import WhatsAppButton from "@/components/WhatsAppButton";
import CouponBanner from "@/components/CouponBanner";

const Index = () => {
  const productManagementPlans = [
    { name: "Regular Plan", price: "₹6,000", duration: "4 weeks", projects: "1" },
    { name: "Advance Plan", price: "₹10,000", duration: "8 weeks", projects: "2" },
    { name: "Premium Plan", price: "₹15,000", duration: "12 weeks", projects: "3" }
  ];

  const leanStartupFeatures = [
    "15 hours | 12 sessions of 1:1 mentorship",
    "Work on your startup idea. Validate, verify and execute",
    "Achieve Product Market Fit",
    "Lean Startup Resources and Tools provided",
    "Certificate of Achievement as a Lean Startup & Management Intern",
    "CV pointers approval for students"
  ];

  const projectManagementFeatures = [
    "15 hours | 8 sessions of 1:1 mentorship",
    "Work on 2 Live projects (SaaS, EdTech, Healthcare, or eCommerce)",
    "Project management resources and tools",
    "Mock interview session",
    "Certificate of Achievement as a Project Management Intern",
    "CV pointers approval for students"
  ];

  const productManagementFeatures = [
    "15 hours | 8 sessions of 1:1 mentorship",
    "Work on Live projects (SaaS, EdTech, Healthcare, or eCommerce)",
    "Product management resources and tools",
    "Mock interview session",
    "Certificate of Achievement as a Product Management Intern",
    "CV pointers approval for students"
  ];

  const testimonials = [
    {
      text: "This mentorship program is well designed for aspirants to learn and apply those learnings by doing project. Mentors play a vital role in shaping the entire learning and guiding towards improvement.",
      author: "Vishal Singh"
    },
    {
      text: "It had been a good learning experience with book my mentor!",
      author: "Astha Dable"
    },
    {
      text: "Book My Mentor is a Great and supportive community where we can learn industry standards knowledge and process in a flexible, convenient manner. The coach Mr.Najmus is a highly skilled, Talented and people friendly person who takes good efforts and care in guiding and coaching. Great team and content in a affordable price. Hats off to their dedication, support and efforts. I will recommend this to everyone who are looking for upskilling in their career.",
      author: "Dhilip Prasanna"
    }
  ];

  const handleCourseSelect = (courseType: string, price: string) => {
    window.location.href = `/checkout?course=${encodeURIComponent(courseType)}&price=${encodeURIComponent(price)}`;
  };

  return (
    <div className="min-h-screen">
      <CouponBanner />
      <Header />
      
      {/* Hero Section */}
      <section id="home" className="relative bg-gradient-to-br from-purple-50 via-purple-100 to-pink-50 py-20 mt-16">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-purple-700 to-pink-600 bg-clip-text text-transparent">
              Step into the Future with Book My Mentor
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 mb-8 leading-relaxed">
              Where Skills Recommended by LinkedIn, Gartner, and Forbes Become Yours
            </p>
            <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto">
              Master trending job-oriented skills through personalized mentorship from industry experts, 
              practical experience via live projects, and comprehensive placement assistance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-lg px-8 py-4">
                Start Your Journey <ArrowRight className="ml-2" size={20} />
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-4 border-2">
                Explore Courses
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-gray-800">Why Choose Book My Mentor?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We bridge the gap between industry demand and talent supply with job-oriented skills 
              that are projected to be highly relevant in 2025.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-purple-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="text-white" size={32} />
                </div>
                <CardTitle>Industry Expert Mentorship</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Learn directly from seasoned professionals with real-world experience in top companies.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-r from-purple-700 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Briefcase className="text-white" size={32} />
                </div>
                <CardTitle>Live Project Experience</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Work on real projects in SaaS, EdTech, Healthcare, and eCommerce industries.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-r from-pink-600 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <GraduationCap className="text-white" size={32} />
                </div>
                <CardTitle>Placement Assistance</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Comprehensive career guidance, mock interviews, and job placement support.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Industry Recognition */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-purple-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-8">Trusted by Industry Leaders</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Our curriculum is aligned with skills recommended by top industry authorities
          </p>
          <div className="flex justify-center items-center space-x-12 opacity-80">
            <div className="text-2xl font-bold">LinkedIn</div>
            <div className="text-2xl font-bold">Gartner</div>
            <div className="text-2xl font-bold">Forbes</div>
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section id="courses" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-800">Our Trending Course Offerings</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Master in-demand skills with personalized mentorship and hands-on project experience
            </p>
          </div>

          <div className="space-y-16">
            <CourseCard
              title="Product Management"
              description="Master the art of delivering exceptional products. Learn product strategy, user research, roadmaps, and agile methodologies with expert mentorship."
              duration="12-week duration"
              sessions="15 hours | 8 sessions of 1:1 mentorship"
              features={productManagementFeatures}
              plans={productManagementPlans}
            />

            <div className="bg-white rounded-xl p-8 shadow-lg">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-3xl font-bold mb-4 text-gray-800">Lean Startup</h3>
                  <p className="text-gray-600 mb-6">
                    Turn your entrepreneurial dreams into reality. Learn to build and scale a startup using proven Lean Startup methodologies.
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="text-green-500" size={20} />
                      <span className="text-gray-600">8-week duration</span>
                    </div>
                    {leanStartupFeatures.map((feature, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                        <span className="text-gray-600">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-blue-600 mb-4">₹8,000</div>
                    <Button 
                      onClick={() => handleCourseSelect("Lean Startup", "₹8,000")}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-3"
                    >
                      Get Started
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-3xl font-bold mb-4 text-gray-800">Project Management</h3>
                  <p className="text-gray-600 mb-6">
                    Lead and execute projects like a pro. Dive into Agile, Scrum, and PMP frameworks with live projects and expert mentorship.
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="text-green-500" size={20} />
                      <span className="text-gray-600">8-week duration</span>
                    </div>
                    {projectManagementFeatures.map((feature, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                        <span className="text-gray-600">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-blue-600 mb-4">₹10,000</div>
                    <Button 
                      onClick={() => handleCourseSelect("Project Management", "₹10,000")}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-3"
                    >
                      Get Started
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <PartnersSection />

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-800">What Our Students Say</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Real experiences from students who transformed their careers with Book My Mentor
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-center space-x-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4 italic">"{testimonial.text}"</p>
                  <p className="font-semibold text-gray-800">- {testimonial.author}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Career?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of students who have successfully transitioned to high-paying jobs through our mentorship programs.
          </p>
          <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 text-lg px-8 py-4">
            Start Your Journey Today <ArrowRight className="ml-2" size={20} />
          </Button>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Index;
