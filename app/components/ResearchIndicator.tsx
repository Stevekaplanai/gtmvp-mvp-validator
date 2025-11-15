'use client';

import { ResearchStatus } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle2, XCircle, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ResearchIndicatorProps {
  status: ResearchStatus;
}

export function ResearchIndicator({ status }: ResearchIndicatorProps) {
  const sources = [
    { key: 'reddit' as const, label: 'Reddit', icon: '💬', color: 'from-orange-500 to-red-500' },
    { key: 'github' as const, label: 'GitHub', icon: '⚙️', color: 'from-purple-500 to-pink-500' },
    { key: 'youtube' as const, label: 'YouTube', icon: '📺', color: 'from-red-500 to-pink-500' },
    { key: 'context7' as const, label: 'Tech Docs', icon: '📚', color: 'from-blue-500 to-cyan-500' },
  ];

  return (
    <div className="glass border-white/10 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <Activity className="w-4 h-4 text-blue-400 animate-pulse" />
        <span className="text-sm font-medium text-gray-300">
          Researching your idea...
        </span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {sources.map(source => {
          const sourceStatus = status[source.key];
          const results = status[`${source.key}Results` as keyof ResearchStatus] as number | undefined;

          return (
            <div
              key={source.key}
              className={cn(
                'glass border-white/10 rounded-lg p-3 transition-all',
                sourceStatus === 'analyzing' && 'border-blue-500/50 shadow-lg shadow-blue-500/20'
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{source.icon}</span>
                  <span className="text-sm text-gray-300">{source.label}</span>
                </div>
                {sourceStatus === 'analyzing' && (
                  <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
                )}
                {sourceStatus === 'complete' && (
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                )}
                {sourceStatus === 'error' && (
                  <XCircle className="w-4 h-4 text-red-400" />
                )}
              </div>
              {results !== undefined && sourceStatus === 'complete' && (
                <Badge
                  variant="secondary"
                  className="mt-2 text-[10px] bg-green-500/20 text-green-300 border-green-500/30"
                >
                  {results} found
                </Badge>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
