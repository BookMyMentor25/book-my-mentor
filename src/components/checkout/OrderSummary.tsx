
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CreditCard, Percent, Tag } from "lucide-react";

interface CouponCode {
  code: string;
  discount: number;
  type: 'percentage' | 'fixed';
}

interface OrderSummaryProps {
  course: string;
  originalPrice: string;
  finalPrice: string;
  appliedCoupon?: CouponCode | null;
}

const OrderSummary = ({ course, originalPrice, finalPrice, appliedCoupon }: OrderSummaryProps) => {
  const originalAmount = parseInt(originalPrice.replace(/[₹,]/g, ''));
  const finalAmount = parseInt(finalPrice.replace(/[₹,]/g, ''));
  const savings = originalAmount - finalAmount;

  return (
    <Card className="h-fit shadow-xl border-2 border-purple-100">
      <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <CardTitle className="flex items-center space-x-2">
          <CreditCard size={20} />
          <span>Order Summary</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <span className="font-medium text-gray-700">Course:</span>
            <span className="font-semibold text-right max-w-48">{course}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-700">Duration:</span>
            <span className="font-semibold">8-12 weeks</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-700">Mentorship:</span>
            <span className="font-semibold">1:1 Sessions</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-700">Support:</span>
            <span className="font-semibold">24/7 Available</span>
          </div>
        </div>

        <Separator />

        {/* Price Breakdown */}
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="font-medium text-gray-700">Course Price:</span>
            <span className={appliedCoupon ? "line-through text-gray-500" : "font-bold text-lg"}>
              {originalPrice}
            </span>
          </div>
          
          {appliedCoupon && (
            <>
              <div className="flex justify-between text-green-600">
                <span className="flex items-center space-x-1">
                  <Tag size={16} />
                  <span>Discount ({appliedCoupon.code}):</span>
                </span>
                <span className="font-semibold">
                  -{appliedCoupon.type === 'percentage' 
                    ? `${appliedCoupon.discount}%` 
                    : `₹${appliedCoupon.discount.toLocaleString('en-IN')}`}
                </span>
              </div>
              <div className="flex justify-between text-green-600">
                <span className="font-medium">You Save:</span>
                <span className="font-bold">₹{savings.toLocaleString('en-IN')}</span>
              </div>
            </>
          )}
        </div>

        <Separator />
        
        <div className="flex justify-between text-xl font-bold">
          <span>Total Amount:</span>
          <span className="text-purple-600">{finalPrice}</span>
        </div>

        {appliedCoupon && (
          <div className="bg-green-50 border border-green-200 p-3 rounded-lg">
            <div className="flex items-center space-x-2 text-green-800">
              <Percent size={16} />
              <span className="text-sm font-semibold">
                Great! You saved ₹{savings.toLocaleString('en-IN')} with coupon "{appliedCoupon.code}"
              </span>
            </div>
          </div>
        )}
        
        <div className="bg-purple-50 p-4 rounded-lg space-y-2">
          <p className="text-sm text-purple-700 font-semibold">✅ What's Included:</p>
          <div className="text-xs text-purple-600 space-y-1">
            <div>🏆 Certificate of Achievement</div>
            <div>💼 Live Project Experience</div>
            <div>🎯 Mock Interview Session</div>
            <div>📄 CV Review & Approval</div>
            <div>📧 Automated Invoice Generation</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderSummary;
