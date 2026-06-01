interface StatusBadgeProps {
  startDate?: string;
  endDate?: string;
  statusNm?: string;
}

function getStatus(start?: string, end?: string, statusNm?: string) {
  if (statusNm) return statusNm;
  const now = new Date();
  const today = now.toISOString().slice(0, 10).replace(/-/g, '');
  if (!start || !end) return '정보없음';
  if (today < start) return '예정';
  if (today > end) return '마감';
  return '접수중';
}

export default function StatusBadge({ startDate, endDate, statusNm }: StatusBadgeProps) {
  const status = getStatus(startDate, endDate, statusNm);
  const colorMap: Record<string, string> = {
    '접수중': 'bg-green-100 text-green-800',
    '예정': 'bg-blue-100 text-blue-800',
    '마감': 'bg-slate-100 text-slate-500',
    '정보없음': 'bg-slate-100 text-slate-400',
  };
  const cls = colorMap[status] ?? 'bg-slate-100 text-slate-600';
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${cls}`}>
      {status}
    </span>
  );
}
