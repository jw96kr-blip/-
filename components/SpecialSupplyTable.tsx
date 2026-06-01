'use client';

import type { SpecialSupply } from '@/lib/types';

function n(v?: number) {
  return v != null ? v.toLocaleString() : '-';
}

interface Props {
  items: SpecialSupply[];
}

export default function SpecialSupplyTable({ items }: Props) {
  if (!items.length) {
    return <p className="text-center text-slate-400 py-8">데이터가 없습니다.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200">
            <th className="text-left px-4 py-3 font-medium text-slate-600">주택명</th>
            <th className="text-center px-3 py-3 font-medium text-slate-600">다자녀</th>
            <th className="text-center px-3 py-3 font-medium text-slate-600">신혼부부</th>
            <th className="text-center px-3 py-3 font-medium text-slate-600">생애최초</th>
            <th className="text-center px-3 py-3 font-medium text-slate-600">노부모</th>
            <th className="text-center px-3 py-3 font-medium text-slate-600">기관추천</th>
            <th className="text-center px-3 py-3 font-medium text-slate-600">기타</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => (
            <tr key={item.houseManageNo ?? i} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
              <td className="px-4 py-3 font-medium">{item.houseNm}</td>
              <td className="px-3 py-3 text-center">{n(item.mhouseHoldRceptHshldco)}</td>
              <td className="px-3 py-3 text-center">{n(item.nwwdsRceptHshldco)}</td>
              <td className="px-3 py-3 text-center">{n(item.firstCritnc)}</td>
              <td className="px-3 py-3 text-center">{n(item.oldprntsSptRceptHshldco)}</td>
              <td className="px-3 py-3 text-center">{n(item.insttRecomendRceptHshldco)}</td>
              <td className="px-3 py-3 text-center">{n(item.etcRceptHshldco)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
