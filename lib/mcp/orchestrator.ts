// MCP Research Orchestrator - coordinates all research sources

import { researchGitHub } from './github-research';
import { researchContext7 } from './context7-research';
import { researchReddit } from './reddit-research';
import { researchYouTube } from './youtube-research';
import { Scorecard, ResearchStatus, Evidence } from '../types';

export interface ResearchOptions {
  query: string;
  techStack?: string[];
  enableReddit?: boolean;
  enableGitHub?: boolean;
  enableContext7?: boolean;
  enableYouTube?: boolean;
}

export async function orchestrateResearch(
  options: ResearchOptions,
  onProgress?: (status: ResearchStatus) => void
): Promise<Scorecard> {
  const {
    query,
    techStack = [],
    enableReddit = true,
    enableGitHub = true,
    enableContext7 = true,
    enableYouTube = true,
  } = options;

  // Initialize research status
  const status: ResearchStatus = {
    reddit: enableReddit ? 'pending' : 'complete',
    github: enableGitHub ? 'pending' : 'complete',
    context7: enableContext7 && techStack.length > 0 ? 'pending' : 'complete',
    youtube: enableYouTube ? 'pending' : 'complete',
  };

  onProgress?.(status);

  const evidence: Evidence[] = [];
  let marketDemandScore = 50;
  let competitionScore = 50;
  let technicalScore = 50;
  let timingScore = 50;

  // Reddit research (Market Demand)
  if (enableReddit) {
    try {
      status.reddit = 'analyzing';
      onProgress?.(status);

      const redditData = await researchReddit(query);
      status.reddit = 'complete';
      status.redditResults = redditData.discussionCount;
      onProgress?.(status);

      // Calculate market demand score
      marketDemandScore = Math.min(100, 50 + redditData.discussionCount / 3);

      evidence.push({
        source: 'reddit',
        type: redditData.discussionCount > 50 ? 'positive' : 'neutral',
        content: redditData.analysis,
      });
    } catch (error) {
      status.reddit = 'error';
      onProgress?.(status);
    }
  }

  // GitHub research (Competition)
  if (enableGitHub) {
    try {
      status.github = 'analyzing';
      onProgress?.(status);

      const githubData = await researchGitHub(query);
      status.github = 'complete';
      status.githubResults = githubData.repositoryCount;
      onProgress?.(status);

      // Calculate competition score (inverse - fewer competitors = higher score)
      competitionScore = Math.max(30, 90 - githubData.repositoryCount * 5);

      evidence.push({
        source: 'github',
        type: githubData.repositoryCount > 10 ? 'negative' : 'positive',
        content: githubData.analysis,
      });
    } catch (error) {
      status.github = 'error';
      onProgress?.(status);
    }
  }

  // Context7 research (Technical Feasibility)
  if (enableContext7 && techStack.length > 0) {
    try {
      status.context7 = 'analyzing';
      onProgress?.(status);

      const context7Data = await researchContext7(techStack);
      status.context7 = 'complete';
      onProgress?.(status);

      technicalScore = context7Data.feasibilityScore;

      evidence.push({
        source: 'context7',
        type: context7Data.feasibilityScore > 70 ? 'positive' : 'neutral',
        content: context7Data.analysis,
      });
    } catch (error) {
      status.context7 = 'error';
      onProgress?.(status);
    }
  }

  // YouTube research (Market Timing)
  if (enableYouTube) {
    try {
      status.youtube = 'analyzing';
      onProgress?.(status);

      const youtubeData = await researchYouTube(query);
      status.youtube = 'complete';
      status.youtubeResults = youtubeData.videoCount;
      onProgress?.(status);

      // Calculate timing score based on trend
      timingScore = youtubeData.trendAnalysis === 'rising' ? 85 :
                    youtubeData.trendAnalysis === 'stable' ? 65 : 45;

      evidence.push({
        source: 'youtube',
        type: youtubeData.trendAnalysis === 'rising' ? 'positive' : 'neutral',
        content: youtubeData.analysis,
      });
    } catch (error) {
      status.youtube = 'error';
      onProgress?.(status);
    }
  }

  // Calculate overall score (weighted average)
  const overall = Math.round(
    marketDemandScore * 0.3 +
    competitionScore * 0.25 +
    technicalScore * 0.3 +
    timingScore * 0.15
  );

  // Generate AI narrative
  const narrative = generateNarrative({
    overall,
    marketDemandScore,
    competitionScore,
    technicalScore,
    timingScore,
    evidence,
  });

  const recommendations = generateRecommendations({
    overall,
    marketDemandScore,
    competitionScore,
    technicalScore,
    timingScore,
  });

  return {
    overall,
    dimensions: {
      marketDemand: {
        score: Math.round(marketDemandScore),
        confidence: marketDemandScore > 70 ? 'high' : marketDemandScore > 50 ? 'medium' : 'low',
        factors: evidence.filter(e => e.source === 'reddit').map(e => e.content),
        summary: `Market demand score: ${Math.round(marketDemandScore)}/100`,
      },
      competition: {
        score: Math.round(competitionScore),
        confidence: competitionScore > 60 ? 'high' : competitionScore > 40 ? 'medium' : 'low',
        factors: evidence.filter(e => e.source === 'github').map(e => e.content),
        summary: `Competition level: ${Math.round(competitionScore)}/100`,
      },
      technicalFeasibility: {
        score: Math.round(technicalScore),
        confidence: technicalScore > 75 ? 'high' : technicalScore > 55 ? 'medium' : 'low',
        factors: evidence.filter(e => e.source === 'context7').map(e => e.content),
        summary: `Technical feasibility: ${Math.round(technicalScore)}/100`,
      },
      marketTiming: {
        score: Math.round(timingScore),
        confidence: timingScore > 70 ? 'high' : timingScore > 55 ? 'medium' : 'low',
        factors: evidence.filter(e => e.source === 'youtube').map(e => e.content),
        summary: `Market timing: ${Math.round(timingScore)}/100`,
      },
    },
    narrative,
    recommendations,
    evidence,
  };
}

function generateNarrative(data: {
  overall: number;
  marketDemandScore: number;
  competitionScore: number;
  technicalScore: number;
  timingScore: number;
  evidence: Evidence[];
}): string {
  const { overall, marketDemandScore, competitionScore, technicalScore, timingScore } = data;

  let verdict = '';
  if (overall >= 75) {
    verdict = 'This is a strong MVP opportunity with favorable conditions across multiple dimensions.';
  } else if (overall >= 60) {
    verdict = 'This MVP shows promise but has some challenges to address.';
  } else if (overall >= 45) {
    verdict = 'This MVP faces significant challenges and requires careful consideration.';
  } else {
    verdict = 'This MVP faces major obstacles that may make it difficult to succeed.';
  }

  const strengths: string[] = [];
  const weaknesses: string[] = [];

  if (marketDemandScore > 70) strengths.push('strong market demand');
  else if (marketDemandScore < 50) weaknesses.push('limited market validation');

  if (competitionScore > 65) strengths.push('favorable competitive landscape');
  else if (competitionScore < 45) weaknesses.push('heavy competition');

  if (technicalScore > 75) strengths.push('high technical feasibility');
  else if (technicalScore < 55) weaknesses.push('technical complexity');

  if (timingScore > 70) strengths.push('excellent market timing');
  else if (timingScore < 50) weaknesses.push('challenging market timing');

  let narrative = `${verdict}\n\n`;

  if (strengths.length > 0) {
    narrative += `**Key Strengths:**\n- ${strengths.join('\n- ')}\n\n`;
  }

  if (weaknesses.length > 0) {
    narrative += `**Areas of Concern:**\n- ${weaknesses.join('\n- ')}\n\n`;
  }

  narrative += `**Overall Assessment:** With a score of ${overall}/100, `;
  if (overall >= 75) {
    narrative += 'this MVP is well-positioned for success. The data supports moving forward with development.';
  } else if (overall >= 60) {
    narrative += 'this MVP is viable but should address the identified weaknesses before launch.';
  } else if (overall >= 45) {
    narrative += 'this MVP needs significant refinement or pivoting before proceeding.';
  } else {
    narrative += 'consider exploring alternative approaches or pivoting to a different opportunity.';
  }

  return narrative;
}

function generateRecommendations(data: {
  overall: number;
  marketDemandScore: number;
  competitionScore: number;
  technicalScore: number;
  timingScore: number;
}): string[] {
  const recommendations: string[] = [];
  const { overall, marketDemandScore, competitionScore, technicalScore, timingScore } = data;

  if (overall >= 70) {
    recommendations.push('Start MVP development within 2-4 weeks');
    recommendations.push('Plan for 3-6 month development timeline');
  } else if (overall >= 50) {
    recommendations.push('Refine concept and validate assumptions before building');
    recommendations.push('Consider smaller scope for faster validation');
  } else {
    recommendations.push('Conduct additional market research before proceeding');
    recommendations.push('Consider pivoting or exploring alternative solutions');
  }

  if (marketDemandScore < 60) {
    recommendations.push('Increase community engagement to validate demand');
    recommendations.push('Conduct user interviews with target market');
  }

  if (competitionScore < 50) {
    recommendations.push('Identify clear differentiation strategy');
    recommendations.push('Study competitor weaknesses and gaps');
  }

  if (technicalScore < 60) {
    recommendations.push('Simplify technical approach or choose proven stack');
    recommendations.push('Allocate time for technical prototyping');
  }

  if (timingScore < 60) {
    recommendations.push('Monitor market trends closely');
    recommendations.push('Consider timing of launch carefully');
  }

  return recommendations;
}
