'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Engagement Components
import { AnimatedScore } from '@/components/engagement/AnimatedScore';
import { StartupComparison } from '@/components/engagement/StartupComparison';
import { AchievementSystem, AchievementToast, useAchievements, ACHIEVEMENTS } from '@/components/engagement/AchievementSystem';
import { ShareCard } from '@/components/engagement/ShareCard';
import { IdeaPortfolio, useIdeaPortfolio, type SavedIdea } from '@/components/engagement/IdeaPortfolio';
import { AIDebate } from '@/components/engagement/AIDebate';
import { RiskRewardMatrix } from '@/components/engagement/RiskRewardMatrix';
import { PredictiveScore } from '@/components/engagement/PredictiveScore';
import { CollaborationHub } from '@/components/engagement/CollaborationHub';
import { LimitedTimeFeatures } from '@/components/engagement/LimitedTimeFeatures';

import {
  Sparkles,
  Trophy,
  Share2,
  Users,
  TrendingUp,
  MessageSquare,
  Target,
  Zap,
  Clock,
  Flame,
} from 'lucide-react';

export default function EngagementDemoPage() {
  const [activeDemo, setActiveDemo] = useState<string>('score');
  const { achievements, unlockAchievement, showToast, closeToast } = useAchievements();
  const { ideas, saveIdea, deleteIdea, toggleFavorite } = useIdeaPortfolio();

  // Mock validation data
  const mockIdea = {
    name: 'AI-Powered Code Review Assistant',
    category: 'SaaS',
    description: 'Automated code review tool that uses AI to catch bugs and suggest improvements',
    score: 78,
    verdict: 'BUILD' as const,
    dimensions: {
      marketOpportunity: 85,
      problemSeverity: 80,
      technicalFeasibility: 75,
      marketTiming: 88,
      founderFit: 70,
      monetizationPotential: 82,
    },
  };

  // Demo idea for portfolio
  const handleAddDemoIdea = () => {
    const newIdea: Omit<SavedIdea, 'id' | 'createdAt' | 'updatedAt' | 'version'> = {
      title: mockIdea.name,
      description: mockIdea.description,
      score: mockIdea.score,
      verdict: mockIdea.verdict,
      category: mockIdea.category,
      dimensions: mockIdea.dimensions,
    };
    saveIdea(newIdea);
    unlockAchievement('first-validation');
  };

  const demoSections = [
    {
      id: 'score',
      label: 'Animated Score',
      icon: Sparkles,
      description: 'Celebrate results with animated scores and confetti',
      color: 'from-blue-500 to-purple-500',
    },
    {
      id: 'comparison',
      label: 'Startup Comparison',
      icon: TrendingUp,
      description: 'Compare to famous successful startups',
      color: 'from-purple-500 to-pink-500',
    },
    {
      id: 'achievements',
      label: 'Achievements',
      icon: Trophy,
      description: 'Unlock badges and track progress',
      color: 'from-yellow-500 to-orange-500',
    },
    {
      id: 'share',
      label: 'Share Cards',
      icon: Share2,
      description: 'Beautiful shareable social cards',
      color: 'from-green-500 to-emerald-500',
    },
    {
      id: 'portfolio',
      label: 'Idea Portfolio',
      icon: Target,
      description: 'Manage multiple ideas and track versions',
      color: 'from-indigo-500 to-blue-500',
    },
    {
      id: 'debate',
      label: 'AI Debate',
      icon: MessageSquare,
      description: 'Watch AI agents debate your idea',
      color: 'from-pink-500 to-rose-500',
    },
    {
      id: 'matrix',
      label: 'Risk/Reward Matrix',
      icon: Target,
      description: 'Visual positioning vs successful startups',
      color: 'from-cyan-500 to-blue-500',
    },
    {
      id: 'prediction',
      label: 'Success Prediction',
      icon: Zap,
      description: 'AI-powered success probability',
      color: 'from-purple-500 to-indigo-500',
    },
    {
      id: 'collaboration',
      label: 'Collaboration',
      icon: Users,
      description: 'Real-time team collaboration',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      id: 'limited',
      label: 'Limited Time',
      icon: Flame,
      description: 'FOMO features and daily challenges',
      color: 'from-orange-500 to-red-500',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-3 mb-4">
            <Sparkles className="w-8 h-8 text-purple-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Engagement Features Demo
            </h1>
            <Sparkles className="w-8 h-8 text-purple-400" />
          </div>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Explore all the gamification and engagement features designed to make GTMVP addictive and fun to use
          </p>
        </motion.div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="glass border-white/10 p-4 text-center">
            <Sparkles className="w-6 h-6 text-blue-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{demoSections.length}</p>
            <p className="text-xs text-gray-400">Features</p>
          </Card>
          <Card className="glass border-white/10 p-4 text-center">
            <Trophy className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{achievements.filter(a => a.unlockedAt).length}</p>
            <p className="text-xs text-gray-400">Achievements</p>
          </Card>
          <Card className="glass border-white/10 p-4 text-center">
            <Target className="w-6 h-6 text-green-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{ideas.length}</p>
            <p className="text-xs text-gray-400">Ideas Saved</p>
          </Card>
          <Card className="glass border-white/10 p-4 text-center">
            <Flame className="w-6 h-6 text-orange-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">7</p>
            <p className="text-xs text-gray-400">Day Streak</p>
          </Card>
        </div>

        {/* Navigation Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
          {demoSections.map(section => {
            const Icon = section.icon;
            return (
              <motion.button
                key={section.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveDemo(section.id)}
                className={`p-4 rounded-lg border transition-all ${
                  activeDemo === section.id
                    ? `border-white/30 bg-gradient-to-br ${section.color} shadow-lg`
                    : 'border-white/10 bg-gray-800/50 hover:border-white/20'
                }`}
              >
                <Icon className={`w-6 h-6 mx-auto mb-2 ${activeDemo === section.id ? 'text-white' : 'text-gray-400'}`} />
                <p className={`text-sm font-semibold ${activeDemo === section.id ? 'text-white' : 'text-gray-400'}`}>
                  {section.label}
                </p>
              </motion.button>
            );
          })}
        </div>

        {/* Demo Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeDemo}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeDemo === 'score' && (
              <div className="space-y-4">
                <Card className="glass border-white/10 p-6">
                  <h2 className="text-2xl font-bold text-white mb-2">Animated Score Counter</h2>
                  <p className="text-gray-400 mb-6">
                    Celebrate validation results with smooth animations and confetti effects
                  </p>
                  <div className="flex justify-center">
                    <AnimatedScore score={mockIdea.score} showConfetti={true} duration={2000} />
                  </div>
                </Card>
              </div>
            )}

            {activeDemo === 'comparison' && (
              <div className="space-y-4">
                <Card className="glass border-white/10 p-6">
                  <h2 className="text-2xl font-bold text-white mb-2">Startup Comparison</h2>
                  <p className="text-gray-400 mb-6">
                    AI-powered research comparing your idea to real successful startups
                  </p>
                </Card>
                <StartupComparison
                  yourScore={mockIdea.score}
                  category={mockIdea.category}
                  ideaName={mockIdea.name}
                  dimensions={mockIdea.dimensions}
                />
              </div>
            )}

            {activeDemo === 'achievements' && (
              <div className="space-y-4">
                <Card className="glass border-white/10 p-6">
                  <h2 className="text-2xl font-bold text-white mb-2">Achievement System</h2>
                  <p className="text-gray-400 mb-4">
                    Unlock badges and track your progress
                  </p>
                  <div className="flex gap-2">
                    <Button onClick={() => unlockAchievement('first-validation')}>
                      Unlock "First Validator"
                    </Button>
                    <Button onClick={() => unlockAchievement('high-score')} variant="outline">
                      Unlock "Diamond Idea"
                    </Button>
                  </div>
                </Card>
                <AchievementSystem achievements={achievements} showUnlocked={true} />
              </div>
            )}

            {activeDemo === 'share' && (
              <div className="space-y-4">
                <Card className="glass border-white/10 p-6">
                  <h2 className="text-2xl font-bold text-white mb-2">Social Share Cards</h2>
                  <p className="text-gray-400 mb-6">
                    Beautiful, shareable cards for social media
                  </p>
                </Card>
                <ShareCard
                  idea={mockIdea.name}
                  score={mockIdea.score}
                  verdict={mockIdea.verdict}
                  topDimension={{ name: 'Market Timing', score: mockIdea.dimensions.marketTiming }}
                  comparedTo="Notion"
                />
              </div>
            )}

            {activeDemo === 'portfolio' && (
              <div className="space-y-4">
                <Card className="glass border-white/10 p-6">
                  <h2 className="text-2xl font-bold text-white mb-2">Idea Portfolio Manager</h2>
                  <p className="text-gray-400 mb-4">
                    Track multiple ideas, versions, and improvements
                  </p>
                  <Button onClick={handleAddDemoIdea}>Add Demo Idea</Button>
                </Card>
                <IdeaPortfolio
                  ideas={ideas}
                  onSelectIdea={(idea) => console.log('Selected:', idea)}
                  onDeleteIdea={deleteIdea}
                  onToggleFavorite={toggleFavorite}
                  onNewIdea={handleAddDemoIdea}
                />
              </div>
            )}

            {activeDemo === 'debate' && (
              <div className="space-y-4">
                <Card className="glass border-white/10 p-6">
                  <h2 className="text-2xl font-bold text-white mb-2">AI Debate Mode</h2>
                  <p className="text-gray-400 mb-6">
                    Watch two AI agents debate the pros and cons of your idea
                  </p>
                </Card>
                <AIDebate idea={mockIdea.name} score={mockIdea.score} autoPlay={false} />
              </div>
            )}

            {activeDemo === 'matrix' && (
              <div className="space-y-4">
                <Card className="glass border-white/10 p-6">
                  <h2 className="text-2xl font-bold text-white mb-2">Risk vs Reward Matrix</h2>
                  <p className="text-gray-400 mb-6">
                    Visualize your idea's positioning against successful startups
                  </p>
                </Card>
                <RiskRewardMatrix
                  yourIdea={{
                    name: mockIdea.name,
                    risk: 100 - mockIdea.dimensions.technicalFeasibility,
                    reward: mockIdea.dimensions.marketOpportunity,
                    category: mockIdea.category,
                  }}
                />
              </div>
            )}

            {activeDemo === 'prediction' && (
              <div className="space-y-4">
                <Card className="glass border-white/10 p-6">
                  <h2 className="text-2xl font-bold text-white mb-2">Predictive Success Score</h2>
                  <p className="text-gray-400 mb-6">
                    AI-powered prediction of your startup's success probability
                  </p>
                </Card>
                <PredictiveScore dimensions={mockIdea.dimensions} category={mockIdea.category} />
              </div>
            )}

            {activeDemo === 'collaboration' && (
              <div className="space-y-4">
                <Card className="glass border-white/10 p-6">
                  <h2 className="text-2xl font-bold text-white mb-2">Real-Time Collaboration</h2>
                  <p className="text-gray-400 mb-6">
                    Work together with your team on idea validation
                  </p>
                </Card>
                <CollaborationHub
                  ideaId="demo-123"
                  ideaTitle={mockIdea.name}
                  onInvite={(email) => console.log('Invited:', email)}
                />
              </div>
            )}

            {activeDemo === 'limited' && (
              <div className="space-y-4">
                <Card className="glass border-white/10 p-6">
                  <h2 className="text-2xl font-bold text-white mb-2">Limited Time Features</h2>
                  <p className="text-gray-400 mb-6">
                    Daily challenges, streaks, and exclusive offers
                  </p>
                </Card>
                <LimitedTimeFeatures userId="demo" />
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Feature Description */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8"
        >
          <Card className="glass border-blue-500/30 p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10">
            <div className="flex items-start gap-4">
              <Sparkles className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-white mb-2">
                  {demoSections.find(s => s.id === activeDemo)?.label}
                </h3>
                <p className="text-sm text-gray-400">
                  {demoSections.find(s => s.id === activeDemo)?.description}
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Achievement Toast */}
      <AnimatePresence>
        {showToast && <AchievementToast achievement={showToast} onClose={closeToast} />}
      </AnimatePresence>
    </div>
  );
}
