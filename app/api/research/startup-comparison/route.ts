import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

interface ResearchedStartup {
  name: string;
  earlyScore: number;
  currentValuation: string;
  category: string;
  foundingStory: string;
  keyLesson: string;
}

interface ResearchData {
  startups: ResearchedStartup[];
  percentileRank: number;
  closestMatch: string;
  insights: string[];
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { score, category, ideaName, dimensions } = body;

    const ideaContext = `User's Idea Score: ${score}/100
Category: ${category || 'General'}
${ideaName ? `Idea Name/Description: ${ideaName}` : ''}
${dimensions ? `Dimension Scores:
- Market Opportunity: ${dimensions.marketOpportunity}/100
- Problem Severity: ${dimensions.problemSeverity}/100
- Technical Feasibility: ${dimensions.technicalFeasibility}/100
- Market Timing: ${dimensions.marketTiming}/100
- Founder Fit: ${dimensions.founderFit}/100
- Monetization Potential: ${dimensions.monetizationPotential}/100` : ''}`.trim();

    const message = await anthropic.messages.create({
      model: 'claude-3-5-haiku-20241022',
      max_tokens: 2048,
      temperature: 0.7,
      messages: [{
        role: 'user',
        content: `You are a startup research analyst. Research 5-8 successful startups that had similar characteristics to the user's idea when they were just starting out.

${ideaContext}

Based on this score and characteristics, find real successful startups that had similar early validation scores, were in similar categories, or faced similar challenges.

For each startup, provide:
1. Name (real company)
2. Estimated early validation score (0-100)
3. Current valuation (use real data)
4. Category
5. Founding story (one compelling sentence)
6. Key lesson (one sentence)

Also provide percentile rank, closest match startup name, and 3-4 insights.

CRITICAL: Return ONLY valid JSON in this exact format:
{
  "startups": [{
    "name": "Company Name",
    "earlyScore": 75,
    "currentValuation": "$10B",
    "category": "SaaS",
    "foundingStory": "Started in a garage during recession",
    "keyLesson": "Focused on one problem exceptionally well"
  }],
  "percentileRank": 72,
  "closestMatch": "Company Name",
  "insights": ["insight 1", "insight 2"]
}`,
      }],
    });

    const content = message.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type from Claude');
    }

    let jsonText = content.text.trim();
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/^```json\n?/, '').replace(/\n?```$/, '');
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/^```\n?/, '').replace(/\n?```$/, '');
    }

    const researchData: ResearchData = JSON.parse(jsonText);

    if (!researchData.startups || !Array.isArray(researchData.startups) || researchData.startups.length === 0) {
      throw new Error('Invalid research data structure');
    }

    researchData.startups.forEach((startup, index) => {
      if (!startup.name || !startup.category || !startup.foundingStory || !startup.keyLesson) {
        throw new Error(`Invalid startup data at index ${index}`);
      }
      startup.earlyScore = Number(startup.earlyScore) || 50;
    });

    return NextResponse.json({
      success: true,
      data: researchData,
    });

  } catch (error) {
    console.error('Startup comparison research error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate startup research',
      },
      { status: 500 }
    );
  }
}
