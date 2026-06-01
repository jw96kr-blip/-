'use client';

import { useRouter, usePathname } from 'next/navigation';

interface Props {
  current?: string;
  totalCount?: number;
}

const REGIONS = [
  { key: '',      label: '전체' },
  { key: 'seoul', label: '서울' },
  { key: 'metro', label: '수도권' },
  { key: 'local', label: '지방' },
];

export default function RegionFilterBar({ current, totalCount }: Props) {
  const router   = useRouter();
  const pathname = usePathname();

  const handleClick = (key: string) => {
    if (key === '') {
      router.push(pathname);
    } else {
      router.push(`${pathname}?region=${key}`);
    }
  };

  return (
    <div className="regionbar">
      <div className="wrap regionbar-row scroll-x">
        {REGIONS.map(r => (
          <button
            key={r.key}
            className={`region-chip${(current ?? '') === r.key ? ' on' : ''}`}
            onClick={() => handleClick(r.key)}
          >
            {r.key && <span className="dot" />}
            {r.label}
            {r.key === '' && totalCount != null && (
              <span className="cnt">{totalCount.toLocaleString()}</span>
            )}
          </button>
        ))}
        <span className="spacer" />
        <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--brown-soft)', paddingRight: '4px', whiteSpace: 'nowrap' }}>
          최신순 · 접수중 우선
        </span>
      </div>
    </div>
  );
}
