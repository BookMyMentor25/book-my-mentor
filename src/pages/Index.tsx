
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
      
      {/* Hero Section - Optimized for 5 Second Test */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-[hsl(var(--primary-dark))] to-primary min-h-[85vh] md:min-h-[75vh] flex items-center">
        {/* Animated background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(255,255,255,0.08),transparent_50%)]"></div>
        
        <div className="container mx-auto px-4 py-12 md:py-16 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            {/* Trust Badge - Social Proof */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full mb-6 border border-white/20">
              <span className="text-yellow-300">⭐⭐⭐⭐⭐</span>
              <span className="text-sm font-medium">Trusted by 2000+ Students</span>
            </div>

            {/* Clear Value Proposition (5 Second Test) */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold mb-6 text-white leading-[1.1] tracking-tight">
              Master In-Demand Skills<br />
              <span className="bg-gradient-to-r from-accent-light via-accent to-accent bg-clip-text text-transparent">
                Accelerate Your Career
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl md:text-2xl mb-8 text-white/95 max-w-3xl mx-auto leading-relaxed font-medium">
              Learn Product Management, Lean Startup & Project Management from industry experts. Skills recommended by LinkedIn, Gartner & Forbes.
            </p>

            {/* CTA Buttons with Clear Hierarchy */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              {user ? (
                <>
                  <Button 
                    size="lg" 
                    className="cta-primary text-base sm:text-lg px-8 py-6 w-full sm:w-auto min-w-[200px] rounded-full"
                    onClick={() => navigate('/dashboard')}
                  >
                    Go to Dashboard →
                  </Button>
                  <Button 
                    size="lg" 
                    className="cta-secondary text-base sm:text-lg px-8 py-6 w-full sm:w-auto min-w-[200px] rounded-full"
                    onClick={handleDownloadBrochures}
                  >
                    Download E-Books
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    size="lg" 
                    className="cta-primary text-base sm:text-lg px-8 py-6 w-full sm:w-auto min-w-[200px] rounded-full"
                    onClick={() => navigate('/auth')}
                  >
                    Start Learning Now →
                  </Button>
                  <Button 
                    size="lg" 
                    className="cta-secondary text-base sm:text-lg px-8 py-6 w-full sm:w-auto min-w-[200px] rounded-full"
                    onClick={handleDownloadBrochures}
                  >
                    Free E-Books
                  </Button>
                </>
              )}
            </div>

            {/* Quick Stats - Social Proof */}
            <div className="grid grid-cols-3 gap-4 sm:gap-8 max-w-2xl mx-auto pt-8 border-t border-white/20">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1">2000+</div>
                <div className="text-xs sm:text-sm text-white/80">Students Trained</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1">4.9/5</div>
                <div className="text-xs sm:text-sm text-white/80">Student Rating</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1">100%</div>
                <div className="text-xs sm:text-sm text-white/80">Placement Support</div>
              </div>
            </div>
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
