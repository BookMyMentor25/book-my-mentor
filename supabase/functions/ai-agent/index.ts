import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY")!;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const SYSTEM_PROMPT = `You are "Mentor AI" — the agentic career & learning copilot for Book My Mentor (India's trusted EdTech + HR-Tech platform).

CORE MISSION: Always give the user a useful, accurate, confident answer. Never reply with "I don't know" or "I can't help with that". If platform data is empty or irrelevant, fall back to your broad general knowledge and cite well-known public sources.

WHAT YOU CAN ANSWER (be expansive, not narrow):
1. Careers & jobs — roles, salaries (India + global), skills, career switches, resume, LinkedIn, interviews, negotiations.
2. Internships, freshers, campus placements, government jobs, PSU, UPSC, GATE, SSC basics.
3. Learning — Product Management, Project Management, Lean Startup, Agile, Scrum, Data Analytics, AI/ML, Web/Mobile dev, Design, Marketing, Finance, etc.
4. Courses & certifications — recommend Book My Mentor courses first; also mention reputable alternatives (Coursera, edX, NPTEL, Google, IBM, AWS, Microsoft Learn, HBR, MIT OCW, freeCodeCamp).
5. Tools — resume builders, cover letters, portfolios, GitHub, Notion, Figma.
6. Indian job market context — top companies, hiring seasons, tier-1/2/3 cities, remote/hybrid trends, salary benchmarks (Naukri, LinkedIn, AmbitionBox, Glassdoor, Levels.fyi as references).
7. Entrepreneurship, startups, freelancing, side projects, study-abroad, GRE/GMAT/IELTS basics.
8. Generative content — resume bullets, cover letters, LinkedIn summaries/headlines, cold emails, interview answers (STAR), project ideas, learning plans, 30-60-90 day plans.

TOOL USAGE:
- When the user asks about jobs/internships/hiring ON THIS PLATFORM, call search_jobs. If it returns nothing, clearly say no platform matches yet, then give 3-5 general suggestions (role keywords, top hiring companies in India for that role, where else to look like Naukri / LinkedIn / Instahyre / Wellfound / company career pages, and 1 ready-to-use search query) and invite them to subscribe to job alerts at /jobs.
- When the user asks about courses, call list_courses and recommend the best fit. If none match, recommend reputable external options and invite them to /courses.
- For all other questions (advice, definitions, how-tos, comparisons, salaries, prep plans, content generation), answer DIRECTLY from your knowledge — do NOT call tools.

STYLE:
- Confident, simple, professional. India-context aware. Currency in ₹.
- Use short bullets, bold key terms, and end with a clear next step ("Sign up free to track applications", "Visit /jobs", "Visit /ai-tools", etc.).
- Never invent specific job postings or course names that the tools did not return. General market info (e.g., "Infosys, TCS, Wipro typically hire freshers in Q1/Q2") IS allowed.
- If the question is sensitive (legal, medical, financial advice), give general guidance and recommend consulting a licensed professional.

You are helpful by default. Answer every reasonable question.`;

const tools = [
  {
    type: "function",
    function: {
      name: "search_jobs",
      description: "Search active job postings on Book My Mentor by keyword/role/location. Use ONLY when the user is asking about jobs/internships available on this platform.",
      parameters: {
        type: "object",
        properties: {
          query: { type: "string", description: "Role, skill, or keyword" },
          location: { type: "string", description: "City or 'remote'. Optional." },
          limit: { type: "number", description: "Max results, default 5" },
        },
        required: ["query"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "list_courses",
      description: "List active courses offered by Book My Mentor. Use ONLY when the user asks about courses available on this platform.",
      parameters: { type: "object", properties: {} },
    },
  },
];

async function runTool(name: string, args: any) {
  const sb = createClient(SUPABASE_URL, SERVICE_KEY);
  if (name === "search_jobs") {
    const q = String(args.query || "").trim();
    const limit = Math.min(Number(args.limit) || 5, 10);
    let query = sb
      .from("job_postings")
      .select("id, job_title, company_name, location, job_type, experience_level, skills_required")
      .eq("is_active", true)
      .limit(limit);
    if (q) query = query.or(`job_title.ilike.%${q}%,company_name.ilike.%${q}%,skills_required.ilike.%${q}%`);
    if (args.location) query = query.ilike("location", `%${args.location}%`);
    const { data, error } = await query;
    if (error) return { error: error.message, jobs: [] };
    return { jobs: data ?? [], count: data?.length ?? 0 };
  }
  if (name === "list_courses") {
    const { data, error } = await sb
      .from("courses")
      .select("id, title, description, duration, price")
      .eq("is_active", true)
      .limit(20);
    if (error) return { error: error.message, courses: [] };
    return { courses: data ?? [], count: data?.length ?? 0 };
  }
  return { error: "unknown tool" };
}

async function callModel(messages: any[]) {
  const r = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${LOVABLE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages,
      tools,
    }),
  });
  if (!r.ok) {
    const t = await r.text();
    throw new Error(`AI gateway ${r.status}: ${t}`);
  }
  return await r.json();
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const { messages } = await req.json();
    if (!Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: "messages[] required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const convo: any[] = [{ role: "system", content: SYSTEM_PROMPT }, ...messages];

    for (let i = 0; i < 4; i++) {
      const data = await callModel(convo);
      const msg = data.choices?.[0]?.message;
      if (!msg) throw new Error("No response from AI");
      convo.push(msg);
      const calls = msg.tool_calls;
      if (!calls || calls.length === 0) {
        return new Response(JSON.stringify({ reply: msg.content ?? "" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      for (const c of calls) {
        let args: any = {};
        try { args = JSON.parse(c.function.arguments || "{}"); } catch { /* ignore */ }
        const result = await runTool(c.function.name, args);
        convo.push({
          role: "tool",
          tool_call_id: c.id,
          content: JSON.stringify(result),
        });
      }
    }
    return new Response(JSON.stringify({ reply: "I couldn't complete that request — please try rephrasing." }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e: any) {
    console.error("ai-agent error:", e);
    const msg = String(e?.message || e);
    const status = msg.includes(" 429") ? 429 : msg.includes(" 402") ? 402 : 500;
    return new Response(JSON.stringify({ error: msg }), {
      status, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
