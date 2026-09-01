import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const BATCH_SIZE = 50;
const SITE = "https://www.bookmymentor.com";

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { profile_id } = (await req.json()) as { profile_id?: string };
    if (!profile_id) throw new Error("profile_id is required");

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) throw new Error("RESEND_API_KEY not set");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: profile, error: pErr } = await supabase
      .from("live_project_teammate_profiles")
      .select("id, user_id, display_name, headline, about, preferred_domain, skills, experience_level, city, availability, course_id")
      .eq("id", profile_id)
      .maybeSingle();
    if (pErr || !profile) throw new Error("Teammate profile not found");

    let courseTitle: string | null = null;
    if (profile.course_id) {
      const { data: course } = await supabase
        .from("courses")
        .select("title")
        .eq("id", profile.course_id)
        .maybeSingle();
      courseTitle = course?.title ?? null;
    }

    // Collect every registered user (subscribed or not)
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
        if (u.id === profile.user_id) continue; // don't notify the author
        seen.add(email);
        recipients.push({ email, name: (u.user_metadata as any)?.full_name || "" });
      }
      if (users.length < 1000) break;
      page++;
    }

    const skills: string[] = Array.isArray(profile.skills) ? profile.skills.slice(0, 8) : [];
    const boardUrl = `${SITE}/find-teammates`;

    const buildHtml = (name: string) => {
      const firstName = (name || "there").split(" ")[0];
      return `
<div style="font-family:'Segoe UI',Arial,sans-serif;max-width:620px;margin:0 auto;background:#ffffff;color:#1a1a2e">
  <div style="background:linear-gradient(135deg,#7c3aed 0%,#a855f7 50%,#ec4899 100%);padding:28px 24px;text-align:center;color:#fff;border-radius:12px 12px 0 0">
    <p style="margin:0;font-size:13px;letter-spacing:2px;text-transform:uppercase;opacity:.9">Live Project Team-Up</p>
    <h1 style="margin:8px 0 0;font-size:26px;font-weight:700">Someone is looking for teammates</h1>
  </div>
  <div style="padding:28px 24px">
    <p style="font-size:16px;margin:0 0 12px">Hi ${firstName},</p>
    <p style="font-size:15px;line-height:1.6;color:#374151;margin:0 0 20px">
      A candidate on <strong style="color:#7c3aed">Book My Mentor</strong> just shared a profile looking for teammates to build a <strong>Live Project</strong> together. Join the batch and split the course fee 3 ways.
    </p>
    <div style="background:linear-gradient(135deg,#faf5ff 0%,#fdf2f8 100%);border:1px solid #e9d5ff;border-radius:14px;padding:22px;margin:22px 0">
      <h2 style="margin:0 0 6px;font-size:20px;font-weight:700">${profile.display_name}</h2>
      <p style="margin:0 0 12px;color:#7c3aed;font-weight:600;font-size:15px">${profile.headline}</p>
      <table style="width:100%;font-size:14px;color:#374151">
        ${courseTitle ? `<tr><td style="padding:4px 0">🎓 <strong>Program:</strong></td><td style="padding:4px 0">${courseTitle}</td></tr>` : ""}
        ${profile.preferred_domain ? `<tr><td style="padding:4px 0">🚀 <strong>Domain:</strong></td><td style="padding:4px 0">${profile.preferred_domain}</td></tr>` : ""}
        <tr><td style="padding:4px 0">🎯 <strong>Level:</strong></td><td style="padding:4px 0">${profile.experience_level}</td></tr>
        ${profile.city ? `<tr><td style="padding:4px 0">📍 <strong>City:</strong></td><td style="padding:4px 0">${profile.city}</td></tr>` : ""}
        ${profile.availability ? `<tr><td style="padding:4px 0">🕒 <strong>Availability:</strong></td><td style="padding:4px 0">${profile.availability}</td></tr>` : ""}
      </table>
      ${skills.length ? `<div style="margin-top:14px">${skills.map((s) => `<span style="display:inline-block;background:#fff;border:1px solid #e9d5ff;color:#7c3aed;font-size:12px;padding:4px 10px;border-radius:999px;margin:3px 4px 0 0">${s}</span>`).join("")}</div>` : ""}
    </div>
    <div style="text-align:center;margin:28px 0">
      <a href="${boardUrl}" style="display:inline-block;background:linear-gradient(135deg,#7c3aed,#ec4899);color:#fff;text-decoration:none;padding:14px 36px;border-radius:10px;font-weight:600;font-size:15px">View Profile &amp; Join the Team →</a>
    </div>
    <p style="font-size:13px;color:#6b7280;text-align:center;margin:0">Contact details are visible only to signed-in members, keeping every candidate's data protected.</p>
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
              subject: `🤝 ${profile.display_name} is looking for Live Project teammates`,
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
        subject: `New Live Project teammate profile: ${profile.display_name}`,
        html: `<p>${profile.display_name} — ${profile.headline}</p><p>Notified ${sent} members.</p>`,
      }),
    });

    console.log(`notify-teammate-profile: sent=${sent}/${recipients.length}`);
    return new Response(JSON.stringify({ success: true, sent }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("notify-teammate-profile error:", error?.message);
    return new Response(JSON.stringify({ error: error?.message || "Unexpected error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
