export interface RepoStats {
  name: string;
  full_name: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  watchers_count: number;
  language: string | null;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  size: number;
  owner: {
    login: string;
    avatar_url: string;
  };
  topics: string[];
  license: { name: string } | null;
  default_branch: string;
}

export interface CommitActivity {
  total: number;
  week: number;
  days: number[];
}

export interface CityMetrics {
  repo: RepoStats;
  commitActivity: CommitActivity[];
  contributors: number;
  totalCommits: number;
  score: number;
  cityLevel: string;
  buildings: number;
  population: number;
  health: number;
}

export async function fetchRepoStats(owner: string, repo: string, token?: string): Promise<RepoStats> {
  const headers: Record<string, string> = { 'Accept': 'application/vnd.github.v3+json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers, next: { revalidate: 300 } });
  if (!res.ok) throw new Error(`Repo not found: ${owner}/${repo}`);
  return res.json();
}

export async function fetchCommitActivity(owner: string, repo: string, token?: string): Promise<CommitActivity[]> {
  const headers: Record<string, string> = { 'Accept': 'application/vnd.github.v3+json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/stats/commit_activity`, { headers, next: { revalidate: 300 } });
  if (!res.ok) return [];
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

export async function fetchContributors(owner: string, repo: string, token?: string): Promise<number> {
  const headers: Record<string, string> = { 'Accept': 'application/vnd.github.v3+json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/contributors?per_page=1&anon=true`, { headers, next: { revalidate: 300 } });
  if (!res.ok) return 0;
  const link = res.headers.get('link') || '';
  const match = link.match(/page=(\d+)>; rel="last"/);
  if (match) return parseInt(match[1]);
  const data = await res.json();
  return Array.isArray(data) ? data.length : 0;
}

export function calculateCityMetrics(repo: RepoStats, activity: CommitActivity[], contributors: number): CityMetrics {
  const totalCommits = activity.reduce((sum, week) => sum + week.total, 0);
  const recentActivity = activity.slice(-4).reduce((sum, week) => sum + week.total, 0);
  const ageMonths = Math.max(1, (Date.now() - new Date(repo.created_at).getTime()) / (1000 * 60 * 60 * 24 * 30));

  const score = Math.round(
    repo.stargazers_count * 10 +
    repo.forks_count * 8 +
    totalCommits * 2 +
    recentActivity * 15 +
    contributors * 5 +
    repo.watchers_count * 3 +
    Math.min(ageMonths * 0.5, 50)
  );

  const buildings = Math.min(50, Math.floor(Math.log10(score + 1) * 15));
  const population = Math.floor(score * 4.2);

  let cityLevel = 'Village';
  if (score > 500) cityLevel = 'Town';
  if (score > 2000) cityLevel = 'City';
  if (score > 10000) cityLevel = 'Metropolis';
  if (score > 50000) cityLevel = 'Megalopolis';
  if (score > 200000) cityLevel = 'Empire';

  const daysSincePush = (Date.now() - new Date(repo.pushed_at).getTime()) / (1000 * 60 * 60 * 24);
  const health = Math.max(10, Math.min(100, 100 - daysSincePush * 2 + recentActivity * 3));

  return { repo, commitActivity: activity, contributors, totalCommits, score, cityLevel, buildings, population, health: Math.round(health) };
}

export function parseRepoUrl(input: string): { owner: string; repo: string } | null {
  const clean = input.trim().replace(/\/$/, '');
  const githubMatch = clean.match(/github\.com\/([^/]+)\/([^/]+)/);
  if (githubMatch) return { owner: githubMatch[1], repo: githubMatch[2] };
  const slugMatch = clean.match(/^([a-zA-Z0-9_.-]+)\/([a-zA-Z0-9_.-]+)$/);
  if (slugMatch) return { owner: slugMatch[1], repo: slugMatch[2] };
  return null;
}
