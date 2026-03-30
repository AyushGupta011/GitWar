'use client';

interface StatBarProps {
  label: string;
  valueA: number;
  valueB: number;
  formatValue?: (v: number) => string;
  icon?: string;
}

export function StatBar({ label, valueA, valueB, formatValue, icon }: StatBarProps) {
  const total = valueA + valueB || 1;
  const pctA = Math.round((valueA / total) * 100);
  const pctB = 100 - pctA;
  const fmt = formatValue || ((v: number) => v.toLocaleString());
  const winnerA = valueA > valueB;
  const winnerB = valueB > valueA;

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-1.5">
        <span className={`text-sm font-bold ${winnerA ? 'text-red-400' : 'text-white/60'}`}>{fmt(valueA)}</span>
        <span className="text-xs text-white/30 flex items-center gap-1">
          {icon && <span>{icon}</span>}
          {label}
        </span>
        <span className={`text-sm font-bold ${winnerB ? 'text-blue-400' : 'text-white/60'}`}>{fmt(valueB)}</span>
      </div>
      <div className="flex h-2 rounded-full overflow-hidden bg-white/5">
        <div
          className="h-full bg-gradient-to-r from-red-600 to-red-400 transition-all duration-1000 rounded-l-full"
          style={{ width: `${pctA}%` }}
        />
        <div
          className="h-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-1000 rounded-r-full"
          style={{ width: `${pctB}%` }}
        />
      </div>
    </div>
  );
}
