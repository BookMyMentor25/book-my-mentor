import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { user_name, user_email, job_title, company_name } = await req.json();
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

    if (!RESEND_API_KEY) {
      console.error("RESEND_API_KEY not configured");
      return new Response(JSON.stringify({ error: "Email not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const emailBody = `
      <h2>Resume Builder Used</h2>
      <p><strong>User:</strong> ${user_name || 'N/A'}</p>
      <p><strong>Email:</strong> ${user_email || 'N/A'}</p>
      <p><strong>Job Title:</strong> ${job_title || 'N/A'}</p>
      <p><strong>Company:</strong> ${company_name || 'N/A'}</p>
      <p><strong>Time:</strong> ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
    `;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "BookMyMentor <onboarding@resend.dev>",
        to: ["bookmymentor.org@gmail.com"],
        subject: `Resume Builder Used: ${job_title} at ${company_name}`,
        html: emailBody,
      }),
    });

    const result = await res.json();
    console.log("Email sent:", result);

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Notification error:", error);
    return new Response(JSON.stringify({ error: "Failed to send notification" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
