// Knowledge base manager - combines all sources and provides search

import { KnowledgeSource, ChatbotContext } from '../types';
import { ingestGTMVPRepos } from './github-ingest';
import { ingestGTMVPNotion } from './notion-ingest';
import { ingestGTMVPWebsite } from './website-ingest';

class KnowledgeBase {
  private sources: KnowledgeSource[] = [];
  private initialized = false;

  async initialize(): Promise<void> {
    if (this.initialized) return;

    console.log('Initializing knowledge base...');

    try {
      // Ingest from all sources
      const [githubSources, notionSources, websiteSources] = await Promise.all([
        ingestGTMVPRepos(),
        ingestGTMVPNotion(),
        ingestGTMVPWebsite(),
      ]);

      this.sources = [...githubSources, ...notionSources, ...websiteSources];
      this.initialized = true;

      console.log(`Knowledge base initialized with ${this.sources.length} sources`);
    } catch (error) {
      console.error('Error initializing knowledge base:', error);
      throw error;
    }
  }

  async search(query: string, category?: string, limit = 5): Promise<ChatbotContext> {
    if (!this.initialized) {
      await this.initialize();
    }

    const queryLower = query.toLowerCase();

    // Simple keyword matching (in production, would use vector similarity)
    let matches = this.sources.filter(source => {
      const matchesQuery =
        source.content.toLowerCase().includes(queryLower) ||
        source.metadata.title?.toLowerCase().includes(queryLower);

      const matchesCategory = !category || source.metadata.category === category;

      return matchesQuery && matchesCategory;
    });

    // Sort by relevance (simple heuristic - count of matches)
    matches = matches
      .map(source => ({
        source,
        score: (source.content.toLowerCase().match(new RegExp(queryLower, 'g')) || []).length,
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(({ source }) => source);

    // Calculate average relevance score
    const avgScore = matches.length > 0 ? 0.8 : 0.0; // Mock score

    return {
      sources: matches,
      relevanceScore: avgScore,
    };
  }

  async getSourcesByCategory(category: string): Promise<KnowledgeSource[]> {
    if (!this.initialized) {
      await this.initialize();
    }

    return this.sources.filter(source => source.metadata.category === category);
  }

  async getAllSources(): Promise<KnowledgeSource[]> {
    if (!this.initialized) {
      await this.initialize();
    }

    return this.sources;
  }

  getStats() {
    return {
      totalSources: this.sources.length,
      byType: {
        github: this.sources.filter(s => s.type === 'github').length,
        notion: this.sources.filter(s => s.type === 'notion').length,
        website: this.sources.filter(s => s.type === 'manual' && s.id.startsWith('website-')).length,
        manual: this.sources.filter(s => s.type === 'manual' && !s.id.startsWith('website-')).length,
      },
      byCategory: {
        service: this.sources.filter(s => s.metadata.category === 'service').length,
        pricing: this.sources.filter(s => s.metadata.category === 'pricing').length,
        caseStudy: this.sources.filter(s => s.metadata.category === 'case-study').length,
        technical: this.sources.filter(s => s.metadata.category === 'technical').length,
      },
    };
  }
}

// Singleton instance
export const knowledgeBase = new KnowledgeBase();
