
import { Linkedin, Instagram, Youtube } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">BM</span>
              </div>
              <span className="text-xl font-bold">Book My Mentor</span>
            </div>
            <p className="text-gray-400 mb-4 text-sm lg:text-base">
              Where Skills Recommended by LinkedIn, Gartner, and Forbes Become Yours.
            </p>
            <div className="space-y-2 text-sm text-gray-400">
              <div>Email: info@bookmymentor.com</div>
              <div>Email: bookmymentor.org@gmail.com</div>
              <div>Phone: +91 8275513895</div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Our Courses</h3>
            <ul className="space-y-2 text-gray-400 text-sm lg:text-base">
              <li>Product Management</li>
              <li>Lean Startup</li>
              <li>Project Management</li>
            </ul>
            <div className="mt-4">
              <p className="text-purple-300 text-sm font-medium">
                🤖 Use AI Tools to understand, access, learn and practice these courses conveniently and efficiently.
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a 
                href="https://www.linkedin.com/company/book-my-mentor-co/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-500 transition-colors"
              >
                <Linkedin size={24} />
              </a>
              <a 
                href="https://www.instagram.com/book_my_mentor/profilecard/?igsh=MXdhMG53anZwY3pmeg==" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-pink-500 transition-colors"
              >
                <Instagram size={24} />
              </a>
              <a 
                href="https://www.youtube.com/channel/UCxcoW1rchq3a8--vd-SrS-Q" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                <Youtube size={24} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Our Locations</h3>
            <div className="space-y-4 text-gray-400 text-sm">
              <div>
                <strong>Mumbai Office:</strong><br />
                Near IIT Bombay<br />
                Powai, Mumbai- 400076
              </div>
              <div>
                <strong>Aurangabad Office:</strong><br />
                Near MGM Hospital, N-5 Cidco<br />
                Aurangabad, Maharashtra 431001
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 Book My Mentor. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
