// Notion workspace content ingestion for knowledge base

import { KnowledgeSource } from '../types';

export interface NotionPage {
  id: string;
  title: string;
  content: string;
  category?: 'service' | 'pricing' | 'case-study' | 'technical';
}

export async function ingestNotionWorkspace(workspaceId: string): Promise<KnowledgeSource[]> {
  const sources: KnowledgeSource[] = [];

  try {
    // In production, this would use Notion API via MCP server
    // For now, creating structure with mock data

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
  } catch (error) {
    console.error('Error ingesting Notion workspace:', error);
  }

  return sources;
}

// Function to ingest GTMVP-specific Notion pages
export async function ingestGTMVPNotion(): Promise<KnowledgeSource[]> {
  // This would use the actual workspace ID in production
  const workspaceId = process.env.NOTION_WORKSPACE_ID || 'mock-workspace';
  return ingestNotionWorkspace(workspaceId);
}
