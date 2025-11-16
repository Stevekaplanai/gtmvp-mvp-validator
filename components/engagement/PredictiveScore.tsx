'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  TrendingUp,
  DollarSign,
  Users,
  Target,
  Clock,
  Sparkles,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  RefreshCw,
} from 'lucide-react';

interface PredictiveScoreProps {
  dimensions: {
    marketOpportunity: number;
    problemSeverity: number;
    technicalFeasibility: number;
    marketTiming: number;
    founderFit: number;
    monetizationPotential: number;
  };
  category?: string;
}

interface Milestone {
  period: string;
  metric: string;
  prediction: number;
  confidence: [number, number];
  description: string;
}

interface SuccessFactors {
  factor: string;
  impact: 'high' | 'medium' | 'low';
  current: number;
  target: number;
  recommendation: string;
}

export function PredictiveScore({ dimensions, category = 'SaaS' }: PredictiveScoreProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [adjustedDimensions, setAdjustedDimensions] = useState(dimensions);

  // Calculate success probability based on dimensions
  const calculateSuccessProbability = (dims: typeof dimensions) => {
    const weights = {
      marketOpportunity: 0.25,
      problemSeverity: 0.20,
      technicalFeasibility: 0.15,
      marketTiming: 0.20,
      founderFit: 0.10,
      monetizationPotential: 0.10,
    };

    let weightedScore = 0;
    Object.entries(dims).forEach(([key, value]) => {
      weightedScore += value * weights[key as keyof typeof weights];
    });

    // Add category multipliers
    const categoryMultipliers: Record<string, number> = {
      SaaS: 1.05,
      Marketplace: 0.95,
      FinTech: 1.0,
      Healthcare: 0.9,
      AI: 1.1,
      Mobile: 1.0,
      eCommerce: 0.95,
    };

    const multiplier = categoryMultipliers[category] || 1.0;
    const baseProb = (weightedScore / 100) * multiplier;

    return Math.min(95, Math.max(10, Math.round(baseProb * 100)));
  };

  const successProbability = calculateSuccessProbability(adjustedDimensions);
  const confidenceInterval: [number, number] = [
    Math.max(0, successProbability - 12),
    Math.min(100, successProbability + 8),
  ];

  // Generate milestone predictions
  const milestones: Milestone[] = [
    {
      period: '3 Months',
      metric: 'First 100 Users',
      prediction: successProbability >= 70 ? 85 : successProbability >= 50 ? 65 : 40,
      confidence: [
        successProbability >= 70 ? 70 : successProbability >= 50 ? 50 : 25,
        successProbability >= 70 ? 95 : successProbability >= 50 ? 80 : 60,
      ],
      description: 'Initial user acquisition and product-market fit validation',
    },
    {
      period: '6 Months',
      metric: '$10K MRR',
      prediction: successProbability >= 70 ? 75 : successProbability >= 50 ? 55 : 30,
      confidence: [
        successProbability >= 70 ? 60 : successProbability >= 50 ? 40 : 15,
        successProbability >= 70 ? 88 : successProbability >= 50 ? 70 : 50,
      ],
      description: 'Revenue generation and monetization proof',
    },
    {
      period: '12 Months',
      metric: '$100K ARR',
      prediction: successProbability >= 70 ? 68 : successProbability >= 50 ? 45 : 22,
      confidence: [
        successProbability >= 70 ? 50 : successProbability >= 50 ? 30 : 10,
        successProbability >= 70 ? 82 : successProbability >= 50 ? 65 : 40,
      ],
      description: 'Sustainable business model and growth trajectory',
    },
  ];

  // Success factors analysis
  const successFactors: SuccessFactors[] = [
    {
      factor: 'Market Timing',
      impact: dimensions.marketTiming >= 80 ? 'high' : dimensions.marketTiming >= 60 ? 'medium' : 'low',
      current: dimensions.marketTiming,
      target: 85,
      recommendation:
        dimensions.marketTiming < 70
          ? 'Research emerging trends and validate market readiness'
          : 'Strong timing - move fast to capture opportunity',
    },
    {
      factor: 'Founder Fit',
      impact: dimensions.founderFit >= 80 ? 'high' : dimensions.founderFit >= 60 ? 'medium' : 'low',
      current: dimensions.founderFit,
      target: 80,
      recommendation:
        dimensions.founderFit < 70
          ? 'Build domain expertise or find complementary co-founders'
          : 'Excellent founder-market fit',
    },
    {
      factor: 'Problem Severity',
      impact: dimensions.problemSeverity >= 80 ? 'high' : dimensions.problemSeverity >= 60 ? 'medium' : 'low',
      current: dimensions.problemSeverity,
      target: 90,
      recommendation:
        dimensions.problemSeverity < 70
          ? 'Validate if this is a "must-have" vs "nice-to-have" solution'
          : 'Strong pain point - users will pay to solve this',
    },
  ];

  const comparisonStartups = [
    { name: 'Notion', year1ARR: '$100K', successProb: 82, actualOutcome: '$10B valuation' },
    { name: 'Stripe', year1ARR: '$250K', successProb: 85, actualOutcome: '$50B valuation' },
    { name: 'Figma', year1ARR: '$150K', successProb: 78, actualOutcome: '$20B valuation' },
    { name: 'Calendly', year1ARR: '$80K', successProb: 68, actualOutcome: '$3B valuation' },
  ];

  const similarStartups = comparisonStartups.filter(
    s => Math.abs(s.successProb - successProbability) <= 15
  );

  const handleAdjustDimension = (key: keyof typeof dimensions, delta: number) => {
    setAdjustedDimensions(prev => ({
      ...prev,
      [key]: Math.min(100, Math.max(0, prev[key] + delta)),
    }));
  };

  const handleReset = () => {
    setAdjustedDimensions(dimensions);
  };

  const impactColors = {
    high: 'text-green-400 bg-green-500/20 border-green-500/50',
    medium: 'text-yellow-400 bg-yellow-500/20 border-yellow-500/50',
    low: 'text-red-400 bg-red-500/20 border-red-500/50',
  };

  return (
    <div className="space-y-4">
      {/* Main Prediction Card */}
      <Card className="glass border-purple-500/30 p-6 bg-gradient-to-br from-purple-500/10 to-blue-500/10">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-purple-500/20">
              <Sparkles className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">AI Success Prediction</h3>
              <p className="text-sm text-gray-400">Based on validation analysis and market data</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="gap-2"
            disabled={JSON.stringify(adjustedDimensions) === JSON.stringify(dimensions)}
          >
            <RefreshCw className="w-4 h-4" />
            Reset
          </Button>
        </div>

        <div className="text-center mb-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', duration: 0.8 }}
            className="inline-block"
          >
            <div className="relative">
              <svg className="w-48 h-48" viewBox="0 0 200 200">
                {/* Background circle */}
                <circle
                  cx="100"
                  cy="100"
                  r="85"
                  fill="none"
                  stroke="rgb(55, 65, 81)"
                  strokeWidth="12"
                />
                {/* Progress arc */}
                <motion.circle
                  cx="100"
                  cy="100"
                  r="85"
                  fill="none"
                  stroke="url(#gradient)"
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray={`${(successProbability / 100) * 534} 534`}
                  initial={{ strokeDasharray: '0 534' }}
                  animate={{ strokeDasharray: `${(successProbability / 100) * 534} 534` }}
                  transition={{ duration: 1.5, ease: 'easeOut' }}
                  transform="rotate(-90 100 100)"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#8B5CF6" />
                    <stop offset="100%" stopColor="#3B82F6" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent"
                >
                  {successProbability}%
                </motion.span>
                <span className="text-sm text-gray-400 mt-1">Success Probability</span>
              </div>
            </div>
          </motion.div>

          <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-400">
            <span>Confidence Range:</span>
            <Badge variant="outline" className="text-xs">
              {confidenceInterval[0]}% - {confidenceInterval[1]}%
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10">
          <div className="text-center">
            <TrendingUp className="w-5 h-5 mx-auto mb-1 text-green-400" />
            <p className="text-xs text-gray-500">Market Fit</p>
            <p className="text-lg font-semibold text-white">
              {Math.round((dimensions.marketOpportunity + dimensions.problemSeverity) / 2)}%
            </p>
          </div>
          <div className="text-center">
            <Target className="w-5 h-5 mx-auto mb-1 text-blue-400" />
            <p className="text-xs text-gray-500">Execution</p>
            <p className="text-lg font-semibold text-white">
              {Math.round((dimensions.technicalFeasibility + dimensions.founderFit) / 2)}%
            </p>
          </div>
          <div className="text-center">
            <DollarSign className="w-5 h-5 mx-auto mb-1 text-purple-400" />
            <p className="text-xs text-gray-500">Revenue</p>
            <p className="text-lg font-semibold text-white">{dimensions.monetizationPotential}%</p>
          </div>
        </div>
      </Card>

      {/* Milestone Predictions */}
      <Card className="glass border-white/10 p-4">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-blue-400" />
          <h4 className="font-semibold text-white">Predicted Milestones</h4>
        </div>
        <div className="space-y-4">
          {milestones.map((milestone, index) => (
            <motion.div
              key={milestone.period}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="border border-white/10 rounded-lg p-3"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {milestone.period}
                  </Badge>
                  <span className="text-sm font-semibold text-white">{milestone.metric}</span>
                </div>
                <span className="text-lg font-bold text-blue-400">{milestone.prediction}%</span>
              </div>
              <p className="text-xs text-gray-400 mb-2">{milestone.description}</p>
              <div className="flex items-center gap-2">
                <Progress value={milestone.prediction} className="flex-1 h-2" />
                <span className="text-xs text-gray-500">
                  {milestone.confidence[0]}-{milestone.confidence[1]}%
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Success Factors */}
      <Card className="glass border-white/10 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-green-400" />
            <h4 className="font-semibold text-white">Key Success Factors</h4>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowDetails(!showDetails)}
            className="gap-1"
          >
            {showDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            {showDetails ? 'Hide' : 'Show'} Details
          </Button>
        </div>
        <div className="space-y-3">
          {successFactors.map((factor, index) => (
            <motion.div
              key={factor.factor}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`border rounded-lg p-3 ${impactColors[factor.impact]}`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-white">{factor.factor}</span>
                  <Badge variant="outline" className="text-xs capitalize">
                    {factor.impact} Impact
                  </Badge>
                </div>
                <span className="text-sm font-bold">{factor.current}/100</span>
              </div>
              {showDetails && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <p className="text-xs text-gray-300 mb-2">{factor.recommendation}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">Target:</span>
                    <Progress value={(factor.current / factor.target) * 100} className="flex-1 h-1" />
                    <span className="text-xs font-semibold">{factor.target}</span>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Similar Startups Comparison */}
      {similarStartups.length > 0 && (
        <Card className="glass border-white/10 p-4">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-purple-400" />
            <h4 className="font-semibold text-white">Similar Success Stories</h4>
          </div>
          <p className="text-sm text-gray-400 mb-3">
            Startups with similar early-stage predictions that succeeded:
          </p>
          <div className="grid md:grid-cols-2 gap-3">
            {similarStartups.map(startup => (
              <div
                key={startup.name}
                className="border border-white/10 rounded-lg p-3 bg-gradient-to-br from-purple-500/5 to-blue-500/5"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-white">{startup.name}</span>
                  <Badge variant="secondary" className="text-xs">
                    {startup.successProb}% predicted
                  </Badge>
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Year 1 ARR:</span>
                    <span className="text-white font-semibold">{startup.year1ARR}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Outcome:</span>
                    <span className="text-green-400 font-semibold">{startup.actualOutcome}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* What-If Scenarios */}
      <Card className="glass border-blue-500/30 p-4 bg-blue-500/5">
        <div className="flex items-center gap-2 mb-3">
          <AlertCircle className="w-5 h-5 text-blue-400" />
          <h4 className="font-semibold text-white">What-If Scenarios</h4>
        </div>
        <p className="text-sm text-gray-400 mb-3">
          Adjust factors to see how they impact your success probability:
        </p>
        <div className="space-y-2">
          {Object.entries(adjustedDimensions).map(([key, value]) => (
            <div key={key} className="flex items-center gap-3">
              <span className="text-xs text-gray-400 w-32 capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </span>
              <div className="flex-1 flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="h-6 w-6 p-0"
                  onClick={() => handleAdjustDimension(key as keyof typeof dimensions, -5)}
                >
                  -
                </Button>
                <Progress value={value} className="flex-1 h-2" />
                <Button
                  size="sm"
                  variant="outline"
                  className="h-6 w-6 p-0"
                  onClick={() => handleAdjustDimension(key as keyof typeof dimensions, 5)}
                >
                  +
                </Button>
                <span className="text-xs text-white w-8 text-right">{value}</span>
              </div>
            </div>
          ))}
        </div>
        {JSON.stringify(adjustedDimensions) !== JSON.stringify(dimensions) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-3 border border-blue-500/30 rounded-lg bg-blue-500/10"
          >
            <p className="text-sm text-blue-300">
              <strong>New Prediction:</strong> {calculateSuccessProbability(adjustedDimensions)}%
              success probability
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {calculateSuccessProbability(adjustedDimensions) > successProbability
                ? '↑ Improving these factors could increase your success rate'
                : '↓ These changes would decrease success probability'}
            </p>
          </motion.div>
        )}
      </Card>
    </div>
  );
}
