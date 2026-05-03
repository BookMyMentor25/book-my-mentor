import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface Payload {
  job_id: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { job_id } = (await req.json()) as Payload;
    if (!job_id) throw new Error("job_id is required");

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) throw new Error("RESEND_API_KEY not set");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Fetch job
    const { data: job, error: jobErr } = await supabase
      .from("job_postings")
      .select("id, title, description, location, job_type, experience_level, salary_min, salary_max, currency, salary_period, company_name, skills, recruiter_id")
      .eq("id", job_id)
      .maybeSingle();
    if (jobErr || !job) throw new Error("Job not found");

    // Resolve company name
    let companyName = job.company_name as string | null;
    if (!companyName && job.recruiter_id) {
      const { data: rec } = await supabase
        .from("recruiters")
        .select("company_name")
        .eq("id", job.recruiter_id)
        .maybeSingle();
      companyName = rec?.company_name ?? "A leading company";
    }
    companyName = companyName || "A leading company";

    // Get all registered users (profiles)
    const { data: profiles, error: profErr } = await supabase
      .from("profiles")
      .select("email, full_name")
      .not("email", "is", null);
    if (profErr) throw profErr;

    const recipients = (profiles || []).filter((p: any) => p.email && p.email.includes("@"));
    if (recipients.length === 0) {
      return new Response(JSON.stringify({ success: true, sent: 0 }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Format salary
    const fmtMoney = (n: number) => `₹${n.toLocaleString("en-IN")}`;
    const salary =
      job.salary_min && job.salary_max
        ? `${fmtMoney(job.salary_min)} – ${fmtMoney(job.salary_max)} ${job.salary_period || ""}`.trim()
        : null;

    const jobUrl = `https://book-my-mentor.lovable.app/jobs/${job.id}`;
    const jobsListUrl = `https://book-my-mentor.lovable.app/jobs`;

    const skillsList: string[] = Array.isArray(job.skills) ? job.skills.slice(0, 6) : [];

    const sendOne = async (toEmail: string, name: string) => {
      const firstName = (name || "there").split(" ")[0];
      const html = `
<div style="font-family:'Segoe UI',Arial,sans-serif;max-width:620px;margin:0 auto;background:#ffffff;color:#1a1a2e">
  <div style="background:linear-gradient(135deg,#7c3aed 0%,#a855f7 50%,#ec4899 100%);padding:28px 24px;text-align:center;color:#fff;border-radius:12px 12px 0 0">
    <p style="margin:0;font-size:13px;letter-spacing:2px;text-transform:uppercase;opacity:0.9">🚀 New Opportunity Just In</p>
    <h1 style="margin:8px 0 0;font-size:26px;font-weight:700">A Job You Might Love</h1>
  </div>

  <div style="padding:28px 24px">
    <p style="font-size:16px;margin:0 0 12px">Hi ${firstName},</p>
    <p style="font-size:15px;line-height:1.6;color:#374151;margin:0 0 20px">
      We're excited to share a brand-new opening on <strong style="color:#7c3aed">Book My Mentor</strong> that aligns with the kind of growth opportunities our community thrives on. Take a quick look — this could be your next big move.
    </p>

    <div style="background:linear-gradient(135deg,#faf5ff 0%,#fdf2f8 100%);border:1px solid #e9d5ff;border-radius:14px;padding:22px;margin:22px 0">
      <h2 style="margin:0 0 6px;color:#1a1a2e;font-size:22px;font-weight:700">${job.title}</h2>
      <p style="margin:0 0 14px;color:#7c3aed;font-weight:600;font-size:15px">${companyName}</p>

      <table style="width:100%;font-size:14px;color:#374151;border-collapse:collapse">
        <tr><td style="padding:4px 0">📍 <strong>Location:</strong></td><td style="padding:4px 0">${job.location}</td></tr>
        <tr><td style="padding:4px 0">💼 <strong>Type:</strong></td><td style="padding:4px 0">${job.job_type}</td></tr>
        ${job.experience_level ? `<tr><td style="padding:4px 0">🎯 <strong>Level:</strong></td><td style="padding:4px 0">${job.experience_level}</td></tr>` : ""}
        ${salary ? `<tr><td style="padding:4px 0">💰 <strong>Salary:</strong></td><td style="padding:4px 0">${salary}</td></tr>` : ""}
      </table>

      ${skillsList.length ? `<div style="margin-top:14px"><strong style="color:#1a1a2e;font-size:13px">Key Skills:</strong><div style="margin-top:6px">${skillsList.map(s => `<span style="display:inline-block;background:#fff;border:1px solid #e9d5ff;color:#7c3aed;font-size:12px;padding:4px 10px;border-radius:999px;margin:3px 4px 0 0">${s}</span>`).join("")}</div></div>` : ""}
    </div>

    <div style="text-align:center;margin:28px 0">
      <a href="${jobUrl}" style="display:inline-block;background:linear-gradient(135deg,#7c3aed,#ec4899);color:#fff;text-decoration:none;padding:14px 36px;border-radius:10px;font-weight:600;font-size:15px;box-shadow:0 4px 14px rgba(124,58,237,0.35)">View & Apply Now →</a>
    </div>

    <p style="font-size:14px;color:#6b7280;line-height:1.6;margin:18px 0 0;text-align:center">
      Know someone perfect for this role? Share it with them — a referral could change someone's career today. 💜
    </p>

    <div style="margin-top:24px;padding-top:18px;border-top:1px solid #f3e8ff;text-align:center">
      <a href="${jobsListUrl}" style="color:#7c3aed;text-decoration:none;font-size:14px;font-weight:500">Browse all opportunities →</a>
    </div>
  </div>

  <div style="padding:18px 24px;background:#fafafa;border-radius:0 0 12px 12px;text-align:center;color:#9ca3af;font-size:12px">
    You're receiving this because you're part of the Book My Mentor community.<br>
    Questions? Reply to this email or write to <a href="mailto:info@bookmymentor.com" style="color:#7c3aed">info@bookmymentor.com</a>
  </div>
</div>`;

      const r = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${RESEND_API_KEY}` },
        body: JSON.stringify({
          from: "Book My Mentor <support@bookmymentor.com>",
          to: [toEmail],
          subject: `🚀 New ${job.job_type}: ${job.title} at ${companyName}`,
          html,
        }),
      });
      if (!r.ok) console.error("Resend failed for", toEmail, await r.text());
    };

    // Send in small batches to respect rate limits
    let sent = 0;
    const batch = 5;
    for (let i = 0; i < recipients.length; i += batch) {
      const slice = recipients.slice(i, i + batch);
      await Promise.all(slice.map((p: any) => sendOne(p.email, p.full_name || "")));
      sent += slice.length;
      if (i + batch < recipients.length) await new Promise(r => setTimeout(r, 600));
    }

    return new Response(JSON.stringify({ success: true, sent }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error("notify-job-broadcast error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
