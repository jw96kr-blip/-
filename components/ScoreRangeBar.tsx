'use client';

interface ScoreRow {
  label: string;     // 평형 또는 지역명
  min?: number;      // 최저 가점
  avg?: number;      // 평균 가점
  max?: number;      // 최고 가점
}

interface Props { rows: ScoreRow[]; maxScore?: number }

export default function ScoreRangeBar({ rows, maxScore = 84 }: Props) {
  if (!rows.length) return <p style={{ textAlign: 'center', color: 'var(--ink-soft)', fontSize: 13, padding: '24px 0' }}>데이터 없음</p>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {rows.map(row => {
        const minPct = ((row.min ?? 0) / maxScore) * 100;
        const avgPct = ((row.avg ?? 0) / maxScore) * 100;
        const maxPct = ((row.max ?? 0) / maxScore) * 100;
        const rangePct = maxPct - minPct;

        return (
          <div key={row.label}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink)' }}>{row.label}</span>
              <span className="num" style={{ fontSize: 12, fontWeight: 700, color: 'var(--brown-soft)' }}>
                {row.min ?? '?'} ~ <b style={{ color: 'var(--gold-deep)' }}>{row.avg ?? '?'}</b> ~ {row.max ?? '?'}점
              </span>
            </div>
            <div style={{ position: 'relative', height: 12, background: 'var(--sage-wash)', borderRadius: 6, overflow: 'hidden' }}>
              {/* 범위 바 (min~max) */}
              <div style={{
                position: 'absolute', top: 2, bottom: 2,
                left: `${minPct}%`, width: `${Math.max(rangePct, 2)}%`,
                background: 'var(--gold-soft)', borderRadius: 4,
              }} />
              {/* 평균 마커 */}
              {row.avg != null && (
                <div style={{
                  position: 'absolute', top: 0, bottom: 0,
                  left: `${avgPct}%`, width: 3,
                  background: 'var(--gold-deep)', borderRadius: 2,
                  transform: 'translateX(-50%)',
                }} />
              )}
            </div>
          </div>
        );
      })}

      {/* 눈금 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: -6 }}>
        {[0, 20, 40, 60, 80, maxScore].map(v => (
          <span key={v} style={{ fontSize: 10, color: 'var(--ink-soft)' }}>{v}</span>
        ))}
      </div>
    </div>
  );
}
