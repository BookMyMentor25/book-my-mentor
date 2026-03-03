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

    const systemPrompt = `You are a world-class career coach and ATS (Applicant Tracking System) resume expert. Transform the candidate's resume into a professional, ATS-optimized document tailored to the specific job description.

CRITICAL FORMATTING RULES:
- Output ONLY plain text. NO markdown (no **, no ##, no ***, no backticks).
- Use === SECTION NAME === for section headers (e.g. === PROFESSIONAL SUMMARY ===)
- Use bullet points with • character only
- Use | as separator for sub-headers (e.g. Company Name | Job Title | Dates)
- NO bold, italic, or any formatting symbols whatsoever
- Keep lines clean and scannable

CORE PRINCIPLES:
1. TRUTHFULNESS: Keep all factual information (dates, companies, degrees, certifications) exactly as provided. Never fabricate experience or achievements.
2. ATS OPTIMIZATION: Naturally weave keywords from the job description throughout. Use standard ATS-recognized section headers.
3. QUANTIFY IMPACT: Use numbers, percentages, and metrics wherever possible (e.g., "Increased sales by 35%" not "Improved sales").
4. ACTION VERBS: Start each bullet with strong verbs (Led, Drove, Spearheaded, Optimized, Delivered, Orchestrated, Achieved).

RESUME STRUCTURE (use exactly these headers):

[CANDIDATE FULL NAME]
[Contact: email | phone | location | LinkedIn if provided]

=== PROFESSIONAL SUMMARY ===
3-4 lines highlighting relevant experience, key strengths, and value proposition for THIS role. Include 3-5 critical keywords from the job description.

=== KEY SKILLS ===
List 10-15 skills prioritizing those in the job description. Mix technical and soft skills.

=== PROFESSIONAL EXPERIENCE ===
For each role:
Company Name | Job Title | Location | Dates
• 3-5 impactful bullets per role with quantified results
• Align descriptions to mirror job requirements

=== EDUCATION ===
Degree | Institution | Year
Include relevant coursework or honors if impressive.

=== CERTIFICATIONS & ACHIEVEMENTS ===
List relevant certifications, awards, publications.

=== ADDITIONAL ===
Languages, volunteer work, or relevant interests (only if valuable).

OUTPUT: Return ONLY the plain text resume. No explanations, no notes, no commentary. No markdown formatting symbols.`;

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
