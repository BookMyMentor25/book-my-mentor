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
    const { user_email, user_name, user_id, order_id, amount, plan } = await req.json();
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) throw new Error("RESEND_API_KEY not set");

    const claimedAt = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

    const adminHtml = `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px">
        <h2 style="color:#1a1a1a">Payment Claim Notification</h2>
        <p>A user has claimed payment for a subscription. Please verify the transaction.</p>
        <div style="background:#f8f9fa;border:1px solid #e2e8f0;border-radius:8px;padding:20px;margin:16px 0">
          <p><strong>User Name:</strong> ${user_name}</p>
          <p><strong>User Email:</strong> ${user_email}</p>
          <p><strong>User ID:</strong> ${user_id}</p>
          <p><strong>Plan:</strong> ${plan}</p>
          <p><strong>Amount:</strong> ₹${amount}</p>
          <p><strong>UPI Transaction ID:</strong> ${order_id}</p>
          <p><strong>Claimed At:</strong> ${claimedAt}</p>
        </div>
        <p style="color:#e53e3e;font-weight:bold">⚠️ Please verify this transaction in your UPI app before confirming.</p>
        <p style="font-size:13px;color:#888">If payment is not received, you can block this user from the Admin Dashboard → Subscriptions tab.</p>
      </div>`;

    const userHtml = `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px">
        <h2 style="color:#1a1a1a">Hi ${user_name},</h2>
        <p>We’ve received your Jobs & Internships subscription payment request.</p>
        <div style="background:#f8f9fa;border:1px solid #e2e8f0;border-radius:8px;padding:20px;margin:16px 0">
          <p><strong>Plan:</strong> ${plan}</p>
          <p><strong>Amount:</strong> ₹${amount}</p>
          <p><strong>UPI Transaction ID:</strong> ${order_id}</p>
          <p><strong>Submitted At:</strong> ${claimedAt}</p>
        </div>
        <p>Our team will verify your payment and activate your subscription shortly.</p>
        <p style="font-size:13px;color:#888">For support, reply to this email or contact info@bookmymentor.com.</p>
      </div>`;

    const adminRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${RESEND_API_KEY}` },
      body: JSON.stringify({
        from: "BookMyMentor <support@bookmymentor.com>",
        to: ["info@bookmymentor.com", "bookmymentor.org@gmail.com"],
        subject: `🔔 Payment Claimed: ${user_name} — ${plan}`,
        html: adminHtml,
      }),
    });

    if (!adminRes.ok) {
      const err = await adminRes.text();
      throw new Error(`Resend error: ${err}`);
    }

    const userRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${RESEND_API_KEY}` },
      body: JSON.stringify({
        from: "BookMyMentor <support@bookmymentor.com>",
        to: [user_email],
        subject: `✅ Payment Request Received — ${plan}`,
        html: userHtml,
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
