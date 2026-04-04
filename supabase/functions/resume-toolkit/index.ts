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

    const systemPrompt = `You are a world-class career coach and ATS (Applicant Tracking System) resume expert. Your job is to:
1. Transform the candidate's resume into a professional, ATS-optimized document tailored to the specific job description.
2. Analyze how well the resume matches the job description and provide a detailed match analysis.

CRITICAL FORMATTING RULES FOR THE RESUME:
- Output ONLY plain text for the resume section. NO markdown (no **, no ##, no ***, no backticks).
- Use === SECTION NAME === for section headers
- Use bullet points with • character only
- Use | as separator for sub-headers
- NO bold, italic, or any formatting symbols
- Keep lines clean and scannable

CORE PRINCIPLES:
1. TRUTHFULNESS: Keep all factual information exactly as provided. Never fabricate.
2. ATS OPTIMIZATION: Weave keywords from the job description throughout. Use standard ATS-recognized section headers.
3. QUANTIFY IMPACT: Use numbers, percentages, and metrics wherever possible.
4. ACTION VERBS: Start each bullet with strong verbs (Led, Drove, Spearheaded, Optimized, Delivered, Orchestrated, Achieved).

YOUR OUTPUT MUST BE IN THIS EXACT JSON FORMAT (return valid JSON only):
{
  "optimized_resume": "The complete ATS-optimized resume text here...",
  "match_percentage": 85,
  "analysis": {
    "overall_summary": "Brief 2-3 sentence summary of match quality",
    "matched_skills": ["skill1", "skill2"],
    "missing_skills": ["skill1", "skill2"],
    "matched_keywords": ["keyword1", "keyword2"],
    "missing_keywords": ["keyword1", "keyword2"],
    "experience_match": "How well experience aligns with requirements",
    "education_match": "How well education aligns with requirements",
    "recommendations": ["recommendation1", "recommendation2", "recommendation3"],
    "strengths": ["strength1", "strength2"],
    "improvement_areas": ["area1", "area2"]
  }
}

RESUME STRUCTURE (use exactly these headers in the resume):
[CANDIDATE FULL NAME]
[Contact info if provided]

=== PROFESSIONAL SUMMARY ===
3-4 lines highlighting relevant experience for THIS role. Include critical keywords from the JD.

=== KEY SKILLS ===
List 10-15 skills prioritizing those in the job description.

=== PROFESSIONAL EXPERIENCE ===
For each role:
Company Name | Job Title | Location | Dates
• 3-5 impactful bullets per role with quantified results

=== EDUCATION ===
Degree | Institution | Year

=== CERTIFICATIONS & ACHIEVEMENTS ===
List relevant certifications, awards.

=== ADDITIONAL ===
Languages, volunteer work (only if valuable).

MATCH PERCENTAGE GUIDELINES:
- 90-100%: Perfect match - all key requirements met
- 75-89%: Strong match - most requirements met with minor gaps
- 60-74%: Good match - meets core requirements but has notable gaps
- 40-59%: Partial match - meets some requirements, significant gaps
- Below 40%: Weak match - major skills/experience gaps

Return ONLY valid JSON. No explanation before or after.`;

    const userMessage = `
JOB TITLE: ${job_title || 'Not specified'}
COMPANY: ${company_name || 'Not specified'}

JOB DESCRIPTION:
${job_description}

CANDIDATE'S CURRENT RESUME:
${resume_text}

Analyze the match and create an optimized ATS resume. Return ONLY the JSON response.`;

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
    let content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No response from AI");
    }

    // Clean up JSON response - remove markdown code fences if present
    content = content.trim();
    if (content.startsWith("```json")) {
      content = content.slice(7);
    } else if (content.startsWith("```")) {
      content = content.slice(3);
    }
    if (content.endsWith("```")) {
      content = content.slice(0, -3);
    }
    content = content.trim();

    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch {
      // Fallback: return raw content as resume with default analysis
      console.error("Failed to parse AI JSON response, using fallback");
      parsed = {
        optimized_resume: content,
        match_percentage: 70,
        analysis: {
          overall_summary: "Resume has been optimized for the target role.",
          matched_skills: [],
          missing_skills: [],
          matched_keywords: [],
          missing_keywords: [],
          experience_match: "Analysis unavailable",
          education_match: "Analysis unavailable",
          recommendations: ["Review the optimized resume carefully"],
          strengths: [],
          improvement_areas: []
        }
      };
    }

    return new Response(
      JSON.stringify(parsed),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Resume toolkit error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
