'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { Listing } from '@/lib/types';
import StatusBadge from './StatusBadge';

// ── 지역 태그 ──────────────────────────────────────────────────────────────────
function regionInfo(areaCodeNm?: string) {
  if (!areaCodeNm) return { cls: 'local', label: '지방' };
  if (areaCodeNm === '서울') return { cls: 'seoul', label: '서울' };
  if (['경기','인천'].includes(areaCodeNm)) return { cls: 'metro', label: '수도권' };
  return { cls: 'local', label: areaCodeNm };
}

// ── 분양가 포맷 (만원 → X억 Y,000만) ─────────────────────────────────────────
function formatPrice(raw?: string): string {
  if (!raw) return '';
  const n = parseInt(raw.replace(/,/g, ''), 10);
  if (isNaN(n) || n <= 0) return '';
  const eok  = Math.floor(n / 10000);
  const rest = n % 10000;
  if (eok === 0) return `${rest.toLocaleString()}만`;
  if (rest === 0) return `${eok}억`;
  return `${eok}억 ${rest.toLocaleString()}만`;
}

// ── 입주예정월 포맷 ───────────────────────────────────────────────────────────
function formatMoveIn(ym?: string): string {
  if (!ym || ym.length < 6) return '';
  return `${ym.slice(0, 4)}년 ${ym.slice(4, 6)}월`;
}

// ── 아이콘 ─────────────────────────────────────────────────────────────────────
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
const ImgIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{opacity:.7}}>
    <rect x="3" y="3" width="18" height="18" rx="2"/><path d="m3 16 5-5 4 4 3-3 6 6"/>
  </svg>
);

// ── 아파트 이미지 훅 ──────────────────────────────────────────────────────────
interface AptImage { imageUrl: string | null; naverSearchUrl: string; googleSearchUrl: string }

function useAptImage(hmpgAdres?: string, houseNm?: string) {
  const [data, setData] = useState<AptImage | null>(null);
  useEffect(() => {
    const q = encodeURIComponent(houseNm ?? '');
    const url = hmpgAdres
      ? `/api/apt-image?url=${encodeURIComponent(hmpgAdres)}&q=${q}`
      : `/api/apt-image?q=${q}`;
    fetch(url).then(r => r.json()).then(setData).catch(() => {});
  }, [hmpgAdres, houseNm]);
  return data;
}

// ── 이미지 박스 ───────────────────────────────────────────────────────────────
function CardImage({ item }: { item: Listing }) {
  const apt = useAptImage(item.HMPG_ADRES, item.HOUSE_NM);
  const [imgError, setImgError] = useState(false);

  const showReal = apt?.imageUrl && !imgError;
  const searchUrl = apt?.naverSearchUrl ?? `https://search.naver.com/search.naver?where=image&query=${encodeURIComponent((item.HOUSE_NM ?? '') + ' 아파트 조감도')}`;

  return (
    <div className="lcard-img" style={showReal ? {padding:0,overflow:'hidden'} : {}}>
      {showReal ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={apt!.imageUrl!}
          alt={item.HOUSE_NM}
          style={{width:'100%',height:'100%',objectFit:'cover',display:'block'}}
          onError={() => setImgError(true)}
        />
      ) : (
        <span className="ph">단지 투시도</span>
      )}
      <div style={{position: showReal ? 'absolute' : 'relative', bottom: showReal ? 11 : undefined, right: showReal ? 11 : undefined, left: showReal ? undefined : 'auto', display:'flex', gap:'6px', alignItems:'center'}}>
        {/* 이미지 검색 버튼 */}
        <a
          href={searchUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={e => e.stopPropagation()}
          style={{background:'rgba(255,255,255,.85)',padding:'3px 7px',borderRadius:'5px',fontSize:'11px',fontWeight:700,color:'var(--brown)',display:'inline-flex',alignItems:'center',gap:'3px',backdropFilter:'blur(4px)'}}
        >
          <ImgIcon />사진 보기
        </a>
        <StatusBadge startDate={item.RCEPT_BGNDE} endDate={item.RCEPT_ENDDE} />
      </div>
    </div>
  );
}

// ── 분양가 훅 ─────────────────────────────────────────────────────────────────
function usePriceRange(houseManageNo?: string) {
  const [price, setPrice] = useState<string>('');
  useEffect(() => {
    if (!houseManageNo) return;
    fetch(`/api/apt-price?houseManageNo=${houseManageNo}`)
      .then(r => r.json())
      .then(data => {
        const items = data?.items ?? [];
        if (!items.length) return;
        const amounts = items
          .map((i: { LTTOT_TOP_AMOUNT?: string }) => parseInt((i.LTTOT_TOP_AMOUNT ?? '').replace(/,/g, ''), 10))
          .filter((n: number) => !isNaN(n) && n > 0);
        if (!amounts.length) return;
        const maxVal = Math.max(...amounts);
        setPrice(formatPrice(String(maxVal)));
      })
      .catch(() => {});
  }, [houseManageNo]);
  return price;
}

// ── 카드 컴포넌트 ─────────────────────────────────────────────────────────────
function ListingCard({ item }: { item: Listing }) {
  const region  = regionInfo(item.SUBSCRPT_AREA_CODE_NM);
  const moveIn  = formatMoveIn(item.MVN_PREARNGE_YM);
  const price   = usePriceRange(item.HOUSE_MANAGE_NO);
  const addr    = item.HSSPLY_ADRES?.slice(0, 20) ?? '';

  const cardContent = (
    <div className="lcard" style={{cursor:'pointer'}}>
      <CardImage item={item} />
      <div className="lcard-body">
        <div className="wrap-row" style={{gap:'6px'}}>
          <span className={`tag ${region.cls}`}>{region.label}</span>
          {item.HOUSE_DTL_SECD_NM && (
            <span style={{fontSize:'11.5px',color:'var(--ink-soft)',fontWeight:700}}>{item.HOUSE_DTL_SECD_NM}</span>
          )}
          {item.PARCPRC_ULS_AT === 'Y' && (
            <span className="tag" style={{background:'#FFF0E0',color:'#A05000'}}>상한제</span>
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
          {moveIn && <span>입주 <b>{moveIn}</b></span>}
          {item.RCEPT_BGNDE && (
            <span>접수 <b>{item.RCEPT_BGNDE.slice(5)}~{item.RCEPT_ENDDE?.slice(5)}</b></span>
          )}
        </div>
        <div className="row" style={{justifyContent:'space-between',marginTop:'4px'}}>
          <span className="num" style={{fontSize:'16px',fontWeight:700,color:'var(--gold-deep)'}}>
            {price ? `${price}~` : ''}
          </span>
          <span style={{fontSize:'12.5px',fontWeight:700,color:'var(--gold-deep)',display:'inline-flex',alignItems:'center',gap:'2px'}}>
            자세히<ChevIcon />
          </span>
        </div>
      </div>
    </div>
  );

  // PBLANC_URL이 있으면 청약홈으로 링크
  if (item.PBLANC_URL) {
    return (
      <a href={item.PBLANC_URL} target="_blank" rel="noopener noreferrer" style={{display:'block',textDecoration:'none'}}>
        {cardContent}
      </a>
    );
  }
  return <Link href="/listings" style={{display:'block',textDecoration:'none'}}>{cardContent}</Link>;
}

// ── 그리드 ─────────────────────────────────────────────────────────────────────
interface Props { items: Listing[] }

export default function ListingCardGrid({ items }: Props) {
  return (
    <div className="grid-4">
      {items.map((item, i) => (
        <ListingCard key={item.HOUSE_MANAGE_NO ?? i} item={item} />
      ))}
    </div>
  );
}
