import Header from '@/components/Header';
import DashboardSummaryCards from '@/components/DashboardSummaryCards';
import ListingsTable from '@/components/ListingsTable';
import CompetitionRateChart from '@/components/CompetitionRateChart';
import WinnersTable from '@/components/WinnersTable';
import Link from 'next/link';
import type { ApiResponse, Listing, CompetitionRate, SubscriptionWinner } from '@/lib/types';

async function fetchFromApi<T>(path: string): Promise<ApiResponse<T>> {
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000';
  try {
    const res = await fetch(`${base}/api/${path}?numOfRows=5`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return { items: [], totalCount: 0, pageNo: 1, numOfRows: 5 };
    return res.json();
  } catch {
    return { items: [], totalCount: 0, pageNo: 1, numOfRows: 5 };
  }
}

export default async function DashboardPage() {
  const [listings, competition, winners] = await Promise.all([
    fetchFromApi<Listing>('listings'),
    fetchFromApi<CompetitionRate>('competition'),
    fetchFromApi<SubscriptionWinner>('subscriptions'),
  ]);

  return (
    <>
      <Header />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8 space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">청약 현황 대시보드</h1>
          <p className="text-sm text-slate-500 mt-1">한국부동산원 청약홈 공공 데이터 기반</p>
        </div>

        <DashboardSummaryCards
          listingCount={listings.totalCount}
          competitionCount={competition.totalCount}
          winnerCount={winners.totalCount}
        />

        <section className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-slate-700">최근 분양 공고</h2>
            <Link href="/listings" className="text-sm text-blue-600 hover:underline">
              전체 보기 →
            </Link>
          </div>
          <ListingsTable items={listings.items} />
        </section>

        <section className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-slate-700">경쟁률 TOP 10</h2>
            <Link href="/competition" className="text-sm text-blue-600 hover:underline">
              전체 보기 →
            </Link>
          </div>
          <div className="px-6 py-4">
            <CompetitionRateChart items={competition.items} />
            <div className="flex gap-4 mt-3 text-xs text-slate-500 justify-center">
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-sm bg-green-500 inline-block" /> 5:1 미만
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-sm bg-amber-400 inline-block" /> 5~20:1
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-sm bg-red-500 inline-block" /> 20:1 초과
              </span>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-slate-700">최근 당첨자 정보</h2>
            <Link href="/subscriptions" className="text-sm text-blue-600 hover:underline">
              전체 보기 →
            </Link>
          </div>
          <WinnersTable items={winners.items} />
        </section>
      </main>

      <footer className="text-center text-xs text-slate-400 py-6 border-t border-slate-100">
        데이터 출처: 공공데이터포털 한국부동산원 청약홈
      </footer>
    </>
  );
}
