import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

interface ToolRequest {
  tool: 'market-size' | 'business-model' | 'marketing-strategy' | 'product-lifecycle' | 'gtm-strategy' | 'market-research' | 'competitor-analysis';
  prompt: string;
  industry?: string;
  targetMarket?: string;
}

const systemPrompts: Record<string, string> = {
  'market-size': `You are an expert market analyst specializing in TAM, SAM, SOM analysis. 
When given a product or service description, provide a comprehensive market size estimation including:
1. **Total Addressable Market (TAM)** - The total global market size
2. **Serviceable Addressable Market (SAM)** - The segment you can target geographically
3. **Serviceable Obtainable Market (SOM)** - The realistic market share you can capture
4. **Market Growth Rate** - CAGR and future projections
5. **Key Market Drivers** - Factors driving growth
6. **Market Challenges** - Potential barriers

Format your response with clear sections, bullet points, and estimated figures in USD. Be data-driven and cite industry benchmarks where applicable.`,

  'business-model': `You are a business strategist expert in business model development. 
Analyze the given product/service and create a comprehensive Business Model Canvas including:
1. **Value Propositions** - What unique value do you offer?
2. **Customer Segments** - Who are your target customers?
3. **Channels** - How will you reach customers?
4. **Customer Relationships** - How will you maintain relationships?
5. **Revenue Streams** - How will you make money?
6. **Key Resources** - What resources do you need?
7. **Key Activities** - What activities are crucial?
8. **Key Partnerships** - Who are your partners?
9. **Cost Structure** - What are your major costs?

Provide actionable insights and examples for each section.`,

  'marketing-strategy': `You are a marketing strategist with expertise in digital and traditional marketing.
Develop a comprehensive marketing strategy including:
1. **Target Audience Analysis** - Demographics, psychographics, behavior
2. **Positioning Statement** - Unique market position
3. **Marketing Mix (4Ps)** - Product, Price, Place, Promotion
4. **Digital Marketing Strategy** - SEO, SEM, Social Media, Content
5. **Traditional Marketing** - PR, Events, Partnerships
6. **Marketing Budget Allocation** - Suggested distribution
7. **KPIs and Metrics** - How to measure success
8. **Marketing Calendar** - Timeline and milestones

Provide specific, actionable recommendations with examples.`,

  'product-lifecycle': `You are a product lifecycle management expert.
Analyze the product/service and provide insights on:
1. **Current Stage Identification** - Introduction, Growth, Maturity, or Decline
2. **Stage Characteristics** - What defines this stage
3. **Recommended Strategies** - Actions for the current stage
4. **Transition Indicators** - Signs of moving to next stage
5. **Revenue Optimization** - Maximizing revenue at each stage
6. **Extension Strategies** - How to extend the lifecycle
7. **Portfolio Considerations** - Impact on product portfolio
8. **Innovation Opportunities** - Areas for product evolution

Provide specific recommendations with timelines and metrics.`,

  'gtm-strategy': `You are a Go-To-Market strategy expert.
Create a comprehensive GTM strategy including:
1. **Market Opportunity Assessment** - Size and timing
2. **Target Customer Definition** - ICP (Ideal Customer Profile)
3. **Value Proposition** - Clear, compelling messaging
4. **Pricing Strategy** - Competitive positioning
5. **Sales Strategy** - Direct, channel, hybrid
6. **Marketing Launch Plan** - Pre-launch, launch, post-launch
7. **Distribution Channels** - How to reach customers
8. **Success Metrics** - KPIs and milestones
9. **Launch Timeline** - Week-by-week plan
10. **Budget Recommendations** - Resource allocation

Provide a ready-to-execute plan with specific actions.`,

  'market-research': `You are a market research expert specializing in both primary and secondary research methodologies.
Provide a comprehensive market research framework including:

**PRIMARY RESEARCH:**
1. **Survey Design** - Key questions to ask
2. **Interview Templates** - Stakeholder and customer interviews
3. **Focus Group Structure** - Discussion guides
4. **Sample Size Recommendations** - Statistical significance

**SECONDARY RESEARCH:**
1. **Industry Reports** - Key sources to reference
2. **Competitor Data** - What to analyze
3. **Market Trends** - Current and emerging
4. **Regulatory Environment** - Relevant regulations
5. **Technology Trends** - Impact on market

**ANALYSIS FRAMEWORK:**
1. **PESTLE Analysis** - Political, Economic, Social, Tech, Legal, Environmental
2. **Porter's Five Forces** - Industry analysis
3. **SWOT Analysis** - Strengths, Weaknesses, Opportunities, Threats

Provide actionable insights and specific methodologies.`,

  'competitor-analysis': `You are a competitive intelligence expert.
Provide a comprehensive competitor analysis including:
1. **Direct Competitors** - Companies offering similar products
2. **Indirect Competitors** - Alternative solutions
3. **Competitor Profiles** - Key information about each
4. **Competitive Advantages** - What makes each competitor strong
5. **Competitive Landscape Map** - Visual positioning
6. **Feature Comparison** - Product/service features matrix
7. **Pricing Comparison** - How prices compare
8. **Market Share Analysis** - Estimated market shares
9. **Competitive Gaps** - Opportunities to differentiate
10. **Strategic Recommendations** - How to compete effectively

Provide specific, actionable insights with examples and data.`
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { tool, prompt, industry, targetMarket }: ToolRequest = await req.json();

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    if (!tool || !prompt) {
      throw new Error('Tool type and prompt are required');
    }

    const systemPrompt = systemPrompts[tool];
    if (!systemPrompt) {
      throw new Error(`Unknown tool: ${tool}`);
    }

    const userMessage = `
Product/Service: ${prompt}
${industry ? `Industry: ${industry}` : ''}
${targetMarket ? `Target Market: ${targetMarket}` : ''}

Please provide a comprehensive analysis.`;

    console.log(`Processing ${tool} request for: ${prompt.substring(0, 50)}...`);

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ 
          error: 'Rate limit exceeded. Please try again in a moment.',
          retryAfter: 30
        }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      if (response.status === 402) {
        return new Response(JSON.stringify({ 
          error: 'AI credits exhausted. Please contact support.' 
        }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();
    const result = data.choices?.[0]?.message?.content;

    if (!result) {
      throw new Error('No response from AI');
    }

    console.log(`Successfully generated ${tool} analysis`);

    return new Response(JSON.stringify({ 
      result,
      tool,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-business-tools function:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
