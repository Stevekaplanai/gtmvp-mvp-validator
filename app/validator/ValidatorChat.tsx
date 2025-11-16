'use client';

import { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../components/ChatMessage';
import { ChatInput } from '../components/ChatInput';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Message } from '@/lib/types';
import { Sparkles, Trophy, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EngagementHub } from '@/components/engagement/EngagementHub';

export function ValidatorChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: `## 🎯 Welcome to GTMVP MVP Validator

Get **ideabrowser.com-level analysis** for your startup idea with our AI-powered validation system.

### 📊 What You Get:

**Level 1: Quick Validation** (2-3 min)
- 6-dimensional scorecard (Market Opportunity, Problem Severity, Technical Feasibility, Market Timing, Founder Fit, Monetization)
- Clear verdict: BUILD ✅ / PIVOT ⚠️ / SKIP ❌
- Key insights and immediate concerns

**Level 2: Deep Dive** (10-15 min)
- Community signals from Reddit & YouTube
- Competitive landscape analysis
- Market sizing (TAM/SAM/SOM)
- Revenue projections & GTM strategy

**Level 3: Full Analysis** (20-30 min)
- Complete 40-step validation report
- Detailed pricing strategy with tiers
- Multi-channel GTM tactics
- 90-day execution roadmap

### 💡 Ready to validate your idea?

**Describe your MVP idea in 1-2 sentences.** I'll instantly provide a comprehensive assessment and you can choose how deep to go.`,
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [showEngagementHub, setShowEngagementHub] = useState(false);
  const [validationData, setValidationData] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content,
          })),
          mode: 'validator',
        }),
      });

      const data = await response.json();

      if (data.success) {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.response,
          timestamp: new Date(),
        };

        setMessages(prev => [...prev, assistantMessage]);

        // Try to detect if this is a validation result
        const response = data.response.toLowerCase();
        if (response.includes('overall score') || response.includes('verdict')) {
          // Parse validation data (simplified - in production, AI would return structured data)
          const mockValidation = {
            idea: {
              name: userMessage.content.substring(0, 100),
              description: userMessage.content,
              category: 'SaaS',
            },
            score: 78, // Would be parsed from response
            verdict: 'BUILD' as const,
            dimensions: {
              marketOpportunity: 85,
              problemSeverity: 80,
              technicalFeasibility: 75,
              marketTiming: 88,
              founderFit: 70,
              monetizationPotential: 82,
            },
          };
          setValidationData(mockValidation);
        }
      } else {
        throw new Error(data.error || 'Failed to get response');
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Welcome Header */}
      <div className="glass border-b border-white/10 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">MVP Validator</h2>
              <p className="text-sm text-gray-400">AI-powered idea validation with real-time research</p>
            </div>
          </div>
          {validationData && (
            <Button
              onClick={() => setShowEngagementHub(true)}
              className="gap-2 glow-on-hover bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              <Trophy className="w-4 h-4" />
              View Engagement Features
            </Button>
          )}
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-6">
        {messages.map((message, index) => (
          <div key={message.id}>
            <ChatMessage message={message} />

            {/* Show engagement features card after last message if validation detected */}
            {index === messages.length - 1 && validationData && (
              <div className="mt-4 animate-in slide-in-from-bottom-4">
                <div className="glass border-purple-500/30 rounded-2xl p-6 bg-gradient-to-r from-purple-500/10 to-pink-500/10">
                  <div className="flex items-center gap-3 mb-4">
                    <Trophy className="w-6 h-6 text-purple-400" />
                    <div>
                      <h3 className="font-bold text-white">Unlock Engagement Features!</h3>
                      <p className="text-sm text-gray-400">
                        Explore interactive features like AI debates, startup comparisons, and more
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="justify-start gap-2"
                      onClick={() => setShowEngagementHub(true)}
                    >
                      <TrendingUp className="w-4 h-4" />
                      Compare to Startups
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="justify-start gap-2"
                      onClick={() => setShowEngagementHub(true)}
                    >
                      <Sparkles className="w-4 h-4" />
                      AI Debate
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="justify-start gap-2"
                      onClick={() => setShowEngagementHub(true)}
                    >
                      <Trophy className="w-4 h-4" />
                      Achievements
                    </Button>
                  </div>
                  <Button
                    onClick={() => setShowEngagementHub(true)}
                    className="w-full mt-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  >
                    View All Engagement Features
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start animate-in slide-in-from-bottom-2">
            <div className="glass border-white/10 rounded-2xl px-5 py-4">
              <div className="flex gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </ScrollArea>

      {/* Input */}
      <ChatInput
        onSend={handleSend}
        disabled={isLoading}
        placeholder="Describe your MVP idea..."
      />

      {/* Engagement Hub Modal */}
      {showEngagementHub && validationData && (
        <EngagementHub
          idea={validationData.idea}
          score={validationData.score}
          verdict={validationData.verdict}
          dimensions={validationData.dimensions}
          onClose={() => setShowEngagementHub(false)}
        />
      )}

      {/* Floating Action Button */}
      {validationData && !showEngagementHub && (
        <div className="absolute bottom-24 right-6 z-20">
          <Button
            onClick={() => setShowEngagementHub(true)}
            className="rounded-full w-14 h-14 shadow-2xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 animate-bounce"
          >
            <Trophy className="w-6 h-6" />
          </Button>
        </div>
      )}
    </div>
  );
}
