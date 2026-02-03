import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface InquiryNotificationRequest {
  name: string;
  email: string;
  phone?: string;
  message: string;
  course_interest?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      name, 
      email, 
      phone,
      message,
      course_interest
    }: InquiryNotificationRequest = await req.json();

    console.log('Processing inquiry notification for:', { name, email, phone });

    const inquiryDate = new Date().toLocaleDateString('en-IN', { 
      day: '2-digit', 
      month: 'long', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    // Acknowledgement email for customer
    const customerEmailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Thank You - Book My Mentor</title>
      </head>
      <body style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 650px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
        <div style="background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 35px 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 26px; font-weight: 600;">Thank You for Reaching Out!</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 14px;">We've received your message</p>
          </div>
          
          <!-- Content -->
          <div style="padding: 30px;">
            <h2 style="color: #333; margin: 0 0 5px 0; font-size: 20px;">Hello ${name}! 👋</h2>
            <p style="color: #666; margin: 0 0 25px 0; font-size: 14px; line-height: 1.6;">
              Thank you for contacting Book My Mentor. We have received your inquiry and our team will get back to you within 24 hours.
            </p>
            
            <!-- Inquiry Summary -->
            <div style="background: #f8f9fa; border-radius: 10px; padding: 25px; margin-bottom: 25px; border: 1px solid #e9ecef;">
              <h3 style="color: #333; margin: 0 0 15px 0; font-size: 16px;">Your Inquiry Summary</h3>
              
              <div style="margin-bottom: 15px;">
                <p style="color: #888; margin: 0; font-size: 12px; text-transform: uppercase;">Submitted On</p>
                <p style="color: #333; margin: 5px 0 0 0; font-size: 14px;">${inquiryDate}</p>
              </div>
              
              ${course_interest ? `
              <div style="margin-bottom: 15px;">
                <p style="color: #888; margin: 0; font-size: 12px; text-transform: uppercase;">Course Interest</p>
                <p style="color: #667eea; margin: 5px 0 0 0; font-size: 14px; font-weight: 500;">${course_interest.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
              </div>
              ` : ''}
              
              <div>
                <p style="color: #888; margin: 0; font-size: 12px; text-transform: uppercase;">Your Message</p>
                <p style="color: #333; margin: 5px 0 0 0; font-size: 14px; line-height: 1.6; background: white; padding: 15px; border-radius: 8px; border: 1px solid #e9ecef;">${message}</p>
              </div>
            </div>
            
            <!-- What's Next -->
            <div style="background: linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%); padding: 20px; border-radius: 10px; margin-bottom: 25px;">
              <h4 style="color: #333; margin: 0 0 12px 0; font-size: 15px;">📋 What Happens Next?</h4>
              <ul style="color: #555; margin: 0; padding-left: 20px; font-size: 13px; line-height: 1.8;">
                <li>Our team will review your inquiry</li>
                <li>You'll receive a response within 24 hours</li>
                <li>We may call or WhatsApp you for more details</li>
                <li>Free consultation available if needed</li>
              </ul>
            </div>
            
            <!-- CTA -->
            <div style="text-align: center; margin-bottom: 25px;">
              <a href="https://book-my-mentor.lovable.app/#courses" 
                 style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; padding: 14px 35px; border-radius: 8px; font-weight: 600; font-size: 14px;">
                Explore Our Courses
              </a>
            </div>
            
            <!-- Support -->
            <div style="text-align: center; padding: 20px 0; border-top: 1px solid #e9ecef;">
              <p style="color: #666; font-size: 13px; margin: 0 0 10px 0;">Need immediate assistance?</p>
              <p style="color: #333; font-size: 14px; margin: 0;">
                📞 <a href="tel:+918275513895" style="color: #667eea; text-decoration: none;">+91 8275513895</a>
                &nbsp;&nbsp;|&nbsp;&nbsp;
                📧 <a href="mailto:info@bookmymentor.com" style="color: #667eea; text-decoration: none;">info@bookmymentor.com</a>
              </p>
            </div>
          </div>
          
          <!-- Footer -->
          <div style="background: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #e9ecef;">
            <p style="color: #667eea; font-weight: 600; margin: 0 0 5px 0; font-size: 14px;">Book My Mentor</p>
            <p style="color: #888; font-size: 12px; margin: 0;">Your Career Growth Partner</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Admin notification email
    const adminEmailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Inquiry - Admin Notification</title>
      </head>
      <body style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 650px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
        <div style="background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">📩 New Contact Inquiry</h1>
            <p style="color: rgba(255,255,255,0.8); margin: 10px 0 0 0; font-size: 14px;">${inquiryDate}</p>
          </div>
          
          <!-- Content -->
          <div style="padding: 30px;">
            <!-- Contact Details -->
            <div style="background: #f8f9fa; border-radius: 10px; padding: 20px; margin-bottom: 20px; border-left: 4px solid #667eea;">
              <h3 style="color: #333; margin: 0 0 15px 0; font-size: 16px;">👤 Contact Details</h3>
              <table style="width: 100%;">
                <tr>
                  <td style="padding: 8px 0; color: #888; font-size: 13px; width: 120px;">Name:</td>
                  <td style="padding: 8px 0; color: #333; font-size: 14px; font-weight: 500;">${name}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #888; font-size: 13px;">Email:</td>
                  <td style="padding: 8px 0; color: #333; font-size: 14px;"><a href="mailto:${email}" style="color: #667eea;">${email}</a></td>
                </tr>
                ${phone ? `
                <tr>
                  <td style="padding: 8px 0; color: #888; font-size: 13px;">Phone:</td>
                  <td style="padding: 8px 0; color: #333; font-size: 14px;"><a href="tel:${phone}" style="color: #667eea;">${phone}</a></td>
                </tr>
                ` : ''}
                ${course_interest ? `
                <tr>
                  <td style="padding: 8px 0; color: #888; font-size: 13px;">Course Interest:</td>
                  <td style="padding: 8px 0; color: #667eea; font-size: 14px; font-weight: 500;">${course_interest.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</td>
                </tr>
                ` : ''}
              </table>
            </div>
            
            <!-- Message -->
            <div style="background: #f8f9fa; border-radius: 10px; padding: 20px; margin-bottom: 20px; border-left: 4px solid #e74c3c;">
              <h3 style="color: #333; margin: 0 0 15px 0; font-size: 16px;">💬 Message</h3>
              <p style="color: #333; margin: 0; font-size: 14px; line-height: 1.6; background: white; padding: 15px; border-radius: 8px; border: 1px solid #e9ecef;">${message}</p>
            </div>
            
            <!-- Quick Actions -->
            <div style="display: flex; gap: 10px; margin-bottom: 20px;">
              <a href="mailto:${email}" 
                 style="flex: 1; display: block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; padding: 12px; border-radius: 8px; font-weight: 500; font-size: 13px; text-align: center;">
                Reply via Email
              </a>
              ${phone ? `
              <a href="https://wa.me/${phone.replace(/\D/g, '')}" 
                 style="flex: 1; display: block; background: linear-gradient(135deg, #25D366 0%, #128C7E 100%); color: white; text-decoration: none; padding: 12px; border-radius: 8px; font-weight: 500; font-size: 13px; text-align: center;">
                WhatsApp
              </a>
              ` : ''}
            </div>
            
            <!-- Action Required -->
            <div style="background: linear-gradient(135deg, #f39c12 0%, #e67e22 100%); color: white; padding: 20px; border-radius: 10px;">
              <h4 style="margin: 0 0 10px 0; font-size: 15px;">⚡ Action Required</h4>
              <p style="margin: 0; font-size: 13px; line-height: 1.6;">Please respond to this inquiry within 24 hours. Check the admin dashboard for full inquiry history.</p>
            </div>
          </div>
          
          <!-- Footer -->
          <div style="background: #f8f9fa; padding: 15px; text-align: center; border-top: 1px solid #e9ecef;">
            <p style="color: #888; font-size: 12px; margin: 0;">This is an automated notification from Book My Mentor</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send acknowledgement email to customer
    const customerEmailResponse = await resend.emails.send({
      from: "Book My Mentor <support@bookmymentor.com>",
      to: [email],
      subject: `Thank You for Contacting Us, ${name}! - Book My Mentor`,
      html: customerEmailHtml,
    });

    console.log("Customer acknowledgement email sent:", customerEmailResponse);

    // Send notification email to admin
    const adminEmailResponse = await resend.emails.send({
      from: "Book My Mentor <support@bookmymentor.com>",
      to: ["info@bookmymentor.com", "bookmymentor.org@gmail.com"],
      subject: `📩 New Inquiry: ${name}${course_interest ? ` - ${course_interest}` : ''}`,
      html: adminEmailHtml,
    });

    console.log("Admin notification email sent:", adminEmailResponse);

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
    console.error("Error sending inquiry notification emails:", error);
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
