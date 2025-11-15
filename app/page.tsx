'use client';

import { useState } from 'react';
import { ValidatorChat } from './validator/ValidatorChat';
import { KnowledgeChat } from './chatbot/KnowledgeChat';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'validator' | 'knowledge'>('validator');

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="text-2xl font-bold text-foreground">GTMVP</div>
              <div className="hidden sm:block text-sm text-muted-foreground">
                AI-Powered MVP Validation
              </div>
            </div>
            <div className="flex items-center gap-4">
              <a
                href="https://gtmvp.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                About GTMVP
              </a>
              <a
                href="tel:9542285908"
                className="hidden sm:block px-4 py-2 bg-accent hover:bg-accent-hover text-white text-sm font-medium rounded-lg transition-colors"
              >
                (954) 228-5908
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="border-b border-border bg-card-bg sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex gap-1">
            <button
              onClick={() => setActiveTab('validator')}
              className={`px-6 py-4 text-sm font-medium transition-colors border-b-2 ${
                activeTab === 'validator'
                  ? 'border-accent text-accent'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">🎯</span>
                <span>MVP Validator</span>
              </div>
              <div className="text-xs mt-0.5 font-normal">
                Validate your idea with AI research
              </div>
            </button>
            <button
              onClick={() => setActiveTab('knowledge')}
              className={`px-6 py-4 text-sm font-medium transition-colors border-b-2 ${
                activeTab === 'knowledge'
                  ? 'border-accent text-accent'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">💬</span>
                <span>Ask About GTMVP</span>
              </div>
              <div className="text-xs mt-0.5 font-normal">
                Questions about our services
              </div>
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'validator' ? <ValidatorChat /> : <KnowledgeChat />}
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card-bg py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <div>
              © 2025 GTMVP. Built with AI by{' '}
              <a href="https://gtmvp.com" className="text-accent hover:underline">
                GTMVP
              </a>
            </div>
            <div className="flex items-center gap-4">
              <a href="mailto:hello@gtmvp.com" className="hover:text-foreground transition-colors">
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
