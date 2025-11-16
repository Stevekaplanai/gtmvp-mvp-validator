'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Play,
  Pause,
  RotateCcw,
  ThumbsUp,
  ThumbsDown,
  Sparkles,
  Brain,
  Zap,
} from 'lucide-react';

interface DebateMessage {
  agent: 'optimist' | 'skeptic';
  message: string;
  timestamp: number;
  emoji?: string;
}

interface AIDebateProps {
  idea: string;
  score: number;
  autoPlay?: boolean;
  onComplete?: () => void;
}

const OPTIMIST_AVATAR = '🌟';
const SKEPTIC_AVATAR = '🤔';

export function AIDebate({ idea, score, autoPlay = false, onComplete }: AIDebateProps) {
  const [messages, setMessages] = useState<DebateMessage[]>([]);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [userVotes, setUserVotes] = useState<{ optimist: number; skeptic: number }>({
    optimist: 0,
    skeptic: 0,
  });

  // Generate debate script based on score and idea
  const debateScript: DebateMessage[] = [
    {
      agent: 'optimist',
      message: `I'm genuinely excited about this idea! With a score of ${score}/100, there's clear potential here.`,
      timestamp: 0,
      emoji: '✨',
    },
    {
      agent: 'skeptic',
      message: `Hold on. A ${score}/100 isn't a guaranteed success. We need to examine the risks carefully.`,
      timestamp: 2000,
      emoji: '⚠️',
    },
    {
      agent: 'optimist',
      message: `Sure, but look at the market opportunity! The problem is real, and people are actively looking for solutions.`,
      timestamp: 4000,
      emoji: '🎯',
    },
    {
      agent: 'skeptic',
      message: `Market opportunity means nothing if execution fails. What about the technical complexity and resource requirements?`,
      timestamp: 6000,
      emoji: '🛠️',
    },
    {
      agent: 'optimist',
      message: `The technical challenges are manageable with the right team. Plus, the timing is perfect - this is exactly what the market needs right now.`,
      timestamp: 8000,
      emoji: '⏰',
    },
    {
      agent: 'skeptic',
      message: `But what about monetization? How will this actually make money sustainably?`,
      timestamp: 10000,
      emoji: '💰',
    },
    {
      agent: 'optimist',
      message: `There are multiple revenue streams! Subscription, premium features, B2B licensing - the monetization potential is strong.`,
      timestamp: 12000,
      emoji: '💎',
    },
    {
      agent: 'skeptic',
      message: `I'll concede there's potential here. But success will require perfect execution, strong founder commitment, and likely some pivots along the way.`,
      timestamp: 14000,
      emoji: '🎲',
    },
    {
      agent: 'optimist',
      message: `And that's exactly why this score is promising! It shows real viability with manageable risks. Time to build!`,
      timestamp: 16000,
      emoji: '🚀',
    },
  ];

  useEffect(() => {
    if (!isPlaying) return;

    if (currentMessageIndex >= debateScript.length) {
      setIsPlaying(false);
      onComplete?.();
      return;
    }

    const currentMessage = debateScript[currentMessageIndex];
    const nextMessage = debateScript[currentMessageIndex + 1];

    const delay = nextMessage
      ? nextMessage.timestamp - currentMessage.timestamp
      : 2000;

    const timer = setTimeout(() => {
      setMessages(prev => [...prev, currentMessage]);
      setCurrentMessageIndex(prev => prev + 1);
    }, delay);

    return () => clearTimeout(timer);
  }, [isPlaying, currentMessageIndex]);

  const handleReset = () => {
    setMessages([]);
    setCurrentMessageIndex(0);
    setIsPlaying(false);
  };

  const handleVote = (agent: 'optimist' | 'skeptic') => {
    setUserVotes(prev => ({
      ...prev,
      [agent]: prev[agent] + 1,
    }));
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <Card className="glass border-purple-500/30 p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-purple-400" />
            <div>
              <h3 className="font-semibold text-white">AI Debate Mode</h3>
              <p className="text-xs text-gray-400">
                Watch two AI agents discuss your idea's potential
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={togglePlayPause}
              className="gap-2"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  {messages.length === 0 ? 'Start' : 'Resume'}
                </>
              )}
            </Button>
            <Button size="sm" variant="outline" onClick={handleReset}>
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Agents */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="glass border-green-500/30 p-4 bg-green-500/5">
          <div className="flex items-center gap-3 mb-2">
            <div className="text-3xl">{OPTIMIST_AVATAR}</div>
            <div>
              <h4 className="font-semibold text-white">The Optimist</h4>
              <p className="text-xs text-gray-400">Sees the potential</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              className="gap-1 text-xs"
              onClick={() => handleVote('optimist')}
            >
              <ThumbsUp className="w-3 h-3" />
              Agree
            </Button>
            {userVotes.optimist > 0 && (
              <Badge variant="secondary">{userVotes.optimist}</Badge>
            )}
          </div>
        </Card>

        <Card className="glass border-red-500/30 p-4 bg-red-500/5">
          <div className="flex items-center gap-3 mb-2">
            <div className="text-3xl">{SKEPTIC_AVATAR}</div>
            <div>
              <h4 className="font-semibold text-white">The Skeptic</h4>
              <p className="text-xs text-gray-400">Questions everything</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              className="gap-1 text-xs"
              onClick={() => handleVote('skeptic')}
            >
              <ThumbsUp className="w-3 h-3" />
              Agree
            </Button>
            {userVotes.skeptic > 0 && (
              <Badge variant="secondary">{userVotes.skeptic}</Badge>
            )}
          </div>
        </Card>
      </div>

      {/* Debate Messages */}
      <Card className="glass border-white/10 p-4 min-h-[400px] max-h-[600px] overflow-y-auto">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <Brain className="w-12 h-12 text-gray-600 mb-4" />
            <p className="text-gray-400 mb-2">Ready to debate your idea</p>
            <p className="text-sm text-gray-500">
              Click Start to watch our AI agents discuss the pros and cons
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {messages.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: msg.agent === 'optimist' ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${
                    msg.agent === 'optimist' ? 'justify-start' : 'justify-end'
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      msg.agent === 'optimist'
                        ? 'bg-green-500/20 border border-green-500/30'
                        : 'bg-red-500/20 border border-red-500/30'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">
                        {msg.agent === 'optimist' ? OPTIMIST_AVATAR : SKEPTIC_AVATAR}
                      </span>
                      <span className="text-xs font-semibold text-white">
                        {msg.agent === 'optimist' ? 'Optimist' : 'Skeptic'}
                      </span>
                      {msg.emoji && <span className="text-sm">{msg.emoji}</span>}
                    </div>
                    <p className="text-sm text-gray-200">{msg.message}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {isPlaying && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-center"
              >
                <div className="flex gap-2">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                    className="w-2 h-2 rounded-full bg-blue-400"
                  />
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
                    className="w-2 h-2 rounded-full bg-purple-400"
                  />
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
                    className="w-2 h-2 rounded-full bg-pink-400"
                  />
                </div>
              </motion.div>
            )}
          </div>
        )}
      </Card>

      {/* Ask Your Own Question */}
      {messages.length > 0 && !isPlaying && currentMessageIndex >= debateScript.length && (
        <Card className="glass border-blue-500/30 p-4 bg-blue-500/5">
          <div className="flex items-center gap-3">
            <Zap className="w-5 h-5 text-blue-400" />
            <div className="flex-1">
              <h4 className="font-semibold text-white mb-1">Want to ask a question?</h4>
              <p className="text-sm text-gray-400">
                Ask either AI agent about specific aspects of your idea
              </p>
            </div>
            <Button size="sm" className="gap-2">
              <Brain className="w-4 h-4" />
              Ask AI
            </Button>
          </div>
        </Card>
      )}

      {/* Summary */}
      {currentMessageIndex >= debateScript.length && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="glass border-white/10 p-4">
            <h4 className="font-semibold text-white mb-2">Debate Summary</h4>
            <div className="space-y-2 text-sm text-gray-300">
              <p>
                ✅ <span className="text-green-400">Optimist</span> highlighted strong market potential
                and timing
              </p>
              <p>
                ⚠️ <span className="text-red-400">Skeptic</span> raised valid concerns about execution
                and monetization
              </p>
              <p className="pt-2 border-t border-white/10 text-white">
                <strong>Consensus:</strong> Promising idea with manageable risks. Success depends on
                execution quality and founder commitment.
              </p>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
