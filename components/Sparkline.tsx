'use client';

interface SparklineProps {
  data: { total: number }[];
  color: 'red' | 'blue';
  height?: number;
}

export function Sparkline({ data, color, height = 40 }: SparklineProps) {
  if (!data || data.length === 0) return null;

  const values = data.slice(-24).map(d => d.total);
  const max = Math.max(...values, 1);
  const w = 200;
  const h = height;
  const step = w / (values.length - 1);

  const points = values.map((v, i) => ({
    x: i * step,
    y: h - (v / max) * h * 0.9 - 4,
  }));

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaD = `${pathD} L ${w} ${h} L 0 ${h} Z`;

  const c = color === 'red' ? '#FF3131' : '#00D4FF';
  const cAlpha = color === 'red' ? 'rgba(255,49,49,0.15)' : 'rgba(0,212,255,0.15)';

  return (
    <svg width="100%" viewBox={`0 0 ${w} ${h}`} className="overflow-visible">
      <path d={areaD} fill={cAlpha} />
      <path d={pathD} fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      {points[points.length - 1] && (
        <circle cx={points[points.length - 1].x} cy={points[points.length - 1].y} r="3" fill={c} />
      )}
    </svg>
  );
}
