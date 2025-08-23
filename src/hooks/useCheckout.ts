
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
}

interface CouponCode {
  code: string;
  discount: number;
  type: 'percentage' | 'fixed';
}

const validCoupons: CouponCode[] = [
  { code: 'NEWUSER10', discount: 10, type: 'percentage' },
  { code: 'FIRST50', discount: 50, type: 'percentage' },
  { code: 'First30', discount: 3000, type: 'fixed' },
  { code: 'STUDENT30', discount: 30, type: 'percentage' },
  { code: 'EARLY20', discount: 20, type: 'percentage' },
  { code: 'SAVE1000', discount: 1000, type: 'fixed' },
  { code: 'Unstop30', discount: 3000, type: 'fixed' },
];

export const useCheckout = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, loading } = useAuth();
  const createOrderMutation = useCreateOrder();
  
  const course = searchParams.get('course') || 'Product Management';
  const originalPrice = searchParams.get('price') || '₹6,000';
  const courseId = searchParams.get('courseId') || '';
  
  const [appliedCoupon, setAppliedCoupon] = useState<CouponCode | null>(null);
  const [finalPrice, setFinalPrice] = useState(originalPrice);
  
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    couponCode: '',
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

  const applyCoupon = () => {
    const coupon = validCoupons.find(c => c.code.toLowerCase() === formData.couponCode.toLowerCase());
    
    if (!coupon) {
      toast({
        title: "Invalid Coupon",
        description: "The coupon code you entered is not valid.",
        variant: "destructive",
      });
      return;
    }

    if (appliedCoupon?.code === coupon.code) {
      toast({
        title: "Coupon Already Applied",
        description: "This coupon is already applied to your order.",
      });
      return;
    }

    const originalAmount = parseInt(originalPrice.replace(/[₹,]/g, ''));
    let discountedAmount = originalAmount;

    if (coupon.type === 'percentage') {
      discountedAmount = originalAmount - (originalAmount * coupon.discount / 100);
    } else {
      discountedAmount = Math.max(0, originalAmount - coupon.discount);
    }

    setAppliedCoupon(coupon);
    setFinalPrice(`₹${discountedAmount.toLocaleString('en-IN')}`);
    
    toast({
      title: "Coupon Applied!",
      description: `You saved ${coupon.type === 'percentage' ? coupon.discount + '%' : '₹' + coupon.discount}!`,
    });
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

      // Send order confirmation emails
      try {
        const emailResponse = await supabase.functions.invoke('send-order-confirmation', {
          body: {
            orderId: orderData.order_id,
            customerEmail: formData.email,
            customerName: formData.name,
            courseName: course,
            orderAmount: parseInt(originalPrice.replace(/[₹,]/g, '')) * 100,
            discountAmount: orderData.discount_amount,
            couponApplied: appliedCoupon?.code
          }
        });
        
        if (emailResponse.error) {
          console.error('Email sending failed:', emailResponse.error);
        } else {
          console.log('Order confirmation emails sent successfully');
        }
      } catch (emailError) {
        console.error('Error sending confirmation emails:', emailError);
        // Don't fail the order if email fails
      }

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
    originalPrice,
    finalPrice,
    courseId,
    formData,
    appliedCoupon,
    handleInputChange,
    applyCoupon,
    removeCoupon,
    handleSubmit,
    isLoading: createOrderMutation.isPending,
    user
  };
};
