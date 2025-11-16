'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Info, TrendingUp, AlertTriangle } from 'lucide-react';

interface DataPoint {
  id: string;
  name: string;
  risk: number; // 0-100
  reward: number; // 0-100
  isYourIdea?: boolean;
  valuation?: string;
  category?: string;
  emoji?: string;
}

const FAMOUS_STARTUPS: DataPoint[] = [
  { id: '1', name: 'Airbnb', risk: 75, reward: 95, valuation: '$75B', category: 'Marketplace', emoji: '🏠' },
  { id: '2', name: 'Uber', risk: 80, reward: 92, valuation: '$82B', category: 'Mobility', emoji: '🚗' },
  { id: '3', name: 'Stripe', risk: 60, reward: 90, valuation: '$50B', category: 'FinTech', emoji: '💳' },
  { id: '4', name: 'Notion', risk: 55, reward: 85, valuation: '$10B', category: 'SaaS', emoji: '📝' },
  { id: '5', name: 'Dropbox', risk: 65, reward: 75, valuation: '$8B', category: 'Cloud', emoji: '📦' },
  { id: '6', name: 'Slack', risk: 50, reward: 88, valuation: '$27B', category: 'Communication', emoji: '💬' },
  { id: '7', name: 'Figma', risk: 58, reward: 87, valuation: '$20B', category: 'Design', emoji: '🎨' },
  { id: '8', name: 'Calendly', risk: 30, reward: 60, valuation: '$3B', category: 'Productivity', emoji: '📅' },
];

interface RiskRewardMatrixProps {
  yourIdea: {
    name: string;
    risk: number;
    reward: number;
    category?: string;
  };
}

export function RiskRewardMatrix({ yourIdea }: RiskRewardMatrixProps) {
  const [selectedPoint, setSelectedPoint] = useState<DataPoint | null>(null);
  const [showLabels, setShowLabels] = useState(true);

  const allPoints: DataPoint[] = [
    ...FAMOUS_STARTUPS,
    {
      id: 'your-idea',
      name: yourIdea.name,
      risk: yourIdea.risk,
      reward: yourIdea.reward,
      isYourIdea: true,
      category: yourIdea.category,
      emoji: '💡',
    },
  ];

  const getQuadrant = (risk: number, reward: number) => {
    if (risk < 50 && reward >= 50) return 'sweet-spot';
    if (risk >= 50 && reward >= 50) return 'high-risk-high-reward';
    if (risk < 50 && reward < 50) return 'low-impact';
    return 'avoid';
  };

  const quadrantInfo = {
    'sweet-spot': {
      title: 'Sweet Spot',
      description: 'Low risk, high reward - ideal zone',
      color: 'bg-green-500/20 border-green-500',
    },
    'high-risk-high-reward': {
      title: 'Moonshot',
      description: 'High risk, high reward - bold ventures',
      color: 'bg-blue-500/20 border-blue-500',
    },
    'low-impact': {
      title: 'Safe Zone',
      description: 'Low risk, low reward - incremental gains',
      color: 'bg-yellow-500/20 border-yellow-500',
    },
    avoid: {
      title: 'Danger Zone',
      description: 'High risk, low reward - generally avoid',
      color: 'bg-red-500/20 border-red-500',
    },
  };

  const yourQuadrant = getQuadrant(yourIdea.risk, yourIdea.reward);
  const similarStartups = FAMOUS_STARTUPS.filter(
    s => getQuadrant(s.risk, s.reward) === yourQuadrant
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <Card className="glass border-white/10 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-400" />
            <h3 className="font-semibold text-white">Risk vs Reward Matrix</h3>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-400 flex items-center gap-2">
              <input
                type="checkbox"
                checked={showLabels}
                onChange={e => setShowLabels(e.target.checked)}
                className="rounded"
              />
              Show Labels
            </label>
            <Badge variant="outline" className="text-xs">
              {quadrantInfo[yourQuadrant].title}
            </Badge>
          </div>
        </div>
      </Card>

      {/* Matrix */}
      <Card className="glass border-white/10 p-6">
        <div className="relative aspect-square max-h-[500px] border border-white/20 rounded-lg overflow-hidden">
          {/* Grid lines */}
          <div className="absolute inset-0">
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/20" />
            <div className="absolute top-1/2 left-0 right-0 h-px bg-white/20" />
          </div>

          {/* Quadrant labels */}
          <div className="absolute top-2 left-2 text-xs text-gray-500 font-semibold">
            Low Risk<br />High Reward
          </div>
          <div className="absolute top-2 right-2 text-xs text-gray-500 font-semibold text-right">
            High Risk<br />High Reward
          </div>
          <div className="absolute bottom-2 left-2 text-xs text-gray-500 font-semibold">
            Low Risk<br />Low Reward
          </div>
          <div className="absolute bottom-2 right-2 text-xs text-gray-500 font-semibold text-right">
            High Risk<br />Low Reward
          </div>

          {/* Axes labels */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 -translate-y-full mb-2">
            <span className="text-xs text-gray-400">Risk →</span>
          </div>
          <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full -rotate-90 ml-2">
            <span className="text-xs text-gray-400">Reward →</span>
          </div>

          {/* Data points */}
          {allPoints.map(point => {
            const x = point.risk;
            const y = 100 - point.reward; // Invert Y axis so high reward is at top

            return (
              <motion.div
                key={point.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: Math.random() * 0.5 }}
                className="absolute cursor-pointer"
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
                onClick={() => setSelectedPoint(point)}
                onMouseEnter={() => setSelectedPoint(point)}
                onMouseLeave={() => !point.isYourIdea && setSelectedPoint(null)}
              >
                <motion.div
                  whileHover={{ scale: 1.2 }}
                  className={`relative ${
                    point.isYourIdea
                      ? 'w-16 h-16 border-4 border-blue-500 shadow-lg shadow-blue-500/50'
                      : 'w-12 h-12 border-2 border-white/30'
                  } rounded-full bg-gradient-to-br from-blue-500/80 to-purple-500/80 backdrop-blur flex items-center justify-center`}
                >
                  <span className="text-2xl">{point.emoji}</span>

                  {point.isYourIdea && (
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full"
                    />
                  )}
                </motion.div>

                {showLabels && (
                  <div className="absolute top-full mt-1 left-1/2 -translate-x-1/2 whitespace-nowrap">
                    <span className={`text-xs font-semibold ${
                      point.isYourIdea ? 'text-blue-400' : 'text-gray-400'
                    }`}>
                      {point.name}
                    </span>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </Card>

      {/* Selected Point Info */}
      {selectedPoint && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className={`border p-4 ${
            selectedPoint.isYourIdea
              ? 'border-blue-500/50 bg-blue-500/10'
              : 'glass border-white/10'
          }`}>
            <div className="flex items-start gap-3">
              <div className="text-4xl">{selectedPoint.emoji}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-bold text-white">{selectedPoint.name}</h4>
                  {selectedPoint.isYourIdea && (
                    <Badge variant="secondary">Your Idea</Badge>
                  )}
                  {selectedPoint.valuation && (
                    <Badge variant="outline">{selectedPoint.valuation}</Badge>
                  )}
                </div>
                {selectedPoint.category && (
                  <p className="text-sm text-gray-400 mb-2">{selectedPoint.category}</p>
                )}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500 mb-1">Risk Level</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-red-500 h-2 rounded-full"
                          style={{ width: `${selectedPoint.risk}%` }}
                        />
                      </div>
                      <span className="text-white font-semibold">{selectedPoint.risk}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Reward Potential</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${selectedPoint.reward}%` }}
                        />
                      </div>
                      <span className="text-white font-semibold">{selectedPoint.reward}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Your Quadrant Analysis */}
      <Card className={`border p-4 ${quadrantInfo[yourQuadrant].color}`}>
        <div className="flex items-start gap-3">
          {yourQuadrant === 'sweet-spot' && <TrendingUp className="w-5 h-5" />}
          {yourQuadrant === 'avoid' && <AlertTriangle className="w-5 h-5" />}
          <div className="flex-1">
            <h4 className="font-semibold text-white mb-1">
              Your Idea is in the "{quadrantInfo[yourQuadrant].title}" Quadrant
            </h4>
            <p className="text-sm text-gray-300 mb-3">
              {quadrantInfo[yourQuadrant].description}
            </p>

            {similarStartups.length > 0 && (
              <div>
                <p className="text-xs text-gray-400 mb-2">
                  Similar successful startups in this quadrant:
                </p>
                <div className="flex flex-wrap gap-2">
                  {similarStartups.map(startup => (
                    <Badge key={startup.id} variant="secondary" className="gap-1">
                      {startup.emoji} {startup.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Legend */}
      <Card className="glass border-white/10 p-4">
        <div className="flex items-center gap-2 mb-2">
          <Info className="w-4 h-4 text-gray-400" />
          <h4 className="text-sm font-semibold text-white">How to Read This Matrix</h4>
        </div>
        <div className="grid grid-cols-2 gap-3 text-xs text-gray-400">
          <div>
            <strong className="text-gray-300">Risk</strong> = Technical complexity, market competition, resource requirements
          </div>
          <div>
            <strong className="text-gray-300">Reward</strong> = Market size, revenue potential, impact
          </div>
        </div>
      </Card>
    </div>
  );
}
