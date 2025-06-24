
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
    <div className="fixed top-0 left-0 right-0 bg-gradient-to-r from-green-500 to-green-600 text-white p-4 z-50 shadow-lg">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Gift size={24} />
          <div>
            <span className="font-semibold text-lg">Welcome! Get 10% OFF</span>
            <span className="ml-2">Use code: </span>
            <span className="bg-white text-green-600 px-2 py-1 rounded font-bold">NEWUSER10</span>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            onClick={handleCopyCoupon}
            variant="outline"
            size="sm"
            className="bg-white text-green-600 hover:bg-gray-100"
          >
            Copy Code
          </Button>
          <Button
            onClick={handleClose}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-green-700"
          >
            <X size={20} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CouponBanner;
