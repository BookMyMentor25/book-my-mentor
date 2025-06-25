
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
    price,
    formData,
    handleInputChange,
    handleSubmit,
    isLoading,
    user
  } = useCheckout();

  if (!user) {
    return null; // Will redirect to auth
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-6 hover:bg-purple-50"
        >
          <ArrowLeft className="mr-2" size={16} />
          Back to Courses
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <OrderSummary course={course} price={price} />
          <StudentInfoForm
            formData={formData}
            onInputChange={handleInputChange}
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
        </div>
      </div>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Checkout;
