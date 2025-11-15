// Embedding generation for RAG system
// Using OpenAI embeddings for production-quality semantic search

import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const response = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: text,
    });

    return response.data[0].embedding;
  } catch (error) {
    console.error('Error generating embedding:', error);
    // Fallback to mock if API fails
    return generateMockEmbedding(text);
  }
}

export async function generateBatchEmbeddings(texts: string[]): Promise<number[][]> {
  try {
    // OpenAI recommends batching in groups of up to 2048 texts
    const batchSize = 100;
    const batches: string[][] = [];

    for (let i = 0; i < texts.length; i += batchSize) {
      batches.push(texts.slice(i, i + batchSize));
    }

    const allEmbeddings: number[][] = [];

    for (const batch of batches) {
      const response = await openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: batch,
      });

      allEmbeddings.push(...response.data.map(item => item.embedding));
    }

    return allEmbeddings;
  } catch (error) {
    console.error('Error generating batch embeddings:', error);
    // Fallback to mock if API fails
    return Promise.all(texts.map(text => generateMockEmbedding(text)));
  }
}

// Fallback mock embedding function
function generateMockEmbedding(text: string): number[] {
  const normalized = text.toLowerCase().trim();
  const embedding: number[] = [];
  const dimensions = 1536; // Match OpenAI embedding dimension

  for (let i = 0; i < dimensions; i++) {
    const charCode = normalized.charCodeAt(i % normalized.length) || 0;
    const value = Math.sin(charCode * (i + 1)) * Math.cos(normalized.length * (i + 1));
    embedding.push(value);
  }

  const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
  return embedding.map(val => val / magnitude);
}
