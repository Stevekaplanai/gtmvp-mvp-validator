'use client';

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Rocket,
  TrendingUp,
  Zap,
  Target,
  CheckCircle2
} from "lucide-react";

interface Milestone {
  phase: string;
  timeline: string;
  icon: 'rocket' | 'trending' | 'zap' | 'target';
  goals: string[];
  metrics: string[];
  status: 'upcoming' | 'current' | 'completed';
}

interface RoadmapTimelineProps {
  milestones: Milestone[];
}

const iconMap = {
  rocket: Rocket,
  trending: TrendingUp,
  zap: Zap,
  target: Target,
};

export function RoadmapTimeline({ milestones }: RoadmapTimelineProps) {
  return (
    <Card className="glass border-white/10 p-6">
      <h3 className="text-xl font-bold text-white mb-6">🗓️ 90-Day Execution Roadmap</h3>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500" />

        {/* Milestones */}
        <div className="space-y-8">
          {milestones.map((milestone, index) => {
            const Icon = iconMap[milestone.icon];
            const isLast = index === milestones.length - 1;

            return (
              <div key={index} className="relative pl-16">
                {/* Icon Circle */}
                <div className="absolute left-0 top-0 w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shadow-lg shadow-blue-500/50">
                  <Icon className="w-6 h-6 text-white" />
                </div>

                {/* Content */}
                <div className="glass border border-white/10 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="text-lg font-semibold text-white">
                        {milestone.phase}
                      </h4>
                      <p className="text-sm text-gray-400">{milestone.timeline}</p>
                    </div>
                    <Badge
                      variant={
                        milestone.status === 'completed' ? 'default' :
                        milestone.status === 'current' ? 'secondary' : 'outline'
                      }
                    >
                      {milestone.status === 'completed' ? 'Done' :
                       milestone.status === 'current' ? 'In Progress' : 'Upcoming'}
                    </Badge>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="text-sm font-semibold text-gray-300 mb-2">Goals:</h5>
                      <ul className="space-y-1">
                        {milestone.goals.map((goal, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-gray-400">
                            <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                            <span>{goal}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h5 className="text-sm font-semibold text-gray-300 mb-2">Key Metrics:</h5>
                      <ul className="space-y-1">
                        {milestone.metrics.map((metric, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-gray-400">
                            <Target className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                            <span>{metric}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
