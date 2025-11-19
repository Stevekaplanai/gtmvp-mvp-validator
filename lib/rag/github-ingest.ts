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
      console.log(`Ingesting GitHub repo: ${repo.owner}/${repo.name}`);

      // Get README.md content from GitHub
      const readmeContent = await fetchGitHubFile(repo.owner, repo.name, 'README.md', repo.branch);

      if (readmeContent) {
        sources.push({
          id: `github-${repo.owner}-${repo.name}-README.md`,
          type: 'github',
          content: readmeContent,
          metadata: {
            title: `${repo.name}/README.md`,
            url: `https://github.com/${repo.owner}/${repo.name}/blob/${repo.branch || 'main'}/README.md`,
            category: inferCategory('README.md', readmeContent),
            lastUpdated: new Date(),
          },
        });
      }

      // Optionally fetch other important files (docs, etc.)
      const docFiles = ['docs/README.md', 'ARCHITECTURE.md', 'docs/architecture.md'];
      for (const docPath of docFiles) {
        const docContent = await fetchGitHubFile(repo.owner, repo.name, docPath, repo.branch);
        if (docContent) {
          sources.push({
            id: `github-${repo.owner}-${repo.name}-${docPath.replace(/\//g, '-')}`,
            type: 'github',
            content: docContent,
            metadata: {
              title: `${repo.name}/${docPath}`,
              url: `https://github.com/${repo.owner}/${repo.name}/blob/${repo.branch || 'main'}/${docPath}`,
              category: inferCategory(docPath, docContent),
              lastUpdated: new Date(),
            },
          });
        }
      }
    } catch (error) {
      console.error(`Error ingesting repo ${repo.owner}/${repo.name}:`, error);
    }
  }

  return sources;
}

async function fetchGitHubFile(
  owner: string,
  repo: string,
  path: string,
  branch: string = 'main'
): Promise<string | null> {
  try {
    // Use GitHub API to fetch file content with timeout
    const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    const response = await fetch(url, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'GTMVP-RAG-System',
        ...(process.env.GITHUB_TOKEN ? { 'Authorization': `token ${process.env.GITHUB_TOKEN}` } : {}),
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      // Try alternative branch if main doesn't work
      if (branch === 'main' && response.status === 404) {
        return fetchGitHubFile(owner, repo, path, 'master');
      }
      return null;
    }

    const data = await response.json();

    // GitHub API returns base64-encoded content
    if (data.content) {
      return Buffer.from(data.content, 'base64').toString('utf-8');
    }

    return null;
  } catch (error) {
    // Silently fail for non-existent repos
    if (error instanceof Error && error.name === 'AbortError') {
      console.log(`Timeout fetching ${owner}/${repo}/${path}`);
    }
    return null;
  }
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
    { owner: 'Stevekaplanai', name: 'google-ai-mcp-server' },
    { owner: 'Stevekaplanai', name: 'gtmvp-mvp-validator' },
    { owner: 'Stevekaplanai', name: 'product-description-generator' },
    { owner: 'Stevekaplanai', name: 'promptforge-mcp-server' },
    { owner: 'Stevekaplanai', name: 'stevekaplanai' },
  ];

  return ingestGitHubRepos(repos);
}
