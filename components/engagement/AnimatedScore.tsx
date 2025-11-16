'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';

interface AnimatedScoreProps {
  score: number;
  maxScore?: number;
  duration?: number;
  onComplete?: () => void;
  showConfetti?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function AnimatedScore({
  score,
  maxScore = 100,
  duration = 2000,
  onComplete,
  showConfetti = true,
  size = 'lg',
}: AnimatedScoreProps) {
  const [displayScore, setDisplayScore] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);

  const sizeClasses = {
    sm: 'text-4xl',
    md: 'text-6xl',
    lg: 'text-8xl',
  };

  useEffect(() => {
    if (hasAnimated) return;

    const startTime = Date.now();
    const endTime = startTime + duration;

    const animate = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentScore = Math.floor(easeOutQuart * score);

      setDisplayScore(currentScore);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplayScore(score);
        setHasAnimated(true);

        // Trigger confetti for high scores
        if (showConfetti && score >= 70) {
          triggerConfetti(score);
        }

        onComplete?.();
      }
    };

    animate();
  }, [score, duration, hasAnimated, showConfetti, onComplete]);

  const triggerConfetti = (finalScore: number) => {
    // Different confetti patterns based on score
    if (finalScore >= 90) {
      // Epic confetti for 90+
      const count = 200;
      const defaults = {
        origin: { y: 0.7 },
        zIndex: 9999,
      };

      function fire(particleRatio: number, opts: any) {
        confetti({
          ...defaults,
          ...opts,
          particleCount: Math.floor(count * particleRatio),
        });
      }

      fire(0.25, {
        spread: 26,
        startVelocity: 55,
      });

      fire(0.2, {
        spread: 60,
      });

      fire(0.35, {
        spread: 100,
        decay: 0.91,
        scalar: 0.8,
      });

      fire(0.1, {
        spread: 120,
        startVelocity: 25,
        decay: 0.92,
        scalar: 1.2,
      });

      fire(0.1, {
        spread: 120,
        startVelocity: 45,
      });
    } else if (finalScore >= 80) {
      // Good confetti for 80-89
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        zIndex: 9999,
      });
    } else {
      // Light confetti for 70-79
      confetti({
        particleCount: 50,
        spread: 50,
        origin: { y: 0.6 },
        zIndex: 9999,
      });
    }
  };

  const getScoreColor = () => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getGlowColor = () => {
    if (score >= 80) return 'shadow-green-500/50';
    if (score >= 60) return 'shadow-yellow-500/50';
    return 'shadow-red-500/50';
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative"
      >
        <motion.div
          animate={{
            scale: hasAnimated ? [1, 1.1, 1] : 1,
          }}
          transition={{
            duration: 0.6,
            times: [0, 0.5, 1],
          }}
          className={`${sizeClasses[size]} font-bold ${getScoreColor()} drop-shadow-2xl ${getGlowColor()}`}
        >
          {displayScore}
          <span className="text-gray-500">/{maxScore}</span>
        </motion.div>

        {hasAnimated && score >= 80 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="absolute -top-8 left-1/2 -translate-x-1/2 text-2xl"
          >
            {score >= 90 ? '🔥' : '✨'}
          </motion.div>
        )}
      </motion.div>

      {hasAnimated && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-gray-400 mt-4 text-lg"
        >
          {score >= 90 && 'Outstanding! 🎉'}
          {score >= 80 && score < 90 && 'Excellent idea! 💫'}
          {score >= 70 && score < 80 && 'Strong potential! ⭐'}
          {score >= 60 && score < 70 && 'Promising start!'}
          {score < 60 && 'Needs refinement'}
        </motion.p>
      )}
    </div>
  );
}
