'use client';

interface Props {
  applicants: { AGE_30?: number; AGE_40?: number; AGE_50?: number; AGE_60?: number };
  winners:    { AGE_30?: number; AGE_40?: number; AGE_50?: number; AGE_60?: number };
}

const AGE_LABELS = ['30대 이하', '40대', '50대', '60대 이상'];
const AGE_KEYS: Array<'AGE_30' | 'AGE_40' | 'AGE_50' | 'AGE_60'> = ['AGE_30', 'AGE_40', 'AGE_50', 'AGE_60'];

export default function AgeBarChart({ applicants, winners }: Props) {
  const maxVal = Math.max(
    ...AGE_KEYS.map(k => Math.max(applicants[k] ?? 0, winners[k] ?? 0)),
    1
  );

  return (
    <div>
      {/* 범례 */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 14, fontSize: 12, fontWeight: 700 }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <span style={{ width: 10, height: 10, borderRadius: 2, background: 'var(--gold)', display: 'inline-block' }} />
          신청자
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <span style={{ width: 10, height: 10, borderRadius: 2, background: 'var(--sage-deep)', display: 'inline-block' }} />
          당첨자
        </span>
      </div>

      {AGE_KEYS.map((key, i) => {
        const appVal = applicants[key] ?? 0;
        const winVal = winners[key] ?? 0;
        const appPct = Math.max(2, (appVal / maxVal) * 100);
        const winPct = Math.max(2, (winVal / maxVal) * 100);

        return (
          <div key={key} style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink-soft)', marginBottom: 5 }}>
              {AGE_LABELS[i]}
            </div>
            {/* 신청자 바 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <div style={{ flex: 1, height: 14, background: 'var(--sage-wash)', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ width: `${appPct}%`, height: '100%', background: 'linear-gradient(90deg,var(--gold),var(--gold-deep))', borderRadius: 4 }} />
              </div>
              <span className="num" style={{ fontSize: 12, fontWeight: 700, color: 'var(--brown)', minWidth: 56, textAlign: 'right' }}>
                {appVal.toLocaleString()}
              </span>
            </div>
            {/* 당첨자 바 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ flex: 1, height: 10, background: 'var(--sage-wash)', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ width: `${winPct}%`, height: '100%', background: 'var(--sage-deep)', borderRadius: 4 }} />
              </div>
              <span className="num" style={{ fontSize: 11, fontWeight: 700, color: 'var(--brown-soft)', minWidth: 56, textAlign: 'right' }}>
                {winVal.toLocaleString()}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
