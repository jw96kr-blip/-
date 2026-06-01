'use client';

import type { SpecialSupply } from '@/lib/types';

function n(v?: number) {
  return v != null && v > 0 ? v.toLocaleString() : '-';
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
            <th className="text-left px-4 py-3 font-medium text-slate-600">공고번호</th>
            <th className="text-left px-4 py-3 font-medium text-slate-600">주택형</th>
            <th className="text-center px-3 py-3 font-medium text-slate-600">특공합계</th>
            <th className="text-center px-3 py-3 font-medium text-slate-600">다자녀</th>
            <th className="text-center px-3 py-3 font-medium text-slate-600">신혼부부</th>
            <th className="text-center px-3 py-3 font-medium text-slate-600">생애최초</th>
            <th className="text-center px-3 py-3 font-medium text-slate-600">노부모</th>
            <th className="text-center px-3 py-3 font-medium text-slate-600">기관추천</th>
            <th className="text-center px-3 py-3 font-medium text-slate-600">청년</th>
            <th className="text-left px-3 py-3 font-medium text-slate-600">상태</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => (
            <tr key={`${item.HOUSE_MANAGE_NO}-${i}`} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
              <td className="px-4 py-3 text-slate-600">{item.PBLANC_NO ?? item.HOUSE_MANAGE_NO}</td>
              <td className="px-4 py-3 font-medium">{item.HOUSE_TY ?? '-'}</td>
              <td className="px-3 py-3 text-center font-medium">{n(item.SPSPLY_HSHLDCO)}</td>
              <td className="px-3 py-3 text-center">{n(item.MNYCH_HSHLDCO)}</td>
              <td className="px-3 py-3 text-center">{n(item.NWWDS_NMTW_HSHLDCO)}</td>
              <td className="px-3 py-3 text-center">{n(item.LFE_FRST_HSHLDCO)}</td>
              <td className="px-3 py-3 text-center">{n(item.OLD_PARNTS_SUPORT_HSHLDCO)}</td>
              <td className="px-3 py-3 text-center">{n(item.INSTT_RECOMEND_HSHLDCO)}</td>
              <td className="px-3 py-3 text-center">{n(item.YGMN_HSHLDCO)}</td>
              <td className="px-3 py-3 text-xs text-slate-500">{item.SUBSCRPT_RESULT_NM ?? '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
