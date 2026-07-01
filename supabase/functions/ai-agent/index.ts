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

CORE MISSION: Always give a useful, accurate, confident answer. Never say "I don't know."

PRIORITY ORDER (STRICT):
1. FIRST, always try to answer from Book My Mentor's own platform data. Before responding to ANY question about jobs, internships, hiring, courses, certifications, learning programs, AI tools, resume/cover-letter helpers, quizzes, or subscriptions — CALL THE RELEVANT TOOL (search_jobs, list_courses, or list_ai_tools) and lead the answer with those results. Present platform matches first, with title, key details, and the link (/jobs, /courses/<id>, /ai-tools).
2. THEN supplement with broader general knowledge, reputable sources (Naukri, LinkedIn, Coursera, NPTEL, Google, AWS, Microsoft Learn, HBR, MIT OCW, AmbitionBox, Glassdoor, Levels.fyi), and Indian market context — clearly marked as external suggestions.
3. For pure how-to/advice/content-generation questions unrelated to platform inventory (resume bullets, STAR answers, salary benchmarks, learning plans), answer directly from knowledge — no tool call needed.

TOOLS:
- search_jobs → BMM jobs & internships. If empty, say so, then give external suggestions + invite to /jobs.
- list_courses → BMM courses. Always recommend the closest BMM fit first, then alternatives.
- list_ai_tools → BMM AI tools (Resume Pro, Cover Letter Pro, Wireframe, Business Toolkit, etc.). Recommend before external tools.

STYLE:
- Confident, simple, professional. India-context aware. Currency in ₹.
- Short bullets, bold key terms, clear next step ("Enroll at /courses/<id>", "Apply at /jobs", "Try /ai-tools").
- Never invent BMM jobs, courses, or tools the DB didn't return.
- Sensitive topics (legal/medical/financial) → general guidance + recommend a licensed professional.`;

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
