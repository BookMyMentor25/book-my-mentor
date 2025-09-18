
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import OrderSummary from "@/components/checkout/OrderSummary";
import StudentInfoForm from "@/components/checkout/StudentInfoForm";
import { useCheckout } from "@/hooks/useCheckout";

const Checkout = () => {
  const navigate = useNavigate();
  const {
    course,
    originalPrice,
    finalPrice,
    formData,
    appliedCoupon,
    handleInputChange,
    handleCheckboxChange,
    applyCoupon,
    removeCoupon,
    handleSubmit,
    isLoading,
    user
  } = useCheckout();

  if (!user) {
    return null; // Will redirect to auth
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-6 hover:bg-purple-100 transition-colors"
        >
          <ArrowLeft className="mr-2" size={16} />
          Back to Courses
        </Button>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Complete Your Enrollment</h1>
          <p className="text-gray-600">You're one step away from transforming your career!</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <OrderSummary 
            course={course} 
            originalPrice={originalPrice}
            finalPrice={finalPrice}
            appliedCoupon={appliedCoupon}
          />
          <StudentInfoForm
            formData={formData}
            onInputChange={handleInputChange}
            onSubmit={handleSubmit}
            isLoading={isLoading}
            appliedCoupon={appliedCoupon}
            onApplyCoupon={applyCoupon}
            onRemoveCoupon={removeCoupon}
            onCheckboxChange={handleCheckboxChange}
          />
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          🔒 Secure checkout • 📧 Instant invoice generation • 🎓 Immediate course access after payment
        </div>
      </div>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Checkout;
