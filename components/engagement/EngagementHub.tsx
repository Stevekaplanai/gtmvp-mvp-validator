'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  X,
  Sparkles,
  TrendingUp,
  Trophy,
  Share2,
  MessageSquare,
  Target,
  Zap,
  Users,
  Flame,
  ChevronRight,
} from 'lucide-react';

// Import all engagement components
import { AnimatedScore } from './AnimatedScore';
import { StartupComparison } from './StartupComparison';
import { AchievementSystem, useAchievements, ACHIEVEMENTS } from './AchievementSystem';
import { ShareCard } from './ShareCard';
import { IdeaPortfolio, useIdeaPortfolio } from './IdeaPortfolio';
import { AIDebate } from './AIDebate';
import { RiskRewardMatrix } from './RiskRewardMatrix';
import { PredictiveScore } from './PredictiveScore';
import { CollaborationHub } from './CollaborationHub';
import { LimitedTimeFeatures } from './LimitedTimeFeatures';

interface EngagementHubProps {
  idea: {
    name: string;
    description: string;
    category?: string;
  };
  score: number;
  verdict: 'BUILD' | 'PIVOT' | 'SKIP';
  dimensions: {
    marketOpportunity: number;
    problemSeverity: number;
    technicalFeasibility: number;
    marketTiming: number;
    founderFit: number;
    monetizationPotential: number;
  };
  onClose: () => void;
}

export function EngagementHub({
  idea,
  score,
  verdict,
  dimensions,
  onClose,
}: EngagementHubProps) {
  const [activeSection, setActiveSection] = useState<string>('overview');
  const { achievements, unlockAchievement } = useAchievements();
  const { ideas, saveIdea, deleteIdea, toggleFavorite } = useIdeaPortfolio();

  // Unlock "First Validation" achievement on mount
  useState(() => {
    setTimeout(() => unlockAchievement('first-validation'), 1000);
  });

  // Unlock high score achievement if applicable
  useState(() => {
    if (score >= 90) {
      setTimeout(() => unlockAchievement('high-score'), 2000);
    }
  });

  const handleSaveIdea = () => {
    saveIdea({
      title: idea.name,
      description: idea.description,
      score,
      verdict,
      category: idea.category || 'General',
      dimensions,
    });
  };

  const topDimension = Object.entries(dimensions).reduce((max, [key, value]) =>
    value > max.value ? { name: key, value } : max
  , { name: '', value: 0 });

  const sections = [
    { id: 'overview', label: 'Results', icon: Sparkles },
    { id: 'comparison', label: 'Compare', icon: TrendingUp },
    { id: 'predict', label: 'Predict', icon: Zap },
    { id: 'matrix', label: 'Matrix', icon: Target },
    { id: 'debate', label: 'Debate', icon: MessageSquare },
    { id: 'achievements', label: 'Achievements', icon: Trophy },
    { id: 'portfolio', label: 'Portfolio', icon: Target },
    { id: 'share', label: 'Share', icon: Share2 },
    { id: 'collaborate', label: 'Team', icon: Users },
    { id: 'challenges', label: 'Challenges', icon: Flame },
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-6xl max-h-[90vh] overflow-hidden rounded-2xl glass border-white/20 shadow-2xl flex flex-col"
        >
          {/* Header */}
          <div className="p-6 border-b border-white/10 bg-gradient-to-r from-blue-500/10 to-purple-500/10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Sparkles className="w-6 h-6 text-blue-400" />
                <div>
                  <h2 className="text-2xl font-bold text-white">Validation Complete!</h2>
                  <p className="text-sm text-gray-400">{idea.name}</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Quick Stats Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Card className="glass border-white/10 p-3 text-center">
                <p className="text-xs text-gray-400 mb-1">Score</p>
                <p className="text-2xl font-bold text-white">{score}</p>
              </Card>
              <Card className={`border p-3 text-center ${
                verdict === 'BUILD' ? 'border-green-500/50 bg-green-500/10' :
                verdict === 'PIVOT' ? 'border-yellow-500/50 bg-yellow-500/10' :
                'border-red-500/50 bg-red-500/10'
              }`}>
                <p className="text-xs text-gray-400 mb-1">Verdict</p>
                <p className="text-lg font-bold text-white">{verdict}</p>
              </Card>
              <Card className="glass border-white/10 p-3 text-center">
                <p className="text-xs text-gray-400 mb-1">Top Strength</p>
                <p className="text-sm font-bold text-white truncate">
                  {topDimension.name.replace(/([A-Z])/g, ' $1').trim()}
                </p>
              </Card>
              <Card className="glass border-white/10 p-3 text-center">
                <p className="text-xs text-gray-400 mb-1">Achievements</p>
                <p className="text-2xl font-bold text-yellow-400">
                  {achievements.filter(a => a.unlockedAt).length}
                </p>
              </Card>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex border-b border-white/10 overflow-x-auto scrollbar-hide bg-gray-900/50">
            {sections.map(section => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
                    activeSection === section.id
                      ? 'border-blue-500 text-white bg-blue-500/10'
                      : 'border-transparent text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{section.label}</span>
                </button>
              );
            })}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                {activeSection === 'overview' && (
                  <div className="space-y-6">
                    <div className="text-center">
                      <AnimatedScore score={score} showConfetti={score >= 70} />
                    </div>

                    <Card className="glass border-white/10 p-6">
                      <h3 className="text-lg font-semibold text-white mb-4">What's Next?</h3>
                      <div className="grid md:grid-cols-3 gap-4">
                        <Button
                          variant="outline"
                          className="h-auto py-4 flex flex-col gap-2"
                          onClick={() => setActiveSection('comparison')}
                        >
                          <TrendingUp className="w-6 h-6" />
                          <span>Compare to Startups</span>
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          className="h-auto py-4 flex flex-col gap-2"
                          onClick={() => setActiveSection('predict')}
                        >
                          <Zap className="w-6 h-6" />
                          <span>Success Prediction</span>
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          className="h-auto py-4 flex flex-col gap-2"
                          onClick={() => setActiveSection('debate')}
                        >
                          <MessageSquare className="w-6 h-6" />
                          <span>Watch AI Debate</span>
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </Card>

                    <Card className="glass border-white/10 p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-white">Save this validation?</p>
                          <p className="text-sm text-gray-400">Track your idea portfolio</p>
                        </div>
                        <Button onClick={handleSaveIdea}>
                          Save to Portfolio
                        </Button>
                      </div>
                    </Card>
                  </div>
                )}

                {activeSection === 'comparison' && (
                  <StartupComparison
                    yourScore={score}
                    category={idea.category}
                    ideaName={idea.name}
                    dimensions={dimensions}
                  />
                )}

                {activeSection === 'predict' && (
                  <PredictiveScore dimensions={dimensions} category={idea.category} />
                )}

                {activeSection === 'matrix' && (
                  <RiskRewardMatrix
                    yourIdea={{
                      name: idea.name,
                      risk: 100 - dimensions.technicalFeasibility,
                      reward: dimensions.marketOpportunity,
                      category: idea.category,
                    }}
                  />
                )}

                {activeSection === 'debate' && (
                  <AIDebate idea={idea.name} score={score} autoPlay={false} />
                )}

                {activeSection === 'achievements' && (
                  <AchievementSystem achievements={achievements} showUnlocked={true} />
                )}

                {activeSection === 'portfolio' && (
                  <IdeaPortfolio
                    ideas={ideas}
                    onSelectIdea={(idea) => console.log('Selected:', idea)}
                    onDeleteIdea={deleteIdea}
                    onToggleFavorite={toggleFavorite}
                    onNewIdea={handleSaveIdea}
                  />
                )}

                {activeSection === 'share' && (
                  <ShareCard
                    idea={idea.name}
                    score={score}
                    verdict={verdict}
                    topDimension={{
                      name: topDimension.name.replace(/([A-Z])/g, ' $1').trim(),
                      score: topDimension.value,
                    }}
                  />
                )}

                {activeSection === 'collaborate' && (
                  <CollaborationHub
                    ideaId={Date.now().toString()}
                    ideaTitle={idea.name}
                    onInvite={(email) => console.log('Invited:', email)}
                  />
                )}

                {activeSection === 'challenges' && (
                  <LimitedTimeFeatures userId="demo" />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
