'use client';

import type { Listing } from '@/lib/types';
import StatusBadge from './StatusBadge';

interface Props {
  items: Listing[];
}

export default function ListingsTable({ items }: Props) {
  if (!items.length) {
    return <p className="text-center text-slate-400 py-8">데이터가 없습니다.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200">
            <th className="text-left px-4 py-3 font-medium text-slate-600">주택명</th>
            <th className="text-left px-4 py-3 font-medium text-slate-600">공급 위치</th>
            <th className="text-center px-4 py-3 font-medium text-slate-600">세대수</th>
            <th className="text-center px-4 py-3 font-medium text-slate-600">접수 시작</th>
            <th className="text-center px-4 py-3 font-medium text-slate-600">접수 종료</th>
            <th className="text-center px-4 py-3 font-medium text-slate-600">상태</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => (
            <tr key={item.HOUSE_MANAGE_NO ?? i} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
              <td className="px-4 py-3 font-medium">{item.HOUSE_NM}</td>
              <td className="px-4 py-3 text-slate-600 max-w-[220px] truncate">{item.HSSPLY_ADRES ?? '-'}</td>
              <td className="px-4 py-3 text-center">{item.TOT_SUPLY_HSHLDCO?.toLocaleString() ?? '-'}</td>
              <td className="px-4 py-3 text-center text-slate-500">{item.RCEPT_BGNDE ?? '-'}</td>
              <td className="px-4 py-3 text-center text-slate-500">{item.RCEPT_ENDDE ?? '-'}</td>
              <td className="px-4 py-3 text-center">
                <StatusBadge startDate={item.RCEPT_BGNDE} endDate={item.RCEPT_ENDDE} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
