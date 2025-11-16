import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

interface StartupComparisonRequest {
  score: number;
  category?: string;
  ideaName?: string;
  dimensions?: {
    marketOpportunity: number;
    problemSeverity: number;
    technicalFeasibility: number;
    marketTiming: number;
    founderFit: number;
    monetizationPotential: number;
  };
}

export async function POST(req: NextRequest) {
  try {
    const body: StartupComparisonRequest = await req.json();
    const { score, category = 'General', ideaName = '', dimensions } = body;

    const prompt = `You are a startup research analyst. Given a startup idea with the following validation metrics:

Score: ${score}/100
Category: ${category}
${ideaName ? `Idea: ${ideaName}` : ''}
${dimensions ? `
Dimensions:
- Market Opportunity: ${dimensions.marketOpportunity}/100
- Problem Severity: ${dimensions.problemSeverity}/100
- Technical Feasibility: ${dimensions.technicalFeasibility}/100
- Market Timing: ${dimensions.marketTiming}/100
- Founder Fit: ${dimensions.founderFit}/100
- Monetization Potential: ${dimensions.monetizationPotential}/100
` : ''}

Research and identify 5-8 real successful startups that:
1. Operate in similar or adjacent markets to "${category}"
2. Had comparable early-stage validation scores (within ±15 points of ${score})
3. Faced similar challenges or opportunities

For each startup, provide:
- Name
- Early-stage score estimate (0-100, based on their initial conditions)
- Current valuation (approximate, in billions)
- Category/Industry
- Key founding insight or story
- Relevant lesson learned

Also provide:
- Percentile ranking (where does ${score} rank compared to these successful startups)
- Closest match (which startup is most similar)
- Key insights (3-4 actionable insights from these comparisons)

Format your response as a valid JSON object with this structure:
{
  "startups": [
    {
      "name": "string",
      "earlyScore": number,
      "currentValuation": "string",
      "category": "string",
      "foundingStory": "string",
      "keyLesson": "string"
    }
  ],
  "percentileRank": number,
  "closestMatch": "string",
  "insights": ["string", "string", "string"]
}

Respond ONLY with the JSON object, no additional text.`;

    const message = await anthropic.messages.create({
      model: process.env.CLAUDE_MODEL || 'claude-3-5-haiku-20241022',
      max_tokens: 2048,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const responseText = message.content[0].type === 'text'
      ? message.content[0].text
      : '';

    // Parse JSON response from Claude
    let researchData;
    try {
      // Try to extract JSON from response (in case Claude adds extra text)
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      researchData = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(responseText);
    } catch (parseError) {
      console.error('Failed to parse Claude response:', responseText);
      throw new Error('Invalid response format from AI');
    }

    return NextResponse.json({
      success: true,
      data: researchData,
      cached: false,
    });

  } catch (error) {
    console.error('Startup comparison research error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate startup comparison',
      },
      { status: 500 }
    );
  }
}
