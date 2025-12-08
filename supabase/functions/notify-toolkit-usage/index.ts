import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ToolkitUsageRequest {
  userName: string;
  userEmail: string;
  toolName: string;
  toolId: string;
  prompt?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userName, userEmail, toolName, toolId, prompt }: ToolkitUsageRequest = await req.json();

    console.log("Sending toolkit usage notification for:", userEmail, toolName);

    const currentDate = new Date().toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      dateStyle: 'full',
      timeStyle: 'medium'
    });

    // Send notification to admin
    const emailResponse = await resend.emails.send({
      from: "BookMyMentor <support@bookmymentor.com>",
      to: ["bookmymentor.org@gmail.com"],
      subject: `Business Toolkit Usage - ${toolName}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; }
            .container { max-width: 600px; margin: 20px auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #9333ea 0%, #db2777 100%); color: white; padding: 30px; text-align: center; }
            .header h1 { margin: 0; font-size: 24px; }
            .content { padding: 30px; }
            .info-box { background: #f8f9fa; border-radius: 8px; padding: 20px; margin: 20px 0; }
            .info-row { display: flex; padding: 10px 0; border-bottom: 1px solid #e9ecef; }
            .info-row:last-child { border-bottom: none; }
            .info-label { font-weight: 600; color: #6b7280; width: 140px; }
            .info-value { color: #1f2937; flex: 1; }
            .highlight { background: linear-gradient(135deg, #9333ea 0%, #db2777 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-weight: 700; }
            .prompt-box { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin-top: 20px; border-radius: 0 8px 8px 0; }
            .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #6b7280; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🛠️ Business Toolkit Usage Alert</h1>
            </div>
            <div class="content">
              <p>A user has accessed the <span class="highlight">Business Toolkit</span>. Here are the details:</p>
              
              <div class="info-box">
                <div class="info-row">
                  <span class="info-label">User Name:</span>
                  <span class="info-value">${userName || 'N/A'}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Email:</span>
                  <span class="info-value">${userEmail}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Tool Used:</span>
                  <span class="info-value"><strong>${toolName}</strong></span>
                </div>
                <div class="info-row">
                  <span class="info-label">Tool ID:</span>
                  <span class="info-value">${toolId}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Date & Time:</span>
                  <span class="info-value">${currentDate}</span>
                </div>
              </div>

              ${prompt ? `
              <div class="prompt-box">
                <strong>User Prompt:</strong><br/>
                <p style="margin: 10px 0 0 0;">${prompt}</p>
              </div>
              ` : ''}
            </div>
            <div class="footer">
              <p>This is an automated notification from BookMyMentor Business Toolkit</p>
              <p>© ${new Date().getFullYear()} BookMyMentor. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log("Admin notification sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in notify-toolkit-usage function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
