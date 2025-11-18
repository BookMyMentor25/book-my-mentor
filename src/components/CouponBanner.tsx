
import { useState, useEffect } from "react";
import { X, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";

const CouponBanner = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has seen the coupon before
    const hasSeenCoupon = localStorage.getItem('bmm-coupon-seen');
    if (!hasSeenCoupon) {
      setIsVisible(true);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem('bmm-coupon-seen', 'true');
  };

  const handleCopyCoupon = () => {
    navigator.clipboard.writeText('NEWUSER10');
    // Could add a toast here if needed
  };

  if (!isVisible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 bg-gradient-to-r from-accent to-accent-light text-white py-3 px-4 z-50 shadow-lg border-b-2 border-accent-light">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3 text-center sm:text-left">
          <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
            <Gift size={20} className="text-white" />
          </div>
          <div className="space-y-1">
            <div className="font-bold text-base sm:text-lg">🎉 New User Offer: 10% OFF</div>
            <div className="text-sm">
              <span className="opacity-90">Use code: </span>
              <span className="bg-white text-accent px-3 py-1 rounded-full font-bold shadow-md">
                NEWUSER10
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={handleCopyCoupon}
            size="sm"
            className="bg-white text-accent hover:bg-white/90 font-semibold shadow-md hover:shadow-lg transition-all"
          >
            Copy Code
          </Button>
          <Button
            onClick={handleClose}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20 p-2"
            aria-label="Close banner"
          >
            <X size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CouponBanner;
