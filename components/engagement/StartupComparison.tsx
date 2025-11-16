'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Sparkles, Loader2 } from 'lucide-react';

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

interface StartupComparisonProps {
  yourScore: number;
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

// Emoji mapping for startup categories
const getCategoryEmoji = (category: string): string => {
  const lowerCategory = category.toLowerCase();
  if (lowerCategory.includes('marketplace')) return '🏪';
  if (lowerCategory.includes('saas') || lowerCategory.includes('software')) return '💻';
  if (lowerCategory.includes('fintech') || lowerCategory.includes('payment')) return '💳';
  if (lowerCategory.includes('design')) return '🎨';
  if (lowerCategory.includes('communication') || lowerCategory.includes('social')) return '💬';
  if (lowerCategory.includes('storage') || lowerCategory.includes('cloud')) return '☁️';
  if (lowerCategory.includes('productivity')) return '📊';
  if (lowerCategory.includes('health')) return '🏥';
  if (lowerCategory.includes('education')) return '📚';
  if (lowerCategory.includes('ai') || lowerCategory.includes('ml')) return '🤖';
  return '🚀';
};

export function StartupComparison({ yourScore, category, ideaName, dimensions }: StartupComparisonProps) {
  const [researchData, setResearchData] = useState<ResearchData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResearch = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/research/startup-comparison', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            score: yourScore,
            category,
            ideaName,
            dimensions,
          }),
        });

        const result = await response.json();

        if (result.success) {
          setResearchData(result.data);
        } else {
          throw new Error(result.error || 'Failed to fetch research');
        }
      } catch (err) {
        console.error('Startup comparison error:', err);
        setError(err instanceof Error ? err.message : 'Failed to load startup comparisons');
      } finally {
        setIsLoading(false);
      }
    };

    fetchResearch();
  }, [yourScore, category, ideaName, dimensions]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-purple-400 animate-spin mx-auto mb-4" />
          <p className="text-sm text-gray-400">Researching similar successful startups...</p>
          <p className="text-xs text-gray-500 mt-1">Analyzing market data and historical patterns</p>
        </div>
      </div>
    );
  }

  if (error || !researchData) {
    return (
      <Card className="glass border-red-500/30 p-6 bg-red-500/10">
        <p className="text-red-400 text-center">
          {error || 'Unable to load startup comparisons'}
        </p>
      </Card>
    );
  }

  const closestMatchStartup = researchData.startups.find(
    s => s.name === researchData.closestMatch
  ) || researchData.startups[0];

  const similarStartups = researchData.startups
    .filter(s => Math.abs(s.earlyScore - yourScore) <= 15)
    .slice(0, 3);

  const getScoreComparison = () => {
    const diff = yourScore - closestMatchStartup.earlyScore;
    if (diff > 5) return `${diff} points higher than`;
    if (diff < -5) return `${Math.abs(diff)} points lower than`;
    return 'nearly identical to';
  };

  return (
    <div className="space-y-6">
      {/* Main Comparison Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="glass border-purple-500/30 p-6 bg-gradient-to-br from-purple-500/10 to-blue-500/10">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="w-5 h-5 text-purple-400" />
            <h3 className="text-lg font-semibold text-white">Your Idea Compares To...</h3>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-6xl">{getCategoryEmoji(closestMatchStartup.category)}</div>
            <div className="flex-1">
              <h4 className="text-2xl font-bold text-white mb-1">{closestMatchStartup.name}</h4>
              <p className="text-gray-400 text-sm mb-2">
                Now valued at <span className="text-green-400 font-bold">{closestMatchStartup.currentValuation}</span>
              </p>
              <p className="text-gray-300 text-sm italic">"{closestMatchStartup.foundingStory}"</p>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Your Score</p>
                <p className="text-2xl font-bold text-blue-400">{yourScore}/100</p>
              </div>
              <div className="text-center px-4">
                <p className="text-xs text-gray-500 mb-1">vs Early {closestMatchStartup.name}</p>
                <Badge variant="secondary" className="text-sm">
                  {getScoreComparison()}
                </Badge>
              </div>
              <div>
                <p className="text-xs text-gray-500">Their Early Score</p>
                <p className="text-2xl font-bold text-purple-400">{closestMatchStartup.earlyScore}/100</p>
              </div>
            </div>
          </div>

          {/* Key Lesson */}
          <div className="mt-4 pt-4 border-t border-white/10">
            <p className="text-xs text-gray-500 mb-2">Key Lesson from {closestMatchStartup.name}</p>
            <p className="text-sm text-gray-300">{closestMatchStartup.keyLesson}</p>
          </div>
        </Card>
      </motion.div>

      {/* Percentile Ranking */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="glass border-white/10 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-green-400" />
              <div>
                <p className="text-sm text-gray-400">Percentile Ranking</p>
                <p className="text-lg font-semibold text-white">
                  Top {100 - researchData.percentileRank}% of validated ideas
                </p>
              </div>
            </div>
            <div className="text-3xl font-bold text-green-400">{researchData.percentileRank}th</div>
          </div>
        </Card>
      </motion.div>

      {/* AI-Generated Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="glass border-blue-500/30 p-5 bg-blue-500/5">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <h4 className="text-sm font-semibold text-white">AI Research Insights</h4>
          </div>
          <ul className="space-y-2">
            {researchData.insights.map((insight, index) => (
              <li key={index} className="flex gap-2 text-sm text-gray-300">
                <span className="text-blue-400 flex-shrink-0">•</span>
                <span>{insight}</span>
              </li>
            ))}
          </ul>
        </Card>
      </motion.div>

      {/* Similar Startups */}
      {similarStartups.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <h4 className="text-sm font-semibold text-gray-400 mb-3">
            Other startups in your score range:
          </h4>
          <div className="grid grid-cols-3 gap-3">
            {similarStartups.map((startup, index) => (
              <Card
                key={startup.name}
                className="glass border-white/10 p-3 hover:border-blue-500/50 transition-all cursor-pointer"
              >
                <div className="text-3xl mb-2">{getCategoryEmoji(startup.category)}</div>
                <p className="text-sm font-semibold text-white truncate">{startup.name}</p>
                <p className="text-xs text-gray-500">{startup.earlyScore}/100 early score</p>
                <p className="text-xs text-green-400 mt-1">{startup.currentValuation} today</p>
              </Card>
            ))}
          </div>
        </motion.div>
      )}

      {/* All Researched Startups */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0 }}
      >
        <details className="glass border-white/10 rounded-lg p-4">
          <summary className="text-sm font-semibold text-gray-400 cursor-pointer hover:text-white transition-colors">
            View all {researchData.startups.length} researched startups →
          </summary>
          <div className="mt-4 space-y-3">
            {researchData.startups.map((startup, index) => (
              <div key={startup.name} className="border-l-2 border-purple-500/30 pl-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">{getCategoryEmoji(startup.category)}</span>
                  <h5 className="font-semibold text-white">{startup.name}</h5>
                  <Badge variant="outline" className="text-xs">
                    {startup.earlyScore}/100
                  </Badge>
                </div>
                <p className="text-xs text-gray-400 mb-1">{startup.category} • {startup.currentValuation}</p>
                <p className="text-sm text-gray-300 italic mb-1">"{startup.foundingStory}"</p>
                <p className="text-xs text-gray-400">💡 {startup.keyLesson}</p>
              </div>
            ))}
          </div>
        </details>
      </motion.div>

      {/* Encouraging Message */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="text-center"
      >
        <p className="text-sm text-gray-400 italic">
          Remember: {closestMatchStartup.name} started with a similar score and is now worth{' '}
          <span className="text-green-400 font-semibold">{closestMatchStartup.currentValuation}</span>.
          Your journey starts here! 🚀
        </p>
      </motion.div>
    </div>
  );
}
