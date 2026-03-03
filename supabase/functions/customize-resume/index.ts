import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { resume_text, job_description, job_title, company_name } = await req.json();

    if (!resume_text || !job_description) {
      return new Response(
        JSON.stringify({ error: "Resume text and job description are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are a world-class career coach and ATS (Applicant Tracking System) resume expert trusted by top recruiters at Fortune 500 companies. Your goal is to transform the candidate's resume into a professional, creative, and recruiter-approved document tailored to the specific job description.

CORE PRINCIPLES:
1. TRUTHFULNESS: Keep all factual information (dates, company names, degrees, certifications) exactly as provided. Never fabricate experience, skills, or achievements.
2. ATS OPTIMIZATION: Use keywords from the job description naturally throughout the resume. Use standard section headers recognized by all ATS systems.
3. RECRUITER APPEAL: Write content that impresses both ATS software AND human recruiters. Use powerful action verbs and quantify achievements wherever possible.
4. PROFESSIONAL FORMATTING: Use clean, scannable plain text with clear hierarchy.

RESUME STRUCTURE (use exactly these section headers):

[CANDIDATE FULL NAME]
[Contact info: email | phone | location | LinkedIn if provided]

=== PROFESSIONAL SUMMARY ===
Write a compelling 3-4 line summary highlighting the candidate's most relevant experience, key strengths, and value proposition for THIS specific role. Include 3-5 critical keywords from the job description naturally.

=== KEY SKILLS ===
List 10-15 skills in a clean format, prioritizing skills mentioned in the job description. Mix technical skills with soft skills relevant to the role.

=== PROFESSIONAL EXPERIENCE ===
For each role:
- Company Name | Job Title | Location | Dates
- Write 3-5 impactful bullet points per role
- Start each bullet with a strong action verb (Led, Drove, Spearheaded, Optimized, Delivered, Orchestrated, etc.)
- Quantify results: revenue impact, percentage improvements, team sizes, project scopes
- Align descriptions to mirror the job requirements

=== EDUCATION ===
Degree | Institution | Year
Include relevant coursework, honors, or GPA if impressive (3.5+)

=== CERTIFICATIONS & ACHIEVEMENTS ===
List relevant certifications, awards, publications, or notable achievements

=== ADDITIONAL ===
Languages, volunteer work, or relevant interests (only if they add value)

STYLE GUIDELINES:
- Be concise yet impactful — ideal resume length is 1-2 pages
- Use industry-specific terminology from the job description
- Prioritize recent and relevant experience
- Remove outdated or irrelevant information
- Ensure every bullet point demonstrates impact, not just duties
- Use numbers and metrics wherever possible (e.g., "Increased sales by 35%" not "Improved sales")

OUTPUT: Return ONLY the optimized resume text. No explanations, no notes, no commentary. The output should be ready to use as-is.`;

    const userMessage = `
JOB TITLE: ${job_title || 'Not specified'}
COMPANY: ${company_name || 'Not specified'}

JOB DESCRIPTION:
${job_description}

CANDIDATE'S CURRENT RESUME:
${resume_text}

Transform this resume into a professional, ATS-optimized version tailored for this specific job. Return ONLY the resume text.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "AI service is busy. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please try again later." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("Failed to generate optimized resume");
    }

    const data = await response.json();
    const optimizedResume = data.choices?.[0]?.message?.content;

    if (!optimizedResume) {
      throw new Error("No response from AI");
    }

    return new Response(
      JSON.stringify({ optimized_resume: optimizedResume }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Resume customization error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
