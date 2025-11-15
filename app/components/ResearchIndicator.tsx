'use client';

import { ResearchStatus } from '@/lib/types';

interface ResearchIndicatorProps {
  status: ResearchStatus;
}

export function ResearchIndicator({ status }: ResearchIndicatorProps) {
  const sources = [
    { key: 'reddit' as const, label: 'Reddit', icon: '💬' },
    { key: 'github' as const, label: 'GitHub', icon: '⚙️' },
    { key: 'youtube' as const, label: 'YouTube', icon: '📺' },
    { key: 'context7' as const, label: 'Tech Docs', icon: '📚' },
  ];

  return (
    <div className="mb-3 p-3 bg-background rounded-lg border border-border">
      <div className="text-xs font-medium text-muted-foreground mb-2">
        Researching your idea...
      </div>
      <div className="grid grid-cols-2 gap-2">
        {sources.map(source => {
          const sourceStatus = status[source.key];
          const results = status[`${source.key}Results` as keyof ResearchStatus] as number | undefined;

          return (
            <div
              key={source.key}
              className="flex items-center gap-2 text-sm"
            >
              <span>{source.icon}</span>
              <span className="text-foreground">{source.label}</span>
              {sourceStatus === 'analyzing' && (
                <div className="ml-auto flex gap-1">
                  <div className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              )}
              {sourceStatus === 'complete' && (
                <span className="ml-auto text-xs text-success">
                  ✓ {results ? `${results} found` : 'Done'}
                </span>
              )}
              {sourceStatus === 'error' && (
                <span className="ml-auto text-xs text-error">✗</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
