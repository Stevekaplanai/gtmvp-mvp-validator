'use client';

import { useState } from 'react';
import { ValidatorChat } from './validator/ValidatorChat';
import { KnowledgeChat } from './chatbot/KnowledgeChat';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, MessageCircle, Phone, Mail } from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'validator' | 'knowledge'>('validator');

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col">
      {/* Header */}
      <header className="relative z-10 glass border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-blue-400 animate-pulse" />
                <span className="text-2xl font-bold gradient-text">GTMVP</span>
              </div>
              <Badge variant="secondary" className="hidden sm:flex">
                AI-Powered MVP Validation
              </Badge>
            </div>
            <div className="flex items-center gap-4">
              <a
                href="https://gtmvp.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                About
              </a>
              <Button
                variant="outline"
                size="sm"
                className="glow-on-hover hidden sm:flex items-center gap-2"
                asChild
              >
                <a href="tel:9542285908">
                  <Phone className="w-4 h-4" />
                  (954) 228-5908
                </a>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="relative z-10 glass border-b border-white/10 sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex gap-2 py-3">
            <Button
              variant={activeTab === 'validator' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('validator')}
              className={`flex-1 sm:flex-none group ${
                activeTab === 'validator' ? 'glow-on-hover' : ''
              }`}
            >
              <div className="flex flex-col items-start gap-1">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  <span className="font-semibold">MVP Validator</span>
                </div>
                <span className="text-xs text-gray-400 hidden sm:block">
                  Validate your idea with AI research
                </span>
              </div>
            </Button>
            <Button
              variant={activeTab === 'knowledge' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('knowledge')}
              className={`flex-1 sm:flex-none group ${
                activeTab === 'knowledge' ? 'glow-on-hover' : ''
              }`}
            >
              <div className="flex flex-col items-start gap-1">
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  <span className="font-semibold">Ask About GTMVP</span>
                </div>
                <span className="text-xs text-gray-400 hidden sm:block">
                  Questions about our services
                </span>
              </div>
            </Button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex flex-col">
        {activeTab === 'validator' ? (
          <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 flex flex-col">
            <Card className="glass border-white/10 overflow-hidden flex-1 flex flex-col">
              <ValidatorChat />
            </Card>
          </div>
        ) : (
          <div className="flex-1 flex flex-col">
            <KnowledgeChat />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 glass border-t border-white/10 mt-auto py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <span>© 2025 GTMVP. Built with</span>
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span>by</span>
              <a href="https://gtmvp.com" className="text-blue-400 hover:text-blue-300 transition-colors">
                GTMVP
              </a>
            </div>
            <div className="flex items-center gap-4">
              <a
                href="mailto:hello@gtmvp.com"
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <Mail className="w-4 h-4" />
                hello@gtmvp.com
              </a>
              <span className="hidden sm:inline">•</span>
              <span className="hidden sm:inline">Dover, Delaware</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
