
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
    <header className="bg-white/95 backdrop-blur-sm border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 lg:py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <a href="/">
              <img 
                src="/lovable-uploads/214d995d-02ae-4cd5-91b4-8fd5272fdde1.png" 
                alt="Book My Mentor Logo" 
                className="h-8 sm:h-10 lg:h-12 w-auto"
              />
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            <a href="/" className="text-gray-700 hover:text-purple-600 transition-colors text-sm xl:text-base">Home</a>
            <a href="/#courses" className="text-gray-700 hover:text-purple-600 transition-colors text-sm xl:text-base">Courses</a>
            <a href="/#partners" className="text-gray-700 hover:text-purple-600 transition-colors text-sm xl:text-base">Partners</a>
            <a href="/team" className="text-gray-700 hover:text-purple-600 transition-colors text-sm xl:text-base">Team</a>
            <a href="/contact" className="text-gray-700 hover:text-purple-600 transition-colors text-sm xl:text-base">Contact</a>
            <Button 
              className="bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-xs xl:text-sm px-3 xl:px-4 py-2"
              onClick={handleShareFeedback}
            >
              Share Feedback
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="lg:hidden p-2 hover:bg-gray-100 rounded-md transition-colors" 
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="lg:hidden mt-4 pb-4 border-t animate-in slide-in-from-top-2 duration-200">
            <div className="flex flex-col space-y-3 pt-4">
              <a href="/" className="text-gray-700 hover:text-purple-600 transition-colors py-2 px-2 rounded hover:bg-gray-50">Home</a>
              <a href="/#courses" className="text-gray-700 hover:text-purple-600 transition-colors py-2 px-2 rounded hover:bg-gray-50">Courses</a>
              <a href="/#partners" className="text-gray-700 hover:text-purple-600 transition-colors py-2 px-2 rounded hover:bg-gray-50">Partners</a>
              <a href="/team" className="text-gray-700 hover:text-purple-600 transition-colors py-2 px-2 rounded hover:bg-gray-50">Team</a>
              <a href="/contact" className="text-gray-700 hover:text-purple-600 transition-colors py-2 px-2 rounded hover:bg-gray-50">Contact</a>
              <Button 
                className="bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 w-fit mt-2"
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
