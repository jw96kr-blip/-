'use client';

interface DataPoint { label: string; value: number }

interface Props {
  data: DataPoint[];
  color?: string;
  height?: number;
  valueLabel?: string;
}

export default function MonthlyTrend({ data, color = 'var(--gold)', height = 100, valueLabel = '' }: Props) {
  if (!data.length) return <p style={{ textAlign: 'center', color: 'var(--ink-soft)', fontSize: 13 }}>데이터 없음</p>;

  const W = 460;
  const H = height;
  const PAD = { top: 12, right: 8, bottom: 28, left: 36 };
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;

  const maxVal = Math.max(...data.map(d => d.value), 1);
  const minVal = 0;

  const xStep = innerW / Math.max(data.length - 1, 1);

  const toX = (i: number) => PAD.left + i * xStep;
  const toY = (v: number) => PAD.top + innerH - ((v - minVal) / (maxVal - minVal)) * innerH;

  const points = data.map((d, i) => `${toX(i)},${toY(d.value)}`).join(' ');

  // 채우기 폴리곤
  const fillPoints = [
    `${toX(0)},${PAD.top + innerH}`,
    ...data.map((d, i) => `${toX(i)},${toY(d.value)}`),
    `${toX(data.length - 1)},${PAD.top + innerH}`,
  ].join(' ');

  return (
    <div style={{ width: '100%', overflowX: 'auto' }}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', minWidth: 280, height: 'auto', display: 'block' }}>
        {/* Y 그리드 */}
        {[0, 0.5, 1].map(r => {
          const y = PAD.top + innerH * (1 - r);
          const val = Math.round(minVal + (maxVal - minVal) * r);
          return (
            <g key={r}>
              <line x1={PAD.left} y1={y} x2={W - PAD.right} y2={y}
                stroke="var(--line)" strokeWidth="1" strokeDasharray="3,3" />
              <text x={PAD.left - 4} y={y + 4} textAnchor="end"
                fontSize="10" fill="var(--ink-soft)" fontFamily="inherit">
                {val.toLocaleString()}
              </text>
            </g>
          );
        })}

        {/* 채우기 영역 */}
        <polygon points={fillPoints} fill={color} opacity="0.12" />

        {/* 라인 */}
        <polyline points={points} fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />

        {/* 포인트 + X 레이블 */}
        {data.map((d, i) => (
          <g key={i}>
            <circle cx={toX(i)} cy={toY(d.value)} r="3.5" fill={color} />
            {/* 모든 레이블 표시 (적으면) 또는 짝수 인덱스만 */}
            {(data.length <= 8 || i % 2 === 0) && (
              <text x={toX(i)} y={H - 4} textAnchor="middle"
                fontSize="10" fill="var(--ink-soft)" fontFamily="inherit">
                {d.label}
              </text>
            )}
          </g>
        ))}

        {/* valueLabel */}
        {valueLabel && (
          <text x={PAD.left} y={PAD.top - 4} fontSize="10" fill="var(--brown-soft)" fontFamily="inherit">
            {valueLabel}
          </text>
        )}
      </svg>
    </div>
  );
}
