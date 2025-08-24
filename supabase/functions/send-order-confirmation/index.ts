import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface OrderConfirmationRequest {
  orderId: string;
  customerEmail: string;
  customerName: string;
  courseName: string;
  orderAmount: number;
  discountAmount?: number;
  couponApplied?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      orderId, 
      customerEmail, 
      customerName, 
      courseName, 
      orderAmount, 
      discountAmount = 0,
      couponApplied 
    }: OrderConfirmationRequest = await req.json();

    console.log('Processing order confirmation for:', { orderId, customerEmail, customerName });

    const finalAmount = (orderAmount - discountAmount) / 100; // Convert from paise to rupees
    const originalAmount = orderAmount / 100;
    const discountAmountRs = discountAmount / 100;

    // Email content for customer
    const customerEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Order Confirmation</h1>
          <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Thank you for your enrollment!</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #333; margin-top: 0;">Hi ${customerName}! 🎉</h2>
          
          <p style="color: #666; line-height: 1.6;">
            Congratulations! Your order has been successfully placed. Our team will contact you shortly for payment details and course access.
          </p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
            <h3 style="color: #333; margin-top: 0;">Order Details</h3>
            <p><strong>Order ID:</strong> ${orderId}</p>
            <p><strong>Course:</strong> ${courseName}</p>
            <p><strong>Customer:</strong> ${customerName}</p>
            <p><strong>Email:</strong> ${customerEmail}</p>
            ${originalAmount !== finalAmount ? `
              <p><strong>Original Amount:</strong> ₹${originalAmount.toLocaleString('en-IN')}</p>
              ${couponApplied ? `<p><strong>Coupon Applied:</strong> ${couponApplied}</p>` : ''}
              <p><strong>Discount:</strong> -₹${discountAmountRs.toLocaleString('en-IN')}</p>
              <p style="font-size: 18px; color: #667eea;"><strong>Final Amount:</strong> ₹${finalAmount.toLocaleString('en-IN')}</p>
            ` : `
              <p style="font-size: 18px; color: #667eea;"><strong>Amount:</strong> ₹${finalAmount.toLocaleString('en-IN')}</p>
            `}
          </div>
          
          <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h4 style="color: #1976d2; margin-top: 0;">What's Next?</h4>
            <ul style="color: #666; margin: 0; padding-left: 20px;">
              <li>Our team will contact you within 24 hours</li>
              <li>Payment instructions will be shared via WhatsApp/Email</li>
              <li>Course access will be provided immediately after payment confirmation</li>
              <li>You'll receive all course materials and lifetime access</li>
            </ul>
          </div>
          
          <p style="color: #666; font-size: 14px; margin-top: 30px;">
            If you have any questions, feel free to contact our support team. We're here to help!
          </p>
          
          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #667eea; font-weight: bold;">🚀 Get ready to transform your career!</p>
          </div>
        </div>
      </div>
    `;

    // Email content for admin
    const adminEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #2c3e50; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0;">🎯 New Order Received!</h1>
        </div>
        
        <div style="background: #ecf0f1; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #2c3e50; margin-top: 0;">Order Details</h2>
          
          <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #e74c3c;">
            <p><strong>Order ID:</strong> ${orderId}</p>
            <p><strong>Course:</strong> ${courseName}</p>
            <p><strong>Customer Name:</strong> ${customerName}</p>
            <p><strong>Customer Email:</strong> ${customerEmail}</p>
            ${originalAmount !== finalAmount ? `
              <p><strong>Original Amount:</strong> ₹${originalAmount.toLocaleString('en-IN')}</p>
              ${couponApplied ? `<p><strong>Coupon Applied:</strong> ${couponApplied}</p>` : ''}
              <p><strong>Discount Given:</strong> ₹${discountAmountRs.toLocaleString('en-IN')}</p>
              <p style="font-size: 18px; color: #e74c3c;"><strong>Final Amount:</strong> ₹${finalAmount.toLocaleString('en-IN')}</p>
            ` : `
              <p style="font-size: 18px; color: #e74c3c;"><strong>Amount:</strong> ₹${finalAmount.toLocaleString('en-IN')}</p>
            `}
          </div>
          
          <div style="background: #f39c12; color: white; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h4 style="margin-top: 0;">⚡ Action Required</h4>
            <p style="margin: 0;">Please contact the customer within 24 hours for payment processing and course enrollment.</p>
          </div>
          
          <p style="color: #7f8c8d; font-size: 14px; margin-top: 20px;">
            This is an automated notification from your course enrollment system.
          </p>
        </div>
      </div>
    `;

    // Send email to customer
    const customerEmailResponse = await resend.emails.send({
      from: "BMM Academy <noreply@bookmymentor.com>",
      to: [customerEmail],
      subject: `🎉 Order Confirmation - ${courseName} (${orderId})`,
      html: customerEmailHtml,
    });

    console.log("Customer email sent:", customerEmailResponse);

    // Send email to admin
    const adminEmailResponse = await resend.emails.send({
      from: "BMM Academy <noreply@bookmymentor.com>",
      to: ["support@bookmymentor.com"],
      subject: `🎯 New Order: ${courseName} - ${customerName} (${orderId})`,
      html: adminEmailHtml,
    });

    console.log("Admin email sent:", adminEmailResponse);

    return new Response(
      JSON.stringify({ 
        success: true, 
        customerEmailId: customerEmailResponse.data?.id,
        adminEmailId: adminEmailResponse.data?.id 
      }), 
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error sending order confirmation emails:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { 
          "Content-Type": "application/json", 
          ...corsHeaders 
        },
      }
    );
  }
};

serve(handler);