'use client';

import { Message } from '@/lib/types';
import { ResearchIndicator } from './ResearchIndicator';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Bot, User, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <div
      className={cn(
        'flex gap-4 mb-6 animate-in slide-in-from-bottom-2 duration-500',
        isUser ? 'flex-row-reverse' : 'flex-row'
      )}
    >
      {/* Avatar */}
      <Avatar className={cn(
        'w-10 h-10 border-2 shadow-lg',
        isUser
          ? 'border-blue-500/50 bg-gradient-to-br from-blue-500 to-purple-600'
          : 'border-purple-500/50 bg-gradient-to-br from-purple-500 to-pink-600'
      )}>
        <div className="w-full h-full flex items-center justify-center">
          {isUser ? (
            <User className="w-5 h-5 text-white" />
          ) : (
            <Bot className="w-5 h-5 text-white" />
          )}
        </div>
      </Avatar>

      {/* Message Content */}
      <div className={cn('flex-1 max-w-[80%]', isUser && 'flex justify-end')}>
        <div
          className={cn(
            'rounded-2xl px-5 py-4 shadow-xl backdrop-blur-sm',
            isUser
              ? 'bg-gradient-to-br from-blue-600/90 to-purple-600/90 text-white border border-white/20'
              : 'glass border-white/10 text-gray-100'
          )}
        >
          {!isUser && message.metadata?.researchStatus && (
            <div className="mb-4">
              <ResearchIndicator status={message.metadata.researchStatus} />
            </div>
          )}

          <div className="whitespace-pre-wrap leading-relaxed">
            {message.content}
          </div>

          {message.metadata?.scorecard && (
            <div className="mt-6 pt-6 border-t border-white/20">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-yellow-400" />
                <span className="text-sm font-medium">Validation Score</span>
              </div>
              <div className="relative">
                <div className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  {message.metadata.scorecard.overall}
                  <span className="text-2xl">/100</span>
                </div>
                <div className="absolute inset-0 blur-2xl opacity-30 bg-gradient-to-r from-blue-500 to-purple-500" />
              </div>
            </div>
          )}

          <div className="text-xs text-gray-400 mt-3 flex items-center gap-2">
            <span>{new Date(message.timestamp).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}</span>
            {!isUser && (
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                AI
              </Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
