import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, style } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Generating wireframe for prompt:", prompt, "style:", style);

    const systemPrompt = `You are an expert UI/UX wireframe designer. Generate a detailed JSON structure for an interactive wireframe mockup based on the user's description.

Output a JSON object with:
{
  "title": "Page title",
  "components": [
    {
      "type": "header" | "navbar" | "hero" | "section" | "card" | "form" | "button" | "input" | "text" | "image" | "footer" | "sidebar" | "modal" | "list",
      "x": number (0-800),
      "y": number (0-1200),
      "width": number,
      "height": number,
      "label": "text content",
      "children": [] (optional nested components),
      "style": "primary" | "secondary" | "outline" | "ghost" (for buttons)
    }
  ],
  "colors": {
    "primary": "#hex",
    "secondary": "#hex",
    "background": "#hex",
    "text": "#hex"
  }
}

Style guide: ${style || 'modern, clean, minimal'}

Create a realistic, well-structured wireframe layout with proper spacing and hierarchy. Include typical UI elements like navigation, headers, content sections, and CTAs.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add more credits." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    console.log("AI response:", content);

    // Extract JSON from response
    let wireframeData;
    try {
      const jsonMatch = content.match(/```json\n?([\s\S]*?)\n?```/) || content.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : content;
      wireframeData = JSON.parse(jsonStr);
    } catch (e) {
      console.error("Failed to parse wireframe JSON:", e);
      wireframeData = {
        title: "Generated Wireframe",
        components: [
          { type: "navbar", x: 0, y: 0, width: 800, height: 60, label: "Navigation Bar" },
          { type: "hero", x: 0, y: 60, width: 800, height: 300, label: "Hero Section" },
          { type: "section", x: 0, y: 360, width: 800, height: 200, label: "Content Section" },
          { type: "footer", x: 0, y: 560, width: 800, height: 80, label: "Footer" }
        ],
        colors: { primary: "#6366f1", secondary: "#8b5cf6", background: "#ffffff", text: "#1f2937" }
      };
    }

    return new Response(JSON.stringify({ wireframe: wireframeData }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-wireframe function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
