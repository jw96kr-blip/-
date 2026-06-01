'use client';

import type { CompetitionRate } from '@/lib/types';

interface Props { items: CompetitionRate[] }

function regionCls(pblanc?: string) {
  // 단순히 번갈아 적용 (실제론 단지 지역 정보 없음)
  return '';
}

export default function CompetitionBars({ items }: Props) {
  const rows = items
    .map(item => ({
      id: item.HOUSE_MANAGE_NO,
      name: `${item.PBLANC_NO ?? ''} ${item.HOUSE_TY ?? ''}`.trim(),
      rate: parseFloat(item.CMPET_RATE ?? '0') || 0,
      pblanc: item.PBLANC_NO,
    }))
    .filter(r => r.rate > 0)
    .sort((a, b) => b.rate - a.rate)
    .slice(0, 6);

  if (!rows.length) return <p style={{textAlign:'center',color:'var(--ink-soft)',padding:'24px 0',fontSize:'13px'}}>데이터가 없습니다.</p>;

  const max = rows[0].rate;

  return (
    <div className="cbar-wrap">
      {rows.map((r, i) => (
        <div className="cbar" key={`${r.id}-${i}`}>
          <div className="cbar-name" title={r.name}>{r.name}</div>
          <div className="cbar-track">
            <div
              className="cbar-fill"
              style={{ width: Math.max(4, (r.rate / max) * 100) + '%' }}
            />
          </div>
          <div className="cbar-val num">{r.rate.toFixed(1)} :1</div>
        </div>
      ))}
    </div>
  );
}
