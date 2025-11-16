'use client';

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  CheckCircle2,
  Circle,
  Rocket,
  MessageSquare,
  FileText,
  Code,
  TrendingUp,
  Users,
  Calendar,
  ExternalLink
} from "lucide-react";

interface NextStep {
  id: string;
  title: string;
  description: string;
  icon: 'rocket' | 'message' | 'file' | 'code' | 'trending' | 'users' | 'calendar';
  status: 'completed' | 'current' | 'upcoming';
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  estimatedTime?: string;
}

interface NextStepsNavigationProps {
  verdict: 'BUILD' | 'PIVOT' | 'SKIP';
  steps: NextStep[];
  currentStepId?: string;
}

const iconMap = {
  rocket: Rocket,
  message: MessageSquare,
  file: FileText,
  code: Code,
  trending: TrendingUp,
  users: Users,
  calendar: Calendar,
};

const verdictPaths = {
  BUILD: {
    title: '🚀 Build Path',
    color: 'text-green-400',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/50',
  },
  PIVOT: {
    title: '🔄 Pivot Path',
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/10',
    borderColor: 'border-yellow-500/50',
  },
  SKIP: {
    title: '🔍 Explore Alternatives',
    color: 'text-red-400',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/50',
  },
};

export function NextStepsNavigation({ verdict, steps, currentStepId }: NextStepsNavigationProps) {
  const pathConfig = verdictPaths[verdict];

  return (
    <Card className="glass border-white/10 p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-white mb-1">{pathConfig.title}</h3>
          <p className="text-sm text-gray-400">Your personalized journey to success</p>
        </div>
        <Badge className={`${pathConfig.bgColor} ${pathConfig.borderColor} ${pathConfig.color} border`}>
          {steps.filter(s => s.status === 'completed').length} / {steps.length} Complete
        </Badge>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-700 rounded-full h-2">
        <div
          className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
          style={{ width: `${(steps.filter(s => s.status === 'completed').length / steps.length) * 100}%` }}
        />
      </div>

      {/* Steps */}
      <div className="space-y-4">
        {steps.map((step, index) => {
          const Icon = iconMap[step.icon];
          const isCurrent = step.id === currentStepId || step.status === 'current';
          const isCompleted = step.status === 'completed';
          const isUpcoming = step.status === 'upcoming';

          return (
            <div
              key={step.id}
              className={`relative flex items-start gap-4 p-4 rounded-lg border transition-all ${
                isCurrent
                  ? `${pathConfig.bgColor} ${pathConfig.borderColor} border-2`
                  : isCompleted
                  ? 'bg-green-500/5 border-green-500/30'
                  : 'glass border-white/10'
              }`}
            >
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="absolute left-8 top-16 w-0.5 h-8 bg-gradient-to-b from-blue-500/50 to-transparent" />
              )}

              {/* Icon */}
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                  isCompleted
                    ? 'bg-green-500/20 border-2 border-green-500'
                    : isCurrent
                    ? 'bg-blue-500/20 border-2 border-blue-500 animate-pulse'
                    : 'bg-gray-700 border border-gray-600'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-6 h-6 text-green-400" />
                ) : (
                  <Icon className={`w-6 h-6 ${isCurrent ? 'text-blue-400' : 'text-gray-400'}`} />
                )}
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-white flex items-center gap-2">
                      {step.title}
                      {isCurrent && (
                        <Badge variant="secondary" className="text-xs">
                          Current
                        </Badge>
                      )}
                    </h4>
                    <p className="text-sm text-gray-400 mt-1">{step.description}</p>
                  </div>
                  {step.estimatedTime && (
                    <Badge variant="outline" className="text-xs">
                      {step.estimatedTime}
                    </Badge>
                  )}
                </div>

                {/* Action Button */}
                {step.action && !isCompleted && (
                  <Button
                    size="sm"
                    variant={isCurrent ? 'default' : 'outline'}
                    className={`mt-2 gap-2 ${isCurrent ? 'glow-on-hover' : ''}`}
                    onClick={step.action.onClick}
                  >
                    {step.action.label}
                    {step.action.href ? (
                      <ExternalLink className="w-3 h-3" />
                    ) : (
                      <ArrowRight className="w-3 h-3" />
                    )}
                  </Button>
                )}

                {isCompleted && (
                  <div className="mt-2 flex items-center gap-2 text-xs text-green-400">
                    <CheckCircle2 className="w-3 h-3" />
                    Completed
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* GTMVP Services CTA */}
      <div className="glass border border-blue-500/30 rounded-lg p-4 bg-blue-500/5">
        <h4 className="text-sm font-semibold text-white mb-2">🚀 Need Help Executing?</h4>
        <p className="text-xs text-gray-400 mb-3">
          GTMVP specializes in turning validated ideas into successful products. We handle MVP development,
          go-to-market strategy, and growth execution.
        </p>
        <div className="flex gap-2">
          <Button size="sm" className="gap-2">
            <MessageSquare className="w-3 h-3" />
            Book Consultation
          </Button>
          <Button size="sm" variant="outline" className="gap-2">
            <FileText className="w-3 h-3" />
            View Services
          </Button>
        </div>
      </div>
    </Card>
  );
}

// Default step templates based on verdict
export const buildPathSteps: NextStep[] = [
  {
    id: 'validation',
    title: 'Idea Validation Complete',
    description: 'Your idea has been validated and scored across 6 dimensions',
    icon: 'file',
    status: 'completed',
    estimatedTime: 'Done',
  },
  {
    id: 'technical-spec',
    title: 'Technical Specification',
    description: 'Define technical requirements, architecture, and tech stack',
    icon: 'code',
    status: 'current',
    action: {
      label: 'Start Tech Spec',
    },
    estimatedTime: '2-3 days',
  },
  {
    id: 'mvp-development',
    title: 'MVP Development',
    description: 'Build your minimum viable product with core features',
    icon: 'rocket',
    status: 'upcoming',
    action: {
      label: 'Begin Development',
    },
    estimatedTime: '4-8 weeks',
  },
  {
    id: 'gtm-strategy',
    title: 'Go-To-Market Strategy',
    description: 'Create marketing plan, pricing, and launch tactics',
    icon: 'trending',
    status: 'upcoming',
    action: {
      label: 'Plan GTM',
    },
    estimatedTime: '1-2 weeks',
  },
  {
    id: 'user-testing',
    title: 'User Testing & Feedback',
    description: 'Validate with real users and iterate based on feedback',
    icon: 'users',
    status: 'upcoming',
    action: {
      label: 'Start Testing',
    },
    estimatedTime: '2-3 weeks',
  },
  {
    id: 'launch',
    title: 'Product Launch',
    description: 'Execute launch plan and start acquiring customers',
    icon: 'calendar',
    status: 'upcoming',
    action: {
      label: 'Launch Product',
    },
    estimatedTime: '1 week',
  },
];

export const pivotPathSteps: NextStep[] = [
  {
    id: 'validation',
    title: 'Initial Validation Complete',
    description: 'Your idea shows promise but needs refinement',
    icon: 'file',
    status: 'completed',
    estimatedTime: 'Done',
  },
  {
    id: 'deep-research',
    title: 'Deep Market Research',
    description: 'Conduct additional research to identify pivot opportunities',
    icon: 'trending',
    status: 'current',
    action: {
      label: 'Start Research',
    },
    estimatedTime: '1 week',
  },
  {
    id: 'pivot-planning',
    title: 'Pivot Strategy',
    description: 'Define how to adjust your idea based on insights',
    icon: 'message',
    status: 'upcoming',
    action: {
      label: 'Plan Pivot',
    },
    estimatedTime: '3-5 days',
  },
  {
    id: 're-validation',
    title: 'Re-validate Adjusted Idea',
    description: 'Validate your pivoted concept with new analysis',
    icon: 'file',
    status: 'upcoming',
    action: {
      label: 'Re-validate',
    },
    estimatedTime: '1-2 days',
  },
  {
    id: 'proceed-to-build',
    title: 'Proceed to Build Path',
    description: 'Move forward with refined and validated concept',
    icon: 'rocket',
    status: 'upcoming',
    action: {
      label: 'Start Building',
    },
    estimatedTime: 'Ongoing',
  },
];

export const skipPathSteps: NextStep[] = [
  {
    id: 'validation',
    title: 'Validation Complete',
    description: 'Current idea shows high risk - explore alternatives',
    icon: 'file',
    status: 'completed',
    estimatedTime: 'Done',
  },
  {
    id: 'alternative-ideas',
    title: 'Explore Alternative Ideas',
    description: 'Brainstorm variations or completely new concepts',
    icon: 'message',
    status: 'current',
    action: {
      label: 'Brainstorm Alternatives',
    },
    estimatedTime: '1-2 weeks',
  },
  {
    id: 'market-analysis',
    title: 'Market Gap Analysis',
    description: 'Identify underserved markets and emerging opportunities',
    icon: 'trending',
    status: 'upcoming',
    action: {
      label: 'Analyze Market',
    },
    estimatedTime: '1 week',
  },
  {
    id: 'new-validation',
    title: 'Validate New Idea',
    description: 'Run validation on your new concept',
    icon: 'file',
    status: 'upcoming',
    action: {
      label: 'Validate New Idea',
    },
    estimatedTime: '1-2 days',
  },
];
