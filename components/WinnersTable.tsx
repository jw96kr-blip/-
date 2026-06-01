'use client';

import type { SubscriptionWinner } from '@/lib/types';

interface Props {
  items: SubscriptionWinner[];
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
            <th className="text-left px-4 py-3 font-medium text-slate-600">시도</th>
            <th className="text-left px-4 py-3 font-medium text-slate-600">시군구</th>
            <th className="text-left px-4 py-3 font-medium text-slate-600">청약공고명</th>
            <th className="text-center px-4 py-3 font-medium text-slate-600">공급세대수</th>
            <th className="text-center px-4 py-3 font-medium text-slate-600">청약접수인원</th>
            <th className="text-center px-4 py-3 font-medium text-slate-600">당첨자수</th>
            <th className="text-center px-4 py-3 font-medium text-slate-600">당첨자발표일</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => (
            <tr key={i} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
              <td className="px-4 py-3">{item.sido}</td>
              <td className="px-4 py-3 text-slate-600">{item.sgg ?? '-'}</td>
              <td className="px-4 py-3 font-medium max-w-[240px] truncate">{item.lttotPblancNm ?? '-'}</td>
              <td className="px-4 py-3 text-center">{item.suplyHshldco?.toLocaleString() ?? '-'}</td>
              <td className="px-4 py-3 text-center">{item.rceptNmpr?.toLocaleString() ?? '-'}</td>
              <td className="px-4 py-3 text-center font-medium text-blue-700">{item.przwnerCo?.toLocaleString() ?? '-'}</td>
              <td className="px-4 py-3 text-center text-slate-500">{item.przwnerPresnatnDe ?? '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
