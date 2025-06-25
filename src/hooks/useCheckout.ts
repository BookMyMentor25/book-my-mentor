
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useCreateOrder } from "@/hooks/useOrders";

interface FormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

export const useCheckout = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const createOrderMutation = useCreateOrder();
  
  const course = searchParams.get('course') || 'Product Management';
  const price = searchParams.get('price') || '₹6,000';
  const courseId = searchParams.get('courseId') || '';
  
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/auth');
    } else {
      // Pre-fill form with user data
      setFormData(prev => ({
        ...prev,
        name: user.user_metadata?.full_name || '',
        email: user.email || '',
      }));
    }
  }, [user, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      navigate('/auth');
      return;
    }

    // Validate form
    if (!formData.name || !formData.email || !formData.phone) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (!courseId) {
      toast({
        title: "Invalid Course",
        description: "Course information is missing. Please try again.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Convert price back to paise for database storage
      const priceNumber = parseInt(price.replace(/[₹,]/g, '')) * 100;
      
      const orderData = {
        course_id: courseId,
        order_id: `BMM-${Date.now()}`,
        amount: priceNumber,
        student_name: formData.name,
        student_email: formData.email,
        student_phone: formData.phone,
        address: formData.address || undefined,
        city: formData.city || undefined,
        state: formData.state || undefined,
        pincode: formData.pincode || undefined,
      };

      await createOrderMutation.mutateAsync(orderData);

      toast({
        title: "Order Placed Successfully!",
        description: "Our team will contact you shortly for payment and course details.",
      });

      // Redirect to dashboard after success
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);

    } catch (error: any) {
      console.error('Order creation error:', error);
      toast({
        title: "Error",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  return {
    course,
    price,
    courseId,
    formData,
    handleInputChange,
    handleSubmit,
    isLoading: createOrderMutation.isPending,
    user
  };
};
