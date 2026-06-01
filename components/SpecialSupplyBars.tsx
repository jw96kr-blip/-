'use client';

import type { SpecialSupply } from '@/lib/types';

const SS_TYPES = [
  { key: 'MNYCH_HSHLDCO'             as const, label: '다자녀',   color: '#C69860' },
  { key: 'NWWDS_NMTW_HSHLDCO'        as const, label: '신혼부부',  color: '#A87C42' },
  { key: 'LFE_FRST_HSHLDCO'          as const, label: '생애최초',  color: '#8A6A45' },
  { key: 'OLD_PARNTS_SUPORT_HSHLDCO' as const, label: '노부모부양', color: '#C4C9BC' },
  { key: 'INSTT_RECOMEND_HSHLDCO'    as const, label: '기관추천',  color: '#DEE1D8' },
  { key: 'YGMN_HSHLDCO'              as const, label: '청년',      color: '#EFE2CE' },
];

interface Props { items: SpecialSupply[]; houseName?: string }

export default function SpecialSupplyBars({ items, houseName }: Props) {
  // 전체 합산
  const totals: Record<string, number> = {};
  SS_TYPES.forEach(t => { totals[t.key] = 0; });
  items.forEach(item => {
    SS_TYPES.forEach(t => { totals[t.key] += item[t.key] ?? 0; });
  });

  const grandTotal = SS_TYPES.reduce((s, t) => s + (totals[t.key] || 0), 0);
  if (!grandTotal) return <p style={{textAlign:'center',color:'var(--ink-soft)',padding:'24px 0',fontSize:'13px'}}>데이터가 없습니다.</p>;

  return (
    <div>
      {/* 누적 바 */}
      <div style={{display:'flex',height:'12px',borderRadius:'999px',overflow:'hidden',marginBottom:'14px'}}>
        {SS_TYPES.map(t => (
          <div key={t.key} style={{width:((totals[t.key]||0)/grandTotal*100)+'%',background:t.color}} />
        ))}
      </div>
      {SS_TYPES.map(t => {
        const val = totals[t.key] || 0;
        const pct = grandTotal ? Math.round(val/grandTotal*100) : 0;
        return (
          <div className="ss-row" key={t.key}>
            <span className="ss-key">
              <span style={{display:'inline-block',width:'8px',height:'8px',borderRadius:'3px',background:t.color,marginRight:'7px',verticalAlign:'1px'}} />
              {t.label}
            </span>
            <span className="ss-track">
              <span className="ss-fill" style={{width:pct+'%',background:t.color}} />
            </span>
            <span className="ss-val num">{val.toLocaleString()}세대</span>
          </div>
        );
      })}
    </div>
  );
}
