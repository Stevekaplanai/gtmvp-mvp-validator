// GitHub repository content ingestion for knowledge base

import { KnowledgeSource } from '../types';

export interface GitHubRepo {
  owner: string;
  name: string;
  branch?: string;
}

export async function ingestGitHubRepos(repos: GitHubRepo[]): Promise<KnowledgeSource[]> {
  const sources: KnowledgeSource[] = [];

  for (const repo of repos) {
    try {
      // In production, this would use GitHub API to fetch repo contents
      // For now, creating structure that will work with real API

      const mockFiles = [
        {
          path: 'README.md',
          content: `# ${repo.name}\n\nProject overview and documentation.`,
        },
        {
          path: 'docs/architecture.md',
          content: `# Architecture\n\nSystem architecture documentation.`,
        },
      ];

      for (const file of mockFiles) {
        sources.push({
          id: `github-${repo.owner}-${repo.name}-${file.path}`,
          type: 'github',
          content: file.content,
          metadata: {
            title: `${repo.name}/${file.path}`,
            url: `https://github.com/${repo.owner}/${repo.name}/blob/main/${file.path}`,
            category: inferCategory(file.path, file.content),
            lastUpdated: new Date(),
          },
        });
      }
    } catch (error) {
      console.error(`Error ingesting repo ${repo.owner}/${repo.name}:`, error);
    }
  }

  return sources;
}

function inferCategory(path: string, content: string): 'service' | 'pricing' | 'case-study' | 'technical' {
  const pathLower = path.toLowerCase();
  const contentLower = content.toLowerCase();

  if (pathLower.includes('case') || pathLower.includes('example') || contentLower.includes('case study')) {
    return 'case-study';
  }

  if (pathLower.includes('price') || pathLower.includes('cost') || contentLower.includes('pricing')) {
    return 'pricing';
  }

  if (pathLower.includes('service') || pathLower.includes('product') || contentLower.includes('offering')) {
    return 'service';
  }

  return 'technical';
}

// Function to fetch specific repos for GTMVP
export async function ingestGTMVPRepos(): Promise<KnowledgeSource[]> {
  const repos: GitHubRepo[] = [
    { owner: 'stevekaplanai', name: 'gtmvp-automation' },
    { owner: 'stevekaplanai', name: 'gtmvp-ads-manager' },
    { owner: 'GTMVP', name: 'client-projects' },
    { owner: 'GTMVP', name: 'mvp-accelerator' },
  ];

  return ingestGitHubRepos(repos);
}
