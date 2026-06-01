'use client';

interface RegionRow { region: string; value: number; sub?: string }

interface Props {
  rows: RegionRow[];
  valueLabel?: string;
  maxRows?: number;
  highlight?: string;
}

const REGION_COLORS: Record<string, string> = {
  '서울': 'var(--gold)',
  '경기': 'var(--gold-deep)',
  '인천': '#B8953A',
};

export default function RegionBarChart({ rows, valueLabel = '건', maxRows = 12, highlight }: Props) {
  const sorted = [...rows].sort((a, b) => b.value - a.value).slice(0, maxRows);
  const max = sorted[0]?.value || 1;

  if (!sorted.length) return <p style={{ textAlign: 'center', color: 'var(--ink-soft)', fontSize: 13, padding: '24px 0' }}>데이터 없음</p>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {sorted.map(row => {
        const pct = Math.max(3, (row.value / max) * 100);
        const isHighlight = highlight && row.region === highlight;
        const color = REGION_COLORS[row.region] ?? (isHighlight ? 'var(--gold)' : 'linear-gradient(90deg,#A7AE96,#838B6B)');
        return (
          <div key={row.region} className="cbar">
            <div className="cbar-name">{row.region}</div>
            <div className="cbar-track">
              <div className="cbar-fill" style={{ width: `${pct}%`, background: color }} />
            </div>
            <div className="cbar-val num">
              {row.value.toLocaleString()}
              <span style={{ fontSize: 11, fontWeight: 400, color: 'var(--brown-soft)', marginLeft: 2 }}>{valueLabel}</span>
              {row.sub && <div style={{ fontSize: 11, color: 'var(--ink-soft)' }}>{row.sub}</div>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
