import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const BATCH_SIZE = 50;
const SITE = "https://www.bookmymentor.com";

const esc = (v: unknown) =>
  String(v ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { project_id } = (await req.json()) as { project_id?: string };
    if (!project_id) throw new Error("project_id is required");

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) throw new Error("RESEND_API_KEY not set");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: project, error: pErr } = await supabase
      .from("live_projects")
      .select(
        "id, submitted_by, company_name, title, summary, domain, engagement_type, duration, skills, openings, stipend, location, status"
      )
      .eq("id", project_id)
      .maybeSingle();
    if (pErr || !project) throw new Error("Live Project not found");
    if (project.status !== "published") {
      return new Response(JSON.stringify({ success: true, skipped: "not published" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Every registered member (subscribed or not)
    const recipients: { email: string; name: string }[] = [];
    const seen = new Set<string>();
    let page = 1;
    while (page <= 20) {
      const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 1000 });
      if (error) throw error;
      const users = data?.users || [];
      for (const u of users) {
        const email = (u.email || "").trim().toLowerCase();
        if (!email || !email.includes("@") || seen.has(email)) continue;
        seen.add(email);
        recipients.push({ email, name: (u.user_metadata as any)?.full_name || "" });
      }
      if (users.length < 1000) break;
      page++;
    }

    const skills: string[] = Array.isArray(project.skills) ? project.skills.slice(0, 8) : [];
    const boardUrl = `${SITE}/live-projects`;
    const summary = esc(project.summary).slice(0, 700);

    const buildHtml = (name: string) => {
      const firstName = esc((name || "there").split(" ")[0]);
      return `
<div style="font-family:'Segoe UI',Arial,sans-serif;max-width:620px;margin:0 auto;background:#ffffff;color:#1a1a2e">
  <div style="background:linear-gradient(135deg,#7c3aed 0%,#a855f7 50%,#ec4899 100%);padding:28px 24px;text-align:center;color:#fff;border-radius:12px 12px 0 0">
    <p style="margin:0;font-size:13px;letter-spacing:2px;text-transform:uppercase;opacity:.9">New Live Project</p>
    <h1 style="margin:8px 0 0;font-size:26px;font-weight:700">${esc(project.company_name)} just posted a Live Project</h1>
  </div>
  <div style="padding:28px 24px">
    <p style="font-size:16px;margin:0 0 12px">Hi ${firstName},</p>
    <p style="font-size:15px;line-height:1.6;color:#374151;margin:0 0 20px">
      A company on <strong style="color:#7c3aed">Book My Mentor</strong> has opened a real
      <strong>${esc(project.domain)}</strong> Live Project. Build it with mentor reviews and turn it into portfolio proof recruiters trust.
    </p>
    <div style="background:linear-gradient(135deg,#faf5ff 0%,#fdf2f8 100%);border:1px solid #e9d5ff;border-radius:14px;padding:22px;margin:22px 0">
      <h2 style="margin:0 0 10px;font-size:20px;font-weight:700">${esc(project.title)}</h2>
      <p style="margin:0 0 14px;color:#374151;font-size:14px;line-height:1.6">${summary}</p>
      <table style="width:100%;font-size:14px;color:#374151">
        <tr><td style="padding:4px 0">🏢 <strong>Company:</strong></td><td style="padding:4px 0">${esc(project.company_name)}</td></tr>
        <tr><td style="padding:4px 0">🚀 <strong>Domain:</strong></td><td style="padding:4px 0">${esc(project.domain)}</td></tr>
        <tr><td style="padding:4px 0">🧩 <strong>Type:</strong></td><td style="padding:4px 0">${esc(project.engagement_type)}</td></tr>
        ${project.duration ? `<tr><td style="padding:4px 0">🕒 <strong>Duration:</strong></td><td style="padding:4px 0">${esc(project.duration)}</td></tr>` : ""}
        ${project.location ? `<tr><td style="padding:4px 0">📍 <strong>Location:</strong></td><td style="padding:4px 0">${esc(project.location)}</td></tr>` : ""}
        ${project.stipend ? `<tr><td style="padding:4px 0">💰 <strong>Stipend / Budget:</strong></td><td style="padding:4px 0">${esc(project.stipend)}</td></tr>` : ""}
        <tr><td style="padding:4px 0">👥 <strong>Openings:</strong></td><td style="padding:4px 0">${esc(project.openings)}</td></tr>
      </table>
      ${skills.length ? `<div style="margin-top:14px">${skills.map((s) => `<span style="display:inline-block;background:#fff;border:1px solid #e9d5ff;color:#7c3aed;font-size:12px;padding:4px 10px;border-radius:999px;margin:3px 4px 0 0">${esc(s)}</span>`).join("")}</div>` : ""}
    </div>
    <div style="text-align:center;margin:28px 0">
      <a href="${boardUrl}" style="display:inline-block;background:linear-gradient(135deg,#7c3aed,#ec4899);color:#fff;text-decoration:none;padding:14px 36px;border-radius:10px;font-weight:600;font-size:15px">View &amp; Apply to this Live Project →</a>
    </div>
    <p style="font-size:13px;color:#6b7280;text-align:center;margin:0">Company contact details are shown only to signed-in members.</p>
  </div>
  <div style="padding:18px 24px;background:#fafafa;border-radius:0 0 12px 12px;text-align:center;color:#9ca3af;font-size:12px">
    You're receiving this because you have a Book My Mentor account.<br/>© 2026 Book My Mentor · Ahad Tech Labs Pvt Ltd
  </div>
</div>`;
    };

    let sent = 0;
    for (let i = 0; i < recipients.length; i += BATCH_SIZE) {
      const batch = recipients.slice(i, i + BATCH_SIZE);
      const results = await Promise.allSettled(
        batch.map((r) =>
          fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${RESEND_API_KEY}`,
            },
            body: JSON.stringify({
              from: "Book My Mentor <support@bookmymentor.com>",
              to: [r.email],
              subject: `🚀 New ${project.domain} Live Project: ${project.title}`,
              html: buildHtml(r.name),
            }),
          })
        )
      );
      sent += results.filter((x) => x.status === "fulfilled" && (x.value as Response).ok).length;
    }

    // Admin heads-up
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${RESEND_API_KEY}` },
      body: JSON.stringify({
        from: "Book My Mentor <support@bookmymentor.com>",
        to: ["info@bookmymentor.com"],
        subject: `New Live Project posted: ${project.title} (${project.company_name})`,
        html: `<p><strong>${esc(project.company_name)}</strong> posted <strong>${esc(project.title)}</strong> in ${esc(project.domain)}.</p><p>Notified ${sent} members.</p>`,
      }),
    });

    console.log(`notify-live-project: sent=${sent}/${recipients.length}`);
    return new Response(JSON.stringify({ success: true, sent }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("notify-live-project error:", error?.message);
    return new Response(JSON.stringify({ error: error?.message || "Unexpected error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
