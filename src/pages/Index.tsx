
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import CouponBanner from "@/components/CouponBanner";
import PartnersSection from "@/components/PartnersSection";
import CoursesSection from "@/components/CoursesSection";

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <CouponBanner />
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Book My Mentor
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Level up your career with expert mentorship in Product Management, Lean Startup, and Project Management
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <>
                <Button 
                  size="lg" 
                  className="bg-white text-purple-700 hover:bg-gray-100"
                  onClick={() => navigate('/dashboard')}
                >
                  My Dashboard
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white text-white hover:bg-white hover:text-purple-700"
                  onClick={() => document.getElementById('courses')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Browse Courses
                </Button>
              </>
            ) : (
              <>
                <Button 
                  size="lg" 
                  className="bg-white text-purple-700 hover:bg-gray-100"
                  onClick={() => navigate('/auth')}
                >
                  Get Started
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white text-white hover:bg-white hover:text-purple-700"
                  onClick={() => document.getElementById('courses')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Explore Courses
                </Button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Dynamic Courses Section */}
      <CoursesSection />

      {/* E-books Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Download E-books</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Access our comprehensive guides to accelerate your learning journey
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-lg text-center hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Product Management E-book</h3>
              <p className="text-gray-600 mb-6">Complete guide to product management principles and best practices</p>
              <Button 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                onClick={() => window.open('https://drive.google.com/file/d/1K7-product-management-ebook/view?usp=drive_link', '_blank')}
              >
                Download Now
              </Button>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-blue-50 p-8 rounded-lg text-center hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Lean Startup E-book</h3>
              <p className="text-gray-600 mb-6">Master the lean startup methodology to build successful businesses</p>
              <Button 
                className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                onClick={() => window.open('https://drive.google.com/file/d/1L8-lean-startup-ebook/view?usp=drive_link', '_blank')}
              >
                Download Now
              </Button>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-8 rounded-lg text-center hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Project Management E-book</h3>
              <p className="text-gray-600 mb-6">Learn proven project management frameworks and methodologies</p>
              <Button 
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                onClick={() => window.open('https://drive.google.com/file/d/1M9-project-management-ebook/view?usp=drive_link', '_blank')}
              >
                Download Now
              </Button>
            </div>
          </div>
        </div>
      </section>

      <PartnersSection />
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Index;
