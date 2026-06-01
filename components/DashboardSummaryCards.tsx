interface Props {
  liveCount:   number;
  soonCount:   number;
  totalUnits:  number;
  matchCount:  number;
}

const BoltIcon  = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{color:'var(--gold-deep)'}}><path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z"/></svg>;
const CalIcon   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{color:'var(--gold-deep)'}}><rect x="3" y="4.5" width="18" height="16" rx="2.5"/><path d="M3 9h18M8 2.5v4M16 2.5v4"/></svg>;
const HomeIcon  = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{color:'var(--gold-deep)'}}><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
const DocIcon   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{color:'var(--gold-deep)'}}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h6"/></svg>;

export default function DashboardSummaryCards({ liveCount, soonCount, totalUnits, matchCount }: Props) {
  const cards = [
    {
      icon:   <BoltIcon />,
      label:  '접수중',
      value:  liveCount,
      unit:   '개 단지',
      foot:   `예정 ${soonCount}건 대기중`,
      alt:    false,
    },
    {
      icon:   <CalIcon />,
      label:  '현재 공고',
      value:  matchCount,
      unit:   '건',
      foot:   '활성 분양 공고 수',
      alt:    true,
    },
    {
      icon:   <HomeIcon />,
      label:  '공급 세대',
      value:  totalUnits,
      unit:   '세대',
      foot:   '조회된 공고 합계',
      alt:    false,
    },
    {
      icon:   <DocIcon />,
      label:  '마감 예정',
      value:  soonCount + liveCount,
      unit:   '건',
      foot:   '이번 주 청약 진행',
      alt:    true,
    },
  ];

  return (
    <div className="summary-grid">
      {cards.map((c, i) => (
        <div key={i} className={`scard${c.alt ? ' alt' : ''}`}>
          <div className="scard-label">{c.icon}{c.label}</div>
          <div className="scard-num num">
            {c.value.toLocaleString()}
            <small>{c.unit}</small>
          </div>
          <div className="scard-foot" style={{ color: 'var(--ink-soft)', fontWeight: 400 }}>
            {c.foot}
          </div>
        </div>
      ))}
    </div>
  );
}
