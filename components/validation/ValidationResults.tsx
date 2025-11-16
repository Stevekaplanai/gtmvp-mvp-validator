'use client';

import { ScoreCard } from './ScoreCard';
import { ExecutiveBrief } from './ExecutiveBrief';
import { RoadmapTimeline } from './RoadmapTimeline';
import { GTMChannelChart } from './GTMChannelChart';
import { NextStepsNavigation, buildPathSteps, pivotPathSteps, skipPathSteps } from './NextStepsNavigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';

interface DimensionScore {
  score: number;
  reasoning: string;
  color: 'green' | 'yellow' | 'red';
}

interface ValidationResultsProps {
  idea: string;
  overallScore: number;
  verdict: 'BUILD' | 'PIVOT' | 'SKIP';
  dimensions: {
    marketOpportunity: DimensionScore;
    problemSeverity: DimensionScore;
    technicalFeasibility: DimensionScore;
    marketTiming: DimensionScore;
    founderFit: DimensionScore;
    monetizationPotential: DimensionScore;
  };
  keyInsights: string[];
  immediateActions: string[];
  estimatedRevenue?: string;
  estimatedTimeline?: string;
  milestones?: Array<{
    phase: string;
    timeline: string;
    icon: 'rocket' | 'trending' | 'zap' | 'target';
    goals: string[];
    metrics: string[];
    status: 'upcoming' | 'current' | 'completed';
  }>;
  gtmChannels?: Array<{
    name: string;
    cac: number;
    conversionRate: number;
    timeToROI: number;
    difficulty: 'easy' | 'medium' | 'hard';
    effectiveness: number;
  }>;
  recommendedChannel?: string;
  depth?: 'quick' | 'deep' | 'full';
}

export function ValidationResults({
  idea,
  overallScore,
  verdict,
  dimensions,
  keyInsights,
  immediateActions,
  estimatedRevenue,
  estimatedTimeline,
  milestones,
  gtmChannels,
  recommendedChannel,
  depth = 'quick',
}: ValidationResultsProps) {
  // Determine which steps to show based on verdict
  const nextSteps = verdict === 'BUILD' ? buildPathSteps : verdict === 'PIVOT' ? pivotPathSteps : skipPathSteps;

  return (
    <div className="space-y-6">
      {/* Executive Brief - Always shown */}
      <ExecutiveBrief
        idea={idea}
        overallScore={overallScore}
        verdict={verdict}
        keyInsights={keyInsights}
        immediateActions={immediateActions}
        estimatedRevenue={estimatedRevenue}
        estimatedTimeline={estimatedTimeline}
      />

      {/* Score Cards Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        <ScoreCard
          title="Market Opportunity"
          score={dimensions.marketOpportunity.score}
          icon="🎯"
          description={dimensions.marketOpportunity.reasoning}
          color={dimensions.marketOpportunity.color}
        />
        <ScoreCard
          title="Problem Severity"
          score={dimensions.problemSeverity.score}
          icon="😫"
          description={dimensions.problemSeverity.reasoning}
          color={dimensions.problemSeverity.color}
        />
        <ScoreCard
          title="Technical Feasibility"
          score={dimensions.technicalFeasibility.score}
          icon="🛠️"
          description={dimensions.technicalFeasibility.reasoning}
          color={dimensions.technicalFeasibility.color}
        />
        <ScoreCard
          title="Market Timing"
          score={dimensions.marketTiming.score}
          icon="⏰"
          description={dimensions.marketTiming.reasoning}
          color={dimensions.marketTiming.color}
        />
        <ScoreCard
          title="Founder Fit"
          score={dimensions.founderFit.score}
          icon="👤"
          description={dimensions.founderFit.reasoning}
          color={dimensions.founderFit.color}
        />
        <ScoreCard
          title="Monetization Potential"
          score={dimensions.monetizationPotential.score}
          icon="💰"
          description={dimensions.monetizationPotential.reasoning}
          color={dimensions.monetizationPotential.color}
        />
      </div>

      {/* Deep and Full Analysis - Tabs for additional content */}
      {(depth === 'deep' || depth === 'full') && (
        <Tabs defaultValue="roadmap" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="roadmap">🗓️ Roadmap</TabsTrigger>
            <TabsTrigger value="gtm">📊 GTM Channels</TabsTrigger>
            <TabsTrigger value="next-steps">🚀 Next Steps</TabsTrigger>
          </TabsList>

          <TabsContent value="roadmap" className="mt-6">
            {milestones && milestones.length > 0 ? (
              <RoadmapTimeline milestones={milestones} />
            ) : (
              <Card className="glass border-white/10 p-6">
                <p className="text-gray-400 text-center">
                  Roadmap will be available in full analysis mode
                </p>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="gtm" className="mt-6">
            {gtmChannels && gtmChannels.length > 0 ? (
              <GTMChannelChart channels={gtmChannels} recommendedChannel={recommendedChannel} />
            ) : (
              <Card className="glass border-white/10 p-6">
                <p className="text-gray-400 text-center">
                  GTM channel analysis will be available in full analysis mode
                </p>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="next-steps" className="mt-6">
            <NextStepsNavigation verdict={verdict} steps={nextSteps} currentStepId="validation" />
          </TabsContent>
        </Tabs>
      )}

      {/* Quick Validation - Just show next steps inline */}
      {depth === 'quick' && (
        <NextStepsNavigation verdict={verdict} steps={nextSteps} currentStepId="validation" />
      )}

      {/* Upgrade Prompts */}
      {depth === 'quick' && (
        <Card className="glass border-blue-500/30 p-6 text-center bg-blue-500/5">
          <h3 className="text-lg font-bold text-white mb-2">💡 Want Deeper Analysis?</h3>
          <p className="text-gray-400 mb-4">
            Get community research, competitive landscape, market sizing, and revenue projections
          </p>
          <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors">
            Request Deep Dive Analysis
          </button>
        </Card>
      )}

      {depth === 'deep' && (
        <Card className="glass border-purple-500/30 p-6 text-center bg-purple-500/5">
          <h3 className="text-lg font-bold text-white mb-2">🚀 Ready for Full 40-Step Analysis?</h3>
          <p className="text-gray-400 mb-4">
            Get complete execution roadmap, pricing strategy, multi-channel GTM tactics, and 90-day milestones
          </p>
          <button className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-semibold transition-colors">
            Get Full Validation Report
          </button>
        </Card>
      )}
    </div>
  );
}

// Helper function to parse validation data from Claude's text response
export function parseValidationFromText(text: string): Partial<ValidationResultsProps> | null {
  try {
    // This is a placeholder for parsing logic
    // In production, you'd extract structured data from Claude's markdown response
    // For now, return null to indicate parsing is needed
    return null;
  } catch (error) {
    console.error('Error parsing validation data:', error);
    return null;
  }
}

// Mock data generator for testing
export function generateMockValidationData(verdict: 'BUILD' | 'PIVOT' | 'SKIP'): ValidationResultsProps {
  const baseScore = verdict === 'BUILD' ? 80 : verdict === 'PIVOT' ? 60 : 40;

  return {
    idea: 'AI-powered MVP validation platform',
    overallScore: baseScore,
    verdict,
    dimensions: {
      marketOpportunity: {
        score: baseScore + 10,
        reasoning: 'Large addressable market with growing demand for validation tools',
        color: baseScore + 10 >= 70 ? 'green' : baseScore + 10 >= 50 ? 'yellow' : 'red',
      },
      problemSeverity: {
        score: baseScore + 5,
        reasoning: 'Entrepreneurs waste significant time on unvalidated ideas',
        color: baseScore + 5 >= 70 ? 'green' : baseScore + 5 >= 50 ? 'yellow' : 'red',
      },
      technicalFeasibility: {
        score: baseScore - 5,
        reasoning: 'Requires AI integration but leverages existing APIs',
        color: baseScore - 5 >= 70 ? 'green' : baseScore - 5 >= 50 ? 'yellow' : 'red',
      },
      marketTiming: {
        score: baseScore + 15,
        reasoning: 'AI tools are trending, validation is evergreen need',
        color: baseScore + 15 >= 70 ? 'green' : baseScore + 15 >= 50 ? 'yellow' : 'red',
      },
      founderFit: {
        score: baseScore,
        reasoning: 'Strong technical background needed for AI implementation',
        color: baseScore >= 70 ? 'green' : baseScore >= 50 ? 'yellow' : 'red',
      },
      monetizationPotential: {
        score: baseScore + 5,
        reasoning: 'Multiple revenue streams: SaaS, consulting, premium features',
        color: baseScore + 5 >= 70 ? 'green' : baseScore + 5 >= 50 ? 'yellow' : 'red',
      },
    },
    keyInsights: [
      'Strong market demand for AI-powered validation tools',
      'Competitive landscape is fragmented with room for innovation',
      'Technical execution is feasible with Claude API integration',
      'Multiple monetization paths available',
    ],
    immediateActions: [
      'Set up Claude API integration and test validation prompts',
      'Research competitor pricing and positioning',
      'Build MVP landing page to capture early interest',
      'Conduct user interviews with 10 potential customers',
    ],
    estimatedRevenue: '$120K-$250K',
    estimatedTimeline: '8-12 weeks',
    milestones: [
      {
        phase: 'MVP Launch',
        timeline: 'Weeks 1-4',
        icon: 'rocket',
        goals: ['Core validation engine', 'Basic UI', 'Claude API integration'],
        metrics: ['100 test validations', '10 beta users', 'Sub-3s response time'],
        status: 'current',
      },
      {
        phase: 'Market Validation',
        timeline: 'Weeks 5-8',
        icon: 'trending',
        goals: ['User feedback collection', 'Feature refinement', 'Pricing model'],
        metrics: ['50 active users', '80% satisfaction', 'Define pricing tiers'],
        status: 'upcoming',
      },
      {
        phase: 'Growth & Scale',
        timeline: 'Weeks 9-12',
        icon: 'zap',
        goals: ['Marketing launch', 'Content creation', 'Partnership outreach'],
        metrics: ['500 signups', '$5K MRR', '20% conversion'],
        status: 'upcoming',
      },
    ],
    gtmChannels: [
      {
        name: 'Content SEO',
        cac: 35,
        conversionRate: 8,
        timeToROI: 6,
        difficulty: 'medium',
        effectiveness: 85,
      },
      {
        name: 'LinkedIn Outbound',
        cac: 120,
        conversionRate: 12,
        timeToROI: 2,
        difficulty: 'easy',
        effectiveness: 78,
      },
      {
        name: 'Paid Ads',
        cac: 180,
        conversionRate: 5,
        timeToROI: 1,
        difficulty: 'hard',
        effectiveness: 65,
      },
    ],
    recommendedChannel: 'Content SEO',
    depth: 'full',
  };
}
