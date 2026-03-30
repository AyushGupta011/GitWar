'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { Swords, Star, GitFork, Users, Activity, Shield, Zap, AlertCircle, ArrowLeft, Share2, Trophy } from 'lucide-react';
import { CitySkyline } from '@/components/CitySkyline';
import { StatBar } from '@/components/StatBar';
import { Sparkline } from '@/components/Sparkline';
import type { CityMetrics } from '@/lib/github';
import Link from 'next/link';

interface BattleResult {
  cityA: CityMetrics;
  cityB: CityMetrics;
  winner: 'a' | 'b' | 'tie';
  margin: number;
  marginPct: number;
}

function BattleContent() {
  const params = useSearchParams();
  const router = useRouter();
  const [result, setResult] = useState<BattleResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [phase, setPhase] = useState<'loading' | 'building' | 'battle' | 'result'>('loading');

  const repoA = params.get('a') || '';
  const repoB = params.get('b') || '';

  useEffect(() => {
    if (!repoA || !repoB) { router.push('/'); return; }

    const fetchBattle = async () => {
      try {
        setPhase('loading');
        const res = await fetch(`/api/github?a=${encodeURIComponent(repoA)}&b=${encodeURIComponent(repoB)}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to load battle');
        setResult(data);
        setPhase('building');
        setTimeout(() => setPhase('battle'), 1500);
        setTimeout(() => setPhase('result'), 3000);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBattle();
  }, [repoA, repoB, router]);

  const handleShare = () => {
    const url = window.location.href;
    const text = result
      ? `⚔️ GitWars: ${result.cityA.repo.full_name} vs ${result.cityB.repo.full_name}\n🏆 Winner: ${result.winner === 'a' ? result.cityA.repo.full_name : result.winner === 'b' ? result.cityB.repo.full_name : 'TIE!'}\n\nCheck the battle:`
      : 'Check out this GitWars battle!';
    if (navigator.share) {
      navigator.share({ title: 'GitWars Battle', text, url });
    } else {
      navigator.clipboard.writeText(`${text} ${url}`);
      alert('Link copied!');
    }
  };

  if (error) {
    return (
      <div className="min-h-screen grid-bg flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Battle Failed</h2>
          <p className="text-white/50 text-sm mb-6">{error}</p>
          <Link href="/" className="px-6 py-3 bg-war-card border border-white/10 rounded-xl text-sm hover:border-yellow-400/50 transition-all inline-block">
            ← Back to Arena
          </Link>
        </div>
      </div>
    );
  }

  if (loading || phase === 'loading') {
    return (
      <div className="min-h-screen grid-bg flex items-center justify-center">
        <div className="text-center">
          <div className="flex items-center gap-4 mb-6">
            <span className="text-red-400 font-mono text-sm">{repoA}</span>
            <Swords className="w-8 h-8 text-yellow-400 animate-pulse" />
            <span className="text-blue-400 font-mono text-sm">{repoB}</span>
          </div>
          <div className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full loader mx-auto mb-4" />
          <p className="text-white/40 text-sm">Gathering battle intel...</p>
        </div>
      </div>
    );
  }

  if (!result) return null;

  const { cityA, cityB, winner, marginPct } = result;
  const winnerCity = winner === 'a' ? cityA : winner === 'b' ? cityB : null;

  return (
    <div className="min-h-screen grid-bg">
      {/* Ambient */}
      <div className="fixed top-0 left-0 w-1/2 h-full bg-red-600/3 pointer-events-none" />
      <div className="fixed top-0 right-0 w-1/2 h-full bg-blue-400/3 pointer-events-none" />

      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-white/5 relative z-10">
        <Link href="/" className="flex items-center gap-2 text-white/50 hover:text-white transition-colors text-sm">
          <ArrowLeft className="w-4 h-4" />
          New Battle
        </Link>
        <div className="flex items-center gap-2">
          <Swords className="w-4 h-4 text-yellow-400" />
          <span className="font-bold text-sm tracking-wider">GITWARS</span>
        </div>
        <button onClick={handleShare} className="flex items-center gap-2 text-white/50 hover:text-yellow-400 transition-colors text-sm">
          <Share2 className="w-4 h-4" />
          Share
        </button>
      </nav>

      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 relative z-10">

        {/* Winner Banner */}
        {phase === 'result' && winnerCity && (
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full border border-yellow-400/30 bg-yellow-400/5">
              <Trophy className="w-5 h-5 text-yellow-400" />
              <span className="text-yellow-400 font-bold tracking-wider">
                {winnerCity.repo.full_name} WINS by {marginPct}%
              </span>
              <Trophy className="w-5 h-5 text-yellow-400" />
            </div>
          </div>
        )}

        {/* City Names Header */}
        <div className="grid grid-cols-3 items-center mb-2">
          <div className="text-left">
            <div className="font-black text-lg md:text-2xl text-red-400 truncate">{cityA.repo.name.toUpperCase()}</div>
            <div className="text-white/30 text-xs">{cityA.repo.owner.login}</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-black vs-text">VS</div>
          </div>
          <div className="text-right">
            <div className="font-black text-lg md:text-2xl text-blue-400 truncate">{cityB.repo.name.toUpperCase()}</div>
            <div className="text-white/30 text-xs">{cityB.repo.owner.login}</div>
          </div>
        </div>

        {/* Skylines */}
        <div className="grid grid-cols-2 gap-2 mb-2">
          <div className={`relative rounded-xl overflow-hidden border transition-all duration-1000 ${winner === 'a' ? 'neon-border-red' : 'border-white/5'}`}>
            <div className="absolute inset-0 bg-gradient-to-b from-red-600/5 to-transparent pointer-events-none" />
            <div className="p-4">
              <CitySkyline
                buildings={cityA.buildings}
                color="red"
                score={cityA.score}
                isWinner={winner === 'a' && phase === 'result'}
                health={cityA.health}
              />
            </div>
            <div className="absolute top-3 right-3 bg-war-dark/80 rounded-lg px-3 py-1">
              <span className="text-yellow-400 font-black text-lg">{cityA.score.toLocaleString()}</span>
              <span className="text-white/30 text-xs ml-1">pts</span>
            </div>
            <div className="absolute top-3 left-3">
              <span className="text-red-400/60 text-xs border border-red-400/20 rounded px-2 py-0.5">{cityA.cityLevel}</span>
            </div>
          </div>

          <div className={`relative rounded-xl overflow-hidden border transition-all duration-1000 ${winner === 'b' ? 'neon-border-blue' : 'border-white/5'}`}>
            <div className="absolute inset-0 bg-gradient-to-b from-blue-400/5 to-transparent pointer-events-none" />
            <div className="p-4">
              <CitySkyline
                buildings={cityB.buildings}
                color="blue"
                score={cityB.score}
                isWinner={winner === 'b' && phase === 'result'}
                health={cityB.health}
              />
            </div>
            <div className="absolute top-3 right-3 bg-war-dark/80 rounded-lg px-3 py-1">
              <span className="text-yellow-400 font-black text-lg">{cityB.score.toLocaleString()}</span>
              <span className="text-white/30 text-xs ml-1">pts</span>
            </div>
            <div className="absolute top-3 left-3">
              <span className="text-blue-400/60 text-xs border border-blue-400/20 rounded px-2 py-0.5">{cityB.cityLevel}</span>
            </div>
          </div>
        </div>

        {/* City level labels */}
        <div className="grid grid-cols-2 gap-2 mb-6 text-center text-xs text-white/30">
          <div>{cityA.cityLevel} · Pop. {cityA.population.toLocaleString()}</div>
          <div>{cityB.cityLevel} · Pop. {cityB.population.toLocaleString()}</div>
        </div>

        {/* Stats Battle */}
        <div className="bg-war-card/60 border border-white/5 rounded-2xl p-6 mb-6">
          <h3 className="text-xs font-bold text-white/40 tracking-widest mb-5 text-center">BATTLE STATS</h3>
          <StatBar label="Stars" valueA={cityA.repo.stargazers_count} valueB={cityB.repo.stargazers_count} icon="⭐" />
          <StatBar label="Forks" valueA={cityA.repo.forks_count} valueB={cityB.repo.forks_count} icon="🍴" />
          <StatBar label="Commits (1yr)" valueA={cityA.totalCommits} valueB={cityB.totalCommits} icon="📝" />
          <StatBar label="Contributors" valueA={cityA.contributors} valueB={cityB.contributors} icon="👥" />
          <StatBar label="Watchers" valueA={cityA.repo.watchers_count} valueB={cityB.repo.watchers_count} icon="👁️" />
          <StatBar label="Open Issues" valueA={cityA.repo.open_issues_count} valueB={cityB.repo.open_issues_count} icon="🐛" />
          <StatBar
            label="City Health"
            valueA={cityA.health}
            valueB={cityB.health}
            formatValue={v => `${v}%`}
            icon="❤️"
          />
        </div>

        {/* Commit Activity Sparklines */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {[{ city: cityA, color: 'red' as const }, { city: cityB, color: 'blue' as const }].map(({ city, color }) => (
            <div key={color} className="bg-war-card/40 border border-white/5 rounded-xl p-4">
              <div className="text-xs text-white/30 mb-3 flex items-center gap-1">
                <Activity className="w-3 h-3" />
                Commit activity (24 weeks)
              </div>
              <Sparkline data={city.commitActivity} color={color} />
              <div className="text-xs text-white/20 mt-2">{city.totalCommits.toLocaleString()} total commits</div>
            </div>
          ))}
        </div>

        {/* City Profiles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {[{ city: cityA, color: 'red' }, { city: cityB, color: 'blue' }].map(({ city, color }) => (
            <div key={color} className="bg-war-card/40 border border-white/5 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-3">
                {city.repo.owner.avatar_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={city.repo.owner.avatar_url} alt={city.repo.owner.login} className="w-8 h-8 rounded-full border border-white/10" />
                )}
                <div>
                  <div className="font-bold text-sm">{city.repo.full_name}</div>
                  {city.repo.language && (
                    <div className={`text-xs ${color === 'red' ? 'text-red-400/70' : 'text-blue-400/70'}`}>{city.repo.language}</div>
                  )}
                </div>
              </div>
              {city.repo.description && (
                <p className="text-white/40 text-xs leading-relaxed mb-3">{city.repo.description}</p>
              )}
              <div className="flex flex-wrap gap-1">
                {city.repo.topics?.slice(0, 4).map(topic => (
                  <span key={topic} className="text-xs px-2 py-0.5 rounded bg-white/5 text-white/40">{topic}</span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/" className="px-8 py-3 rounded-xl border border-white/10 hover:border-yellow-400/50 text-sm text-center transition-all hover:text-yellow-400">
            ⚔️ Start New Battle
          </Link>
          <button onClick={handleShare} className="px-8 py-3 rounded-xl bg-gradient-to-r from-red-600/20 to-blue-500/20 border border-white/10 hover:border-yellow-400/30 text-sm transition-all hover:scale-[1.02]">
            🔗 Share This Battle
          </button>
        </div>
      </div>
    </div>
  );
}

export default function BattlePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen grid-bg flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full loader" />
      </div>
    }>
      <BattleContent />
    </Suspense>
  );
}
