'use client';

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Download,
  Share2
} from "lucide-react";

interface ExecutiveBriefProps {
  idea: string;
  overallScore: number;
  verdict: 'BUILD' | 'PIVOT' | 'SKIP';
  keyInsights: string[];
  immediateActions: string[];
  estimatedRevenue?: string;
  estimatedTimeline?: string;
}

export function ExecutiveBrief({
  idea,
  overallScore,
  verdict,
  keyInsights,
  immediateActions,
  estimatedRevenue,
  estimatedTimeline,
}: ExecutiveBriefProps) {
  const verdictConfig = {
    BUILD: {
      color: 'bg-green-500/20 border-green-500/50 text-green-400',
      icon: CheckCircle2,
      message: 'Strong opportunity - proceed with development',
    },
    PIVOT: {
      color: 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400',
      icon: AlertCircle,
      message: 'Promising but needs refinement',
    },
    SKIP: {
      color: 'bg-red-500/20 border-red-500/50 text-red-400',
      icon: TrendingDown,
      message: 'High risk - consider alternatives',
    },
  };

  const config = verdictConfig[verdict];
  const VerdictIcon = config.icon;

  return (
    <Card className="glass border-white/10 p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-white mb-2">Executive Brief</h2>
          <p className="text-gray-400">{idea}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Share2 className="w-4 h-4" />
            Share
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Verdict Card */}
      <div className={`rounded-lg border p-4 ${config.color}`}>
        <div className="flex items-center gap-3 mb-2">
          <VerdictIcon className="w-6 h-6" />
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h3 className="text-xl font-bold">Verdict: {verdict}</h3>
              <Badge variant="secondary" className="text-lg">
                Score: {overallScore}/100
              </Badge>
            </div>
            <p className="text-sm mt-1">{config.message}</p>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      {(estimatedRevenue || estimatedTimeline) && (
        <div className="grid grid-cols-2 gap-4">
          {estimatedRevenue && (
            <div className="glass border border-white/10 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <h4 className="text-sm text-gray-400">Est. Year 1 Revenue</h4>
              </div>
              <p className="text-2xl font-bold text-white">{estimatedRevenue}</p>
            </div>
          )}
          {estimatedTimeline && (
            <div className="glass border border-white/10 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-1">
                <AlertCircle className="w-4 h-4 text-blue-400" />
                <h4 className="text-sm text-gray-400">Time to MVP</h4>
              </div>
              <p className="text-2xl font-bold text-white">{estimatedTimeline}</p>
            </div>
          )}
        </div>
      )}

      {/* Key Insights */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-3">🎯 Key Insights</h3>
        <div className="space-y-2">
          {keyInsights.map((insight, index) => (
            <div
              key={index}
              className="flex items-start gap-2 text-gray-300 text-sm"
            >
              <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
              <span>{insight}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Immediate Actions */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-3">⚡ Next Steps</h3>
        <div className="space-y-2">
          {immediateActions.map((action, index) => (
            <div
              key={index}
              className="flex items-start gap-2 glass border border-white/10 rounded-lg p-3"
            >
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 text-sm font-bold flex-shrink-0">
                {index + 1}
              </div>
              <span className="text-gray-300 text-sm">{action}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="flex gap-3 pt-4 border-t border-white/10">
        <Button className="flex-1 glow-on-hover gap-2">
          Start Building
          <ArrowRight className="w-4 h-4" />
        </Button>
        <Button variant="outline" className="flex-1">
          Talk to Expert
        </Button>
      </div>
    </Card>
  );
}
