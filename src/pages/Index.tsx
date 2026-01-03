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
import MobileToolkitBanner from "@/components/MobileToolkitBanner";
import heroImage from "@/assets/hero-mentorship.jpg";
import { CheckCircle, Users, Award, Briefcase } from "lucide-react";

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleDownloadBrochures = () => {
    document.getElementById('downloads')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <CouponBanner />
      
      {/* Hero Section - 5-Second Clarity + Golden Ratio + 60-30-10 Color System */}
      <section 
        className="relative overflow-hidden min-h-[90vh] md:min-h-[85vh] flex items-center"
        aria-label="Hero section - Master in-demand skills"
      >
        {/* 60% Primary - Background with gradient overlay + subtle animation */}
        <div className="absolute inset-0">
          <img 
            src={heroImage} 
            alt="Professional online mentorship - Learn Product Management, Lean Startup and Project Management" 
            className="w-full h-full object-cover scale-105 animate-[scaleIn_1.5s_ease-out_forwards]"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/95 via-primary-light/90 to-primary-dark/95 animate-gradient-shift"></div>
        </div>
        
        {/* 10% Accent - Enhanced floating elements with varied animations */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[10%] right-[5%] w-32 h-32 md:w-48 md:h-48 bg-accent/20 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-[15%] left-[8%] w-24 h-24 md:w-36 md:h-36 bg-accent-light/25 rounded-full blur-2xl animate-pulse-glow"></div>
          <div className="absolute top-[40%] left-[3%] w-16 h-16 md:w-24 md:h-24 bg-primary-light/20 rounded-full blur-2xl animate-float-reverse"></div>
          <div className="absolute bottom-[35%] right-[10%] w-20 h-20 md:w-32 md:h-32 bg-accent/15 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }}></div>
        </div>
        
        <div className="container mx-auto px-4 py-16 md:py-20 relative z-10">
          {/* Golden Ratio Container - 61.8% max width */}
          <div className="max-w-4xl mx-auto text-center">
            
            {/* Trust Badge - Immediate credibility with bounce animation */}
            <div className="animate-hidden animate-slide-down inline-flex items-center gap-2 bg-white/15 backdrop-blur-md text-white px-5 py-2.5 rounded-full mb-6 border border-white/25 shadow-lg hover:bg-white/20 hover:scale-105 transition-all duration-300 cursor-default">
              <span className="text-amber-300 text-base">★★★★★</span>
              <span className="text-sm font-semibold">Rated 4.9/5 by 2000+ Students</span>
            </div>

            {/* H1 - Primary keyword + staggered reveal animation */}
            <h1 className="text-[2rem] sm:text-[2.5rem] md:text-[3.25rem] lg:text-[4rem] font-extrabold mb-5 text-white leading-[1.15] tracking-tight">
              <span className="animate-hidden animate-slide-up block animate-delay-100">
                Master Product Management
              </span>
              <span className="animate-hidden animate-slide-up animate-delay-300 bg-gradient-to-r from-accent via-accent-light to-accent bg-clip-text text-transparent inline-block">
                & Accelerate Your Career
              </span>
            </h1>
            
            {/* Subheadline - Fade in with delay */}
            <p className="animate-hidden animate-slide-up animate-delay-500 text-base sm:text-lg md:text-xl mb-8 text-white/90 max-w-2xl mx-auto leading-relaxed font-medium">
              Learn <strong>Lean Startup</strong> & <strong>Project Management</strong> from industry experts. 
              Get certified with courses recommended by <em>LinkedIn, Gartner & Forbes</em>.
            </p>

            {/* 3-Click Navigation - CTAs with scale animation */}
            <div className="animate-hidden animate-scale-in animate-delay-618 flex flex-col sm:flex-row gap-4 justify-center items-center mb-10">
              {user ? (
                <>
                  <Button 
                    size="lg" 
                    className="cta-primary text-base md:text-lg px-8 py-6 rounded-xl shadow-2xl font-bold w-full sm:w-auto group relative overflow-hidden"
                    onClick={() => navigate('/dashboard')}
                    aria-label="Go to your learning dashboard"
                  >
                    <span className="relative z-10">Go to Dashboard</span>
                    <div className="absolute inset-0 animate-shimmer"></div>
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="bg-white/10 backdrop-blur-md text-white border-2 border-white/30 hover:bg-white/20 hover:border-white/50 text-base md:text-lg px-8 py-6 rounded-xl font-semibold w-full sm:w-auto transition-all duration-300 hover:scale-[1.02]"
                    onClick={handleDownloadBrochures}
                    aria-label="Download free e-books and course brochures"
                  >
                    Free E-Books
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    size="lg" 
                    className="cta-primary text-base md:text-lg px-10 py-6 rounded-xl shadow-2xl font-bold w-full sm:w-auto group relative overflow-hidden"
                    onClick={() => navigate('/auth')}
                    aria-label="Start learning product management today"
                  >
                    <span className="relative z-10">Start Learning Free →</span>
                    <div className="absolute inset-0 animate-shimmer"></div>
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="bg-white/10 backdrop-blur-md text-white border-2 border-white/30 hover:bg-white/20 hover:border-white/50 text-base md:text-lg px-8 py-6 rounded-xl font-semibold w-full sm:w-auto transition-all duration-300 hover:scale-[1.02]"
                    onClick={handleDownloadBrochures}
                    aria-label="Download free e-books"
                  >
                    Download Free E-Books
                  </Button>
                </>
              )}
            </div>

            {/* Social Proof Stats - Staggered bounce-in animation */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
              {[
                { icon: Users, value: "2000+", label: "Students Enrolled", delay: "0.8s" },
                { icon: Award, value: "4.9★", label: "Average Rating", delay: "0.9s" },
                { icon: CheckCircle, value: "95%", label: "Success Rate", delay: "1s" },
                { icon: Briefcase, value: "100%", label: "Placement Support", delay: "1.1s" },
              ].map((stat, index) => (
                <div 
                  key={index}
                  className="animate-hidden animate-bounce-in bg-white/10 backdrop-blur-md rounded-xl p-4 md:p-5 border border-white/20 hover:bg-white/20 hover:scale-105 hover:border-white/40 transition-all duration-300 cursor-default group"
                  style={{ animationDelay: stat.delay }}
                >
                  <stat.icon className="w-5 h-5 md:w-6 md:h-6 text-accent mx-auto mb-2 group-hover:scale-110 transition-transform duration-300" aria-hidden="true" />
                  <div className="text-xl md:text-2xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-xs md:text-sm text-white/80 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content - Semantic HTML for SEO */}
      <main>
        {/* Courses Section - Primary conversion point */}
        <CoursesSection />

        {/* About Section - Trust building */}
        <AboutSection />

        {/* Testimonials - Social proof */}
        <TestimonialsSection />

        {/* Downloads - Lead generation */}
        <DownloadSection />

        {/* Partners - Authority building */}
        <PartnersSection />
      </main>

      <Footer />
      <WhatsAppButton />
      <MobileToolkitBanner />
    </div>
  );
};

export default Index;
