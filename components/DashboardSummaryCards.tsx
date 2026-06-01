interface SummaryCardProps {
  title: string;
  value: string | number;
  description?: string;
  color?: string;
}

function SummaryCard({ title, value, description, color = 'blue' }: SummaryCardProps) {
  const colorMap: Record<string, string> = {
    blue: 'border-l-blue-500',
    green: 'border-l-green-500',
    orange: 'border-l-orange-500',
  };
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-slate-200 border-l-4 ${colorMap[color]} p-5`}>
      <p className="text-sm text-slate-500 font-medium">{title}</p>
      <p className="text-3xl font-bold mt-1 text-slate-800">{value}</p>
      {description && <p className="text-xs text-slate-400 mt-1">{description}</p>}
    </div>
  );
}

interface Props {
  listingCount: number;
  competitionCount: number;
  winnerCount: number;
}

export default function DashboardSummaryCards({ listingCount, competitionCount, winnerCount }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <SummaryCard
        title="분양 공고"
        value={listingCount}
        description="최근 분양 정보 건수"
        color="blue"
      />
      <SummaryCard
        title="경쟁률 조회"
        value={competitionCount}
        description="최근 경쟁률 집계 건수"
        color="green"
      />
      <SummaryCard
        title="당첨자 정보"
        value={winnerCount}
        description="최근 당첨자 데이터 건수"
        color="orange"
      />
    </div>
  );
}
