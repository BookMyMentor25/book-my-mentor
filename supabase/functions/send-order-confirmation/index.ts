import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
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
      customerPhone,
      courseName, 
      orderAmount, 
      discountAmount = 0,
      couponApplied,
      address,
      city,
      state,
      pincode
    }: OrderConfirmationRequest = await req.json();

    console.log('Processing order confirmation for:', { orderId, customerEmail, customerName, customerPhone });

    const finalAmount = (orderAmount - discountAmount) / 100; // Convert from paise to rupees
    const originalAmount = orderAmount / 100;
    const discountAmountRs = discountAmount / 100;
    const orderDate = new Date().toLocaleDateString('en-IN', { 
      day: '2-digit', 
      month: 'long', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    // Build address string
    const fullAddress = [address, city, state, pincode].filter(Boolean).join(', ');

    // Invoice HTML for customer
    const customerEmailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Invoice - Book My Mentor</title>
      </head>
      <body style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 650px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
        <div style="background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 35px 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 26px; font-weight: 600;">📄 Order Invoice</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 14px;">Thank you for enrolling with Book My Mentor!</p>
          </div>
          
          <!-- Content -->
          <div style="padding: 30px;">
            <h2 style="color: #333; margin: 0 0 5px 0; font-size: 20px;">Hello ${customerName}! 🎉</h2>
            <p style="color: #666; margin: 0 0 25px 0; font-size: 14px;">Your order has been successfully placed.</p>
            
            <!-- Invoice Details Box -->
            <div style="background: #f8f9fa; border-radius: 10px; padding: 25px; margin-bottom: 25px; border: 1px solid #e9ecef;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px dashed #dee2e6;">
                <div>
                  <p style="color: #888; margin: 0; font-size: 12px; text-transform: uppercase;">Invoice Number</p>
                  <p style="color: #333; margin: 5px 0 0 0; font-size: 16px; font-weight: 600;">${orderId}</p>
                </div>
                <div style="text-align: right;">
                  <p style="color: #888; margin: 0; font-size: 12px; text-transform: uppercase;">Date</p>
                  <p style="color: #333; margin: 5px 0 0 0; font-size: 14px;">${orderDate}</p>
                </div>
              </div>
              
              <!-- Customer Details -->
              <div style="margin-bottom: 20px;">
                <p style="color: #888; margin: 0 0 8px 0; font-size: 12px; text-transform: uppercase;">Bill To</p>
                <p style="color: #333; margin: 0; font-size: 15px; font-weight: 500;">${customerName}</p>
                <p style="color: #666; margin: 3px 0; font-size: 14px;">📧 ${customerEmail}</p>
                <p style="color: #666; margin: 3px 0; font-size: 14px;">📱 ${customerPhone}</p>
                ${fullAddress ? `<p style="color: #666; margin: 3px 0; font-size: 14px;">📍 ${fullAddress}</p>` : ''}
              </div>
              
              <!-- Course Details -->
              <div style="background: white; border-radius: 8px; padding: 15px; border: 1px solid #e9ecef;">
                <table style="width: 100%; border-collapse: collapse;">
                  <thead>
                    <tr style="border-bottom: 2px solid #667eea;">
                      <th style="text-align: left; padding: 10px 0; color: #333; font-size: 13px;">Course</th>
                      <th style="text-align: right; padding: 10px 0; color: #333; font-size: 13px;">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style="padding: 15px 0; color: #333; font-size: 14px; font-weight: 500;">${courseName}</td>
                      <td style="padding: 15px 0; text-align: right; color: #333; font-size: 14px;">₹${originalAmount.toLocaleString('en-IN')}</td>
                    </tr>
                    ${discountAmount > 0 ? `
                    <tr style="border-top: 1px solid #e9ecef;">
                      <td style="padding: 10px 0; color: #28a745; font-size: 13px;">
                        Discount ${couponApplied ? `(${couponApplied})` : ''}
                      </td>
                      <td style="padding: 10px 0; text-align: right; color: #28a745; font-size: 13px;">-₹${discountAmountRs.toLocaleString('en-IN')}</td>
                    </tr>
                    ` : ''}
                    <tr style="border-top: 2px solid #333;">
                      <td style="padding: 15px 0; color: #333; font-size: 16px; font-weight: 700;">Total Amount</td>
                      <td style="padding: 15px 0; text-align: right; color: #667eea; font-size: 18px; font-weight: 700;">₹${finalAmount.toLocaleString('en-IN')}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            
            <!-- What's Next -->
            <div style="background: linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%); padding: 20px; border-radius: 10px; margin-bottom: 25px;">
              <h4 style="color: #333; margin: 0 0 12px 0; font-size: 15px;">📋 What's Next?</h4>
              <ul style="color: #555; margin: 0; padding-left: 20px; font-size: 13px; line-height: 1.8;">
                <li>Our team will contact you within 24 hours</li>
                <li>Payment instructions will be shared via WhatsApp/Email</li>
                <li>Course access provided immediately after payment</li>
                <li>Lifetime access to all course materials included</li>
              </ul>
            </div>
            
            <!-- Support -->
            <div style="text-align: center; padding: 20px 0; border-top: 1px solid #e9ecef;">
              <p style="color: #666; font-size: 13px; margin: 0 0 10px 0;">Questions? We're here to help!</p>
              <p style="color: #667eea; font-size: 14px; margin: 0; font-weight: 500;">📧 support@bookmymentor.com</p>
            </div>
          </div>
          
          <!-- Footer -->
          <div style="background: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #e9ecef;">
            <p style="color: #667eea; font-weight: 600; margin: 0 0 5px 0; font-size: 14px;">🚀 Get ready to transform your career!</p>
            <p style="color: #888; font-size: 12px; margin: 0;">Book My Mentor - Your Career Growth Partner</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Invoice HTML for admin
    const adminEmailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Order - Admin Copy</title>
      </head>
      <body style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 650px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
        <div style="background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">🎯 New Order Received!</h1>
            <p style="color: rgba(255,255,255,0.8); margin: 10px 0 0 0; font-size: 14px;">${orderDate}</p>
          </div>
          
          <!-- Content -->
          <div style="padding: 30px;">
            <!-- Quick Summary -->
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 10px; padding: 20px; margin-bottom: 25px; color: white;">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                  <p style="margin: 0; font-size: 12px; opacity: 0.9;">Order Value</p>
                  <p style="margin: 5px 0 0 0; font-size: 28px; font-weight: 700;">₹${finalAmount.toLocaleString('en-IN')}</p>
                </div>
                <div style="text-align: right;">
                  <p style="margin: 0; font-size: 12px; opacity: 0.9;">Order ID</p>
                  <p style="margin: 5px 0 0 0; font-size: 16px; font-weight: 600;">${orderId}</p>
                </div>
              </div>
            </div>
            
            <!-- Customer Details -->
            <div style="background: #f8f9fa; border-radius: 10px; padding: 20px; margin-bottom: 20px; border-left: 4px solid #667eea;">
              <h3 style="color: #333; margin: 0 0 15px 0; font-size: 16px;">👤 Customer Details</h3>
              <table style="width: 100%;">
                <tr>
                  <td style="padding: 8px 0; color: #888; font-size: 13px; width: 120px;">Name:</td>
                  <td style="padding: 8px 0; color: #333; font-size: 14px; font-weight: 500;">${customerName}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #888; font-size: 13px;">Email:</td>
                  <td style="padding: 8px 0; color: #333; font-size: 14px;"><a href="mailto:${customerEmail}" style="color: #667eea;">${customerEmail}</a></td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #888; font-size: 13px;">Phone:</td>
                  <td style="padding: 8px 0; color: #333; font-size: 14px;"><a href="tel:${customerPhone}" style="color: #667eea;">${customerPhone}</a></td>
                </tr>
                ${fullAddress ? `
                <tr>
                  <td style="padding: 8px 0; color: #888; font-size: 13px;">Address:</td>
                  <td style="padding: 8px 0; color: #333; font-size: 14px;">${fullAddress}</td>
                </tr>
                ` : ''}
              </table>
            </div>
            
            <!-- Order Details -->
            <div style="background: #f8f9fa; border-radius: 10px; padding: 20px; margin-bottom: 20px; border-left: 4px solid #e74c3c;">
              <h3 style="color: #333; margin: 0 0 15px 0; font-size: 16px;">📦 Order Details</h3>
              <table style="width: 100%;">
                <tr>
                  <td style="padding: 8px 0; color: #888; font-size: 13px; width: 120px;">Course:</td>
                  <td style="padding: 8px 0; color: #333; font-size: 14px; font-weight: 500;">${courseName}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #888; font-size: 13px;">Original Price:</td>
                  <td style="padding: 8px 0; color: #333; font-size: 14px;">₹${originalAmount.toLocaleString('en-IN')}</td>
                </tr>
                ${discountAmount > 0 ? `
                <tr>
                  <td style="padding: 8px 0; color: #888; font-size: 13px;">Coupon:</td>
                  <td style="padding: 8px 0; color: #28a745; font-size: 14px; font-weight: 500;">${couponApplied || 'Applied'}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #888; font-size: 13px;">Discount:</td>
                  <td style="padding: 8px 0; color: #28a745; font-size: 14px;">-₹${discountAmountRs.toLocaleString('en-IN')}</td>
                </tr>
                ` : ''}
                <tr style="border-top: 2px solid #dee2e6;">
                  <td style="padding: 12px 0; color: #333; font-size: 15px; font-weight: 700;">Final Amount:</td>
                  <td style="padding: 12px 0; color: #e74c3c; font-size: 18px; font-weight: 700;">₹${finalAmount.toLocaleString('en-IN')}</td>
                </tr>
              </table>
            </div>
            
            <!-- Action Required -->
            <div style="background: linear-gradient(135deg, #f39c12 0%, #e67e22 100%); color: white; padding: 20px; border-radius: 10px;">
              <h4 style="margin: 0 0 10px 0; font-size: 15px;">⚡ Action Required</h4>
              <p style="margin: 0; font-size: 13px; line-height: 1.6;">Please contact the customer within 24 hours for payment processing and course enrollment.</p>
            </div>
          </div>
          
          <!-- Footer -->
          <div style="background: #f8f9fa; padding: 15px; text-align: center; border-top: 1px solid #e9ecef;">
            <p style="color: #888; font-size: 12px; margin: 0;">This is an automated notification from Book My Mentor Order System</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send email to customer from support@bookmymentor.com
    const customerEmailResponse = await resend.emails.send({
      from: "Book My Mentor <support@bookmymentor.com>",
      to: [customerEmail],
      subject: `🎉 Order Invoice - ${courseName} (${orderId})`,
      html: customerEmailHtml,
    });

    console.log("Customer email sent:", customerEmailResponse);

    // Send email to admin - both info@bookmymentor.com and bookmymentor.org@gmail.com
    const adminEmailResponse = await resend.emails.send({
      from: "Book My Mentor <support@bookmymentor.com>",
      to: ["info@bookmymentor.com", "bookmymentor.org@gmail.com"],
      subject: `🎯 New Order: ${courseName} - ${customerName} (₹${finalAmount.toLocaleString('en-IN')})`,
      html: adminEmailHtml,
    });

    console.log("Admin email sent to both addresses:", adminEmailResponse);

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
