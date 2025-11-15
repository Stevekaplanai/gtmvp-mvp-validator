'use client';

import { Message } from '@/lib/types';
import { ResearchIndicator } from './ResearchIndicator';

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
          isUser
            ? 'bg-accent text-white'
            : 'bg-card-bg border border-border text-foreground'
        }`}
      >
        {!isUser && message.metadata?.researchStatus && (
          <ResearchIndicator status={message.metadata.researchStatus} />
        )}

        <div className="whitespace-pre-wrap">{message.content}</div>

        {message.metadata?.scorecard && (
          <div className="mt-4 pt-4 border-t border-border/50">
            <div className="text-sm font-medium mb-2">Validation Score</div>
            <div className="text-3xl font-bold text-accent">
              {message.metadata.scorecard.overall}/100
            </div>
          </div>
        )}

        <div className="text-xs text-muted-foreground mt-2">
          {new Date(message.timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>
      </div>
    </div>
  );
}
