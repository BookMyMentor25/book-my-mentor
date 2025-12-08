
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useCreateOrder } from "@/hooks/useOrders";
import { supabase } from "@/integrations/supabase/client";

interface FormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  couponCode: string;
  whatsappNotification: boolean;
}

interface AppliedCoupon {
  code: string;
  discountPercent: number;
  discountAmount: number;
  discountType: string;
}

export const useCheckout = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, loading } = useAuth();
  const createOrderMutation = useCreateOrder();
  
  const course = searchParams.get('course') || 'Product Management';
  const originalPrice = searchParams.get('price') || '₹6,000';
  const courseId = searchParams.get('courseId') || '';
  
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);
  const [finalPrice, setFinalPrice] = useState(originalPrice);
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);
  
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    couponCode: '',
    whatsappNotification: false,
  });

  // Wait for auth loading to complete before redirecting
  useEffect(() => {
    if (!loading && !user) {
      console.log('No user found, redirecting to auth');
      navigate('/auth');
    } else if (user) {
      console.log('User found, pre-filling form:', user.email);
      // Pre-fill form with user data
      setFormData(prev => ({
        ...prev,
        name: user.user_metadata?.full_name || '',
        email: user.email || '',
        whatsappNotification: false,
      }));
    }
  }, [user, loading, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (field: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: checked
    }));
  };

  const applyCoupon = async () => {
    if (!formData.couponCode.trim()) {
      toast({
        title: "Enter Coupon Code",
        description: "Please enter a coupon code to apply.",
        variant: "destructive",
      });
      return;
    }

    setIsValidatingCoupon(true);
    
    try {
      // Validate coupon using the database function
      const { data, error } = await supabase
        .rpc('validate_coupon', { input_code: formData.couponCode.trim() });

      if (error) {
        console.error('Coupon validation error:', error);
        toast({
          title: "Validation Error",
          description: "Unable to validate coupon. Please try again.",
          variant: "destructive",
        });
        return;
      }

      const result = data?.[0];
      
      if (!result || !result.is_valid) {
        toast({
          title: "Invalid Coupon",
          description: result?.error_message || "The coupon code you entered is not valid.",
          variant: "destructive",
        });
        return;
      }

      if (appliedCoupon?.code.toLowerCase() === formData.couponCode.toLowerCase()) {
        toast({
          title: "Coupon Already Applied",
          description: "This coupon is already applied to your order.",
        });
        return;
      }

      const originalAmount = parseInt(originalPrice.replace(/[₹,]/g, ''));
      let discountedAmount = originalAmount;

      // Apply percentage discount
      if (result.discount_percent > 0) {
        discountedAmount = originalAmount - (originalAmount * result.discount_percent / 100);
      }
      
      // Apply fixed discount
      if (result.discount_amount > 0) {
        discountedAmount = Math.max(0, discountedAmount - result.discount_amount);
      }

      const newCoupon: AppliedCoupon = {
        code: formData.couponCode.trim(),
        discountPercent: result.discount_percent,
        discountAmount: result.discount_amount,
        discountType: result.discount_type || 'percentage'
      };

      setAppliedCoupon(newCoupon);
      setFinalPrice(`₹${discountedAmount.toLocaleString('en-IN')}`);
      
      // Build discount description
      let discountDesc = '';
      if (result.discount_percent > 0) {
        discountDesc = `${result.discount_percent}%`;
      }
      if (result.discount_amount > 0) {
        discountDesc += discountDesc ? ` + ₹${result.discount_amount}` : `₹${result.discount_amount}`;
      }
      
      toast({
        title: "Coupon Applied!",
        description: `You saved ${discountDesc}!`,
      });
    } catch (err) {
      console.error('Coupon application error:', err);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setFinalPrice(originalPrice);
    setFormData(prev => ({ ...prev, couponCode: '' }));
    
    toast({
      title: "Coupon Removed",
      description: "The coupon has been removed from your order.",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submission started');

    if (!user) {
      console.log('No user, redirecting to auth');
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
      console.log('Creating order with data:', {
        courseId,
        user: user.id,
        formData,
        finalPrice
      });

      // Convert final price back to paise for database storage
      const priceNumber = parseInt(finalPrice.replace(/[₹,]/g, '')) * 100;
      
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
        coupon_applied: appliedCoupon?.code || undefined,
        discount_amount: appliedCoupon ? 
          (parseInt(originalPrice.replace(/[₹,]/g, '')) - parseInt(finalPrice.replace(/[₹,]/g, ''))) * 100 : 0,
      };

      console.log('Order data prepared:', orderData);
      const result = await createOrderMutation.mutateAsync(orderData);
      console.log('Order creation result:', result);

      // Send order confirmation emails with invoice
      try {
        const emailResponse = await supabase.functions.invoke('send-order-confirmation', {
          body: {
            orderId: orderData.order_id,
            customerEmail: formData.email,
            customerName: formData.name,
            customerPhone: formData.phone,
            courseName: course,
            orderAmount: parseInt(originalPrice.replace(/[₹,]/g, '')) * 100,
            discountAmount: orderData.discount_amount,
            couponApplied: appliedCoupon?.code,
            address: formData.address || undefined,
            city: formData.city || undefined,
            state: formData.state || undefined,
            pincode: formData.pincode || undefined
          }
        });
        
        if (emailResponse.error) {
          console.error('Invoice email sending failed:', emailResponse.error);
        } else {
          console.log('Invoice emails sent to customer and admins successfully');
        }
      } catch (emailError) {
        console.error('Error sending invoice emails:', emailError);
        // Don't fail the order if email fails
      }

      toast({
        title: "Order Placed Successfully!",
        description: "Our team will contact you shortly for payment and course details.",
      });

      // Send order notification via WhatsApp if opted in
      if (formData.whatsappNotification && (window as any).sendOrderNotification) {
        (window as any).sendOrderNotification({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          course: course || 'Unknown Course',
          price: finalPrice,
          paymentStatus: 'Pending'
        });
      }

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
    originalPrice,
    finalPrice,
    courseId,
    formData,
    appliedCoupon,
    handleInputChange,
    handleCheckboxChange,
    applyCoupon,
    removeCoupon,
    handleSubmit,
    isLoading: createOrderMutation.isPending,
    isValidatingCoupon,
    user
  };
};
