'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import type { CompetitionRate } from '@/lib/types';

interface Props {
  items: CompetitionRate[];
}

function getBarColor(rate: number) {
  if (rate > 20) return '#ef4444';
  if (rate > 5) return '#f59e0b';
  return '#22c55e';
}

export default function CompetitionRateChart({ items }: Props) {
  const data = items
    .map((item) => ({
      name: item.houseNm.length > 12 ? item.houseNm.slice(0, 12) + '…' : item.houseNm,
      경쟁률: parseFloat(item.compRate) || 0,
    }))
    .sort((a, b) => b.경쟁률 - a.경쟁률)
    .slice(0, 10);

  if (!data.length) {
    return <p className="text-center text-slate-400 py-8">데이터가 없습니다.</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart data={data} layout="vertical" margin={{ left: 16, right: 24, top: 8, bottom: 8 }}>
        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
        <XAxis type="number" tick={{ fontSize: 12 }} />
        <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 12 }} />
        <Tooltip
          formatter={(v) => [`${Number(v).toFixed(1)} : 1`, '경쟁률']}
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
