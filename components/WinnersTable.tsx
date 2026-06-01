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
            <th className="text-left px-4 py-3 font-medium text-slate-600">주택명</th>
            <th className="text-left px-4 py-3 font-medium text-slate-600">공급유형</th>
            <th className="text-center px-4 py-3 font-medium text-slate-600">당첨세대수</th>
            <th className="text-center px-4 py-3 font-medium text-slate-600">최저 가점</th>
            <th className="text-center px-4 py-3 font-medium text-slate-600">평균 가점</th>
            <th className="text-center px-4 py-3 font-medium text-slate-600">최고 가점</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => (
            <tr key={`${item.houseManageNo}-${i}`} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
              <td className="px-4 py-3 font-medium">{item.houseNm}</td>
              <td className="px-4 py-3 text-slate-600">{item.suplyTyNm}</td>
              <td className="px-4 py-3 text-center">{item.drwtHshldco?.toLocaleString() ?? '-'}</td>
              <td className="px-4 py-3 text-center">{item.mnmScre ?? '-'}</td>
              <td className="px-4 py-3 text-center">{item.avrgScre ?? '-'}</td>
              <td className="px-4 py-3 text-center">{item.mxmScre ?? '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
