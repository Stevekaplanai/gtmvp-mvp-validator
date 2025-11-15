// Simple vector store for RAG system
// In production, replace with Supabase Vector or Pinecone

import { KnowledgeSource } from '../types';

export interface VectorEntry {
  id: string;
  embedding: number[];
  source: KnowledgeSource;
}

export class VectorStore {
  private entries: VectorEntry[] = [];

  async addEntry(source: KnowledgeSource, embedding: number[]): Promise<void> {
    this.entries.push({
      id: source.id,
      embedding,
      source,
    });
  }

  async addBatch(sources: KnowledgeSource[], embeddings: number[][]): Promise<void> {
    for (let i = 0; i < sources.length; i++) {
      await this.addEntry(sources[i], embeddings[i]);
    }
  }

  async search(queryEmbedding: number[], limit = 5, minScore = 0.7): Promise<KnowledgeSource[]> {
    // Calculate cosine similarity for each entry
    const scored = this.entries.map(entry => ({
      source: entry.source,
      score: cosineSimilarity(queryEmbedding, entry.embedding),
    }));

    // Sort by score descending and filter by minimum score
    const results = scored
      .filter(item => item.score >= minScore)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(item => item.source);

    return results;
  }

  size(): number {
    return this.entries.length;
  }

  clear(): void {
    this.entries = [];
  }
}

// Calculate cosine similarity between two vectors
function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    throw new Error('Vectors must have the same length');
  }

  let dotProduct = 0;
  let magnitudeA = 0;
  let magnitudeB = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    magnitudeA += a[i] * a[i];
    magnitudeB += b[i] * b[i];
  }

  magnitudeA = Math.sqrt(magnitudeA);
  magnitudeB = Math.sqrt(magnitudeB);

  if (magnitudeA === 0 || magnitudeB === 0) {
    return 0;
  }

  return dotProduct / (magnitudeA * magnitudeB);
}
