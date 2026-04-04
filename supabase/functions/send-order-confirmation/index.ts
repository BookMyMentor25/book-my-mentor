import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const GATEWAY_URL = 'https://connector-gateway.lovable.dev/resend';
const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

interface OrderConfirmationRequest {
  orderId: string;
  customerEmail: string;
  customerName: string;
  customerPhone: string;
  courseName: string;
  orderAmount: number;
  discountAmount?: number;
  couponApplied?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
}

async function sendEmailWithRetry(payload: any, maxRetries = 2): Promise<any> {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(`${GATEWAY_URL}/emails`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${LOVABLE_API_KEY}`,
          'X-Connection-Api-Key': RESEND_API_KEY!,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        return await response.json();
      }

      const errorText = await response.text();
      console.error(`Email send attempt ${attempt + 1} failed:`, response.status, errorText);

      if (response.status === 429 && attempt < maxRetries) {
        await new Promise(r => setTimeout(r, 2000 * (attempt + 1)));
        continue;
      }

      throw new Error(`Email API error: ${response.status} - ${errorText}`);
    } catch (err) {
      if (attempt === maxRetries) throw err;
      console.log(`Retrying email send (attempt ${attempt + 2})...`);
      await new Promise(r => setTimeout(r, 1000 * (attempt + 1)));
    }
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      orderId, customerEmail, customerName, customerPhone,
      courseName, orderAmount, discountAmount = 0,
      couponApplied, address, city, state, pincode
    }: OrderConfirmationRequest = await req.json();

    console.log('Processing order confirmation for:', { orderId, customerEmail, customerName });

    if (!RESEND_API_KEY || !LOVABLE_API_KEY) {
      throw new Error("Email API keys are not configured");
    }

    const finalAmount = (orderAmount - discountAmount) / 100;
    const originalAmount = orderAmount / 100;
    const discountAmountRs = discountAmount / 100;
    const orderDate = new Date().toLocaleDateString('en-IN', { 
      day: '2-digit', month: 'long', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });

    const fullAddress = [address, city, state, pincode].filter(Boolean).join(', ');

    const customerEmailHtml = `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Order Invoice - Book My Mentor</title></head><body style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 650px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;"><div style="background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);"><div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 35px 30px; text-align: center;"><h1 style="color: white; margin: 0; font-size: 26px; font-weight: 600;">📄 Order Invoice</h1><p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 14px;">Thank you for enrolling with Book My Mentor!</p></div><div style="padding: 30px;"><h2 style="color: #333; margin: 0 0 5px 0; font-size: 20px;">Hello ${customerName}! 🎉</h2><p style="color: #666; margin: 0 0 25px 0; font-size: 14px;">Your order has been successfully placed.</p><div style="background: #f8f9fa; border-radius: 10px; padding: 25px; margin-bottom: 25px; border: 1px solid #e9ecef;"><table style="width: 100%;"><tr><td style="padding: 8px 0;"><p style="color: #888; margin: 0; font-size: 12px; text-transform: uppercase;">Invoice Number</p><p style="color: #333; margin: 5px 0 0 0; font-size: 16px; font-weight: 600;">${orderId}</p></td><td style="text-align: right; padding: 8px 0;"><p style="color: #888; margin: 0; font-size: 12px; text-transform: uppercase;">Date</p><p style="color: #333; margin: 5px 0 0 0; font-size: 14px;">${orderDate}</p></td></tr></table><div style="border-top: 1px dashed #dee2e6; margin: 15px 0; padding-top: 15px;"><p style="color: #888; margin: 0 0 8px 0; font-size: 12px; text-transform: uppercase;">Bill To</p><p style="color: #333; margin: 0; font-size: 15px; font-weight: 500;">${customerName}</p><p style="color: #666; margin: 3px 0; font-size: 14px;">📧 ${customerEmail}</p><p style="color: #666; margin: 3px 0; font-size: 14px;">📱 ${customerPhone}</p>${fullAddress ? `<p style="color: #666; margin: 3px 0; font-size: 14px;">📍 ${fullAddress}</p>` : ''}</div><div style="background: white; border-radius: 8px; padding: 15px; border: 1px solid #e9ecef; margin-top: 15px;"><table style="width: 100%; border-collapse: collapse;"><tr style="border-bottom: 2px solid #667eea;"><th style="text-align: left; padding: 10px 0; color: #333; font-size: 13px;">Course</th><th style="text-align: right; padding: 10px 0; color: #333; font-size: 13px;">Amount</th></tr><tr><td style="padding: 15px 0; color: #333; font-size: 14px; font-weight: 500;">${courseName}</td><td style="padding: 15px 0; text-align: right; color: #333; font-size: 14px;">₹${originalAmount.toLocaleString('en-IN')}</td></tr>${discountAmount > 0 ? `<tr style="border-top: 1px solid #e9ecef;"><td style="padding: 10px 0; color: #28a745; font-size: 13px;">Discount ${couponApplied ? `(${couponApplied})` : ''}</td><td style="padding: 10px 0; text-align: right; color: #28a745; font-size: 13px;">-₹${discountAmountRs.toLocaleString('en-IN')}</td></tr>` : ''}<tr style="border-top: 2px solid #333;"><td style="padding: 15px 0; color: #333; font-size: 16px; font-weight: 700;">Total Amount</td><td style="padding: 15px 0; text-align: right; color: #667eea; font-size: 18px; font-weight: 700;">₹${finalAmount.toLocaleString('en-IN')}</td></tr></table></div></div><div style="background: linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%); padding: 20px; border-radius: 10px; margin-bottom: 25px;"><h4 style="color: #333; margin: 0 0 12px 0; font-size: 15px;">📋 What's Next?</h4><ul style="color: #555; margin: 0; padding-left: 20px; font-size: 13px; line-height: 1.8;"><li>Our team will contact you within 24 hours</li><li>Payment instructions will be shared via WhatsApp/Email</li><li>Course access provided immediately after payment</li><li>Lifetime access to all course materials included</li></ul></div><div style="text-align: center; padding: 20px 0; border-top: 1px solid #e9ecef;"><p style="color: #666; font-size: 13px; margin: 0 0 10px 0;">Questions? We're here to help!</p><p style="color: #667eea; font-size: 14px; margin: 0; font-weight: 500;">📧 info@bookmymentor.com</p></div></div><div style="background: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #e9ecef;"><p style="color: #667eea; font-weight: 600; margin: 0 0 5px 0; font-size: 14px;">🚀 Get ready to transform your career!</p><p style="color: #888; font-size: 12px; margin: 0;">Book My Mentor - Your Career Growth Partner</p></div></div></body></html>`;

    const adminEmailHtml = `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>New Order - Admin</title></head><body style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 650px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;"><div style="background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);"><div style="background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%); padding: 30px; text-align: center;"><h1 style="color: white; margin: 0; font-size: 24px;">🎯 New Order Received!</h1><p style="color: rgba(255,255,255,0.8); margin: 10px 0 0 0; font-size: 14px;">${orderDate}</p></div><div style="padding: 30px;"><div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 10px; padding: 20px; margin-bottom: 25px; color: white;"><table style="width: 100%;"><tr><td><p style="margin: 0; font-size: 12px; opacity: 0.9;">Order Value</p><p style="margin: 5px 0 0 0; font-size: 28px; font-weight: 700;">₹${finalAmount.toLocaleString('en-IN')}</p></td><td style="text-align: right;"><p style="margin: 0; font-size: 12px; opacity: 0.9;">Order ID</p><p style="margin: 5px 0 0 0; font-size: 16px; font-weight: 600;">${orderId}</p></td></tr></table></div><div style="background: #f8f9fa; border-radius: 10px; padding: 20px; margin-bottom: 20px; border-left: 4px solid #667eea;"><h3 style="color: #333; margin: 0 0 15px 0; font-size: 16px;">👤 Customer Details</h3><table style="width: 100%;"><tr><td style="padding: 8px 0; color: #888; font-size: 13px; width: 120px;">Name:</td><td style="padding: 8px 0; color: #333; font-size: 14px; font-weight: 500;">${customerName}</td></tr><tr><td style="padding: 8px 0; color: #888; font-size: 13px;">Email:</td><td style="padding: 8px 0; color: #333; font-size: 14px;">${customerEmail}</td></tr><tr><td style="padding: 8px 0; color: #888; font-size: 13px;">Phone:</td><td style="padding: 8px 0; color: #333; font-size: 14px;">${customerPhone}</td></tr>${fullAddress ? `<tr><td style="padding: 8px 0; color: #888; font-size: 13px;">Address:</td><td style="padding: 8px 0; color: #333; font-size: 14px;">${fullAddress}</td></tr>` : ''}</table></div><div style="background: #f8f9fa; border-radius: 10px; padding: 20px; margin-bottom: 20px; border-left: 4px solid #e74c3c;"><h3 style="color: #333; margin: 0 0 15px 0; font-size: 16px;">📦 Order Details</h3><table style="width: 100%;"><tr><td style="padding: 8px 0; color: #888; font-size: 13px; width: 120px;">Course:</td><td style="padding: 8px 0; color: #333; font-size: 14px; font-weight: 500;">${courseName}</td></tr><tr><td style="padding: 8px 0; color: #888; font-size: 13px;">Original Price:</td><td style="padding: 8px 0; color: #333; font-size: 14px;">₹${originalAmount.toLocaleString('en-IN')}</td></tr>${discountAmount > 0 ? `<tr><td style="padding: 8px 0; color: #888; font-size: 13px;">Coupon:</td><td style="padding: 8px 0; color: #28a745; font-size: 14px; font-weight: 500;">${couponApplied || 'Applied'}</td></tr><tr><td style="padding: 8px 0; color: #888; font-size: 13px;">Discount:</td><td style="padding: 8px 0; color: #28a745; font-size: 14px;">-₹${discountAmountRs.toLocaleString('en-IN')}</td></tr>` : ''}<tr style="border-top: 2px solid #dee2e6;"><td style="padding: 12px 0; color: #333; font-size: 15px; font-weight: 700;">Final Amount:</td><td style="padding: 12px 0; color: #e74c3c; font-size: 18px; font-weight: 700;">₹${finalAmount.toLocaleString('en-IN')}</td></tr></table></div><div style="background: linear-gradient(135deg, #f39c12 0%, #e67e22 100%); color: white; padding: 20px; border-radius: 10px;"><h4 style="margin: 0 0 10px 0; font-size: 15px;">⚡ Action Required</h4><p style="margin: 0; font-size: 13px; line-height: 1.6;">Please contact the customer within 24 hours for payment processing and course enrollment.</p></div></div><div style="background: #f8f9fa; padding: 15px; text-align: center; border-top: 1px solid #e9ecef;"><p style="color: #888; font-size: 12px; margin: 0;">Automated notification from Book My Mentor Order System</p></div></div></body></html>`;

    // Send both emails in parallel with retry
    const [customerResult, adminResult] = await Promise.all([
      sendEmailWithRetry({
        from: "Book My Mentor <support@bookmymentor.com>",
        to: [customerEmail],
        subject: `🎉 Order Invoice - ${courseName} (${orderId})`,
        html: customerEmailHtml,
      }),
      sendEmailWithRetry({
        from: "Book My Mentor <support@bookmymentor.com>",
        to: ["info@bookmymentor.com", "bookmymentor.org@gmail.com"],
        subject: `🎯 New Order: ${courseName} - ${customerName} (₹${finalAmount.toLocaleString('en-IN')})`,
        html: adminEmailHtml,
      }),
    ]);

    console.log("Emails sent successfully:", { customerResult, adminResult });

    return new Response(
      JSON.stringify({ success: true, customerEmailId: customerResult?.id, adminEmailId: adminResult?.id }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Error sending order confirmation emails:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
