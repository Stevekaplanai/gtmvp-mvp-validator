'use client';

import { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../components/ChatMessage';
import { ChatInput } from '../components/ChatInput';
import { Message } from '@/lib/types';

export function KnowledgeChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: `Hi! I'm your GTMVP assistant. 👋

I can answer questions about:
- **AI Automation** - Customer service chatbots, lead qualification, content creation
- **Paid Ads Management** - Google, Facebook, Instagram, YouTube campaigns
- **MVP Development** - Launch your startup idea in weeks, not months
- **Developer Matching** - Connect with the right technical talent
- **Pricing & Packages** - Transparent pricing for all services
- **Case Studies** - Past projects and results

What would you like to know about GTMVP?`,
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
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
          mode: 'knowledge',
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
      } else {
        throw new Error(data.error || 'Failed to get response');
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again or call us at (954) 228-5908.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-280px)] bg-card-bg border border-border rounded-xl overflow-hidden">
      {/* Quick Actions */}
      <div className="border-b border-border p-4 bg-background">
        <div className="text-sm font-medium text-foreground mb-2">Quick Questions:</div>
        <div className="flex flex-wrap gap-2">
          {[
            'How much does AI automation cost?',
            'What\'s your ads management process?',
            'Can you help launch my MVP?',
            'Tell me about your case studies',
          ].map((question) => (
            <button
              key={question}
              onClick={() => handleSend(question)}
              disabled={isLoading}
              className="px-3 py-1.5 bg-card-bg border border-border rounded-full text-xs text-foreground hover:bg-hover transition-colors disabled:opacity-50"
            >
              {question}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map(message => (
          <ChatMessage key={message.id} message={message} />
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-card-bg border border-border rounded-2xl px-4 py-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input */}
      <ChatInput
        onSend={handleSend}
        disabled={isLoading}
        placeholder="Ask about GTMVP services..."
      />
    </div>
  );
}
