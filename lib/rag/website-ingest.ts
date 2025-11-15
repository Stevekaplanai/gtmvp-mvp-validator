// Website content ingestion for knowledge base
// Loads scraped content from gtmvp.com into the knowledge base

import { KnowledgeSource } from '../types';
import * as fs from 'fs';
import * as path from 'path';

export interface WebsitePage {
  url: string;
  title: string;
  category: 'service' | 'pricing' | 'case-study' | 'technical';
  content: string;
  lastUpdated: string;
}

export async function ingestWebsiteContent(scrapedDir: string): Promise<KnowledgeSource[]> {
  const sources: KnowledgeSource[] = [];

  try {
    // Read all JSON files from the scraped directory
    const files = fs.readdirSync(scrapedDir).filter(file => file.endsWith('.json'));

    for (const file of files) {
      const filePath = path.join(scrapedDir, file);
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const page: WebsitePage = JSON.parse(fileContent);

      sources.push({
        id: `website-${file.replace('.json', '')}`,
        type: 'manual',
        content: page.content,
        metadata: {
          title: page.title,
          url: page.url,
          category: page.category,
          lastUpdated: new Date(page.lastUpdated),
        },
      });
    }

    console.log(`Ingested ${sources.length} pages from gtmvp.com`);
  } catch (error) {
    console.error('Error ingesting website content:', error);
  }

  return sources;
}

// Function to ingest GTMVP website
export async function ingestGTMVPWebsite(): Promise<KnowledgeSource[]> {
  const scrapedDir = path.join(process.cwd(), 'knowledge-base', 'scraped');

  // Check if directory exists, if not return empty array (will use during build)
  if (!fs.existsSync(scrapedDir)) {
    console.log('Scraped content directory not found, skipping website ingestion');
    return [];
  }

  return ingestWebsiteContent(scrapedDir);
}
