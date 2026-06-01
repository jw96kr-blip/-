'use client';

import Link from 'next/link';
import type { Listing } from '@/lib/types';
import StatusBadge, { getStatusKey } from './StatusBadge';

function regionInfo(areaCodeNm?: string) {
  if (!areaCodeNm) return { cls: 'local', label: '지방' };
  if (areaCodeNm === '서울') return { cls: 'seoul', label: '서울' };
  if (['경기','인천'].includes(areaCodeNm)) return { cls: 'metro', label: '수도권' };
  return { cls: 'local', label: areaCodeNm };
}

function formatMoveIn(ym?: string): string {
  if (!ym || ym.length < 6) return '';
  return `${ym.slice(0, 4)}.${ym.slice(4, 6)} 입주`;
}

const PinIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{verticalAlign:'-1px',opacity:.55}}>
    <path d="M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11Z"/><circle cx="12" cy="10" r="2.5"/>
  </svg>
);
const HomeIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{verticalAlign:'-1px',opacity:.55}}>
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);

interface Props { items: Listing[] }

export default function ScheduleList({ items }: Props) {
  if (!items.length) {
    return <p style={{textAlign:'center',color:'var(--ink-soft)',padding:'24px 0',fontSize:'13px'}}>데이터가 없습니다.</p>;
  }

  return (
    <div>
      {items.map((item, i) => {
        const bgnde  = item.RCEPT_BGNDE ?? '';
        const day    = bgnde.slice(8, 10) || '--';
        const mon    = bgnde.slice(5, 7)  || '--';
        const region = regionInfo(item.SUBSCRPT_AREA_CODE_NM);
        const moveIn = formatMoveIn(item.MVN_PREARNGE_YM);

        const target = item.PBLANC_URL ?? '/listings';
        const isExternal = !!item.PBLANC_URL;

        return (
          <a
            key={item.HOUSE_MANAGE_NO ?? i}
            href={target}
            target={isExternal ? '_blank' : undefined}
            rel={isExternal ? 'noopener noreferrer' : undefined}
            className="sched-item"
            style={{display:'flex',textDecoration:'none',color:'inherit'}}
          >
            <div className="sched-date">
              <div className="sched-day num">{day}</div>
              <div className="sched-mon">{mon}월</div>
            </div>
            <div className="sched-body">
              <div className="sched-name">{item.HOUSE_NM}</div>
              <div className="sched-meta">
                <span className={`tag ${region.cls}`}>{region.label}</span>
                {item.HSSPLY_ADRES && (
                  <span><PinIcon /> {item.HSSPLY_ADRES.slice(0, 16)}</span>
                )}
                {item.TOT_SUPLY_HSHLDCO && (
                  <span>· <b style={{color:'var(--brown)'}}>{item.TOT_SUPLY_HSHLDCO.toLocaleString()}</b>세대</span>
                )}
                {moveIn && (
                  <span><HomeIcon /> {moveIn}</span>
                )}
                {item.BSNS_MBY_NM && (
                  <span style={{color:'var(--brown-soft)'}}>{item.BSNS_MBY_NM.slice(0, 12)}</span>
                )}
              </div>
            </div>
            <div style={{textAlign:'right',flexShrink:0,display:'flex',flexDirection:'column',alignItems:'flex-end',gap:'6px'}}>
              <StatusBadge startDate={item.RCEPT_BGNDE} endDate={item.RCEPT_ENDDE} />
              <span style={{fontSize:'11.5px',fontWeight:700,color:'var(--ink-soft)'}}>
                ~{item.RCEPT_ENDDE?.slice(5) ?? ''}
              </span>
            </div>
          </a>
        );
      })}
    </div>
  );
}
