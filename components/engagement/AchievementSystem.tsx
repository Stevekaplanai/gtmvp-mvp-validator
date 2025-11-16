'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import confetti from 'canvas-confetti';
import {
  Trophy,
  Target,
  Zap,
  Rocket,
  Star,
  Award,
  TrendingUp,
  Users,
  Brain,
  Heart,
  Lock,
  CheckCircle2,
} from 'lucide-react';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedAt?: Date;
  progress?: number;
  maxProgress?: number;
}

const iconMap: Record<string, any> = {
  trophy: Trophy,
  target: Target,
  zap: Zap,
  rocket: Rocket,
  star: Star,
  award: Award,
  trending: TrendingUp,
  users: Users,
  brain: Brain,
  heart: Heart,
};

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-validation',
    title: 'First Validator',
    description: 'Complete your first idea validation',
    icon: 'trophy',
    rarity: 'common',
  },
  {
    id: 'high-score',
    title: 'Diamond Idea',
    description: 'Achieve a 90+ overall validation score',
    icon: 'star',
    rarity: 'epic',
  },
  {
    id: 'hot-streak',
    title: 'Hot Streak',
    description: 'Validate 3 ideas in one day',
    icon: 'zap',
    rarity: 'rare',
  },
  {
    id: 'launch-ready',
    title: 'Launch Ready',
    description: 'Complete all action items for your idea',
    icon: 'rocket',
    rarity: 'rare',
  },
  {
    id: 'data-driven',
    title: 'Data Driven',
    description: 'Request a deep dive analysis',
    icon: 'brain',
    rarity: 'common',
  },
  {
    id: 'quick-learner',
    title: 'Quick Learner',
    description: 'Improve an idea score by 20+ points',
    icon: 'trending',
    rarity: 'rare',
  },
  {
    id: 'perfectionist',
    title: 'Perfectionist',
    description: 'Get 100/100 in any dimension',
    icon: 'target',
    rarity: 'legendary',
  },
  {
    id: 'collaborator',
    title: 'Team Player',
    description: 'Share a validation with your team',
    icon: 'users',
    rarity: 'common',
  },
  {
    id: 'persistent',
    title: 'Never Give Up',
    description: 'Validate the same idea 5 times',
    icon: 'heart',
    rarity: 'epic',
  },
  {
    id: 'explorer',
    title: 'Idea Explorer',
    description: 'Validate ideas in 3 different categories',
    icon: 'award',
    rarity: 'rare',
  },
];

const rarityConfig = {
  common: {
    color: 'bg-gray-500/20 border-gray-500/50 text-gray-400',
    glow: 'shadow-gray-500/20',
    label: 'Common',
  },
  rare: {
    color: 'bg-blue-500/20 border-blue-500/50 text-blue-400',
    glow: 'shadow-blue-500/30',
    label: 'Rare',
  },
  epic: {
    color: 'bg-purple-500/20 border-purple-500/50 text-purple-400',
    glow: 'shadow-purple-500/40',
    label: 'Epic',
  },
  legendary: {
    color: 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400',
    glow: 'shadow-yellow-500/50',
    label: 'Legendary',
  },
};

interface AchievementSystemProps {
  achievements: Achievement[];
  showUnlocked?: boolean;
  compact?: boolean;
}

export function AchievementSystem({
  achievements,
  showUnlocked = true,
  compact = false,
}: AchievementSystemProps) {
  const unlockedCount = achievements.filter(a => a.unlockedAt).length;
  const totalCount = achievements.length;
  const progressPercent = (unlockedCount / totalCount) * 100;

  return (
    <div className="space-y-4">
      {/* Progress Header */}
      <Card className="glass border-white/10 p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-400" />
            <h3 className="font-semibold text-white">Achievements</h3>
          </div>
          <Badge variant="secondary">
            {unlockedCount}/{totalCount}
          </Badge>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
          />
        </div>
      </Card>

      {/* Achievement Grid */}
      <div className={compact ? 'grid grid-cols-5 gap-2' : 'grid grid-cols-2 md:grid-cols-3 gap-3'}>
        {achievements.map((achievement, index) => (
          <AchievementCard
            key={achievement.id}
            achievement={achievement}
            compact={compact}
            delay={index * 0.05}
          />
        ))}
      </div>
    </div>
  );
}

interface AchievementCardProps {
  achievement: Achievement;
  compact?: boolean;
  delay?: number;
}

function AchievementCard({ achievement, compact, delay = 0 }: AchievementCardProps) {
  const Icon = iconMap[achievement.icon] || Trophy;
  const config = rarityConfig[achievement.rarity];
  const isUnlocked = !!achievement.unlockedAt;

  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay }}
        className="relative"
      >
        <div
          className={`aspect-square rounded-lg border flex items-center justify-center ${
            isUnlocked ? config.color : 'bg-gray-800/50 border-gray-700'
          } ${isUnlocked ? 'cursor-pointer hover:scale-105 transition-transform' : ''}`}
          title={achievement.title}
        >
          {isUnlocked ? (
            <Icon className="w-6 h-6" />
          ) : (
            <Lock className="w-6 h-6 text-gray-600" />
          )}
        </div>
        {isUnlocked && (
          <div className="absolute -top-1 -right-1">
            <CheckCircle2 className="w-4 h-4 text-green-400 bg-gray-900 rounded-full" />
          </div>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <Card
        className={`p-4 border ${
          isUnlocked
            ? `${config.color} ${config.glow} cursor-pointer hover:scale-105 transition-transform`
            : 'glass border-gray-700 opacity-50'
        }`}
      >
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-lg ${isUnlocked ? 'bg-white/10' : 'bg-gray-800'}`}>
            {isUnlocked ? (
              <Icon className="w-5 h-5" />
            ) : (
              <Lock className="w-5 h-5 text-gray-600" />
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-semibold text-white text-sm">{achievement.title}</h4>
              {isUnlocked && <CheckCircle2 className="w-4 h-4 text-green-400" />}
            </div>
            <p className="text-xs text-gray-400">{achievement.description}</p>
            {achievement.progress !== undefined && achievement.maxProgress && !isUnlocked && (
              <div className="mt-2">
                <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                  <span>Progress</span>
                  <span>
                    {achievement.progress}/{achievement.maxProgress}
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-1">
                  <div
                    className="bg-blue-500 h-1 rounded-full"
                    style={{
                      width: `${(achievement.progress / achievement.maxProgress) * 100}%`,
                    }}
                  />
                </div>
              </div>
            )}
            {isUnlocked && achievement.unlockedAt && (
              <p className="text-xs text-gray-500 mt-1">
                Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

interface AchievementToastProps {
  achievement: Achievement;
  onClose: () => void;
}

export function AchievementToast({ achievement, onClose }: AchievementToastProps) {
  const Icon = iconMap[achievement.icon] || Trophy;
  const config = rarityConfig[achievement.rarity];

  useEffect(() => {
    // Trigger confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FFD700', '#FFA500', '#FF6347'],
    });

    // Auto-close after 5 seconds
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.3 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -50, scale: 0.3 }}
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50"
    >
      <Card className={`${config.color} ${config.glow} shadow-2xl p-4 min-w-[300px]`}>
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-lg bg-white/20">
            <Icon className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <p className="text-xs font-semibold text-white/70 uppercase tracking-wide">
              Achievement Unlocked!
            </p>
            <h4 className="font-bold text-white">{achievement.title}</h4>
            <p className="text-sm text-white/80">{achievement.description}</p>
          </div>
          <Badge variant="outline" className="text-xs">
            {config.label}
          </Badge>
        </div>
      </Card>
    </motion.div>
  );
}

// Hook to manage achievements
export function useAchievements() {
  const [achievements, setAchievements] = useState<Achievement[]>(ACHIEVEMENTS);
  const [showToast, setShowToast] = useState<Achievement | null>(null);

  const unlockAchievement = (achievementId: string) => {
    setAchievements(prev => {
      const updated = prev.map(a => {
        if (a.id === achievementId && !a.unlockedAt) {
          const unlocked = { ...a, unlockedAt: new Date() };
          setShowToast(unlocked);
          return unlocked;
        }
        return a;
      });
      return updated;
    });
  };

  const updateProgress = (achievementId: string, progress: number) => {
    setAchievements(prev =>
      prev.map(a => {
        if (a.id === achievementId) {
          const updated = { ...a, progress };
          if (a.maxProgress && progress >= a.maxProgress && !a.unlockedAt) {
            unlockAchievement(achievementId);
          }
          return updated;
        }
        return a;
      })
    );
  };

  return {
    achievements,
    unlockAchievement,
    updateProgress,
    showToast,
    closeToast: () => setShowToast(null),
  };
}
