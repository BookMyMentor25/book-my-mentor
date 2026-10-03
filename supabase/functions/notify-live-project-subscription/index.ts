import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

const esc = (s: string) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
const json = (b: unknown, status = 200) => new Response(JSON.stringify(b), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const auth = req.headers.get("Authorization") || "";
    const url = Deno.env.get("SUPABASE_URL")!;
    const userClient = createClient(url, Deno.env.get("SUPABASE_ANON_KEY")!, { global: { headers: { Authorization: auth } } });
    const { data: { user } } = await userClient.auth.getUser();
    if (!user) return json({ error: "Unauthorized" }, 401);

    const body = await req.json().catch(() => ({}));
    const id = typeof body.subscription_id === "string" && /^[0-9a-f-]{36}$/i.test(body.subscription_id) ? body.subscription_id : null;
    if (!id) return json({ error: "Invalid subscription_id" }, 400);

    const admin = createClient(url, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const { data: sub } = await admin.from("live_project_subscriptions").select("*").eq("id", id).eq("user_id", user.id).maybeSingle();
    if (!sub) return json({ error: "Not found" }, 404);
    const { data: code } = await admin.from("live_project_access_codes").select("code").eq("user_id", user.id).maybeSingle();

    const RESEND = Deno.env.get("RESEND_API_KEY");
    if (!RESEND) throw new Error("RESEND_API_KEY not set");
    const at = new Date(sub.created_at).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });

    const adminHtml = `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px">
      <h2>New Live Projects subscription order</h2>
      <p>Please check Live Project slot availability. If slots are available, email payment details (₹2,999) to the member. Share the Project Accessible Code only after payment is confirmed.</p>
      <div style="background:#f8f9fa;border:1px solid #e2e8f0;border-radius:8px;padding:20px">
        <p><strong>Name:</strong> ${esc(sub.full_name)}</p>
        <p><strong>Email:</strong> ${esc(sub.email)}</p>
        <p><strong>Phone:</strong> ${esc(sub.phone)}</p>
        <p><strong>Preferred domain:</strong> ${esc(sub.preferred_domain || "-")}</p>
        <p><strong>Motivation:</strong> ${esc(sub.motivation || "-")}</p>
        <p><strong>Ordered at:</strong> ${esc(at)}</p>
        <p style="font-size:18px"><strong>Project Accessible Code:</strong> <code>${esc(code?.code || "-")}</code></p>
      </div>
      <p style="font-size:13px;color:#888">Manage this order in Admin Dashboard → Live Projects.</p></div>`;

    const userHtml = `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px">
      <h2>Hi ${esc(sub.full_name)},</h2>
      <p>Thanks for ordering the Book My Mentor Live Projects plan (₹2,999, valid 3 months).</p>
      <p>Our team is checking Live Project slot availability. If a slot is available, we'll email you payment details to confirm your enrolment. Do not pay anyone until you receive that email from us.</p>
      <p style="font-size:13px;color:#888">Questions? Write to info@bookmymentor.com.</p></div>`;

    const send = (to: string[], subject: string, html: string) =>
      fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${RESEND}` },
        body: JSON.stringify({ from: "Book My Mentor <support@bookmymentor.com>", reply_to: "info@bookmymentor.com", to, subject, html }),
      });
    await Promise.all([
      send(["info@bookmymentor.com", "bookmymentor.org@gmail.com"], `New Live Projects order: ${sub.full_name}`, adminHtml),
      send([sub.email], "Your Live Projects order is received", userHtml),
    ]);
    return json({ success: true });
  } catch (e) {
    console.error(e);
    return json({ error: (e as Error).message }, 500);
  }
});
