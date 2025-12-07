import { Menu, X, GraduationCap, Users, Mail, MessageSquare, Sparkles } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleShareFeedback = () => {
    window.open('https://g.page/r/CZvakCyCA-xjEAE/review', '_blank');
  };

  // 3-Click Navigation Structure - Strategic ordering for conversion
  const navItems = [
    { label: "Courses", href: "/#courses", icon: GraduationCap },
    { label: "Business Toolkit", href: "/ai-tools", icon: Sparkles, isHighlighted: true },
    { label: "Our Team", href: "/team", icon: Users },
    { label: "Contact", href: "/contact", icon: Mail },
  ];

  return (
    <header 
      className="bg-background/98 backdrop-blur-md border-b border-border sticky top-0 z-50 shadow-sm"
      role="banner"
    >
      <nav className="container mx-auto px-4 py-3 lg:py-4" aria-label="Main navigation">
        <div className="flex items-center justify-between">
          {/* Logo - Click 1: Home */}
          <a 
            href="/" 
            className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-primary/50 rounded-lg"
            aria-label="BookMyMentor - Go to homepage"
          >
            <img 
              src="/lovable-uploads/214d995d-02ae-4cd5-91b4-8fd5272fdde1.png" 
              alt="BookMyMentor Logo" 
              className="h-10 sm:h-12 w-auto"
              width="120"
              height="48"
            />
          </a>

          {/* Desktop Navigation - Click 2: Section */}
          <div className="hidden lg:flex items-center gap-6">
            {navItems.map((item) => (
              <a 
                key={item.label}
                href={item.href} 
                className={`transition-all font-medium px-3 py-1.5 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                  item.isHighlighted 
                    ? "bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-md hover:shadow-lg hover:scale-105 flex items-center gap-1.5" 
                    : "text-foreground/80 hover:text-primary"
                }`}
              >
                {item.isHighlighted && <Sparkles className="w-4 h-4" aria-hidden="true" />}
                {item.label}
                {item.isHighlighted && <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded-full ml-1">FREE</span>}
              </a>
            ))}
            
            {/* Primary CTA - Click 3: Conversion */}
            {user ? (
              <Button 
                className="cta-primary px-5 rounded-full"
                onClick={() => navigate('/dashboard')}
              >
                Dashboard
              </Button>
            ) : (
              <Button 
                className="cta-primary px-5 rounded-full"
                onClick={() => navigate('/auth')}
              >
                Start Learning
              </Button>
            )}
            
            <Button 
              variant="outline"
              className="px-4 rounded-full border-primary/30 text-primary hover:bg-primary/5"
              onClick={handleShareFeedback}
              aria-label="Share your feedback on Google"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Feedback
            </Button>
          </div>

          {/* Mobile: Visible Business Toolkit CTA + Menu Button */}
          <div className="lg:hidden flex items-center gap-2">
            <a 
              href="/ai-tools"
              className="flex items-center gap-1.5 bg-gradient-to-r from-primary to-accent text-primary-foreground px-3 py-1.5 rounded-full text-sm font-medium shadow-md hover:shadow-lg transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
              <span className="hidden sm:inline">Business Toolkit</span>
              <span className="sm:hidden">Toolkit</span>
              <span className="text-[9px] bg-white/20 px-1 py-0.5 rounded-full">FREE</span>
            </a>
            <button 
              className="p-2 hover:bg-secondary rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50" 
              onClick={toggleMenu}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation - 3-Click accessible */}
        {isMenuOpen && (
          <div 
            id="mobile-menu"
            className="lg:hidden mt-4 pb-4 border-t border-border animate-fade-in"
          >
            <div className="flex flex-col gap-1 pt-4">
              {navItems.map((item) => (
                <a 
                  key={item.label}
                  href={item.href} 
                  className={`flex items-center gap-3 transition-all py-3 px-4 rounded-lg font-medium ${
                    item.isHighlighted 
                      ? "bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-md" 
                      : "text-foreground hover:text-primary hover:bg-secondary"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <item.icon className="w-5 h-5" aria-hidden="true" />
                  {item.label}
                  {item.isHighlighted && <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full ml-auto">FREE</span>}
                </a>
              ))}
              
              <div className="flex flex-col gap-2 mt-3 pt-3 border-t border-border">
                {user ? (
                  <Button 
                    className="cta-primary w-full rounded-full"
                    onClick={() => { navigate('/dashboard'); setIsMenuOpen(false); }}
                  >
                    Go to Dashboard
                  </Button>
                ) : (
                  <Button 
                    className="cta-primary w-full rounded-full"
                    onClick={() => { navigate('/auth'); setIsMenuOpen(false); }}
                  >
                    Start Learning Free
                  </Button>
                )}
                <Button 
                  variant="outline"
                  className="w-full rounded-full border-primary/30"
                  onClick={handleShareFeedback}
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Share Feedback
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
