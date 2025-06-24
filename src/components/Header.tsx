
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="bg-white/95 backdrop-blur-sm border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <a href="/">
              <img 
                src="/lovable-uploads/214d995d-02ae-4cd5-91b4-8fd5272fdde1.png" 
                alt="Book My Mentor Logo" 
                className="h-12 w-auto"
              />
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="/" className="text-gray-700 hover:text-purple-600 transition-colors">Home</a>
            <a href="/#courses" className="text-gray-700 hover:text-purple-600 transition-colors">Courses</a>
            <a href="/#partners" className="text-gray-700 hover:text-purple-600 transition-colors">Partners</a>
            <a href="/team" className="text-gray-700 hover:text-purple-600 transition-colors">Team</a>
            <a href="#contact" className="text-gray-700 hover:text-purple-600 transition-colors">Contact</a>
            <Button className="bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900">
              Get Started
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2" 
            onClick={toggleMenu}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t">
            <div className="flex flex-col space-y-4 pt-4">
              <a href="/" className="text-gray-700 hover:text-purple-600 transition-colors">Home</a>
              <a href="/#courses" className="text-gray-700 hover:text-purple-600 transition-colors">Courses</a>
              <a href="/#partners" className="text-gray-700 hover:text-purple-600 transition-colors">Partners</a>
              <a href="/team" className="text-gray-700 hover:text-purple-600 transition-colors">Team</a>
              <a href="#contact" className="text-gray-700 hover:text-purple-600 transition-colors">Contact</a>
              <Button className="bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 w-fit">
                Get Started
              </Button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
