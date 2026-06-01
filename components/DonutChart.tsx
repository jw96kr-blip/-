'use client';

interface Segment { label: string; value: number; color: string }

interface Props {
  segments: Segment[];
  centerLabel?: string;
  centerSub?: string;
  size?: number;
}

export default function DonutChart({ segments, centerLabel, centerSub, size = 160 }: Props) {
  const total = segments.reduce((s, seg) => s + seg.value, 0);
  if (!total) return <p style={{ textAlign: 'center', color: 'var(--ink-soft)', fontSize: 13 }}>데이터 없음</p>;

  // conic-gradient 생성
  let cumPct = 0;
  const stops = segments.map(seg => {
    const pct = (seg.value / total) * 100;
    const start = cumPct;
    cumPct += pct;
    return `${seg.color} ${start.toFixed(2)}% ${cumPct.toFixed(2)}%`;
  }).join(', ');

  const donutSize = size;
  const holeSize = donutSize * 0.58;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
      {/* 도넛 */}
      <div style={{ position: 'relative', flexShrink: 0 }}>
        <div style={{
          width: donutSize, height: donutSize, borderRadius: '50%',
          background: `conic-gradient(${stops})`,
        }} />
        <div style={{
          position: 'absolute',
          top: '50%', left: '50%',
          transform: 'translate(-50%,-50%)',
          width: holeSize, height: holeSize,
          borderRadius: '50%',
          background: 'var(--card)',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          textAlign: 'center',
        }}>
          {centerLabel && <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--brown)', lineHeight: 1 }}>{centerLabel}</div>}
          {centerSub   && <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--brown-soft)', marginTop: 3 }}>{centerSub}</div>}
        </div>
      </div>

      {/* 범례 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {segments.map(seg => (
          <div key={seg.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 10, height: 10, borderRadius: 3, background: seg.color, flexShrink: 0 }} />
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink)', minWidth: 60 }}>{seg.label}</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--brown)', marginLeft: 'auto', fontVariantNumeric: 'tabular-nums' }}>
              {total > 0 ? Math.round(seg.value / total * 100) : 0}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
