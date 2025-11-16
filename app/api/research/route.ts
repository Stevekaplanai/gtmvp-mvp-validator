import { NextRequest, NextResponse } from 'next/server';
import type { CommunitySignals } from '@/lib/types/validation';

/**
 * Research API endpoint - conducts real-time market research using MCP servers
 *
 * Available MCP capabilities:
 * - Reddit: Community sentiment, pain points, discussions
 * - YouTube: Content gaps, tutorial demand, search volume
 * - GitHub: Competitive repos, technical feasibility
 * - Context7: General web research, market data
 */

export async function POST(request: NextRequest) {
  try {
    const { idea, depth = 'quick' } = await request.json();

    if (!idea || typeof idea !== 'string') {
      return NextResponse.json(
        { error: 'Invalid idea parameter' },
        { status: 400 }
      );
    }

    // Feature flag check
    const researchEnabled = process.env.ENABLE_REAL_TIME_RESEARCH === 'true';
    if (!researchEnabled) {
      return NextResponse.json({
        success: true,
        data: getMockResearchData(),
        message: 'Real-time research disabled - returning mock data',
      });
    }

    // Extract search keywords from idea
    const keywords = extractKeywords(idea);

    // Conduct research across MCP servers
    // Note: In production, this will use Claude's MCP tool calling
    // For now, returning structured mock data that matches the expected format

    const researchData: CommunitySignals = {
      reddit: {
        relevantSubreddits: await searchReddit(keywords),
        painPointFrequency: 0,
        solutionDemand: 0,
        topDiscussions: [],
        trendingTopics: [],
      },
      youtube: {
        searchVolume: '0',
        contentGaps: [],
        topVideos: [],
        tutorialDemand: 'low',
      },
      github: {
        competingRepos: [],
        openIssues: [],
        marketGaps: [],
        technicalFeasibility: 'moderate',
      },
    };

    return NextResponse.json({
      success: true,
      data: researchData,
      depth,
    });

  } catch (error) {
    console.error('Research API error:', error);
    return NextResponse.json(
      { error: 'Failed to conduct research' },
      { status: 500 }
    );
  }
}

function extractKeywords(idea: string): string[] {
  const stopWords = new Set([
    'the', 'a', 'an', 'for', 'to', 'in', 'on', 'with', 'that',
    'helps', 'allows', 'enables', 'makes', 'lets', 'users'
  ]);

  return idea
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 3 && !stopWords.has(word))
    .slice(0, 5);
}

async function searchReddit(keywords: string[]): Promise<string[]> {
  // TODO: Implement actual MCP Reddit search
  // This will use Claude's MCP tools to search Reddit for relevant subreddits

  // Placeholder implementation
  return [];
}

function getMockResearchData(): CommunitySignals {
  return {
    reddit: {
      relevantSubreddits: ['r/SaaS', 'r/startups', 'r/entrepreneur'],
      painPointFrequency: 75,
      solutionDemand: 82,
      topDiscussions: [
        {
          title: 'Looking for better solutions for...',
          url: '#',
          upvotes: 245,
          comments: 89,
          sentiment: 'positive',
        },
      ],
      trendingTopics: ['automation', 'workflow', 'productivity'],
    },
    youtube: {
      searchVolume: '10K-100K monthly',
      contentGaps: ['Advanced tutorials', 'Integration guides'],
      topVideos: [
        {
          title: 'How to automate...',
          views: 45000,
          channel: 'TechChannel',
        },
      ],
      tutorialDemand: 'high',
    },
    github: {
      competingRepos: [
        {
          name: 'competitor-solution',
          stars: 1200,
          description: 'Similar tool',
          lastUpdate: '2 weeks ago',
        },
      ],
      openIssues: ['Feature requests for similar functionality'],
      marketGaps: ['Better UX', 'Easier setup', 'More integrations'],
      technicalFeasibility: 'moderate',
    },
  };
}
