import Link from 'next/link';
import Header from '@/components/Header';
import DashboardSummaryCards from '@/components/DashboardSummaryCards';
import ScheduleList from '@/components/ScheduleList';
import CompetitionBars from '@/components/CompetitionBars';
import SpecialSupplyBars from '@/components/SpecialSupplyBars';
import ListingCardGrid from '@/components/ListingCardGrid';
import type { ApiResponse, Listing, CompetitionRate, SpecialSupply, SubscriptionWinner } from '@/lib/types';
import { getStatusKey } from '@/components/StatusBadge';

async function fetchApi<T>(path: string, params = 'numOfRows=10'): Promise<ApiResponse<T>> {
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000';
  try {
    const res = await fetch(`${base}/api/${path}?${params}`, { next: { revalidate: 300 } });
    if (!res.ok) return { items: [], totalCount: 0, pageNo: 1, numOfRows: 10 };
    return res.json();
  } catch {
    return { items: [], totalCount: 0, pageNo: 1, numOfRows: 10 };
  }
}

const ChevIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="m9 6 6 6-6 6"/>
  </svg>
);

export default async function DashboardPage() {
  const [listings, competition, specialSupply, winners] = await Promise.all([
    fetchApi<Listing>('listings', 'numOfRows=12'),
    fetchApi<CompetitionRate>('competition', 'numOfRows=20'),
    fetchApi<SpecialSupply>('special-supply', 'numOfRows=20'),
    fetchApi<SubscriptionWinner>('subscriptions', 'numOfRows=10'),
  ]);

  const liveCount = listings.items.filter(
    item => getStatusKey(item.RCEPT_BGNDE, item.RCEPT_ENDDE) === 'live'
  ).length;

  const today = new Date();
  const dateLabel = `${today.getFullYear()}년 ${today.getMonth()+1}월 · 청약 현황 한눈에 보기`;

  return (
    <>
      <Header />

      {/* 지역 필터 바 */}
      <div className="regionbar">
        <div className="wrap regionbar-row scroll-x">
          <button className="region-chip on">전체 <span className="cnt">{listings.totalCount.toLocaleString()}</span></button>
          <button className="region-chip"><span className="dot" />서울</button>
          <button className="region-chip"><span className="dot" />수도권</button>
          <button className="region-chip"><span className="dot" />지방</button>
          <span className="spacer" />
          <span style={{fontSize:'12px',fontWeight:700,color:'var(--brown-soft)',paddingRight:'4px',whiteSpace:'nowrap'}}>
            최신순 · 접수중 우선
          </span>
        </div>
      </div>

      <main style={{flex:1}}>
        <div className="wrap">
          {/* 페이지 타이틀 */}
          <div className="row" style={{justifyContent:'space-between',alignItems:'flex-end',paddingTop:'22px',flexWrap:'wrap',gap:'12px'}}>
            <div>
              <div className="kr-eyebrow">{dateLabel}</div>
              <h1 className="h-page" style={{marginTop:'6px'}}>오늘의 청약 대시보드</h1>
            </div>
          </div>

          {/* 대시보드 본문 */}
          <div className="dash">

            {/* 요약 카드 4개 */}
            <DashboardSummaryCards
              listingCount={listings.totalCount}
              competitionCount={competition.totalCount}
              winnerCount={winners.totalCount}
              liveCount={liveCount}
            />

            {/* split: 청약 일정 | 경쟁률+특별공급 */}
            <div className="split-2">
              {/* 청약 일정 */}
              <div className="card card-pad">
                <div className="panel-head">
                  <h3 className="h-section">이번주 청약 일정</h3>
                  <Link href="/listings" className="more">분양정보 전체<ChevIcon /></Link>
                </div>
                <ScheduleList items={listings.items.slice(0, 7)} />
              </div>

              {/* 우측 위젯 */}
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

            {/* 분양정보 카드 그리드 */}
            <div>
              <div className="panel-head">
                <h3 className="h-section">
                  진행 중 분양정보{' '}
                  <span style={{fontSize:'14px',color:'var(--gold-deep)'}} className="num">{listings.items.length}</span>
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
          <span style={{fontSize:'12px',color:'var(--brown-soft)',fontWeight:700}}>청약 라운지 © 2026</span>
        </div>
      </footer>
    </>
  );
}
