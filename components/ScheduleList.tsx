'use client';

import Link from 'next/link';
import type { Listing } from '@/lib/types';
import StatusBadge, { getStatusKey } from './StatusBadge';

function regionInfo(areaCodeNm?: string) {
  if (!areaCodeNm) return { cls: 'local', label: '지방' };
  if (areaCodeNm === '서울') return { cls: 'seoul', label: '서울' };
  if (areaCodeNm === '경기' || areaCodeNm === '인천') return { cls: 'metro', label: '수도권' };
  return { cls: 'local', label: '지방' };
}

const PinIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{verticalAlign:'-1px',opacity:.6}}>
    <path d="M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11Z"/><circle cx="12" cy="10" r="2.5"/>
  </svg>
);

interface Props { items: Listing[] }

export default function ScheduleList({ items }: Props) {
  if (!items.length) return <p style={{textAlign:'center',color:'var(--ink-soft)',padding:'24px 0',fontSize:'13px'}}>데이터가 없습니다.</p>;

  return (
    <div>
      {items.map((item, i) => {
        const bgnde = item.RCEPT_BGNDE ?? '';
        const day   = bgnde.slice(8, 10) || '--';
        const mon   = bgnde.slice(5, 7)  || '--';
        const region = regionInfo(item.SUBSCRPT_AREA_CODE_NM);
        const status = getStatusKey(item.RCEPT_BGNDE, item.RCEPT_ENDDE);

        return (
          <Link href="/listings" key={item.HOUSE_MANAGE_NO ?? i} className="sched-item" style={{display:'flex'}}>
            <div className="sched-date">
              <div className="sched-day num">{day}</div>
              <div className="sched-mon">{mon}월</div>
            </div>
            <div className="sched-body">
              <div className="sched-name">{item.HOUSE_NM}</div>
              <div className="sched-meta">
                <span className={`tag ${region.cls}`}>{region.label}</span>
                {item.HSSPLY_ADRES && (
                  <span><PinIcon /> {item.HSSPLY_ADRES.slice(0, 18)}</span>
                )}
                {item.TOT_SUPLY_HSHLDCO && (
                  <span>· {item.TOT_SUPLY_HSHLDCO.toLocaleString()}세대</span>
                )}
              </div>
            </div>
            <div style={{textAlign:'right',flexShrink:0,display:'flex',flexDirection:'column',alignItems:'flex-end',gap:'6px'}}>
              <StatusBadge startDate={item.RCEPT_BGNDE} endDate={item.RCEPT_ENDDE} />
              <span style={{fontSize:'12px',fontWeight:700,color:'var(--ink-soft)'}}>
                ~{item.RCEPT_ENDDE?.slice(5) ?? ''}
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
