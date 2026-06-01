interface Props {
  listingCount: number;
  competitionCount: number;
  winnerCount: number;
  liveCount: number;
}

const CalIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{color:'var(--gold-deep)'}}>
    <rect x="3" y="4.5" width="18" height="16" rx="2.5"/><path d="M3 9h18M8 2.5v4M16 2.5v4"/>
  </svg>
);
const BoltIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{color:'var(--gold-deep)'}}>
    <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z"/>
  </svg>
);
const TrophyIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{color:'var(--gold-deep)'}}>
    <path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4Z"/><path d="M17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3"/>
  </svg>
);
const DocIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{color:'var(--gold-deep)'}}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h6"/>
  </svg>
);

export default function DashboardSummaryCards({ listingCount, competitionCount, winnerCount, liveCount }: Props) {
  const cards = [
    { icon: <BoltIcon />,   label: '오늘 접수중',  value: liveCount,       unit: '개 단지',  note: '현재 접수 진행',         alt: false },
    { icon: <CalIcon />,    label: '분양 공고',    value: listingCount,    unit: '건',       note: '전체 분양정보',           alt: true  },
    { icon: <TrophyIcon />, label: '경쟁률 집계',  value: competitionCount,unit: '건',       note: '주택형별 경쟁률',         alt: false },
    { icon: <DocIcon />,    label: '당첨자 통계',  value: winnerCount,     unit: '건',       note: '지역별 연령 현황',         alt: true  },
  ];
  return (
    <div className="summary-grid">
      {cards.map((c, i) => (
        <div key={i} className={`scard${c.alt ? ' alt' : ''}`}>
          <div className="scard-label">{c.icon}{c.label}</div>
          <div className="scard-num num">{c.value.toLocaleString()}<small>{c.unit}</small></div>
          <div className="scard-foot" style={{color:'var(--ink-soft)',fontWeight:400}}>{c.note}</div>
        </div>
      ))}
    </div>
  );
}
