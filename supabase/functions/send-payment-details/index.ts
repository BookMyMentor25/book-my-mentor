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
    const { user_email, user_name, plan, amount, duration } = await req.json();
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) throw new Error("RESEND_API_KEY not set");

    // Send to the user
    const userRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${RESEND_API_KEY}` },
      body: JSON.stringify({
        from: "BookMyMentor <support@bookmymentor.com>",
        to: [user_email],
        subject: `Payment Details for ${plan} — BookMyMentor`,
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px">
            <h2 style="color:#1a1a1a">Hi ${user_name},</h2>
            <p>Thank you for choosing <strong>BookMyMentor</strong>! Here are your payment details:</p>
            <div style="background:#f8f9fa;border:1px solid #e2e8f0;border-radius:8px;padding:20px;margin:16px 0">
              <p><strong>Plan:</strong> ${plan}</p>
              <p><strong>Amount:</strong> ₹${amount}</p>
              <p><strong>Duration:</strong> ${duration}</p>
              <p style="margin-top:12px"><strong>How to Pay:</strong></p>
              <ol style="font-size:14px;color:#555">
                <li>Open any UPI app (GPay, PhonePe, Paytm)</li>
                <li>Scan the QR code on our subscription page or search for our UPI</li>
                <li>Pay ₹${amount}</li>
                <li>Copy the Transaction ID and paste it on the subscription page</li>
              </ol>
              <p style="margin-top:12px"><a href="https://book-my-mentor.lovable.app/jobs/subscribe" style="color:#6366f1;font-weight:bold">→ Complete Payment Here</a></p>
            </div>
            <p style="font-size:13px;color:#888">For support, reply to this email or contact support@bookmymentor.com</p>
          </div>`,
      }),
    });

    if (!userRes.ok) {
      const err = await userRes.text();
      throw new Error(`Resend error: ${err}`);
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
