'use client';

import type { SubscriptionWinner } from '@/lib/types';

interface Props {
  items: SubscriptionWinner[];
}

function formatPeriod(de?: string) {
  if (!de || de.length < 6) return de ?? '-';
  return `${de.slice(0, 4)}년 ${de.slice(4, 6)}월`;
}

export default function WinnersTable({ items }: Props) {
  if (!items.length) {
    return <p className="text-center text-slate-400 py-8">데이터가 없습니다.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200">
            <th className="text-left px-4 py-3 font-medium text-slate-600">통계 기간</th>
            <th className="text-left px-4 py-3 font-medium text-slate-600">지역</th>
            <th className="text-center px-4 py-3 font-medium text-slate-600">30대</th>
            <th className="text-center px-4 py-3 font-medium text-slate-600">40대</th>
            <th className="text-center px-4 py-3 font-medium text-slate-600">50대</th>
            <th className="text-center px-4 py-3 font-medium text-slate-600">60대+</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => (
            <tr key={i} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
              <td className="px-4 py-3 text-slate-500">{formatPeriod(item.STAT_DE)}</td>
              <td className="px-4 py-3 font-medium">{item.SUBSCRPT_AREA_CODE_NM ?? '-'}</td>
              <td className="px-4 py-3 text-center">{item.AGE_30?.toLocaleString() ?? '-'}</td>
              <td className="px-4 py-3 text-center">{item.AGE_40?.toLocaleString() ?? '-'}</td>
              <td className="px-4 py-3 text-center">{item.AGE_50?.toLocaleString() ?? '-'}</td>
              <td className="px-4 py-3 text-center">{item.AGE_60?.toLocaleString() ?? '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
