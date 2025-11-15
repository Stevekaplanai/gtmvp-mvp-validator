// Core application types for GTMVP MVP Validator

export type ChatMode = 'validator' | 'knowledge';

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  metadata?: {
    researchStatus?: ResearchStatus;
    scorecard?: Scorecard;
  };
}

export interface ResearchStatus {
  reddit: 'pending' | 'analyzing' | 'complete' | 'error';
  github: 'pending' | 'analyzing' | 'complete' | 'error';
  context7: 'pending' | 'analyzing' | 'complete' | 'error';
  youtube: 'pending' | 'analyzing' | 'complete' | 'error';
  redditResults?: number;
  githubResults?: number;
  youtubeResults?: number;
}

export interface Scorecard {
  overall: number; // 0-100
  dimensions: {
    marketDemand: DimensionScore;
    competition: DimensionScore;
    technicalFeasibility: DimensionScore;
    marketTiming: DimensionScore;
  };
  narrative: string;
  recommendations: string[];
  evidence: Evidence[];
}

export interface DimensionScore {
  score: number; // 0-100
  confidence: 'low' | 'medium' | 'high';
  factors: string[];
  summary: string;
}

export interface Evidence {
  source: 'reddit' | 'github' | 'youtube' | 'context7';
  type: 'positive' | 'negative' | 'neutral';
  content: string;
  url?: string;
}

export interface ValidationContext {
  ideaDescription: string;
  targetMarket: 'B2B' | 'B2C' | 'Technical';
  industry?: string;
  techStack?: string[];
  timeline?: string;
  budget?: string;
  teamSize?: string;
}

export interface ConversationState {
  stage: 'intro' | 'intake' | 'research' | 'scoring' | 'results';
  context: Partial<ValidationContext>;
  messages: Message[];
  currentQuestion?: string;
}

// Knowledge base types
export interface KnowledgeSource {
  id: string;
  type: 'github' | 'notion' | 'manual';
  content: string;
  metadata: {
    title?: string;
    url?: string;
    category?: 'service' | 'pricing' | 'case-study' | 'technical';
    lastUpdated?: Date;
  };
  embedding?: number[];
}

export interface ChatbotContext {
  sources: KnowledgeSource[];
  relevanceScore: number;
}
