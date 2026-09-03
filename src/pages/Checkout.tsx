
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Users, UserPlus } from "lucide-react";
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

        <div className="text-center mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">Complete Your Enrollment</h1>
          <p className="text-gray-600">You're one step away from transforming your career!</p>
        </div>

        <button
          type="button"
          onClick={() => navigate(`/group-enroll${window.location.search}`)}
          aria-label="Enroll as a batch of 3 and pay only one third of the course fee"
          className="mx-auto mb-8 flex w-full max-w-6xl flex-col items-center gap-3 rounded-2xl border-2 border-accent bg-accent/10 p-4 text-left transition-all duration-300 hover:bg-accent/20 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent sm:flex-row sm:justify-between sm:gap-6 sm:p-5"
        >
          <span className="flex items-center gap-3 sm:gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent/20">
              <Users className="h-5 w-5 text-accent" />
            </span>
            <span className="flex flex-col leading-snug">
              <span className="text-base font-bold text-gray-900 sm:text-lg">
                Coming with 2 friends? Pay only 1/3 each
              </span>
              <span className="text-sm text-gray-600">
                Same course, same mentors — the fee is split equally across all 3 members.
              </span>
            </span>
          </span>
          <span className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-5 py-3 text-sm font-bold text-accent-foreground shadow-md sm:w-auto">
            Enroll as a Batch of 3
            <ArrowRight className="h-4 w-4" />
          </span>
        </button>

        <button
          type="button"
          onClick={() => navigate("/find-teammates")}
          aria-label="No team yet? Find Live Project teammates on Book My Mentor"
          className="mx-auto mb-8 flex w-full max-w-6xl flex-col items-center gap-3 rounded-2xl border-2 border-primary/30 bg-primary/5 p-4 text-left transition-all duration-300 hover:bg-primary/10 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:flex-row sm:justify-between sm:gap-6 sm:p-5"
        >
          <span className="flex items-center gap-3 sm:gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/15">
              <UserPlus className="h-5 w-5 text-primary" />
            </span>
            <span className="flex flex-col leading-snug">
              <span className="text-base font-bold text-gray-900 sm:text-lg">
                No team yet? Find teammates in 1 click
              </span>
              <span className="text-sm text-gray-600">
                Publish a short profile, invite friends from LinkedIn or Instagram, or join a candidate already looking for members.
              </span>
            </span>
          </span>
          <span className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground shadow-md sm:w-auto">
            Find Teammates
            <ArrowRight className="h-4 w-4" />
          </span>
        </button>

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
