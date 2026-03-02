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

    const systemPrompt = `You are an expert ATS (Applicant Tracking System) resume optimization specialist. Your task is to customize and optimize the candidate's resume to match the given job description while maintaining truthfulness and professionalism.

IMPORTANT RULES:
1. Keep all factual information (dates, company names, education) exactly as provided
2. Optimize bullet points and descriptions to use keywords from the job description
3. Reorder sections to highlight the most relevant experience first
4. Use strong action verbs and quantifiable achievements
5. Ensure the resume passes ATS keyword scanning
6. Format the output in clean, professional plain text with clear sections
7. Add a "Key Skills" section at the top matching the job requirements
8. Keep the resume concise (ideally 1-2 pages worth of content)
9. Use standard section headers that ATS systems recognize: "Summary", "Experience", "Education", "Skills", "Certifications"
10. Do NOT fabricate experience or skills the candidate doesn't have

OUTPUT FORMAT:
Return the optimized resume in clean plain text format with clear section separators using "===". Do not use markdown formatting.`;

    const userMessage = `
JOB TITLE: ${job_title || 'Not specified'}
COMPANY: ${company_name || 'Not specified'}

JOB DESCRIPTION:
${job_description}

CANDIDATE'S CURRENT RESUME:
${resume_text}

Please optimize this resume to be ATS-friendly and tailored for this specific job. Return ONLY the optimized resume text, no explanations.`;

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
