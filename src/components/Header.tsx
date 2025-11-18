
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const scrollToContact = () => {
    const footer = document.querySelector('footer');
    footer?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleShareFeedback = () => {
    window.open('https://g.page/r/CZvakCyCA-xjEAE/review', '_blank');
  };

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-3 lg:py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <a href="/" className="flex items-center gap-2">
              <img 
                src="/lovable-uploads/214d995d-02ae-4cd5-91b4-8fd5272fdde1.png" 
                alt="Book My Mentor - Master In-Demand Skills" 
                className="h-10 sm:h-12 w-auto"
              />
            </a>
          </div>

          {/* Desktop Navigation - Simplified (3 Click Rule) */}
          <nav className="hidden lg:flex items-center gap-8">
            <a href="/#courses" className="text-foreground/80 hover:text-primary transition-colors font-medium">Courses</a>
            <a href="/team" className="text-foreground/80 hover:text-primary transition-colors font-medium">Our Team</a>
            <a href="/contact" className="text-foreground/80 hover:text-primary transition-colors font-medium">Contact</a>
            <Button 
              className="cta-primary px-6 rounded-full"
              onClick={handleShareFeedback}
            >
              Share Feedback
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="lg:hidden p-2 hover:bg-secondary rounded-lg transition-colors" 
            onClick={toggleMenu}
            aria-label="Toggle navigation menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="lg:hidden mt-4 pb-4 border-t border-border animate-in slide-in-from-top-2 duration-200">
            <div className="flex flex-col gap-2 pt-4">
              <a href="/#courses" className="text-foreground hover:text-primary transition-colors py-3 px-4 rounded-lg hover:bg-secondary font-medium">
                Courses
              </a>
              <a href="/team" className="text-foreground hover:text-primary transition-colors py-3 px-4 rounded-lg hover:bg-secondary font-medium">
                Our Team
              </a>
              <a href="/contact" className="text-foreground hover:text-primary transition-colors py-3 px-4 rounded-lg hover:bg-secondary font-medium">
                Contact Us
              </a>
              <Button 
                className="cta-primary mt-2 w-full rounded-full"
                onClick={handleShareFeedback}
              >
                Share Feedback
              </Button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
