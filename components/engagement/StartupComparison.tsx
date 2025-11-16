'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Sparkles } from 'lucide-react';

interface FamousStartup {
  name: string;
  logo: string; // emoji for now
  earlyScore: number;
  currentValuation: string;
  founded: string;
  category: string;
  insight: string;
}

const famousStartups: FamousStartup[] = [
  {
    name: 'Airbnb',
    logo: '🏠',
    earlyScore: 78,
    currentValuation: '$75B',
    founded: '2008',
    category: 'Marketplace',
    insight: 'Started during recession, seemed crazy at first',
  },
  {
    name: 'Notion',
    logo: '📝',
    earlyScore: 82,
    currentValuation: '$10B',
    founded: '2016',
    category: 'SaaS',
    insight: 'Took years to find product-market fit',
  },
  {
    name: 'Stripe',
    logo: '💳',
    earlyScore: 85,
    currentValuation: '$50B',
    founded: '2010',
    category: 'FinTech',
    insight: 'Solved a painful developer problem',
  },
  {
    name: 'Figma',
    logo: '🎨',
    earlyScore: 80,
    currentValuation: '$20B',
    founded: '2012',
    category: 'Design Tool',
    insight: 'First truly collaborative design tool',
  },
  {
    name: 'Slack',
    logo: '💬',
    earlyScore: 83,
    currentValuation: '$27B',
    founded: '2013',
    category: 'Communication',
    insight: 'Born from failed gaming company',
  },
  {
    name: 'Dropbox',
    logo: '📦',
    earlyScore: 75,
    currentValuation: '$8B',
    founded: '2007',
    category: 'Cloud Storage',
    insight: 'Competed against tech giants from day 1',
  },
  {
    name: 'Canva',
    logo: '🖼️',
    earlyScore: 79,
    currentValuation: '$40B',
    founded: '2012',
    category: 'Design Tool',
    insight: 'Made design accessible to everyone',
  },
  {
    name: 'Calendly',
    logo: '📅',
    earlyScore: 72,
    currentValuation: '$3B',
    founded: '2013',
    category: 'Productivity',
    insight: 'Solved simple scheduling pain point',
  },
];

interface StartupComparisonProps {
  yourScore: number;
  category?: string;
}

export function StartupComparison({ yourScore, category }: StartupComparisonProps) {
  // Find the closest matching startup
  const closestMatch = famousStartups.reduce((prev, curr) => {
    return Math.abs(curr.earlyScore - yourScore) < Math.abs(prev.earlyScore - yourScore)
      ? curr
      : prev;
  });

  // Find startups in similar range (±10 points)
  const similarStartups = famousStartups
    .filter(s => Math.abs(s.earlyScore - yourScore) <= 10)
    .sort((a, b) => Math.abs(a.earlyScore - yourScore) - Math.abs(b.earlyScore - yourScore))
    .slice(0, 3);

  // Calculate percentile
  const percentile = Math.round(
    (famousStartups.filter(s => s.earlyScore <= yourScore).length / famousStartups.length) * 100
  );

  const getScoreComparison = () => {
    const diff = yourScore - closestMatch.earlyScore;
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
        transition={{ delay: 0.5 }}
      >
        <Card className="glass border-purple-500/30 p-6 bg-gradient-to-br from-purple-500/10 to-blue-500/10">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="w-5 h-5 text-purple-400" />
            <h3 className="text-lg font-semibold text-white">Your Idea Compares To...</h3>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-6xl">{closestMatch.logo}</div>
            <div className="flex-1">
              <h4 className="text-2xl font-bold text-white mb-1">{closestMatch.name}</h4>
              <p className="text-gray-400 text-sm mb-2">
                Now valued at <span className="text-green-400 font-bold">{closestMatch.currentValuation}</span>
              </p>
              <p className="text-gray-300 text-sm italic">"{closestMatch.insight}"</p>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Your Score</p>
                <p className="text-2xl font-bold text-blue-400">{yourScore}/100</p>
              </div>
              <div className="text-center px-4">
                <p className="text-xs text-gray-500 mb-1">vs Early {closestMatch.name}</p>
                <Badge variant="secondary" className="text-sm">
                  {getScoreComparison()}
                </Badge>
              </div>
              <div>
                <p className="text-xs text-gray-500">Their Early Score</p>
                <p className="text-2xl font-bold text-purple-400">{closestMatch.earlyScore}/100</p>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Percentile Ranking */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Card className="glass border-white/10 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-green-400" />
              <div>
                <p className="text-sm text-gray-400">Percentile Ranking</p>
                <p className="text-lg font-semibold text-white">
                  Top {100 - percentile}% of validated ideas
                </p>
              </div>
            </div>
            <div className="text-3xl font-bold text-green-400">{percentile}th</div>
          </div>
        </Card>
      </motion.div>

      {/* Similar Startups */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
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
              <div className="text-3xl mb-2">{startup.logo}</div>
              <p className="text-sm font-semibold text-white">{startup.name}</p>
              <p className="text-xs text-gray-500">{startup.earlyScore}/100 early score</p>
              <p className="text-xs text-green-400 mt-1">{startup.currentValuation} today</p>
            </Card>
          ))}
        </div>
      </motion.div>

      {/* Encouraging Message */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1 }}
        className="text-center"
      >
        <p className="text-sm text-gray-400 italic">
          Remember: {closestMatch.name} started with a similar score and is now worth{' '}
          <span className="text-green-400 font-semibold">{closestMatch.currentValuation}</span>.
          Your journey starts here! 🚀
        </p>
      </motion.div>
    </div>
  );
}
