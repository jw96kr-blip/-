import Link from 'next/link';
import { Suspense } from 'react';
import Header from '@/components/Header';
import DashboardSummaryCards from '@/components/DashboardSummaryCards';
import ScheduleList from '@/components/ScheduleList';
import CompetitionBars from '@/components/CompetitionBars';
import SpecialSupplyBars from '@/components/SpecialSupplyBars';
import ListingCardGrid from '@/components/ListingCardGrid';
import RegionFilterBar from '@/components/RegionFilterBar';
import type { ApiResponse, Listing, CompetitionRate, SpecialSupply, SubscriptionWinner } from '@/lib/types';
import { getStatusKey } from '@/components/StatusBadge';

const BASE = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000';

async function fetchApi<T>(path: string, params = ''): Promise<ApiResponse<T>> {
  try {
    const res = await fetch(`${BASE}/api/${path}${params ? '?' + params : ''}`, { next: { revalidate: 300 } });
    if (!res.ok) return { items: [], totalCount: 0, matchCount: 0, pageNo: 1, numOfRows: 10 };
    return res.json();
  } catch {
    return { items: [], totalCount: 0, matchCount: 0, pageNo: 1, numOfRows: 10 };
  }
}

const ChevIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="m9 6 6 6-6 6"/>
  </svg>
);

interface PageProps {
  searchParams: Promise<{ region?: string }>;
}

// 지역 → API 파라미터 매핑
const REGION_PARAMS: Record<string, string> = {
  seoul:  'region=%EC%84%9C%EC%9A%B8',          // 서울
  metro:  'region=%EA%B2%BD%EA%B8%B0',           // 경기 (수도권 대표)
  local:  '',                                     // 지방 = 필터 없이 로드 후 클라이언트 제외
};

export default async function DashboardPage({ searchParams }: PageProps) {
  const { region } = await searchParams;
  const regionParam = region ? (REGION_PARAMS[region] ?? '') : '';

  const [listings, competition, specialSupply, winners] = await Promise.all([
    fetchApi<Listing>('listings', `perPage=12${regionParam ? '&' + regionParam : ''}`),
    fetchApi<CompetitionRate>('competition', 'perPage=20'),
    fetchApi<SpecialSupply>('special-supply', 'perPage=20'),
    fetchApi<SubscriptionWinner>('subscriptions', 'perPage=10'),
  ]);

  // KPI 계산
  const liveCount  = listings.items.filter(i => getStatusKey(i.RCEPT_BGNDE, i.RCEPT_ENDDE) === 'live').length;
  const soonCount  = listings.items.filter(i => getStatusKey(i.RCEPT_BGNDE, i.RCEPT_ENDDE) === 'soon').length;
  const totalUnits = listings.items.reduce((s, i) => s + (i.TOT_SUPLY_HSHLDCO ?? 0), 0);

  // 지역별 공고 수 집계
  const regionMap: Record<string, number> = {};
  listings.items.forEach(i => {
    const r = i.SUBSCRPT_AREA_CODE_NM ?? '기타';
    regionMap[r] = (regionMap[r] ?? 0) + 1;
  });

  const today = new Date();
  const dateLabel = `${today.getFullYear()}년 ${today.getMonth() + 1}월 · 청약 현황 한눈에 보기`;

  return (
    <>
      <Header />

      {/* 지역 필터 바 — 클라이언트 컴포넌트 */}
      <Suspense fallback={null}>
        <RegionFilterBar
          current={region}
          totalCount={listings.matchCount || listings.totalCount}
        />
      </Suspense>

      <main style={{ flex: 1 }}>
        <div className="wrap">
          <div className="row" style={{ justifyContent: 'space-between', alignItems: 'flex-end', paddingTop: '22px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <div className="kr-eyebrow">{dateLabel}</div>
              <h1 className="h-page" style={{ marginTop: '6px' }}>오늘의 청약 대시보드</h1>
            </div>
          </div>

          <div className="dash">
            {/* 요약 카드 — matchCount 기반 */}
            <DashboardSummaryCards
              liveCount={liveCount}
              soonCount={soonCount}
              totalUnits={totalUnits}
              matchCount={listings.matchCount || listings.totalCount}
            />

            {/* split-2: 청약 일정 | 경쟁률 + 특별공급 */}
            <div className="split-2">
              <div className="card card-pad">
                <div className="panel-head">
                  <h3 className="h-section">이번주 청약 일정</h3>
                  <Link href="/listings" className="more">분양정보 전체<ChevIcon /></Link>
                </div>
                <ScheduleList items={listings.items.slice(0, 7)} />
              </div>

              <div className="col">
                <div className="card card-pad">
                  <div className="panel-head">
                    <h3 className="h-section">실시간 경쟁률 TOP 6</h3>
                    <Link href="/competition" className="more">경쟁률 상세<ChevIcon /></Link>
                  </div>
                  <CompetitionBars items={competition.items} />
                </div>
                <div className="card card-pad">
                  <div className="panel-head">
                    <h3 className="h-section">특별공급 현황</h3>
                    <Link href="/competition" className="more">상세<ChevIcon /></Link>
                  </div>
                  <SpecialSupplyBars items={specialSupply.items} />
                </div>
              </div>
            </div>

            {/* 분양 카드 그리드 */}
            <div>
              <div className="panel-head">
                <h3 className="h-section">
                  진행 중 분양정보{' '}
                  <span style={{ fontSize: '14px', color: 'var(--gold-deep)' }} className="num">
                    {listings.matchCount || listings.items.length}
                  </span>
                </h3>
                <Link href="/listings" className="more">분양정보 전체<ChevIcon /></Link>
              </div>
              <ListingCardGrid items={listings.items.slice(0, 8)} />
            </div>
          </div>
        </div>
      </main>

      <footer className="ft">
        <div className="wrap ft-row">
          <p className="ft-note">
            <b>데이터 출처</b> 공공데이터포털 한국부동산원 청약홈 OpenAPI<br />
            본 서비스는 공공 데이터를 활용하며 투자 조언을 제공하지 않습니다.
          </p>
          <span style={{ fontSize: '12px', color: 'var(--brown-soft)', fontWeight: 700 }}>청약 라운지 © 2026</span>
        </div>
      </footer>
    </>
  );
}
