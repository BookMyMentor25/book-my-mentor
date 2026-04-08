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
    const { resume_text, job_description, job_title, company_name, applicant_name } = await req.json();

    if (!job_description) {
      return new Response(
        JSON.stringify({ error: "Job description is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are a world-class career coach and ATS (Applicant Tracking System) expert specializing in cover letters. Your job is to:
1. Generate a professional, ATS-optimized cover letter tailored to the specific job description.
2. Analyze how well the cover letter matches the job description.

TONE & STYLE:
- Professional, confident, polite, and impressive
- Show genuine enthusiasm for the role and company
- Demonstrate knowledge of the company and industry
- Use specific examples and quantified achievements when resume is provided
- Keep it concise: 3-4 paragraphs, under 400 words
- Use active voice and power verbs

COVER LETTER STRUCTURE:
- Opening paragraph: Hook the reader. Mention the specific role and why you're excited.
- Body paragraph(s): Highlight 2-3 most relevant achievements/skills that match the JD. Quantify results.
- Closing paragraph: Reiterate enthusiasm, call to action, professional sign-off.

ATS OPTIMIZATION:
- Naturally incorporate keywords from the job description
- Use standard formatting (no tables, columns, or graphics)
- Include relevant industry terminology

CRITICAL FORMATTING RULES:
- Output ONLY plain text. NO markdown (no **, no ##, no ***, no backticks).
- Use proper letter formatting with line breaks
- NO bold, italic, or any formatting symbols

YOUR OUTPUT MUST BE IN THIS EXACT JSON FORMAT (return valid JSON only):
{
  "cover_letter": "The complete cover letter text here...",
  "match_percentage": 85,
  "analysis": {
    "overall_summary": "Brief 2-3 sentence summary of how well the cover letter addresses the JD",
    "matched_keywords": ["keyword1", "keyword2"],
    "missing_keywords": ["keyword1", "keyword2"],
    "strengths": ["strength1", "strength2"],
    "recommendations": ["recommendation1", "recommendation2"],
    "tone_assessment": "Assessment of professional tone and impact"
  }
}

MATCH PERCENTAGE GUIDELINES:
- 90-100%: Cover letter perfectly addresses all key requirements
- 75-89%: Strong alignment with most requirements
- 60-74%: Good alignment with core requirements
- 40-59%: Partial alignment, significant gaps
- Below 40%: Weak alignment

Return ONLY valid JSON. No explanation before or after.`;

    const userMessage = `
JOB TITLE: ${job_title || 'Not specified'}
COMPANY: ${company_name || 'Not specified'}
APPLICANT NAME: ${applicant_name || 'Not specified'}

JOB DESCRIPTION:
${job_description}

${resume_text ? `CANDIDATE'S RESUME/BACKGROUND:
${resume_text}` : 'No resume provided. Generate a strong cover letter based on the job description alone.'}

Generate a professional, ATS-optimized cover letter. Return ONLY the JSON response.`;

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
      throw new Error("Failed to generate cover letter");
    }

    const data = await response.json();
    let content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No response from AI");
    }

    content = content.trim();
    if (content.startsWith("```json")) content = content.slice(7);
    else if (content.startsWith("```")) content = content.slice(3);
    if (content.endsWith("```")) content = content.slice(0, -3);
    content = content.trim();

    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch {
      console.error("Failed to parse AI JSON response, using fallback");
      parsed = {
        cover_letter: content,
        match_percentage: 70,
        analysis: {
          overall_summary: "Cover letter has been generated for the target role.",
          matched_keywords: [],
          missing_keywords: [],
          strengths: [],
          recommendations: ["Review the cover letter carefully"],
          tone_assessment: "Professional tone applied"
        }
      };
    }

    return new Response(
      JSON.stringify(parsed),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Cover letter generator error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
