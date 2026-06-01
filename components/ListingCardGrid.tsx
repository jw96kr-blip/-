'use client';

import Link from 'next/link';
import type { Listing } from '@/lib/types';
import StatusBadge from './StatusBadge';

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
const ChevIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="m9 6 6 6-6 6"/>
  </svg>
);

interface Props { items: Listing[] }

export default function ListingCardGrid({ items }: Props) {
  return (
    <div className="grid-4">
      {items.map((item, i) => {
        const region = regionInfo(item.SUBSCRPT_AREA_CODE_NM);
        const addr = item.HSSPLY_ADRES?.slice(0, 20) ?? '';
        return (
          <Link href="/listings" key={item.HOUSE_MANAGE_NO ?? i} className="lcard">
            <div className="lcard-img">
              <span className="ph">단지 투시도</span>
              <StatusBadge startDate={item.RCEPT_BGNDE} endDate={item.RCEPT_ENDDE} />
            </div>
            <div className="lcard-body">
              <div className="wrap-row" style={{gap:'6px'}}>
                <span className={`tag ${region.cls}`}>{region.label}</span>
                {item.HOUSE_DTL_SECD_NM && (
                  <span style={{fontSize:'11.5px',color:'var(--ink-soft)',fontWeight:700}}>{item.HOUSE_DTL_SECD_NM}</span>
                )}
              </div>
              <div className="lcard-title">{item.HOUSE_NM}</div>
              {addr && (
                <div style={{fontSize:'12.5px',color:'var(--ink-soft)'}}>
                  <PinIcon /> {addr}
                </div>
              )}
              <div className="lcard-meta">
                {item.TOT_SUPLY_HSHLDCO && <span><b>{item.TOT_SUPLY_HSHLDCO.toLocaleString()}</b>세대</span>}
                {item.RCEPT_BGNDE && <span>접수 <b>{item.RCEPT_BGNDE.slice(5)}~{item.RCEPT_ENDDE?.slice(5)}</b></span>}
              </div>
              <div className="row" style={{justifyContent:'flex-end',marginTop:'2px'}}>
                <span style={{fontSize:'12.5px',fontWeight:700,color:'var(--gold-deep)',display:'inline-flex',alignItems:'center',gap:'2px'}}>
                  자세히<ChevIcon />
                </span>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
