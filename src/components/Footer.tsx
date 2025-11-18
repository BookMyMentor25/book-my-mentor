
import { Linkedin, Instagram, Youtube } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">BM</span>
              </div>
              <span className="text-xl font-bold">Book My Mentor</span>
            </div>
            <p className="text-gray-300 mb-6 text-sm leading-relaxed">
              Where Skills Recommended by LinkedIn, Gartner, and Forbes Become Yours.
            </p>
            <div className="space-y-2 text-sm text-gray-300">
              <div className="flex items-center gap-2">
                <span className="text-primary">✉</span>
                <a href="mailto:info@bookmymentor.com" className="hover:text-primary transition-colors">
                  info@bookmymentor.com
                </a>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-primary">📞</span>
                <a href="tel:+918275513895" className="hover:text-primary transition-colors">
                  +91 8275513895
                </a>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4 text-white">Our Courses</h3>
            <ul className="space-y-3 text-gray-300">
              <li>
                <a href="/#courses" className="hover:text-primary transition-colors hover:translate-x-1 inline-block">
                  → Product Management
                </a>
              </li>
              <li>
                <a href="/#courses" className="hover:text-primary transition-colors hover:translate-x-1 inline-block">
                  → Lean Startup
                </a>
              </li>
              <li>
                <a href="/#courses" className="hover:text-primary transition-colors hover:translate-x-1 inline-block">
                  → Project Management
                </a>
              </li>
            </ul>
            <div className="mt-6 p-4 bg-primary/10 rounded-lg border border-primary/20">
              <p className="text-primary text-sm font-medium">
                🤖 AI-Powered Learning Tools Available
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4 text-white">Connect With Us</h3>
            <div className="flex gap-4 mb-6">
              <a 
                href="https://www.linkedin.com/company/book-my-mentor-co/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 hover:bg-primary rounded-lg flex items-center justify-center transition-all hover:scale-110"
                aria-label="Follow us on LinkedIn"
              >
                <Linkedin size={20} />
              </a>
              <a 
                href="https://www.instagram.com/book_my_mentor/profilecard/?igsh=MXdhMG53anZwY3pmeg==" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 hover:bg-accent rounded-lg flex items-center justify-center transition-all hover:scale-110"
                aria-label="Follow us on Instagram"
              >
                <Instagram size={20} />
              </a>
              <a 
                href="https://www.youtube.com/channel/UCxcoW1rchq3a8--vd-SrS-Q" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 hover:bg-red-500 rounded-lg flex items-center justify-center transition-all hover:scale-110"
                aria-label="Subscribe to our YouTube channel"
              >
                <Youtube size={20} />
              </a>
            </div>
            <a 
              href="/contact"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-accent transition-colors"
            >
              Want to partner with us? →
            </a>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4 text-white">Our Locations</h3>
            <div className="space-y-4 text-gray-300 text-sm">
              <div className="p-3 bg-white/5 rounded-lg">
                <strong className="text-white">Mumbai Office</strong><br />
                Near IIT Bombay<br />
                Powai, Mumbai - 400076
              </div>
              <div className="p-3 bg-white/5 rounded-lg">
                <strong className="text-white">Aurangabad Office</strong><br />
                Near MGM Hospital, N-5 Cidco<br />
                Aurangabad, Maharashtra 431001
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 text-center">
          <p className="text-gray-400 text-sm mb-2">
            Book My Mentor is the brand of Ahad Tech Labs Pvt Ltd
          </p>
          <p className="text-gray-500 text-sm">
            &copy; 2025 Book My Mentor. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
