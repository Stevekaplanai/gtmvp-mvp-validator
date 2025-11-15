'use client';

import { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../components/ChatMessage';
import { ChatInput } from '../components/ChatInput';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Message } from '@/lib/types';
import { MessageCircle } from 'lucide-react';

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

  const quickQuestions = [
    'How much does AI automation cost?',
    'What\'s your ads management process?',
    'Can you help launch my MVP?',
    'Tell me about your case studies',
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-280px)]">
      {/* Header */}
      <div className="glass border-b border-white/10 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600">
            <MessageCircle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">GTMVP Assistant</h2>
            <p className="text-sm text-gray-400">Ask anything about our services</p>
          </div>
        </div>

        {/* Quick Questions */}
        <div className="flex flex-wrap gap-2">
          {quickQuestions.map((question) => (
            <Button
              key={question}
              onClick={() => handleSend(question)}
              disabled={isLoading}
              variant="outline"
              size="sm"
              className="glass border-white/20 hover:border-purple-500/50 hover:bg-purple-500/10 text-xs transition-all"
            >
              {question}
            </Button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-6">
        {messages.map(message => (
          <ChatMessage key={message.id} message={message} />
        ))}
        {isLoading && (
          <div className="flex justify-start animate-in slide-in-from-bottom-2">
            <div className="glass border-white/10 rounded-2xl px-5 py-4">
              <div className="flex gap-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
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
        placeholder="Ask about GTMVP services..."
      />
    </div>
  );
}
