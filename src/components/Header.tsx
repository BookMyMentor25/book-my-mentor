import { Menu, X, GraduationCap, Users, Mail, MessageSquare, Sparkles, Briefcase, Rocket } from "lucide-react";
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
    { label: "Live Projects", href: "/live-projects", icon: Rocket, isHighlighted: true },
    { label: "Trending Skillsets", href: "/#courses", icon: GraduationCap },
    { label: "Find Teammates", href: "/find-teammates", icon: Users, isNew: true },
    { label: "Jobs & Internships", href: "/jobs", icon: Briefcase, isNew: true },
    { label: "Business & Product Toolkit", href: "/ai-tools", icon: Sparkles, isHighlighted: true, shortLabel: "AI Toolkit" },
    { label: "Our Team", href: "/team", icon: Users, onlyXl: true },
    { label: "Contact", href: "/contact", icon: Mail, onlyXl: true },
  ];

  return (
    <header
      className="bg-background/98 backdrop-blur-md border-b border-border sticky top-0 z-50 shadow-sm"
      role="banner"
    >
      <nav className="container mx-auto px-4 py-3 lg:py-3.5" aria-label="Main navigation">
        <div className="flex items-center justify-between gap-4">
          {/* Logo - Click 1: Home (never compressed) */}
          <a
            href="/"
            className="flex shrink-0 items-center gap-2 focus:outline-none focus:ring-2 focus:ring-primary/50 rounded-lg"
            aria-label="BookMyMentor - Go to homepage"
          >
            <img
              src="/lovable-uploads/214d995d-02ae-4cd5-91b4-8fd5272fdde1.png"
              alt="BookMyMentor Logo"
              className="h-10 sm:h-11 lg:h-12 w-auto shrink-0"
              width="144"
              height="48"
              fetchPriority="high"
            />
          </a>

          {/* Desktop Navigation - Click 2: Section */}
          <div className="hidden xl:flex items-center justify-end gap-1.5">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className={`whitespace-nowrap text-sm font-medium px-2.5 py-1.5 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                  item.onlyXl ? "hidden xl:inline-flex" : "inline-flex"
                } items-center gap-1.5 ${
                  item.isHighlighted
                    ? "bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-md hover:shadow-lg hover:scale-[1.04]"
                    : item.isNew
                    ? "text-foreground/80 hover:text-primary hover:bg-secondary"
                    : "text-foreground/80 hover:text-primary hover:bg-secondary"
                }`}
              >
                {item.isHighlighted && <item.icon className="w-4 h-4" aria-hidden="true" />}
                <span>{item.shortLabel ?? item.label}</span>
                {item.isNew && <span className="text-[10px] font-semibold bg-primary text-primary-foreground px-1.5 py-0.5 rounded-full">New</span>}
                {item.isHighlighted && item.shortLabel && <span className="text-[10px] font-semibold bg-white/20 px-1.5 py-0.5 rounded-full">Free</span>}
              </a>
            ))}

            {/* Primary CTA - Click 3: Conversion */}
            {user ? (
              <Button
                className="cta-primary ml-1 shrink-0 whitespace-nowrap px-4 xl:px-5 rounded-full text-sm"
                onClick={() => navigate('/dashboard')}
              >
                Dashboard
              </Button>
            ) : (
              <Button
                className="cta-primary ml-1 shrink-0 whitespace-nowrap px-4 xl:px-5 rounded-full text-sm"
                onClick={() => navigate('/auth')}
              >
                Start Learning
              </Button>
            )}

            <Button
              variant="outline"
              size="icon"
              className="shrink-0 rounded-full border-primary/30 text-primary hover:bg-primary/5"
              onClick={handleShareFeedback}
              aria-label="Share your feedback on Google"
              title="Share your feedback on Google"
            >
              <MessageSquare className="w-4 h-4" />
            </Button>
          </div>

          {/* Tablet & Mobile: keep the primary Live Projects journey visible */}
          <div className="xl:hidden flex items-center gap-2">
            <a
              href="/live-projects"
              className="flex min-h-11 items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground shadow-md transition-all hover:shadow-lg"
            >
              <Rocket className="h-4 w-4" aria-hidden="true" />
              <span>Live Projects</span>
            </a>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="min-h-11 min-w-11 rounded-lg"
              onClick={toggleMenu}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation - 3-Click accessible */}
        {isMenuOpen && (
          <div
            id="mobile-menu"
            className="xl:hidden mt-4 pb-4 border-t border-border animate-fade-in"
          >
            <div className="flex flex-col gap-1 pt-4">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className={`flex items-center gap-3 transition-all py-3 px-4 rounded-lg font-medium ${
                    item.isHighlighted
                      ? "bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-md"
                      : item.isNew
                      ? "bg-primary/10 text-primary border border-primary/20"
                      : "text-foreground hover:text-primary hover:bg-secondary"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <item.icon className="w-5 h-5" aria-hidden="true" />
                  {item.label}
                  {item.isHighlighted && <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full ml-auto">Free</span>}
                  {item.isNew && <span className="text-[10px] bg-primary text-primary-foreground px-2 py-0.5 rounded-full ml-auto">New</span>}
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
