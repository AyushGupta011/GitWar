'use client';
import { useMemo } from 'react';

interface CitySkylineProps {
  buildings: number;
  color: 'red' | 'blue';
  score: number;
  isWinner?: boolean;
  health: number;
}

export function CitySkyline({ buildings, color, score, isWinner, health }: CitySkylineProps) {
  const colorMain = color === 'red' ? '#FF3131' : '#00D4FF';
  const colorGlow = color === 'red' ? 'rgba(255,49,49,0.6)' : 'rgba(0,212,255,0.6)';
  const colorDim = color === 'red' ? 'rgba(255,49,49,0.15)' : 'rgba(0,212,255,0.15)';

  const buildingData = useMemo(() => {
    const count = Math.max(8, Math.min(buildings, 20));
    return Array.from({ length: count }, (_, i) => {
      const seed = (score * (i + 1) * 7919) % 1000;
      const h = 30 + (seed % 120) * (1 + i / count);
      const w = 18 + (seed % 16);
      return { h: Math.min(h, 200), w, hasAntenna: seed % 3 === 0, windows: Math.floor(h / 20) };
    });
  }, [buildings, score]);

  const totalW = buildingData.reduce((s, b) => s + b.w + 4, 0);
  const svgW = Math.max(280, totalW);
  const maxH = Math.max(...buildingData.map(b => b.h));

  let x = 0;

  return (
    <div className="w-full overflow-hidden">
      <svg
        width="100%"
        viewBox={`0 0 ${svgW} ${maxH + 40}`}
        className="w-full"
        style={{ maxHeight: '220px' }}
      >
        <defs>
          <filter id={`glow-${color}`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Ground line */}
        <line x1="0" y1={maxH + 30} x2={svgW} y2={maxH + 30} stroke={colorMain} strokeWidth="1" opacity="0.3" />

        {buildingData.map((b, i) => {
          const bx = x;
          x += b.w + 4;
          const by = maxH + 28 - b.h;
          const animDelay = i * 0.06;
          const isActive = (i / buildingData.length) * 100 < health;

          return (
            <g key={i} style={{ animationDelay: `${animDelay}s` }}>
              {/* Building body */}
              <rect
                x={bx} y={by} width={b.w} height={b.h}
                fill={isActive ? colorDim : 'rgba(30,30,46,0.5)'}
                stroke={isActive ? colorMain : 'rgba(255,255,255,0.1)'}
                strokeWidth="0.5"
                rx="1"
                className="city-building"
                style={{ animationDelay: `${animDelay}s` }}
              />

              {/* Windows */}
              {Array.from({ length: b.windows }, (_, wi) => (
                <rect
                  key={wi}
                  x={bx + 3}
                  y={by + 6 + wi * 18}
                  width={b.w - 6}
                  height={8}
                  fill={isActive && Math.random() > 0.3 ? colorMain : 'transparent'}
                  opacity={0.4 + Math.random() * 0.4}
                  rx="0.5"
                />
              ))}

              {/* Antenna */}
              {b.hasAntenna && (
                <line x1={bx + b.w / 2} y1={by} x2={bx + b.w / 2} y2={by - 12}
                  stroke={colorMain} strokeWidth="1" opacity="0.8"
                  filter={`url(#glow-${color})`}
                />
              )}

              {/* Winner crown effect */}
              {isWinner && i === Math.floor(buildingData.length / 2) && (
                <text x={bx + b.w / 2} y={by - 18} textAnchor="middle" fontSize="12">👑</text>
              )}
            </g>
          );
        })}

        {/* Ground glow */}
        <rect x="0" y={maxH + 28} width={svgW} height="4" fill={colorMain} opacity="0.3" rx="2" />
      </svg>
    </div>
  );
}
