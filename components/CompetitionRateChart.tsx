'use client';

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import type { CompetitionRate } from '@/lib/types';

interface Props {
  items: CompetitionRate[];
}

function parseRate(raw?: string): number {
  if (!raw) return 0;
  const n = parseFloat(raw);
  return isNaN(n) ? 0 : n;
}

function getBarColor(rate: number) {
  if (rate > 20) return '#ef4444';
  if (rate > 5) return '#f59e0b';
  return '#22c55e';
}

export default function CompetitionRateChart({ items }: Props) {
  const data = items
    .filter((item) => parseRate(item.CMPET_RATE) > 0)
    .map((item) => ({
      name: `${item.PBLANC_NO ?? ''} ${item.HOUSE_TY ?? ''}`.trim().slice(0, 16),
      경쟁률: parseRate(item.CMPET_RATE),
    }))
    .sort((a, b) => b.경쟁률 - a.경쟁률)
    .slice(0, 10);

  if (!data.length) {
    return <p className="text-center text-slate-400 py-8">데이터가 없습니다.</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart data={data} layout="vertical" margin={{ left: 16, right: 32, top: 8, bottom: 8 }}>
        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
        <XAxis type="number" tick={{ fontSize: 11 }} />
        <YAxis type="category" dataKey="name" width={140} tick={{ fontSize: 10 }} />
        <Tooltip
          formatter={(v) => [`${Number(v).toFixed(2)} : 1`, '경쟁률']}
          contentStyle={{ fontSize: 13 }}
        />
        <Bar dataKey="경쟁률" radius={[0, 4, 4, 0]}>
          {data.map((entry, i) => (
            <Cell key={i} fill={getBarColor(entry.경쟁률)} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
