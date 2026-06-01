interface StatusBadgeProps {
  startDate?: string;  // YYYY-MM-DD
  endDate?: string;
}

export function getStatusKey(start?: string, end?: string): 'live' | 'soon' | 'closed' {
  if (!start || !end) return 'closed';
  const today = new Date().toISOString().slice(0, 10);
  if (today < start) return 'soon';
  if (today > end) return 'closed';
  return 'live';
}

const LABELS = { live: '접수중', soon: '예정', closed: '마감' };

export default function StatusBadge({ startDate, endDate }: StatusBadgeProps) {
  const status = getStatusKey(startDate, endDate);
  return (
    <span className={`badge ${status}`}>
      <span className="pip" />
      {LABELS[status]}
    </span>
  );
}
