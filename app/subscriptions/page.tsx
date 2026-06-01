'use client';

import { useState } from 'react';
import useSWR from 'swr';
import Header from '@/components/Header';
import WinnersTable from '@/components/WinnersTable';
import ScoreRangeBar from '@/components/ScoreRangeBar';
import RegionBarChart from '@/components/RegionBarChart';
import AgeBarChart from '@/components/AgeBarChart';
import LoadingSpinner from '@/components/LoadingSpinner';
import type { ApiResponse, SubscriptionWinner } from '@/lib/types';

const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function SubscriptionsPage() {
  const [page, setPage] = useState(1);
  const perPage = 20;

  // 가점제 당첨자 (지역별 평균/최고/최저)
  const { data, isLoading } = useSWR<ApiResponse<SubscriptionWinner>>(
    `/api/subscriptions?page=${page}&perPage=${perPage}`, fetcher
  );

  // 연령별 신청자·당첨자
  const { data: ageStats } = useSWR<{
    applicants: { AGE_30?: number; AGE_40?: number; AGE_50?: number; AGE_60?: number };
    winners:    { AGE_30?: number; AGE_40?: number; AGE_50?: number; AGE_60?: number };
  }>('/api/age-stats', fetcher);

  // 지역별 경쟁률 통계
  const { data: regionCmpet } = useSWR<ApiResponse<{
    SUBSCRPT_AREA_CODE_NM?: string;
    SUPLY_CMPET_RATE?: string;
    SPSPLY_CMPET_RATE?: string;
    SUPLY_HSHLDCO?: number;
    SPSPLY_HSHLDCO?: number;
    STAT_DE?: string;
  }>>('/api/region-cmpet', fetcher);

  const items = data?.items ?? [];
  const matchCount = data?.matchCount ?? data?.totalCount ?? 0;
  const totalPages = Math.ceil(matchCount / perPage) || 1;

  // KPI 계산 (가점제 데이터)
  const hasScore = items.some(i => i.AVRG_SCORE != null);
  const avgScore = hasScore
    ? (items.reduce((s, i) => s + (i.AVRG_SCORE ?? 0), 0) / items.filter(i => i.AVRG_SCORE != null).length).toFixed(1)
    : '-';
  const maxScore = hasScore ? Math.max(...items.map(i => i.TOP_SCORE ?? 0)) : 0;
  const minScore = hasScore ? Math.min(...items.filter(i => i.LWET_SCROE != null).map(i => i.LWET_SCROE!)) : 0;

  // 지역별 가점 분포 (ScoreRangeBar용)
  const scoreRows = items
    .filter(i => i.AVRG_SCORE != null && i.SUBSCRPT_AREA_CODE_NM)
    .sort((a, b) => (b.AVRG_SCORE ?? 0) - (a.AVRG_SCORE ?? 0))
    .slice(0, 10)
    .map(i => ({
      label: i.SUBSCRPT_AREA_CODE_NM ?? '-',
      min:   i.LWET_SCROE ?? undefined,
      avg:   i.AVRG_SCORE ?? undefined,
      max:   i.TOP_SCORE  ?? undefined,
    }));

  // 지역별 일반공급 경쟁률 (RegionBarChart용)
  const regionRows = (regionCmpet?.items ?? [])
    .filter(i => i.SUBSCRPT_AREA_CODE_NM)
    .map(i => ({
      region: i.SUBSCRPT_AREA_CODE_NM!,
      value:  parseFloat(i.SUPLY_CMPET_RATE ?? '0') || 0,
      sub:    i.SUPLY_HSHLDCO ? `${i.SUPLY_HSHLDCO.toLocaleString()}세대` : undefined,
    }))
    .filter(r => r.value > 0);

  return (
    <>
      <Header />
      <main style={{ flex: 1 }}>
        <div className="wrap">

          {/* 페이지 헤더 */}
          <div style={{ paddingTop: 24, paddingBottom: 20 }}>
            <div className="kr-eyebrow">청약 신청·당첨자 통계 현황</div>
            <h1 className="h-page" style={{ marginTop: 6 }}>당첨자 분석</h1>
          </div>

          {/* KPI */}
          <div className="summary-grid" style={{ marginBottom: 24 }}>
            {[
              { label: '평균 당첨 가점', value: avgScore,         unit: '점',  note: '조회 지역 평균', alt: false },
              { label: '최고 당첨 가점', value: maxScore || '-',  unit: maxScore ? '점' : '', note: '최고 기록', alt: true  },
              { label: '최저 당첨 가점', value: minScore || '-',  unit: minScore ? '점' : '', note: '최저 커트라인', alt: false },
              { label: '조회 지역·기간', value: items.length,      unit: '건',  note: '최근 6개월', alt: true  },
            ].map((c, i) => (
              <div key={i} className={`scard${c.alt ? ' alt' : ''}`}>
                <div className="scard-label">{c.label}</div>
                <div className="scard-num num">{c.value}<small>{c.unit}</small></div>
                <div className="scard-foot" style={{ color: 'var(--ink-soft)', fontWeight: 400 }}>{c.note}</div>
              </div>
            ))}
          </div>

          {/* 차트 2열 */}
          <div className="grid-2" style={{ marginBottom: 24 }}>
            {/* 지역별 당첨 가점 분포 */}
            <div className="card card-pad">
              <div className="panel-head" style={{ marginBottom: 16 }}>
                <h3 className="h-section" style={{ fontSize: 16 }}>지역별 당첨 가점 분포</h3>
                <span style={{ fontSize: 11, color: 'var(--ink-soft)', fontWeight: 400 }}>최저 · 평균 · 최고</span>
              </div>
              {isLoading ? <LoadingSpinner /> : scoreRows.length ? (
                <ScoreRangeBar rows={scoreRows} />
              ) : (
                <p style={{ textAlign: 'center', color: 'var(--ink-soft)', fontSize: 13, padding: '24px 0' }}>데이터 없음</p>
              )}
            </div>

            {/* 연령별 신청·당첨 분포 */}
            <div className="card card-pad">
              <div className="panel-head" style={{ marginBottom: 16 }}>
                <h3 className="h-section" style={{ fontSize: 16 }}>연령별 신청·당첨 현황</h3>
                <span style={{ fontSize: 11, color: 'var(--ink-soft)', fontWeight: 400 }}>최근 6개월 합산</span>
              </div>
              {ageStats ? (
                <AgeBarChart
                  applicants={ageStats.applicants}
                  winners={ageStats.winners}
                />
              ) : (
                <LoadingSpinner text="연령 데이터 로딩 중..." />
              )}
            </div>
          </div>

          {/* 지역별 일반공급 경쟁률 */}
          {regionRows.length > 0 && (
            <div className="card card-pad" style={{ marginBottom: 24 }}>
              <div className="panel-head" style={{ marginBottom: 16 }}>
                <h3 className="h-section" style={{ fontSize: 16 }}>지역별 일반공급 경쟁률</h3>
                <span style={{ fontSize: 11, color: 'var(--ink-soft)', fontWeight: 400 }}>최근 1개월 기준</span>
              </div>
              <RegionBarChart rows={regionRows} valueLabel=":1" maxRows={15} />
            </div>
          )}

          {/* 가점제 당첨자 테이블 */}
          <div className="card" style={{ overflow: 'hidden', marginBottom: 24 }}>
            <div className="panel-head" style={{ padding: '16px 22px 0' }}>
              <h3 className="h-section" style={{ fontSize: 16 }}>
                가점제 당첨자 현황{' '}
                <span style={{ fontSize: 13, color: 'var(--gold-deep)' }} className="num">{matchCount.toLocaleString()}건</span>
              </h3>
            </div>
            {isLoading ? <LoadingSpinner /> : <WinnersTable items={items} />}
          </div>

          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, paddingBottom: 32 }}>
              <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page===1} className="region-chip" style={{ opacity: page===1 ? 0.4:1 }}>이전</button>
              <span className="region-chip on">{page} / {totalPages}</span>
              <button onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={page===totalPages} className="region-chip" style={{ opacity: page===totalPages ? 0.4:1 }}>다음</button>
            </div>
          )}
        </div>
      </main>

      <footer className="ft">
        <div className="wrap ft-row">
          <p className="ft-note"><b>데이터 출처</b> 공공데이터포털 한국부동산원 청약홈 OpenAPI</p>
        </div>
      </footer>
    </>
  );
}
