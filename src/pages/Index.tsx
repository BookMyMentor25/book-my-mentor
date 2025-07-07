
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import CouponBanner from "@/components/CouponBanner";
import PartnersSection from "@/components/PartnersSection";
import CoursesSection from "@/components/CoursesSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import DownloadSection from "@/components/DownloadSection";
import AboutSection from "@/components/AboutSection";

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleDownloadBrochures = () => {
    document.getElementById('downloads')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleShareFeedback = () => {
    window.open('https://g.page/r/CZvakCyCA-xjEAE/review', '_blank');
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <CouponBanner />
      
      {/* Hero Section */}
      <section className="py-8 sm:py-12 md:py-16 lg:py-20 bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="rwd-container text-center flex flex-col justify-center items-center min-h-[60vh]">
          <h1 className="responsive-text-4xl font-bold mb-4 sm:mb-6 leading-tight hierarchy-primary">
            Book My Mentor
          </h1>
          <p className="responsive-text-xl mb-6 sm:mb-8 max-w-4xl mx-auto leading-relaxed px-2 hierarchy-secondary">
            Level up your career with expert mentorship in Product Management, Lean Startup, and Project Management
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4 max-w-2xl mx-auto content-primary">
            {user ? (
              <>
                <Button 
                  size="lg" 
                  className="bg-white text-purple-700 hover:bg-gray-100 responsive-text-base w-full sm:w-auto min-w-[160px] font-semibold shadow-lg"
                  onClick={() => navigate('/dashboard')}
                >
                  My Dashboard
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white text-white hover:bg-white hover:text-purple-700 responsive-text-base w-full sm:w-auto min-w-[160px] font-semibold"
                  onClick={handleDownloadBrochures}
                >
                  Download Brochures
                </Button>
              </>
            ) : (
              <>
                <Button 
                  size="lg" 
                  className="bg-white text-purple-700 hover:bg-gray-100 responsive-text-base w-full sm:w-auto min-w-[160px] font-semibold shadow-lg"
                  onClick={() => navigate('/dashboard')}
                >
                  My Dashboard
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white text-white hover:bg-white hover:text-purple-700 responsive-text-base w-full sm:w-auto min-w-[160px] font-semibold"
                  onClick={handleDownloadBrochures}
                >
                  Download Brochures
                </Button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Dynamic Courses Section */}
      <CoursesSection />

      {/* About Us Section */}
      <AboutSection />

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Download Section (E-books and Brochures) */}
      <DownloadSection />

      <PartnersSection />
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Index;
