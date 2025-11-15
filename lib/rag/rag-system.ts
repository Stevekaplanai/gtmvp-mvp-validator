// Complete RAG (Retrieval-Augmented Generation) system

import { knowledgeBase } from './knowledge-base';
import { VectorStore } from './vector-store';
import { generateEmbedding, generateBatchEmbeddings } from './embeddings';
import { KnowledgeSource } from '../types';

class RAGSystem {
  private vectorStore: VectorStore;
  private initialized = false;

  constructor() {
    this.vectorStore = new VectorStore();
  }

  async initialize(): Promise<void> {
    if (this.initialized) return;

    console.log('Initializing RAG system...');

    try {
      // Initialize knowledge base first
      await knowledgeBase.initialize();

      // Get all sources
      const sources = await knowledgeBase.getAllSources();

      // Generate embeddings for all sources
      const texts = sources.map(s => s.content);
      const embeddings = await generateBatchEmbeddings(texts);

      // Add to vector store
      await this.vectorStore.addBatch(sources, embeddings);

      this.initialized = true;

      console.log(`RAG system initialized with ${this.vectorStore.size()} vectors`);
    } catch (error) {
      console.error('Error initializing RAG system:', error);
      throw error;
    }
  }

  async query(question: string, limit = 3): Promise<{
    sources: KnowledgeSource[];
    context: string;
  }> {
    if (!this.initialized) {
      await this.initialize();
    }

    // Generate embedding for the question
    const queryEmbedding = await generateEmbedding(question);

    // Search vector store
    const sources = await this.vectorStore.search(queryEmbedding, limit);

    // Combine source content into context
    const context = sources
      .map((source, index) => {
        return `[Source ${index + 1}: ${source.metadata.title}]\n${source.content}\n`;
      })
      .join('\n---\n\n');

    return {
      sources,
      context,
    };
  }

  async getStats() {
    return {
      initialized: this.initialized,
      vectorCount: this.vectorStore.size(),
      knowledgeBaseStats: knowledgeBase.getStats(),
    };
  }
}

// Singleton instance
export const ragSystem = new RAGSystem();
