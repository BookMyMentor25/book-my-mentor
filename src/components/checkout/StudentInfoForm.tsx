
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

          {/* Referral/Coupon Code Section */}
          <div className="space-y-4">
            <Label htmlFor="couponCode">Referral/Coupon Code (Optional)</Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="couponCode"
                  name="couponCode"
                  value={formData.couponCode}
                  onChange={onInputChange}
                  placeholder="Enter referral or coupon code"
                  className="pl-10"
                  disabled={!!appliedCoupon}
                />
              </div>
              <div className="flex gap-2">
                {!appliedCoupon ? (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onApplyCoupon}
                    disabled={!formData.couponCode.trim()}
                    className="whitespace-nowrap"
                  >
                    Apply Code
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={onRemoveCoupon}
                    className="whitespace-nowrap"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Remove
                  </Button>
                )}
              </div>
            </div>
            
            {appliedCoupon && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-sm text-green-800 font-medium">
                  ✅ Code "{appliedCoupon.code}" applied successfully! 
                  You saved {appliedCoupon.type === 'percentage' 
                    ? `${appliedCoupon.discount}%` 
                    : `₹${appliedCoupon.discount}`}
                </p>
              </div>
            )}
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
