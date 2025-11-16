'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ChevronRight,
  ChevronLeft,
  HelpCircle,
  Target,
  Users,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

interface GuidanceQuestion {
  id: string;
  category: string;
  icon: any;
  question: string;
  why: string;
  examples: string[];
  thinkingPrompts: string[];
  color: string;
}

const guidanceQuestions: GuidanceQuestion[] = [
  {
    id: 'problem',
    category: 'Problem Understanding',
    icon: Target,
    question: 'What exact problem are you solving?',
    why: 'Successful startups solve real, painful problems. The more specific you are, the better you can validate demand and build a solution that truly resonates.',
    examples: [
      'Airbnb: "Travelers can\'t find affordable, authentic local stays"',
      'Stripe: "Developers spend weeks integrating payment systems"',
      'Notion: "Teams use 10+ disconnected tools for work"',
    ],
    thinkingPrompts: [
      'Who experiences this problem most acutely?',
      'How do they currently solve it (badly)?',
      'What triggers this problem to occur?',
      'How much does this problem cost them (time/money)?',
    ],
    color: 'from-red-500 to-orange-500',
  },
  {
    id: 'target-user',
    category: 'Target Customer',
    icon: Users,
    question: 'Who is your specific target customer?',
    why: 'Trying to serve everyone means serving no one well. Identifying a specific, reachable customer segment lets you craft messaging that converts and build features that delight.',
    examples: [
      'Slack: "Software development teams of 10-50 people"',
      'Figma: "Product designers working on web/mobile apps"',
      'Calendly: "Sales professionals who schedule 10+ meetings/week"',
    ],
    thinkingPrompts: [
      'What industry or job role has this problem most?',
      'What size company or budget do they have?',
      'Where do these people hang out online?',
      'What tools do they already use and love?',
    ],
    color: 'from-blue-500 to-cyan-500',
  },
  {
    id: 'value-prop',
    category: 'Value Proposition',
    icon: Sparkles,
    question: 'What makes your solution 10x better than alternatives?',
    why: 'Being slightly better isn\'t enough. Your solution needs to be dramatically better on at least one dimension that matters to convince users to switch.',
    examples: [
      'Notion: "All your work tools in one place, infinitely flexible"',
      'Loom: "Show, don\'t tell - async video in seconds"',
      'Linear: "Issue tracking that\'s actually fast and beautiful"',
    ],
    thinkingPrompts: [
      'What can users do with your solution they can\'t do now?',
      'What becomes 10x faster, easier, or cheaper?',
      'What frustration does your solution eliminate entirely?',
      'What new possibility does your solution unlock?',
    ],
    color: 'from-purple-500 to-pink-500',
  },
  {
    id: 'monetization',
    category: 'Monetization Strategy',
    icon: DollarSign,
    question: 'How will you make money from day one?',
    why: 'Revenue validates that people truly value your solution. Having a clear monetization strategy from the start forces you to build something people will pay for.',
    examples: [
      'Stripe: "2.9% + 30¢ per successful transaction"',
      'Notion: "Free for individuals, $8/user/month for teams"',
      'Superhuman: "$30/month premium email client"',
    ],
    thinkingPrompts: [
      'What pricing model fits your customer behavior?',
      'What would customers pay for this value?',
      'Which features should be free vs. paid?',
      'How can you charge before building everything?',
    ],
    color: 'from-green-500 to-emerald-500',
  },
  {
    id: 'market-timing',
    category: 'Market Timing',
    icon: TrendingUp,
    question: 'Why is now the perfect time for this idea?',
    why: 'Great ideas at the wrong time fail. Identifying why now is the right moment - new tech, behavior change, regulation - can be the difference between success and failure.',
    examples: [
      'Zoom: "Remote work explosion + need for reliable video"',
      'Robinhood: "Mobile-first generation + distrust of big banks"',
      'ChatGPT: "GPT-3 breakthrough + accessible AI interface"',
    ],
    thinkingPrompts: [
      'What technology just became available or affordable?',
      'What behavior or trend is accelerating right now?',
      'What regulation or event created new demand?',
      'Why would this idea have failed 5 years ago?',
    ],
    color: 'from-yellow-500 to-orange-500',
  },
  {
    id: 'risks',
    category: 'Critical Risks',
    icon: AlertTriangle,
    question: 'What could kill this idea?',
    why: 'Every idea has fatal risks. Identifying them early lets you validate the riskiest assumptions first and pivot before wasting time and money.',
    examples: [
      'Regulatory risk: "New law could ban our business model"',
      'Competition risk: "Google could clone this in 3 months"',
      'Market risk: "Target customers might not actually pay"',
    ],
    thinkingPrompts: [
      'What assumption, if wrong, kills the entire idea?',
      'What could a big competitor do to crush you?',
      'What regulatory or technical risk could emerge?',
      'What customer behavior assumption are you betting on?',
    ],
    color: 'from-red-500 to-pink-500',
  },
];

interface VisualGuidanceProps {
  onComplete?: (insights: Record<string, string>) => void;
  initialAnswers?: Record<string, string>;
}

export function VisualGuidance({ onComplete, initialAnswers = {} }: VisualGuidanceProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>(initialAnswers);
  const [showWhy, setShowWhy] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const currentQuestion = guidanceQuestions[currentIndex];
  const progress = ((currentIndex + 1) / guidanceQuestions.length) * 100;

  const handleNext = () => {
    if (currentIndex < guidanceQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowWhy(false);
    } else {
      setIsComplete(true);
      onComplete?.(answers);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setShowWhy(false);
    }
  };

  const handleAnswer = (answer: string) => {
    setAnswers({ ...answers, [currentQuestion.id]: answer });
  };

  const Icon = currentQuestion.icon;

  if (isComplete) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12"
      >
        <CheckCircle2 className="w-16 h-16 text-green-400 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-white mb-2">
          Guidance Complete! 🎉
        </h3>
        <p className="text-gray-400 mb-6">
          You've thought through the critical elements of your startup idea.
        </p>
        <div className="glass border-green-500/30 rounded-xl p-6 bg-green-500/10 max-w-2xl mx-auto">
          <p className="text-sm text-gray-300 mb-4">
            Your thoughtful answers will help you:
          </p>
          <ul className="text-left space-y-2 text-sm text-gray-300">
            <li className="flex gap-2">
              <span className="text-green-400">✓</span>
              <span>Validate the riskiest assumptions first</span>
            </li>
            <li className="flex gap-2">
              <span className="text-green-400">✓</span>
              <span>Build exactly what your target customers need</span>
            </li>
            <li className="flex gap-2">
              <span className="text-green-400">✓</span>
              <span>Communicate your value proposition clearly</span>
            </li>
            <li className="flex gap-2">
              <span className="text-green-400">✓</span>
              <span>Make money from day one with a clear strategy</span>
            </li>
          </ul>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">
            Question {currentIndex + 1} of {guidanceQuestions.length}
          </span>
          <span className="text-gray-400">{Math.round(progress)}% complete</span>
        </div>
        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Question Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card className={`glass border-white/20 p-6 bg-gradient-to-br ${currentQuestion.color}/10`}>
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-3 rounded-xl bg-gradient-to-br ${currentQuestion.color}`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <Badge variant="outline" className="mb-2">
                  {currentQuestion.category}
                </Badge>
                <h3 className="text-xl font-bold text-white">
                  {currentQuestion.question}
                </h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowWhy(!showWhy)}
                className="text-gray-400 hover:text-white"
              >
                <HelpCircle className="w-5 h-5" />
              </Button>
            </div>

            {/* Why This Matters */}
            <AnimatePresence>
              {showWhy && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-4 p-4 rounded-lg bg-white/5 border border-white/10"
                >
                  <div className="flex items-start gap-2">
                    <Lightbulb className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-yellow-400 mb-1">
                        Why This Matters
                      </p>
                      <p className="text-sm text-gray-300">{currentQuestion.why}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Answer Input */}
            <div className="mb-4">
              <textarea
                value={answers[currentQuestion.id] || ''}
                onChange={(e) => handleAnswer(e.target.value)}
                placeholder="Type your answer here..."
                className="w-full h-32 px-4 py-3 bg-gray-900/50 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
              />
            </div>

            {/* Examples */}
            <div className="mb-4">
              <p className="text-xs font-semibold text-gray-400 mb-2">
                Examples from successful startups:
              </p>
              <div className="space-y-2">
                {currentQuestion.examples.map((example, index) => (
                  <div
                    key={index}
                    className="text-sm text-gray-400 pl-4 border-l-2 border-purple-500/30 italic"
                  >
                    {example}
                  </div>
                ))}
              </div>
            </div>

            {/* Thinking Prompts */}
            <details className="mb-4">
              <summary className="text-xs font-semibold text-gray-400 cursor-pointer hover:text-white transition-colors mb-2">
                💭 Thinking prompts to guide you →
              </summary>
              <ul className="space-y-1.5 mt-2">
                {currentQuestion.thinkingPrompts.map((prompt, index) => (
                  <li key={index} className="flex gap-2 text-sm text-gray-400">
                    <span className="text-purple-400 flex-shrink-0">•</span>
                    <span>{prompt}</span>
                  </li>
                ))}
              </ul>
            </details>

            {/* Navigation */}
            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <Button
                variant="ghost"
                onClick={handlePrevious}
                disabled={currentIndex === 0}
                className="gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>
              <Button
                onClick={handleNext}
                disabled={!answers[currentQuestion.id]?.trim()}
                className={`gap-2 bg-gradient-to-r ${currentQuestion.color} hover:opacity-90`}
              >
                {currentIndex === guidanceQuestions.length - 1 ? 'Complete' : 'Next'}
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        </motion.div>
      </AnimatePresence>

      {/* Quick Navigation */}
      <div className="flex items-center justify-center gap-2">
        {guidanceQuestions.map((q, index) => {
          const QuestionIcon = q.icon;
          return (
            <button
              key={q.id}
              onClick={() => setCurrentIndex(index)}
              className={`p-2 rounded-lg transition-all ${
                index === currentIndex
                  ? `bg-gradient-to-br ${q.color} text-white shadow-lg scale-110`
                  : answers[q.id]
                  ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                  : 'bg-gray-800 text-gray-500 hover:bg-gray-700'
              }`}
              title={q.category}
            >
              <QuestionIcon className="w-4 h-4" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
