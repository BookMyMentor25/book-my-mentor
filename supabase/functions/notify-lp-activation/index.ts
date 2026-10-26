import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

const esc = (s: string) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
const json = (b: unknown, status = 200) => new Response(JSON.stringify(b), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

// 60-30-10 system: deep purple/magenta primary (60%), neutral grays (30%), warm orange accent (10%)
const PRIMARY = "#7c3aed";
const PRIMARY_DARK = "#c026a7";
const ACCENT = "#f97316";
const NEUTRAL_BG = "#f6f6f8";
const TEXT = "#26262e";
const MUTED = "#75747f";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const auth = req.headers.get("Authorization") || "";
    const url = Deno.env.get("SUPABASE_URL")!;
    const userClient = createClient(url, Deno.env.get("SUPABASE_ANON_KEY")!, { global: { headers: { Authorization: auth } } });
    const { data: { user } } = await userClient.auth.getUser();
    if (!user) return json({ error: "Unauthorized" }, 401);

    // Only admins may trigger this email
    const admin = createClient(url, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const { data: isAdmin } = await admin.from("admin_users").select("user_id").eq("user_id", user.id).maybeSingle();
    if (!isAdmin) return json({ error: "Forbidden" }, 403);

    const body = await req.json().catch(() => ({}));
    const id = typeof body.subscription_id === "string" && /^[0-9a-f-]{36}$/i.test(body.subscription_id) ? body.subscription_id : null;
    if (!id) return json({ error: "Invalid subscription_id" }, 400);

    const { data: sub } = await admin.from("live_project_subscriptions").select("*").eq("id", id).maybeSingle();
    if (!sub) return json({ error: "Not found" }, 404);
    if (sub.status !== "active") return json({ error: "Subscription is not active" }, 400);

    const { data: codeRow } = await admin.from("live_project_access_codes").select("code").eq("user_id", sub.user_id).maybeSingle();
    const code = codeRow?.code || "";
    if (!code) return json({ error: "No Project Accessible Code found for this member" }, 400);

    const RESEND = Deno.env.get("RESEND_API_KEY");
    if (!RESEND) throw new Error("RESEND_API_KEY not set");

    const startDate = sub.starts_at ? new Date(sub.starts_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Kolkata" }) : "today";
    const boardUrl = "https://bookmymentor.com/live-projects";

    const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Payment received — Your Live Projects plan is active</title>
<style>
  @media only screen and (max-width: 620px) {
    .container { width: 100% !important; border-radius: 0 !important; }
    .px { padding-left: 20px !important; padding-right: 20px !important; }
    .code { font-size: 20px !important; letter-spacing: 1px !important; }
    .h1 { font-size: 22px !important; }
  }
</style>
</head>
<body style="margin:0;padding:0;background:${NEUTRAL_BG};font-family:'Segoe UI',Helvetica,Arial,sans-serif;color:${TEXT};">
  <div style="display:none;font-size:1px;color:${NEUTRAL_BG};max-height:0;overflow:hidden;">Your Live Projects plan is active. Here is your Project Accessible Code.</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${NEUTRAL_BG};padding:24px 12px;">
    <tr><td align="center">
      <table role="presentation" class="container" width="600" cellpadding="0" cellspacing="0" style="width:600px;max-width:600px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(38,38,46,0.08);">
        <!-- Header: primary 60% -->
        <tr><td class="px" style="padding:28px 32px;background:linear-gradient(135deg,${PRIMARY} 0%,${PRIMARY_DARK} 100%);text-align:center;">
          <div style="font-size:20px;font-weight:700;color:#ffffff;letter-spacing:0.5px;">Book My Mentor</div>
          <div style="font-size:13px;color:rgba(255,255,255,0.85);margin-top:4px;">Live Projects Program</div>
        </td></tr>
        <!-- Hero -->
        <tr><td class="px" style="padding:32px 40px 8px;text-align:center;">
          <div style="display:inline-block;background:rgba(249,115,22,0.12);color:${ACCENT};font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase;padding:6px 14px;border-radius:999px;">Payment received</div>
          <h1 class="h1" style="margin:14px 0 0;font-size:26px;line-height:1.3;color:${TEXT};">You're in, ${esc(sub.full_name)}! Your Live Projects plan is now <span style="color:${PRIMARY};">active</span>.</h1>
        </td></tr>
        <!-- Body: neutral 30% -->
        <tr><td class="px" style="padding:16px 40px 0;">
          <p style="margin:0 0 14px;font-size:15px;line-height:1.618;color:${TEXT};">
            We've received your payment of <strong>₹2,999</strong> for the Live Projects plan. Your membership started on <strong>${startDate}</strong> and is valid for <strong>3 months</strong>.
          </p>
          <p style="margin:0 0 20px;font-size:15px;line-height:1.618;color:${TEXT};">
            You can now register for the Live Projects on our board and start applying. <strong>Project Orientation details will be conveyed to you soon</strong> on this email.
          </p>
        </td></tr>
        <!-- Code card -->
        <tr><td class="px" style="padding:0 40px 8px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#faf9fd;border:2px dashed ${PRIMARY};border-radius:12px;">
            <tr><td style="padding:20px;text-align:center;">
              <div style="font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:${MUTED};margin-bottom:8px;">Your Project Accessible Code</div>
              <div class="code" style="font-size:26px;font-weight:800;letter-spacing:3px;color:${PRIMARY};font-family:'Courier New',monospace;">${esc(code)}</div>
              <div style="font-size:12px;color:${MUTED};margin-top:10px;line-height:1.5;">Works only on your own registered account (${esc(sub.email)}). Please keep it private — sharing or misuse leads to cancellation without refund.</div>
            </td></tr>
          </table>
        </td></tr>
        <!-- CTA: accent 10% -->
        <tr><td class="px" style="padding:20px 40px 4px;text-align:center;">
          <a href="${boardUrl}" style="display:inline-block;background:${ACCENT};color:#ffffff;font-size:15px;font-weight:700;text-decoration:none;padding:14px 32px;border-radius:999px;">Register for Live Projects →</a>
        </td></tr>
        <!-- What happens next -->
        <tr><td class="px" style="padding:20px 40px 0;">
          <div style="font-size:14px;font-weight:700;color:${TEXT};margin-bottom:10px;">What happens next</div>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;line-height:1.618;color:${TEXT};">
            <tr><td style="padding:6px 0;vertical-align:top;width:28px;color:${PRIMARY};font-weight:700;">1.</td><td style="padding:6px 0;">Enter your Project Accessible Code on the Live Projects board to unlock complete company details.</td></tr>
            <tr><td style="padding:6px 0;vertical-align:top;color:${PRIMARY};font-weight:700;">2.</td><td style="padding:6px 0;">Apply to the Live Projects that match your skills and interests.</td></tr>
            <tr><td style="padding:6px 0;vertical-align:top;color:${PRIMARY};font-weight:700;">3.</td><td style="padding:6px 0;">Watch this inbox — your Project Orientation details are on their way.</td></tr>
          </table>
          <p style="margin:16px 0 0;font-size:13px;color:${MUTED};line-height:1.5;">
            On completion you'll receive your Offer Letter, a Live Project Completion Certificate and CV Pointers Approval.
          </p>
        </td></tr>
        <!-- Footer -->
        <tr><td class="px" style="padding:24px 40px 32px;">
          <div style="border-top:1px solid #e8e8ee;padding-top:16px;font-size:12px;color:${MUTED};line-height:1.6;text-align:center;">
            Questions? Reply to this email or write to <a href="mailto:info@bookmymentor.com" style="color:${PRIMARY};text-decoration:none;">info@bookmymentor.com</a>.<br/>
            © 2026 Book My Mentor. All rights reserved.
          </div>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

    const send = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${RESEND}` },
      body: JSON.stringify({
        from: "Book My Mentor <support@bookmymentor.com>",
        reply_to: "info@bookmymentor.com",
        to: [sub.email],
        subject: "Payment received — Your Live Projects plan is active",
        html,
      }),
    });
    if (!send.ok) throw new Error(`Resend error: ${await send.text()}`);

    return json({ success: true, code });
  } catch (e) {
    console.error(e);
    return json({ error: (e as Error).message }, 500);
  }
});
