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
import heroImage from "@/assets/hero-mentorship.jpg";

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
      
      {/* Hero Section - Optimized for 5 Second Test with Image Background */}
      <section className="relative overflow-hidden min-h-[85vh] md:min-h-[75vh] flex items-center">
        {/* Hero Image Background with Overlay - 60-30-10 Color System */}
        <div className="absolute inset-0">
          <img 
            src={heroImage} 
            alt="Professional online mentorship and education" 
            className="w-full h-full object-cover"
          />
          {/* Gradient overlay for text readability - 60% primary overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/85 to-primary-dark/90"></div>
          {/* Additional subtle gradient - 30% accent touches */}
          <div className="absolute inset-0 bg-gradient-to-t from-accent/20 via-transparent to-transparent"></div>
        </div>
        
        {/* Animated floating shapes - 10% accent elements */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Subtle accent shapes for visual interest */}
          <div className="absolute top-20 right-10 w-40 h-40 bg-accent/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-32 left-20 w-32 h-32 bg-accent-light/15 rounded-full blur-2xl animate-pulse-glow"></div>
          <div className="absolute top-1/2 right-1/3 w-24 h-24 border border-accent/20 rounded-lg rotate-12 animate-float-reverse"></div>
        </div>
        
        <div className="container mx-auto px-4 py-12 md:py-16 relative z-10">
          {/* Golden Ratio Layout - Content width follows 1:1.618 ratio */}
          <div className="max-w-5xl mx-auto text-center space-golden-lg">
            {/* Trust Badge - Social Proof - Above the fold for instant credibility */}
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md text-white px-6 py-3 rounded-full mb-space-golden-md border border-white/30 shadow-xl">
              <span className="text-yellow-300 text-lg">⭐⭐⭐⭐⭐</span>
              <span className="text-sm md:text-base font-semibold">Trusted by 2000+ Students</span>
            </div>

            {/* Clear Value Proposition (5 Second Test) - Golden Ratio Typography */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold mb-space-golden-md text-white leading-[1.1] tracking-tight drop-shadow-lg">
              Master In-Demand Skills<br />
              <span className="bg-gradient-to-r from-accent-light via-accent to-accent-dark bg-clip-text text-transparent drop-shadow-2xl">
                Accelerate Your Career
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl md:text-2xl mb-space-golden-lg text-white/95 max-w-3xl mx-auto leading-relaxed font-medium drop-shadow-md">
              Learn Product Management, Lean Startup & Project Management from industry experts. Skills recommended by LinkedIn, Gartner & Forbes.
            </p>

            {/* CTA Buttons with Clear Hierarchy - Conversion Optimized */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-space-golden-lg">
              {user ? (
                <>
                  <Button 
                    size="lg" 
                    className="cta-primary text-lg px-10 py-7 rounded-xl shadow-2xl hover:shadow-accent/50 transform hover:scale-105 transition-all duration-300 font-bold w-full sm:w-auto"
                    onClick={() => navigate('/dashboard')}
                  >
                    🚀 Go to Dashboard
                  </Button>
                  <Button 
                    size="lg" 
                    className="bg-white/20 backdrop-blur-md text-white border-2 border-white/40 hover:bg-white/30 hover:border-white/60 text-lg px-10 py-7 rounded-xl shadow-xl font-bold w-full sm:w-auto transition-all duration-300"
                    onClick={handleDownloadBrochures}
                  >
                    📚 Download E-Books
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    size="lg" 
                    className="cta-primary text-lg px-10 py-7 rounded-xl shadow-2xl hover:shadow-accent/50 transform hover:scale-105 transition-all duration-300 font-bold w-full sm:w-auto"
                    onClick={() => navigate('/auth')}
                  >
                    🎯 Start Learning Now →
                  </Button>
                  <Button 
                    size="lg" 
                    className="bg-white/20 backdrop-blur-md text-white border-2 border-white/40 hover:bg-white/30 hover:border-white/60 text-lg px-10 py-7 rounded-xl shadow-xl font-bold w-full sm:w-auto transition-all duration-300"
                    onClick={handleDownloadBrochures}
                  >
                    📚 Free E-Books
                  </Button>
                </>
              )}
            </div>

            {/* Quick Stats - Social Proof - Golden Ratio Spacing */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mt-space-golden-lg">
              <div className="bg-white/15 backdrop-blur-md rounded-2xl p-6 border border-white/30 shadow-xl transform hover:scale-105 transition-all">
                <div className="text-3xl md:text-4xl font-bold text-accent mb-2">2000+</div>
                <div className="text-sm text-white/90 font-medium">Students Enrolled</div>
              </div>
              <div className="bg-white/15 backdrop-blur-md rounded-2xl p-6 border border-white/30 shadow-xl transform hover:scale-105 transition-all">
                <div className="text-3xl md:text-4xl font-bold text-accent mb-2">4.9★</div>
                <div className="text-sm text-white/90 font-medium">Average Rating</div>
              </div>
              <div className="bg-white/15 backdrop-blur-md rounded-2xl p-6 border border-white/30 shadow-xl transform hover:scale-105 transition-all">
                <div className="text-3xl md:text-4xl font-bold text-accent mb-2">95%</div>
                <div className="text-sm text-white/90 font-medium">Success Rate</div>
              </div>
              <div className="bg-white/15 backdrop-blur-md rounded-2xl p-6 border border-white/30 shadow-xl transform hover:scale-105 transition-all">
                <div className="text-3xl md:text-4xl font-bold text-accent mb-2">100%</div>
                <div className="text-sm text-white/90 font-medium">Placement Support</div>
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
