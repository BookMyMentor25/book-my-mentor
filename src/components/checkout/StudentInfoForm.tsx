
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Phone, Mail, MapPin, Tag, X } from "lucide-react";

interface FormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  couponCode: string;
}

interface CouponCode {
  code: string;
  discount: number;
  type: 'percentage' | 'fixed';
}

interface StudentInfoFormProps {
  formData: FormData;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  appliedCoupon?: CouponCode | null;
  onApplyCoupon?: () => void;
  onRemoveCoupon?: () => void;
}

const StudentInfoForm = ({ 
  formData, 
  onInputChange, 
  onSubmit, 
  isLoading, 
  appliedCoupon,
  onApplyCoupon,
  onRemoveCoupon 
}: StudentInfoFormProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <User className="w-5 h-5" />
          <span>Student Information</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Full Name *</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={onInputChange}
                  placeholder="Enter your full name"
                  className="pl-10"
                  required
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="email">Email Address *</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={onInputChange}
                  placeholder="Enter your email"
                  className="pl-10"
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="phone">Phone Number *</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={onInputChange}
                placeholder="Enter your phone number"
                className="pl-10"
                required
              />
            </div>
          </div>

          {/* Coupon Code Section */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-200">
            <Label htmlFor="couponCode" className="text-blue-800 font-semibold">
              Have a Referral/Coupon Code?
            </Label>
            <div className="flex space-x-2 mt-2">
              <div className="relative flex-1">
                <Tag className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="couponCode"
                  name="couponCode"
                  value={formData.couponCode}
                  onChange={onInputChange}
                  placeholder="Enter coupon code"
                  className="pl-10"
                  disabled={!!appliedCoupon}
                />
              </div>
              {appliedCoupon ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={onRemoveCoupon}
                  className="border-red-300 text-red-600 hover:bg-red-50"
                >
                  <X className="w-4 h-4 mr-1" />
                  Remove
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={onApplyCoupon}
                  className="bg-blue-600 hover:bg-blue-700"
                  disabled={!formData.couponCode.trim()}
                >
                  Apply
                </Button>
              )}
            </div>
            {appliedCoupon && (
              <div className="mt-2 p-2 bg-green-100 border border-green-300 rounded text-sm text-green-800">
                ✅ Coupon "{appliedCoupon.code}" applied! 
                You saved {appliedCoupon.type === 'percentage' ? `${appliedCoupon.discount}%` : `₹${appliedCoupon.discount}`}
              </div>
            )}
            <div className="mt-2 text-xs text-blue-600">
              Try: FIRST50, STUDENT30, EARLY20, or SAVE1000
            </div>
          </div>

          <div>
            <Label htmlFor="address">Address</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={onInputChange}
                placeholder="Enter your address"
                className="pl-10"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                name="city"
                value={formData.city}
                onChange={onInputChange}
                placeholder="City"
              />
            </div>
            
            <div>
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                name="state"
                value={formData.state}
                onChange={onInputChange}
                placeholder="State"
              />
            </div>
            
            <div>
              <Label htmlFor="pincode">Pincode</Label>
              <Input
                id="pincode"
                name="pincode"
                value={formData.pincode}
                onChange={onInputChange}
                placeholder="Pincode"
              />
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> After submitting this form, our team will contact you within 24 hours 
              to complete the payment process and provide course access details. An invoice will be generated automatically.
            </p>
          </div>

          <Button
            type="submit"
            className="w-full h-12 text-lg font-bold bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 transform transition-all duration-300 hover:scale-105"
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Place Order & Generate Invoice"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default StudentInfoForm;
