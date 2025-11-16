'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Clock,
  Zap,
  Trophy,
  Star,
  Gift,
  Sparkles,
  TrendingUp,
  Target,
  Award,
  Flame,
  CheckCircle2,
  Lock,
  Calendar,
} from 'lucide-react';

interface Challenge {
  id: string;
  title: string;
  description: string;
  reward: string;
  progress: number;
  maxProgress: number;
  expiresAt: Date;
  difficulty: 'easy' | 'medium' | 'hard';
  isCompleted: boolean;
  icon: string;
}

interface LimitedOffer {
  id: string;
  title: string;
  description: string;
  badge: string;
  expiresAt: Date;
  isActive: boolean;
  discount?: number;
  icon: string;
}

interface Streak {
  currentStreak: number;
  longestStreak: number;
  lastValidationDate: Date;
}

interface LimitedTimeFeaturesProps {
  userId?: string;
}

export function LimitedTimeFeatures({ userId = 'demo' }: LimitedTimeFeaturesProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState<'challenges' | 'offers' | 'streak'>('challenges');

  // Mock data - in production, this would come from API
  const [challenges, setChallenges] = useState<Challenge[]>([
    {
      id: 'daily-1',
      title: 'Daily Validator',
      description: 'Validate your first idea today',
      reward: '+50 XP, Achievement Badge',
      progress: 0,
      maxProgress: 1,
      expiresAt: getEndOfDay(),
      difficulty: 'easy',
      isCompleted: false,
      icon: 'target',
    },
    {
      id: 'daily-2',
      title: 'Social Butterfly',
      description: 'Share your validation results on 2 platforms',
      reward: '+100 XP, Viral Badge',
      progress: 0,
      maxProgress: 2,
      expiresAt: getEndOfDay(),
      difficulty: 'medium',
      isCompleted: false,
      icon: 'sparkles',
    },
    {
      id: 'weekend-1',
      title: 'Weekend Warrior',
      description: 'Complete 3 validations this weekend',
      reward: '+200 XP, Premium Analysis Unlock',
      progress: 1,
      maxProgress: 3,
      expiresAt: getEndOfWeekend(),
      difficulty: 'hard',
      isCompleted: false,
      icon: 'trophy',
    },
  ]);

  const [offers, setOffers] = useState<LimitedOffer[]>([
    {
      id: 'flash-1',
      title: '⚡ Flash Boost',
      description: 'Get instant deep-dive analysis on your next validation',
      badge: 'Next 24h Only',
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      isActive: true,
      icon: 'zap',
    },
    {
      id: 'weekend-special',
      title: '🎁 Weekend Special',
      description: 'Unlock AI Debate Mode + Predictive Scores',
      badge: 'Ends Sunday',
      expiresAt: getEndOfWeekend(),
      isActive: true,
      discount: 50,
      icon: 'gift',
    },
    {
      id: 'early-bird',
      title: '🌅 Early Bird Bonus',
      description: 'Validate before 9 AM and get 2x XP',
      badge: 'Daily Until 9 AM',
      expiresAt: new Date(new Date().setHours(9, 0, 0, 0)),
      isActive: new Date().getHours() < 9,
      icon: 'trending',
    },
  ]);

  const [streak, setStreak] = useState<Streak>({
    currentStreak: 7,
    longestStreak: 12,
    lastValidationDate: new Date(),
  });

  // Update current time every second for countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  function getEndOfDay() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    return tomorrow;
  }

  function getEndOfWeekend() {
    const now = new Date();
    const sunday = new Date(now);
    sunday.setDate(now.getDate() + (7 - now.getDay()));
    sunday.setHours(23, 59, 59, 999);
    return sunday;
  }

  function formatTimeRemaining(expiresAt: Date): string {
    const diff = expiresAt.getTime() - currentTime.getTime();
    if (diff <= 0) return 'Expired';

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days}d ${hours % 24}h`;
    }
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m ${seconds}s`;
  }

  const handleCompleteChallenge = (challengeId: string) => {
    setChallenges(prev =>
      prev.map(c =>
        c.id === challengeId
          ? { ...c, progress: Math.min(c.progress + 1, c.maxProgress), isCompleted: c.progress + 1 >= c.maxProgress }
          : c
      )
    );
  };

  const handleClaimOffer = (offerId: string) => {
    console.log('Claiming offer:', offerId);
    // In production, this would trigger the offer claim
  };

  const difficultyColors = {
    easy: 'bg-green-500/20 text-green-400 border-green-500/50',
    medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
    hard: 'bg-red-500/20 text-red-400 border-red-500/50',
  };

  const iconMap: Record<string, any> = {
    target: Target,
    sparkles: Sparkles,
    trophy: Trophy,
    zap: Zap,
    gift: Gift,
    trending: TrendingUp,
  };

  // Check if streak is at risk
  const lastValidation = streak.lastValidationDate.getTime();
  const now = currentTime.getTime();
  const hoursSinceLastValidation = (now - lastValidation) / (1000 * 60 * 60);
  const streakAtRisk = hoursSinceLastValidation > 20 && hoursSinceLastValidation < 24;
  const streakExpiringSoon = hoursSinceLastValidation > 18 && hoursSinceLastValidation <= 20;

  return (
    <div className="space-y-4">
      {/* Header with Tab Navigation */}
      <Card className="glass border-orange-500/30 p-4 bg-gradient-to-r from-orange-500/10 to-red-500/10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <Flame className="w-6 h-6 text-orange-400" />
            <div>
              <h3 className="text-lg font-bold text-white">Limited Time Features</h3>
              <p className="text-xs text-gray-400">Don't miss out on exclusive rewards!</p>
            </div>
          </div>
          <Badge variant="outline" className="gap-1 bg-red-500/20 text-red-400 border-red-500/50">
            <Clock className="w-3 h-3" />
            Active Now
          </Badge>
        </div>

        <div className="flex gap-2 border-t border-white/10 pt-3">
          <Button
            variant="ghost"
            size="sm"
            className={`flex-1 ${activeTab === 'challenges' ? 'bg-white/10 text-white' : 'text-gray-400'}`}
            onClick={() => setActiveTab('challenges')}
          >
            <Target className="w-4 h-4 mr-2" />
            Challenges
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={`flex-1 ${activeTab === 'offers' ? 'bg-white/10 text-white' : 'text-gray-400'}`}
            onClick={() => setActiveTab('offers')}
          >
            <Gift className="w-4 h-4 mr-2" />
            Offers
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={`flex-1 ${activeTab === 'streak' ? 'bg-white/10 text-white' : 'text-gray-400'}`}
            onClick={() => setActiveTab('streak')}
          >
            <Flame className="w-4 h-4 mr-2" />
            Streak
          </Button>
        </div>
      </Card>

      {/* Challenges Tab */}
      {activeTab === 'challenges' && (
        <div className="space-y-3">
          {challenges.map((challenge, index) => {
            const timeRemaining = formatTimeRemaining(challenge.expiresAt);
            const isExpired = timeRemaining === 'Expired';
            const Icon = iconMap[challenge.icon] || Target;

            return (
              <motion.div
                key={challenge.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card
                  className={`border p-4 ${
                    challenge.isCompleted
                      ? 'border-green-500/50 bg-green-500/10'
                      : isExpired
                        ? 'border-gray-700 bg-gray-800/50 opacity-50'
                        : 'glass border-white/10'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${challenge.isCompleted ? 'bg-green-500/20' : 'bg-white/10'}`}>
                      {challenge.isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 text-green-400" />
                      ) : isExpired ? (
                        <Lock className="w-5 h-5 text-gray-600" />
                      ) : (
                        <Icon className="w-5 h-5 text-blue-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-white">{challenge.title}</h4>
                        <Badge variant="outline" className={`text-xs ${difficultyColors[challenge.difficulty]}`}>
                          {challenge.difficulty}
                        </Badge>
                        {!isExpired && !challenge.isCompleted && (
                          <Badge variant="outline" className="text-xs bg-red-500/20 text-red-400 border-red-500/50">
                            <Clock className="w-3 h-3 mr-1" />
                            {timeRemaining}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-400 mb-2">{challenge.description}</p>

                      {!isExpired && !challenge.isCompleted && (
                        <>
                          <div className="flex items-center gap-2 mb-2">
                            <Progress value={(challenge.progress / challenge.maxProgress) * 100} className="flex-1 h-2" />
                            <span className="text-xs text-gray-400">
                              {challenge.progress}/{challenge.maxProgress}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <Star className="w-3 h-3" />
                              {challenge.reward}
                            </div>
                            <Button size="sm" onClick={() => handleCompleteChallenge(challenge.id)}>
                              Continue
                            </Button>
                          </div>
                        </>
                      )}

                      {challenge.isCompleted && (
                        <div className="flex items-center gap-2 text-sm text-green-400">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Completed! Reward claimed</span>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Offers Tab */}
      {activeTab === 'offers' && (
        <div className="space-y-3">
          {offers.map((offer, index) => {
            const timeRemaining = formatTimeRemaining(offer.expiresAt);
            const isExpired = timeRemaining === 'Expired' || !offer.isActive;
            const Icon = iconMap[offer.icon] || Gift;

            return (
              <motion.div
                key={offer.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card
                  className={`border p-4 relative overflow-hidden ${
                    isExpired
                      ? 'border-gray-700 bg-gray-800/50 opacity-50'
                      : 'border-purple-500/50 bg-gradient-to-br from-purple-500/10 to-pink-500/10'
                  }`}
                >
                  {!isExpired && (
                    <div className="absolute top-0 right-0">
                      <div className="bg-red-500 text-white text-xs font-bold px-3 py-1 transform rotate-45 translate-x-8 translate-y-2">
                        {offer.badge}
                      </div>
                    </div>
                  )}

                  <div className="flex items-start gap-3">
                    <div className={`p-3 rounded-lg ${isExpired ? 'bg-gray-700' : 'bg-purple-500/20'}`}>
                      <Icon className={`w-6 h-6 ${isExpired ? 'text-gray-500' : 'text-purple-400'}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-lg font-bold text-white">{offer.title}</h4>
                        {offer.discount && !isExpired && (
                          <Badge className="bg-red-500 text-white">-{offer.discount}%</Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-400 mb-3">{offer.description}</p>

                      {!isExpired && (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="w-4 h-4 text-red-400" />
                            <span className="text-red-400 font-semibold">{timeRemaining} left</span>
                          </div>
                          <Button
                            size="sm"
                            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                            onClick={() => handleClaimOffer(offer.id)}
                          >
                            <Sparkles className="w-4 h-4 mr-2" />
                            Claim Now
                          </Button>
                        </div>
                      )}

                      {isExpired && (
                        <div className="text-sm text-gray-500">
                          <Lock className="w-4 h-4 inline mr-1" />
                          This offer has expired
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Streak Tab */}
      {activeTab === 'streak' && (
        <div className="space-y-4">
          <Card className="glass border-orange-500/30 p-6 bg-gradient-to-br from-orange-500/10 to-yellow-500/10">
            <div className="text-center mb-6">
              <motion.div
                animate={{
                  scale: streakAtRisk ? [1, 1.1, 1] : 1,
                }}
                transition={{
                  repeat: streakAtRisk ? Infinity : 0,
                  duration: 1,
                }}
                className="inline-block"
              >
                <Flame className={`w-16 h-16 mb-2 mx-auto ${streakAtRisk ? 'text-red-400' : 'text-orange-400'}`} />
              </motion.div>
              <h3 className="text-4xl font-bold text-white mb-1">{streak.currentStreak} Days</h3>
              <p className="text-sm text-gray-400">Current Validation Streak</p>
              {streakAtRisk && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 p-2 bg-red-500/20 border border-red-500/50 rounded-lg"
                >
                  <p className="text-xs text-red-400 font-semibold">
                    ⚠️ Streak expires in {24 - Math.floor(hoursSinceLastValidation)} hours!
                  </p>
                </motion.div>
              )}
              {streakExpiringSoon && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 p-2 bg-yellow-500/20 border border-yellow-500/50 rounded-lg"
                >
                  <p className="text-xs text-yellow-400 font-semibold">
                    💡 Keep your streak alive - validate an idea today!
                  </p>
                </motion.div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-1">Longest Streak</p>
                <p className="text-2xl font-bold text-white">{streak.longestStreak}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-1">Total XP Earned</p>
                <p className="text-2xl font-bold text-purple-400">{streak.currentStreak * 50}</p>
              </div>
            </div>
          </Card>

          {/* Streak Milestones */}
          <Card className="glass border-white/10 p-4">
            <div className="flex items-center gap-2 mb-3">
              <Award className="w-4 h-4 text-yellow-400" />
              <h4 className="font-semibold text-white">Streak Milestones</h4>
            </div>
            <div className="space-y-2">
              {[
                { days: 7, reward: 'Week Warrior Badge', unlocked: streak.currentStreak >= 7 },
                { days: 14, reward: '2-Week Champion + 200 XP', unlocked: streak.currentStreak >= 14 },
                { days: 30, reward: 'Monthly Master + Premium Features', unlocked: streak.currentStreak >= 30 },
                { days: 100, reward: 'Legendary Validator + Lifetime Pro', unlocked: streak.currentStreak >= 100 },
              ].map(milestone => (
                <div
                  key={milestone.days}
                  className={`flex items-center justify-between p-2 rounded-lg border ${
                    milestone.unlocked
                      ? 'border-green-500/50 bg-green-500/10'
                      : 'border-white/10 bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {milestone.unlocked ? (
                      <CheckCircle2 className="w-5 h-5 text-green-400" />
                    ) : (
                      <Lock className="w-5 h-5 text-gray-600" />
                    )}
                    <div>
                      <p className="text-sm font-semibold text-white">{milestone.days} Days</p>
                      <p className="text-xs text-gray-400">{milestone.reward}</p>
                    </div>
                  </div>
                  {!milestone.unlocked && (
                    <Badge variant="outline" className="text-xs">
                      {milestone.days - streak.currentStreak} to go
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </Card>

          {/* Calendar Preview */}
          <Card className="glass border-white/10 p-4">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-4 h-4 text-blue-400" />
              <h4 className="font-semibold text-white">This Week's Activity</h4>
            </div>
            <div className="grid grid-cols-7 gap-2">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => {
                const hasValidation = index <= new Date().getDay();
                return (
                  <div key={index} className="text-center">
                    <p className="text-xs text-gray-500 mb-1">{day}</p>
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        hasValidation ? 'bg-orange-500/20 border border-orange-500/50' : 'bg-gray-800'
                      }`}
                    >
                      {hasValidation && <Flame className="w-4 h-4 text-orange-400" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
