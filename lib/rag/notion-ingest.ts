// Notion workspace content ingestion for knowledge base

import { KnowledgeSource } from '../types';
import { Client } from '@notionhq/client';

export interface NotionPage {
  id: string;
  title: string;
  content: string;
  category?: 'service' | 'pricing' | 'case-study' | 'technical';
}

// Initialize Notion client
const notion = process.env.NOTION_API_KEY
  ? new Client({ auth: process.env.NOTION_API_KEY })
  : null;

export async function ingestNotionWorkspace(workspaceId: string): Promise<KnowledgeSource[]> {
  const sources: KnowledgeSource[] = [];

  try {
    // If Notion client is not available, use mock data
    if (!notion) {
      console.log('Notion API key not found, using mock data');
      return getMockNotionPages();
    }

    // Search for all pages in the workspace
    const response = await notion.search({
      filter: {
        property: 'object',
        value: 'page',
      },
      page_size: 100,
    });

    console.log(`Found ${response.results.length} pages in Notion workspace`);

    for (const page of response.results) {
      if (page.object === 'page') {
        try {
          // Get page title
          const title = getPageTitle(page);

          // Get page content
          const content = await getPageContent(page.id);

          // Infer category from title and content
          const category = inferNotionCategory(title, content);

          sources.push({
            id: `notion-${page.id}`,
            type: 'notion',
            content: `# ${title}\n\n${content}`,
            metadata: {
              title,
              url: `https://stevekaplanai.notion.site/${page.id}`,
              category,
              lastUpdated: new Date(page.last_edited_time),
            },
          });
        } catch (error) {
          console.error(`Error processing Notion page ${page.id}:`, error);
        }
      }
    }

    console.log(`Ingested ${sources.length} pages from Notion`);
  } catch (error) {
    console.error('Error ingesting Notion workspace:', error);
    // Fallback to mock data if API fails
    return getMockNotionPages();
  }

  return sources;
}

function getPageTitle(page: any): string {
  try {
    const properties = page.properties;

    // Try different title property names
    for (const [key, value] of Object.entries(properties)) {
      if (value && typeof value === 'object' && 'title' in value) {
        const titleArray = (value as any).title;
        if (Array.isArray(titleArray) && titleArray.length > 0) {
          return titleArray.map((t: any) => t.plain_text).join('');
        }
      }
    }

    // Try Name property
    if (properties.Name && properties.Name.title) {
      return properties.Name.title.map((t: any) => t.plain_text).join('');
    }

    return 'Untitled';
  } catch (error) {
    return 'Untitled';
  }
}

async function getPageContent(pageId: string): Promise<string> {
  if (!notion) return '';

  try {
    const blocks = await notion.blocks.children.list({
      block_id: pageId,
      page_size: 100,
    });

    let content = '';

    for (const block of blocks.results) {
      content += extractBlockText(block) + '\n\n';
    }

    return content.trim();
  } catch (error) {
    console.error(`Error fetching content for page ${pageId}:`, error);
    return '';
  }
}

function extractBlockText(block: any): string {
  try {
    const type = block.type;

    if (!type || !block[type]) return '';

    const blockData = block[type];

    // Handle rich text arrays
    if (blockData.rich_text && Array.isArray(blockData.rich_text)) {
      return blockData.rich_text.map((t: any) => t.plain_text).join('');
    }

    // Handle specific block types
    switch (type) {
      case 'paragraph':
      case 'heading_1':
      case 'heading_2':
      case 'heading_3':
      case 'bulleted_list_item':
      case 'numbered_list_item':
      case 'quote':
      case 'callout':
        return blockData.rich_text?.map((t: any) => t.plain_text).join('') || '';
      default:
        return '';
    }
  } catch (error) {
    return '';
  }
}

function inferNotionCategory(title: string, content: string): 'service' | 'pricing' | 'case-study' | 'technical' {
  const titleLower = title.toLowerCase();
  const contentLower = content.toLowerCase();

  if (titleLower.includes('case') || titleLower.includes('example') || contentLower.includes('case study')) {
    return 'case-study';
  }

  if (titleLower.includes('price') || titleLower.includes('cost') || contentLower.includes('pricing')) {
    return 'pricing';
  }

  if (titleLower.includes('service') || titleLower.includes('product') || contentLower.includes('offering')) {
    return 'service';
  }

  return 'technical';
}

function getMockNotionPages(): KnowledgeSource[] {
  const mockPages: NotionPage[] = [
      {
        id: 'page-1',
        title: 'GTMVP Services Overview',
        content: `# GTMVP Services

## AI Automation
- Customer service chatbots
- Lead qualification systems
- Content creation tools
- Saves 20+ hours per week

## Paid Ads Management
- Google, Facebook, Instagram, YouTube campaigns
- 3.2x average ROAS improvement
- 40% cost per acquisition decrease

## MVP Development
- Launch in weeks, not months
- Full-stack development
- Product strategy included

## Developer Matching
- Connect with vetted talent
- Technical assessment included
- Project management support`,
        category: 'service',
      },
      {
        id: 'page-2',
        title: 'Pricing & Packages',
        content: `# GTMVP Pricing

## AI Automation Packages
- **Starter**: $2,500/month - 1 chatbot + basic automation
- **Growth**: $5,000/month - Multiple bots + workflows
- **Enterprise**: Custom - Full automation suite

## Ads Management
- **Setup Fee**: $1,500 one-time
- **Management**: 15% of ad spend (minimum $2,000/month)

## MVP Development
- **MVP Package**: $15,000-$30,000
- **Includes**: Strategy, design, development, launch
- **Timeline**: 6-12 weeks

## Developer Matching
- **Placement Fee**: 20% of first year salary
- **Hourly Contractors**: $75-150/hour depending on skills`,
        category: 'pricing',
      },
      {
        id: 'page-3',
        title: 'Case Study: SaaS Chatbot Implementation',
        content: `# Case Study: AI Customer Service Chatbot

**Client**: B2B SaaS company (50 employees)

**Challenge**:
- Support team overwhelmed with repetitive questions
- 24/7 coverage needed
- Response time averaging 4 hours

**Solution**:
- Deployed AI chatbot trained on knowledge base
- Integrated with Zendesk and Slack
- Automated 70% of common inquiries

**Results**:
- Response time reduced to < 30 seconds
- Support team saved 100+ hours/month
- Customer satisfaction increased 35%
- ROI achieved in 3 months

**Tech Stack**: Claude AI, Next.js, Supabase, Vercel`,
        category: 'case-study',
      },
      {
        id: 'page-4',
        title: 'Technical Capabilities',
        content: `# GTMVP Technical Stack

## Frontend
- React, Next.js, Vue.js
- Tailwind CSS, shadcn/ui
- TypeScript

## Backend
- Node.js, Python, Go
- Supabase, Firebase, PostgreSQL
- RESTful APIs, GraphQL

## AI/ML
- Claude AI (Anthropic)
- OpenAI GPT-4
- Custom embeddings
- RAG systems

## DevOps
- Vercel, AWS, Google Cloud
- GitHub Actions, CircleCI
- Docker, Kubernetes

## Integrations
- Slack, Discord, Teams
- Stripe, PayPal
- Google Workspace
- CRM systems (HubSpot, Salesforce)`,
        category: 'technical',
      },
    ];

  const sources: KnowledgeSource[] = [];

  for (const page of mockPages) {
    sources.push({
      id: `notion-${page.id}`,
      type: 'notion',
      content: page.content,
      metadata: {
        title: page.title,
        url: `https://stevekaplanai.notion.site/${page.id}`,
        category: page.category || 'service',
        lastUpdated: new Date(),
      },
    });
  }

  return sources;
}

// Function to ingest GTMVP-specific Notion pages
export async function ingestGTMVPNotion(): Promise<KnowledgeSource[]> {
  // This would use the actual workspace ID in production
  const workspaceId = process.env.NOTION_WORKSPACE_ID || 'mock-workspace';
  return ingestNotionWorkspace(workspaceId);
}
