'use client';
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Swords, Github, Flame, Star, GitFork, Users, Zap, Trophy } from 'lucide-react';
import Image from 'next/image';

const FAMOUS_BATTLES = [
  { a: 'facebook/react', b: 'vuejs/vue' },
  { a: 'tailwindlabs/tailwindcss', b: 'styled-components/styled-components' },
  { a: 'vercel/next.js', b: 'remix-run/remix' },
  { a: 'prisma/prisma', b: 'drizzle-team/drizzle-orm' },
];

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [repoA, setRepoA] = useState('');
  const [repoB, setRepoB] = useState('');
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setActiveTab(t => (t + 1) % FAMOUS_BATTLES.length), 3000);
    return () => clearInterval(timer);
  }, []);

  const handleBattle = () => {
    if (!repoA.trim() || !repoB.trim()) return;
    const a = encodeURIComponent(repoA.trim());
    const b = encodeURIComponent(repoB.trim());
    router.push(`/battle?a=${a}&b=${b}`);
  };

  const handleFamousBattle = (battle: { a: string; b: string }) => {
    router.push(`/battle?a=${encodeURIComponent(battle.a)}&b=${encodeURIComponent(battle.b)}`);
  };

  return (
    <div className="min-h-screen grid-bg relative overflow-hidden">
      {/* Ambient glows */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed top-0 right-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 left-1/2 w-96 h-96 bg-yellow-400/5 rounded-full blur-3xl pointer-events-none" />

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-white/5">
        <div className="flex items-center gap-2">
          <Swords className="w-5 h-5 text-yellow-400" />
          <span className="font-bold tracking-wider text-sm">GITWARS</span>
        </div>
        <div className="flex items-center gap-4">
          {session ? (
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push('/leaderboard')}
                className="text-xs text-white/50 hover:text-white transition-colors px-3 py-1.5"
              >
                Leaderboard
              </button>
              {session.user?.image && (
                <Image src={session.user.image} alt="avatar" width={32} height={32} className="rounded-full border border-white/10" />
              )}
            </div>
          ) : (
            <button
              onClick={() => signIn('github')}
              className="flex items-center gap-2 px-4 py-2 text-xs border border-white/10 rounded-lg hover:border-yellow-400/50 hover:text-yellow-400 transition-all"
            >
              <Github className="w-3.5 h-3.5" />
              Sign in with GitHub
            </button>
          )}
        </div>
      </nav>

      {/* Hero */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 pt-20 pb-16 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-yellow-400/30 bg-yellow-400/5 text-yellow-400 text-xs mb-8">
          <Flame className="w-3 h-3" />
          <span>GitHub Repo Battle Arena</span>
        </div>

        {/* Headline */}
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-6 leading-none">
          <span className="text-war-red text-glow-red">GIT</span>
          <span className="vs-text">WARS</span>
        </h1>
        <p className="text-white/50 text-lg md:text-xl mb-12 max-w-xl mx-auto leading-relaxed">
          Drop two GitHub repos. Watch their cities battle it out in real-time.
          Stars, commits, and community decide who wins.
        </p>

        {/* Battle Form */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-war-card/80 backdrop-blur border border-white/5 rounded-2xl p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] gap-4 items-center mb-6">
              <div>
                <label className="text-xs text-white/40 mb-2 block text-left">CITY A</label>
                <input
                  type="text"
                  value={repoA}
                  onChange={e => setRepoA(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleBattle()}
                  placeholder="facebook/react"
                  className="w-full px-4 py-3 rounded-xl text-sm border border-red-500/20 focus:border-red-500/60 bg-red-500/5"
                />
              </div>
              <div className="text-3xl font-black vs-text text-center hidden md:block">VS</div>
              <div>
                <label className="text-xs text-white/40 mb-2 block text-left">CITY B</label>
                <input
                  type="text"
                  value={repoB}
                  onChange={e => setRepoB(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleBattle()}
                  placeholder="vuejs/vue"
                  className="w-full px-4 py-3 rounded-xl text-sm border border-blue-500/20 focus:border-blue-500/60 bg-blue-500/5"
                />
              </div>
            </div>

            <button
              onClick={handleBattle}
              disabled={!repoA.trim() || !repoB.trim()}
              className="w-full py-4 rounded-xl font-bold text-sm tracking-widest bg-gradient-to-r from-red-600 to-blue-500 hover:from-red-500 hover:to-blue-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              ⚔️ START BATTLE
            </button>

            {!session && (
              <p className="text-white/30 text-xs mt-3 text-center">
                <button onClick={() => signIn('github')} className="text-yellow-400/70 hover:text-yellow-400 underline">Sign in with GitHub</button> to unlock higher API rate limits
              </p>
            )}
          </div>

          {/* Famous Battles */}
          <div className="mt-6">
            <p className="text-white/30 text-xs mb-3">FAMOUS BATTLES</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {FAMOUS_BATTLES.map((battle, i) => (
                <button
                  key={i}
                  onClick={() => handleFamousBattle(battle)}
                  className={`px-3 py-2 rounded-lg text-xs border transition-all text-left ${i === activeTab ? 'border-yellow-400/50 bg-yellow-400/5 text-yellow-400' : 'border-white/5 hover:border-white/20 text-white/40 hover:text-white/70'}`}
                >
                  <span className="text-red-400">{battle.a.split('/')[1]}</span>
                  <span className="text-white/20 mx-1">vs</span>
                  <span className="text-blue-400">{battle.b.split('/')[1]}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-20">
          {[
            { icon: Swords, label: 'Battles Fought', value: '10K+' },
            { icon: Trophy, label: 'Winners Crowned', value: '10K+' },
            { icon: Star, label: 'Stars Counted', value: '500M+' },
            { icon: Zap, label: 'Commits Tracked', value: '1B+' },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="bg-war-card/40 border border-white/5 rounded-xl p-4 text-center">
              <Icon className="w-4 h-4 text-yellow-400 mx-auto mb-2" />
              <div className="text-xl font-black text-white">{value}</div>
              <div className="text-white/30 text-xs mt-1">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 py-16 border-t border-white/5">
        <h2 className="text-2xl font-black text-center mb-12 tracking-tight">HOW IT WORKS</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { step: '01', title: 'Enter two repos', desc: 'Paste any GitHub repo URL or owner/repo slug into the battle arena.', color: 'red' },
            { step: '02', title: 'Cities are built', desc: 'Stars, commits, forks, contributors — all become buildings, population, and city health.', color: 'yellow' },
            { step: '03', title: 'One city wins', desc: 'The highest-scoring city wins. Share the result to spark a debate.', color: 'blue' },
          ].map(({ step, title, desc, color }) => (
            <div key={step} className="bg-war-card/40 border border-white/5 rounded-xl p-6">
              <div className={`text-4xl font-black mb-4 ${color === 'red' ? 'text-red-500/30' : color === 'yellow' ? 'text-yellow-400/30' : 'text-blue-400/30'}`}>{step}</div>
              <h3 className="font-bold mb-2 tracking-wide">{title}</h3>
              <p className="text-white/40 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 py-6 text-center text-white/20 text-xs">
        GitWars — May the best repo win ⚔️
      </footer>
    </div>
  );
}
