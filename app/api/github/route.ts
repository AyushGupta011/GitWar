import { NextRequest, NextResponse } from 'next/server';
import { fetchRepoStats, fetchCommitActivity, fetchContributors, calculateCityMetrics, parseRepoUrl } from '@/lib/github';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const repoA = searchParams.get('a');
  const repoB = searchParams.get('b');

  if (!repoA || !repoB) {
    return NextResponse.json({ error: 'Missing repo parameters' }, { status: 400 });
  }

  const parsedA = parseRepoUrl(repoA);
  const parsedB = parseRepoUrl(repoB);

  if (!parsedA || !parsedB) {
    return NextResponse.json({ error: 'Invalid repo format. Use owner/repo or GitHub URL' }, { status: 400 });
  }

  const session = await getServerSession(authOptions);
  const token = (session as any)?.accessToken;

  try {
    const [statsA, statsB, activityA, activityB, contribA, contribB] = await Promise.all([
      fetchRepoStats(parsedA.owner, parsedA.repo, token),
      fetchRepoStats(parsedB.owner, parsedB.repo, token),
      fetchCommitActivity(parsedA.owner, parsedA.repo, token),
      fetchCommitActivity(parsedB.owner, parsedB.repo, token),
      fetchContributors(parsedA.owner, parsedA.repo, token),
      fetchContributors(parsedB.owner, parsedB.repo, token),
    ]);

    const metricsA = calculateCityMetrics(statsA, activityA, contribA);
    const metricsB = calculateCityMetrics(statsB, activityB, contribB);

    const winner = metricsA.score > metricsB.score ? 'a' : metricsB.score > metricsA.score ? 'b' : 'tie';
    const margin = Math.abs(metricsA.score - metricsB.score);
    const marginPct = Math.round((margin / Math.max(metricsA.score, metricsB.score, 1)) * 100);

    return NextResponse.json({ cityA: metricsA, cityB: metricsB, winner, margin, marginPct });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to fetch repo data' }, { status: 500 });
  }
}
