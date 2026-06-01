'use client';

import type { CompetitionRate } from '@/lib/types';

interface Props {
  items: CompetitionRate[];
  labelKey?: 'HOUSE_TY' | 'PBLANC_NO'; // 드릴다운 시 평형명 표시
  maxItems?: number;
}

export default function CompetitionBars({ items, labelKey, maxItems = 10 }: Props) {
  const rows = items
    .map(item => {
      let name = '';
      if (labelKey === 'HOUSE_TY') {
        name = item.HOUSE_TY ?? item.PBLANC_NO ?? item.HOUSE_MANAGE_NO;
      } else {
        name = `${item.PBLANC_NO ?? ''} ${item.HOUSE_TY ?? ''}`.trim() || item.HOUSE_MANAGE_NO;
      }
      return {
        id:   item.HOUSE_MANAGE_NO,
        name: name.length > 18 ? name.slice(0, 18) + '…' : name,
        rate: parseFloat(item.CMPET_RATE ?? '0') || 0,
        req:  parseInt(item.REQ_CNT ?? '0', 10) || 0,
        rank: item.SUBSCRPT_RANK_CODE ?? 1,
      };
    })
    .filter(r => r.rate > 0)
    .sort((a, b) => b.rate - a.rate)
    .slice(0, maxItems);

  if (!rows.length) return <p style={{ textAlign: 'center', color: 'var(--ink-soft)', padding: '24px 0', fontSize: 13 }}>데이터가 없습니다.</p>;

  const max = rows[0].rate;

  return (
    <div className="cbar-wrap">
      {rows.map((r, i) => (
        <div className="cbar" key={`${r.id}-${r.name}-${i}`}>
          <div className="cbar-name" title={r.name}>{r.name}</div>
          <div className="cbar-track">
            <div
              className="cbar-fill"
              style={{ width: `${Math.max(4, (r.rate / max) * 100)}%` }}
            />
          </div>
          <div className="cbar-val num">
            {r.rate.toFixed(1)} :1
            {r.req > 0 && <div style={{ fontSize: 10, color: 'var(--ink-soft)', fontWeight: 400 }}>{r.req.toLocaleString()}명</div>}
          </div>
        </div>
      ))}
    </div>
  );
}
