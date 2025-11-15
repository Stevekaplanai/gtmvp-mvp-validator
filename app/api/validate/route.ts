import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { orchestrateResearch } from '@/lib/mcp/orchestrator';

// This endpoint orchestrates the MVP validation process
// It coordinates Claude + MCP research to generate the scorecard

const validateRequestSchema = z.object({
  context: z.object({
    ideaDescription: z.string(),
    targetMarket: z.enum(['B2B', 'B2C', 'Technical']),
    industry: z.string().optional(),
    techStack: z.array(z.string()).optional(),
    timeline: z.string().optional(),
    budget: z.string().optional(),
    teamSize: z.string().optional(),
  }),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { context } = validateRequestSchema.parse(body);

    // Orchestrate real MCP research across all sources
    const scorecard = await orchestrateResearch({
      query: context.ideaDescription,
      techStack: context.techStack || [],
      enableReddit: true,
      enableGitHub: true,
      enableContext7: (context.techStack?.length || 0) > 0,
      enableYouTube: true,
    });

    return NextResponse.json({
      scorecard,
      success: true,
    });
  } catch (error) {
    console.error('Validation API error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request format', details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to validate MVP idea' },
      { status: 500 }
    );
  }
}
