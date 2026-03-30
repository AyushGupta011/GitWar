'use client';
import { useRouter } from 'next/navigation';
import { Swords, Trophy, ArrowLeft, Flame } from 'lucide-react';
import Link from 'next/link';

const LEADERBOARD = [
  { rank: 1, a: 'facebook/react', b: 'vuejs/vue', battles: 4821, hotness: 99 },
  { rank: 2, a: 'vercel/next.js', b: 'remix-run/remix', battles: 3204, hotness: 95 },
  { rank: 3, a: 'tailwindlabs/tailwindcss', b: 'styled-components/styled-components', battles: 2987, hotness: 92 },
  { rank: 4, a: 'prisma/prisma', b: 'drizzle-team/drizzle-orm', battles: 2341, hotness: 88 },
  { rank: 5, a: 'trpc/trpc', b: 'graphql/graphql-js', battles: 1987, hotness: 85 },
  { rank: 6, a: 'vitejs/vite', b: 'webpack/webpack', battles: 1654, hotness: 82 },
  { rank: 7, a: 'supabase/supabase', b: 'firebase/firebase-js-sdk', battles: 1432, hotness: 79 },
  { rank: 8, a: 'microsoft/typescript', b: 'nicolo-ribaudo/babel', battles: 1201, hotness: 74 },
];

export default function LeaderboardPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen grid-bg">
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-yellow-400/5 rounded-full blur-3xl pointer-events-none" />

      <nav className="flex items-center justify-between px-6 py-4 border-b border-white/5 relative z-10">
        <Link href="/" className="flex items-center gap-2 text-white/50 hover:text-white transition-colors text-sm">
          <ArrowLeft className="w-4 h-4" />
          Arena
        </Link>
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-yellow-400" />
          <span className="font-bold text-sm tracking-wider">LEADERBOARD</span>
        </div>
        <div className="w-20" />
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-12 relative z-10">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black tracking-tight mb-2">
            <span className="text-yellow-400">🏆</span> Top Battles
          </h1>
          <p className="text-white/40 text-sm">The most heated GitWars matchups of all time</p>
        </div>

        <div className="space-y-3">
          {LEADERBOARD.map((item) => (
            <button
              key={item.rank}
              onClick={() => router.push(`/battle?a=${encodeURIComponent(item.a)}&b=${encodeURIComponent(item.b)}`)}
              className="w-full bg-war-card/50 border border-white/5 hover:border-yellow-400/30 rounded-xl p-4 flex items-center gap-4 transition-all hover:bg-war-card/80 group text-left"
            >
              {/* Rank */}
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm flex-shrink-0 ${item.rank <= 3 ? 'bg-yellow-400/10 text-yellow-400' : 'bg-white/5 text-white/30'}`}>
                {item.rank <= 3 ? ['🥇','🥈','🥉'][item.rank - 1] : item.rank}
              </div>

              {/* Repos */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-red-400 font-mono text-sm font-bold truncate">{item.a.split('/')[1]}</span>
                  <Swords className="w-3 h-3 text-white/30 flex-shrink-0" />
                  <span className="text-blue-400 font-mono text-sm font-bold truncate">{item.b.split('/')[1]}</span>
                </div>
                <div className="text-white/20 text-xs mt-0.5">{item.a} vs {item.b}</div>
              </div>

              {/* Hotness + count */}
              <div className="text-right flex-shrink-0">
                <div className="flex items-center gap-1 justify-end text-orange-400 text-xs mb-1">
                  <Flame className="w-3 h-3" />
                  <span>{item.hotness}°</span>
                </div>
                <div className="text-white/20 text-xs">{item.battles.toLocaleString()} battles</div>
              </div>

              {/* Arrow */}
              <div className="text-white/20 group-hover:text-yellow-400 transition-colors text-lg">→</div>
            </button>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link href="/" className="px-6 py-3 rounded-xl bg-gradient-to-r from-red-600 to-blue-500 text-sm font-bold tracking-widest hover:opacity-90 transition-all inline-block">
            ⚔️ START YOUR BATTLE
          </Link>
        </div>
      </div>
    </div>
  );
}
