// Enhanced validation types for comprehensive market analysis

export interface ValidationScore {
  overall: number; // 0-100
  dimensions: {
    marketOpportunity: DimensionScore;
    problemSeverity: DimensionScore;
    technicalFeasibility: DimensionScore;
    marketTiming: DimensionScore;
    founderFit: DimensionScore;
    monetizationPotential: DimensionScore;
  };
}

export interface DimensionScore {
  score: number; // 0-100
  reasoning: string;
  evidence: string[];
  signals: 'strong' | 'moderate' | 'weak';
}

export interface CommunitySignals {
  reddit: RedditSignals;
  youtube: YouTubeSignals;
  github: GitHubSignals;
}

export interface RedditSignals {
  relevantSubreddits: string[];
  painPointFrequency: number;
  solutionDemand: number;
  topDiscussions: Array<{
    title: string;
    url: string;
    upvotes: number;
    comments: number;
    sentiment: 'positive' | 'neutral' | 'negative';
  }>;
  trendingTopics: string[];
}

export interface YouTubeSignals {
  searchVolume: string;
  contentGaps: string[];
  topVideos: Array<{
    title: string;
    views: number;
    channel: string;
  }>;
  tutorialDemand: 'high' | 'medium' | 'low';
}

export interface GitHubSignals {
  competingRepos: Array<{
    name: string;
    stars: number;
    description: string;
    lastUpdate: string;
  }>;
  openIssues: string[];
  marketGaps: string[];
  technicalFeasibility: 'easy' | 'moderate' | 'complex';
}

export interface CompetitiveLandscape {
  directCompetitors: Competitor[];
  indirectCompetitors: Competitor[];
  marketGaps: string[];
  differentiationOpportunities: string[];
}

export interface Competitor {
  name: string;
  description: string;
  strengths: string[];
  weaknesses: string[];
  marketShare?: string;
  pricing?: string;
}

export interface MarketSizing {
  tam: {
    value: string;
    reasoning: string;
  };
  sam: {
    value: string;
    reasoning: string;
  };
  som: {
    value: string;
    reasoning: string;
  };
  revenueProjections: {
    year1: string;
    year2: string;
    year3: string;
    assumptions: string[];
  };
}

export interface GTMStrategy {
  pricing: PricingStrategy;
  channels: Channel[];
  roadmap: Milestone[];
}

export interface PricingStrategy {
  model: 'freemium' | 'subscription' | 'one-time' | 'usage-based' | 'hybrid';
  tiers: PricingTier[];
  valueLadder: string[];
  revenueProjection: string;
}

export interface PricingTier {
  name: string;
  price: string;
  features: string[];
  targetCustomer: string;
}

export interface Channel {
  name: string;
  priority: 'primary' | 'secondary' | 'tertiary';
  tactics: string[];
  estimatedCAC: string;
  estimatedConversion: string;
}

export interface Milestone {
  phase: 'MVP' | '30-day' | '60-day' | '90-day' | 'Scale';
  timeline: string;
  goals: string[];
  keyMetrics: string[];
  deliverables: string[];
}

export interface DeepValidationReport {
  idea: string;
  score: ValidationScore;
  communitySignals: CommunitySignals;
  competitiveLandscape: CompetitiveLandscape;
  marketSizing: MarketSizing;
  gtmStrategy: GTMStrategy;
  verdict: 'BUILD' | 'PIVOT' | 'SKIP';
  confidence: 'high' | 'medium' | 'low';
  keyInsights: string[];
  actionableSteps: string[];
  researchSources: string[];
}

export type ValidationDepth = 'quick' | 'deep' | 'full';

export interface ValidationRequest {
  idea: string;
  depth: ValidationDepth;
  userContext?: {
    industry?: string;
    experience?: string;
    budget?: string;
    timeline?: string;
  };
}
