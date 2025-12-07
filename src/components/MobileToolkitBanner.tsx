import { Sparkles, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const MobileToolkitBanner = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const location = useLocation();

  // Hide on AI tools pages
  const hideOnPages = ["/ai-tools", "/ai-tool", "/wireframe"];
  const shouldHide = hideOnPages.some(page => location.pathname.startsWith(page));

  useEffect(() => {
    // Check if user dismissed the banner in this session
    const dismissed = sessionStorage.getItem("toolkit-banner-dismissed");
    if (dismissed) {
      setIsVisible(false);
    }
  }, []);

  const handleDismiss = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsVisible(false);
      sessionStorage.setItem("toolkit-banner-dismissed", "true");
    }, 300);
  };

  if (!isVisible || shouldHide) return null;

  return (
    <div 
      className={`lg:hidden fixed bottom-4 left-4 right-4 z-50 animate-fade-in ${isAnimating ? 'animate-fade-out' : ''}`}
    >
      <div className="bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_100%] animate-[gradient_3s_ease_infinite] rounded-2xl p-4 shadow-xl border border-primary/20">
        <button 
          onClick={handleDismiss}
          className="absolute -top-2 -right-2 bg-background rounded-full p-1 shadow-md hover:bg-secondary transition-colors"
          aria-label="Dismiss banner"
        >
          <X className="w-4 h-4 text-foreground/70" />
        </button>
        
        <a 
          href="/ai-tools"
          className="flex items-center gap-3"
        >
          <div className="bg-white/20 rounded-xl p-2.5 backdrop-blur-sm">
            <Sparkles className="w-6 h-6 text-primary-foreground" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-primary-foreground font-bold text-sm">
                Free Business Toolkit
              </h3>
              <span className="text-[10px] bg-white/25 text-primary-foreground px-2 py-0.5 rounded-full font-medium">
                16 AI Tools
              </span>
            </div>
            <p className="text-primary-foreground/80 text-xs mt-0.5 truncate">
              RICE, SCRUM, Kanban, Risk & more
            </p>
          </div>
          
          <div className="bg-white text-primary font-semibold text-xs px-3 py-2 rounded-full shadow-md hover-scale">
            Try Free →
          </div>
        </a>
      </div>
    </div>
  );
};

export default MobileToolkitBanner;
