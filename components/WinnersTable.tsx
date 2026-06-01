'use client';

import type { SubscriptionWinner } from '@/lib/types';

interface Props { items: SubscriptionWinner[] }

function formatPeriod(de?: string) {
  if (!de || de.length < 6) return de ?? '-';
  return `${de.slice(0, 4)}년 ${de.slice(4, 6)}월`;
}

function ScoreBar({ score, max }: { score?: number; max: number }) {
  if (score == null) return <span style={{color:'var(--ink-soft)'}}>-</span>;
  const pct = Math.min(100, (score / max) * 100);
  return (
    <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
      <div style={{flex:1,height:'6px',background:'var(--sage-wash)',borderRadius:'999px',overflow:'hidden'}}>
        <div style={{width:`${pct}%`,height:'100%',background:'linear-gradient(90deg,var(--gold),var(--gold-deep))',borderRadius:'999px'}} />
      </div>
      <span className="num" style={{fontSize:'13px',fontWeight:700,color:'var(--brown)',minWidth:'28px',textAlign:'right'}}>{score}점</span>
    </div>
  );
}

export default function WinnersTable({ items }: Props) {
  if (!items.length) {
    return <p style={{textAlign:'center',color:'var(--ink-soft)',padding:'24px 0',fontSize:'13px'}}>데이터가 없습니다.</p>;
  }

  // 가점제 데이터 여부 판단
  const hasScore = items.some(i => i.AVRG_SCORE != null);
  const maxScore = hasScore ? Math.max(...items.map(i => i.TOP_SCORE ?? 0)) || 84 : 0;

  if (hasScore) {
    return (
      <div className="overflow-x-auto">
        <table className="tbl">
          <thead>
            <tr>
              <th>통계 기간</th>
              <th>지역</th>
              <th>거주 구분</th>
              <th style={{minWidth:160}}>평균 가점</th>
              <th style={{minWidth:160}}>최고 가점</th>
              <th className="r" style={{paddingRight:16}}>최저 가점</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => (
              <tr key={i}>
                <td style={{color:'var(--ink-soft)'}}>{formatPeriod(item.STAT_DE)}</td>
                <td><span style={{fontWeight:700}}>{item.SUBSCRPT_AREA_CODE_NM ?? '-'}</span></td>
                <td style={{color:'var(--ink-soft)',fontSize:'12.5px'}}>{item.RESIDE_SECD_NM ?? '-'}</td>
                <td><ScoreBar score={item.AVRG_SCORE} max={maxScore} /></td>
                <td><ScoreBar score={item.TOP_SCORE} max={maxScore} /></td>
                <td className="r t-num" style={{paddingRight:16}}>{item.LWET_SCROE ?? '-'}점</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  // fallback: 연령별 당첨자 수
  return (
    <div className="overflow-x-auto">
      <table className="tbl">
        <thead>
          <tr>
            <th>통계 기간</th>
            <th>지역</th>
            <th className="r">30대↓</th>
            <th className="r">40대</th>
            <th className="r">50대</th>
            <th className="r">60대↑</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => (
            <tr key={i}>
              <td style={{color:'var(--ink-soft)'}}>{formatPeriod(item.STAT_DE)}</td>
              <td><span style={{fontWeight:700}}>{item.SUBSCRPT_AREA_CODE_NM ?? '-'}</span></td>
              <td className="r t-num">{item.AGE_30?.toLocaleString() ?? '-'}</td>
              <td className="r t-num">{item.AGE_40?.toLocaleString() ?? '-'}</td>
              <td className="r t-num">{item.AGE_50?.toLocaleString() ?? '-'}</td>
              <td className="r t-num">{item.AGE_60?.toLocaleString() ?? '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
