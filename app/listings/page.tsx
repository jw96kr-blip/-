'use client';

import { useState, useCallback } from 'react';
import useSWR from 'swr';
import Header from '@/components/Header';
import ListingsTable from '@/components/ListingsTable';
import DonutChart from '@/components/DonutChart';
import RegionBarChart from '@/components/RegionBarChart';
import MonthlyTrend from '@/components/MonthlyTrend';
import LoadingSpinner from '@/components/LoadingSpinner';
import type { ApiResponse, Listing } from '@/lib/types';
import { getStatusKey } from '@/components/StatusBadge';

const fetcher = (url: string) => fetch(url).then(r => r.json());

const AREA_LABELS: Record<string, string> = {
  '100':'서울','200':'강원','300':'대전','312':'충남','338':'세종','360':'충북',
  '400':'인천','410':'경기','500':'광주','513':'전남','560':'전북',
  '600':'부산','621':'경남','680':'울산','690':'제주','700':'대구','712':'경북',
};

const DONUT_COLORS = ['var(--gold)','var(--gold-deep)','#B8953A','var(--sage-deep)','#A0A890','var(--closed)'];

const ChevIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="m9 6 6 6-6 6"/></svg>
);

export default function ListingsPage() {
  const [page,      setPage]      = useState(1);
  const [region,    setRegion]    = useState('');
  const [houseType, setHouseType] = useState('');
  const [search,    setSearch]    = useState('');
  const [inputVal,  setInputVal]  = useState('');
  const perPage = 20;

  // 필터 파라미터 조합
  const buildParams = useCallback((p = 1) => {
    const q = new URLSearchParams({ page: String(p), perPage: String(perPage) });
    if (region)    q.set('region', region);
    if (houseType) q.set('houseType', houseType);
    if (search)    q.set('search', search);
    return q.toString();
  }, [region, houseType, search]);

  const { data, isLoading } = useSWR<ApiResponse<Listing>>(
    `/api/listings?${buildParams(page)}`, fetcher
  );

  // 더 많은 데이터로 차트 계산 (페이지네이션과 별도로 100건 조회)
  const { data: chartData } = useSWR<ApiResponse<Listing>>(
    `/api/listings?${buildParams(1)}&perPage=100`, fetcher
  );

  const items = data?.items ?? [];
  const chartItems = chartData?.items ?? [];
  const matchCount = data?.matchCount ?? data?.totalCount ?? 0;
  const totalPages = Math.ceil(matchCount / perPage) || 1;

  // 지역별 분포
  const regionMap: Record<string, number> = {};
  chartItems.forEach(i => {
    const r = i.SUBSCRPT_AREA_CODE_NM ?? '기타';
    regionMap[r] = (regionMap[r] ?? 0) + 1;
  });
  const regionRows = Object.entries(regionMap).map(([r, v]) => ({ region: r, value: v }));

  // 주택구분 도넛
  const typeMap: Record<string, number> = {};
  chartItems.forEach(i => {
    const t = i.HOUSE_DTL_SECD_NM ?? '기타';
    typeMap[t] = (typeMap[t] ?? 0) + 1;
  });
  const typeSegments = Object.entries(typeMap).map(([label, value], idx) => ({
    label, value, color: DONUT_COLORS[idx % DONUT_COLORS.length],
  }));

  // 월별 공고 추이 (모집공고일 기준)
  const monthMap: Record<string, number> = {};
  chartItems.forEach(i => {
    const d = i.RCRIT_PBLANC_DE;
    if (!d) return;
    const ym = d.slice(0, 7); // YYYY-MM
    monthMap[ym] = (monthMap[ym] ?? 0) + 1;
  });
  const monthlyData = Object.entries(monthMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([label, value]) => ({ label: label.slice(5), value })); // MM만 표시

  // KPI
  const liveCount = items.filter(i => getStatusKey(i.RCEPT_BGNDE, i.RCEPT_ENDDE) === 'live').length;
  const totalUnits = chartItems.reduce((s, i) => s + (i.TOT_SUPLY_HSHLDCO ?? 0), 0);
  const mingyeongPct = chartItems.length
    ? Math.round(chartItems.filter(i => i.HOUSE_DTL_SECD_NM === '민영').length / chartItems.length * 100)
    : 0;

  const handleSearch = () => { setSearch(inputVal); setPage(1); };
  const handleRegion = (r: string) => { setRegion(r); setPage(1); };
  const handleType   = (t: string) => { setHouseType(t); setPage(1); };
  const handleReset  = () => { setRegion(''); setHouseType(''); setSearch(''); setInputVal(''); setPage(1); };

  return (
    <>
      <Header />
      <main style={{ flex: 1 }}>
        <div className="wrap">

          {/* 페이지 헤더 */}
          <div style={{ paddingTop: 24, paddingBottom: 16 }}>
            <div className="kr-eyebrow">분양 공고 현황</div>
            <h1 className="h-page" style={{ marginTop: 6 }}>분양정보</h1>
          </div>

          {/* KPI 카드 */}
          <div className="summary-grid" style={{ marginBottom: 24 }}>
            {[
              { label: '조회된 공고', value: matchCount, unit: '건', note: '필터 결과' },
              { label: '접수중',      value: liveCount,  unit: '개', note: '현재 청약 진행' },
              { label: '공급세대 합계', value: totalUnits, unit: '세대', note: '조회 기준' },
              { label: '민영 비율',   value: mingyeongPct, unit: '%', note: '민영 vs 국민' },
            ].map((c, i) => (
              <div key={i} className={`scard${i % 2 === 1 ? ' alt' : ''}`}>
                <div className="scard-label">{c.label}</div>
                <div className="scard-num num">{c.value.toLocaleString()}<small>{c.unit}</small></div>
                <div className="scard-foot" style={{ color: 'var(--ink-soft)', fontWeight: 400 }}>{c.note}</div>
              </div>
            ))}
          </div>

          {/* 필터 바 */}
          <div className="card card-pad" style={{ marginBottom: 20 }}>
            <div className="row" style={{ flexWrap: 'wrap', gap: 10 }}>
              {/* 지역 */}
              <select
                value={region}
                onChange={e => handleRegion(e.target.value)}
                style={{ padding: '7px 12px', borderRadius: 8, border: '1px solid var(--line-strong)', fontSize: 13, fontWeight: 700, color: 'var(--ink)', background: 'var(--card)', cursor: 'pointer' }}
              >
                <option value="">전체 지역</option>
                {Object.entries(AREA_LABELS).map(([, name]) => (
                  <option key={name} value={name}>{name}</option>
                ))}
              </select>

              {/* 주택구분 */}
              <select
                value={houseType}
                onChange={e => handleType(e.target.value)}
                style={{ padding: '7px 12px', borderRadius: 8, border: '1px solid var(--line-strong)', fontSize: 13, fontWeight: 700, color: 'var(--ink)', background: 'var(--card)', cursor: 'pointer' }}
              >
                <option value="">전체 유형</option>
                <option value="01">민영</option>
                <option value="03">국민</option>
              </select>

              {/* 검색 */}
              <div style={{ display: 'flex', gap: 6, flex: 1, minWidth: 200 }}>
                <input
                  type="text"
                  placeholder="단지명 검색..."
                  value={inputVal}
                  onChange={e => setInputVal(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSearch()}
                  style={{ flex: 1, padding: '7px 12px', borderRadius: 8, border: '1px solid var(--line-strong)', fontSize: 13, color: 'var(--ink)', background: 'var(--card)' }}
                />
                <button
                  onClick={handleSearch}
                  style={{ padding: '7px 16px', borderRadius: 8, background: 'var(--brown)', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}
                >
                  검색
                </button>
                {(region || houseType || search) && (
                  <button
                    onClick={handleReset}
                    style={{ padding: '7px 12px', borderRadius: 8, background: 'var(--sage-wash)', color: 'var(--brown-soft)', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}
                  >
                    초기화
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* 차트 3개 */}
          <div className="grid-3" style={{ marginBottom: 24 }}>
            <div className="card card-pad">
              <div className="panel-head" style={{ marginBottom: 16 }}>
                <h3 className="h-section" style={{ fontSize: 16 }}>지역별 공고 분포</h3>
              </div>
              <RegionBarChart rows={regionRows} valueLabel="건" highlight={region || undefined} maxRows={8} />
            </div>

            <div className="card card-pad">
              <div className="panel-head" style={{ marginBottom: 16 }}>
                <h3 className="h-section" style={{ fontSize: 16 }}>주택구분</h3>
              </div>
              <DonutChart
                segments={typeSegments}
                centerLabel={String(chartItems.length)}
                centerSub="개 단지"
                size={130}
              />
            </div>

            <div className="card card-pad">
              <div className="panel-head" style={{ marginBottom: 8 }}>
                <h3 className="h-section" style={{ fontSize: 16 }}>월별 공고 추이</h3>
              </div>
              <MonthlyTrend data={monthlyData} valueLabel="건" height={130} />
            </div>
          </div>

          {/* 테이블 */}
          <div className="card" style={{ overflow: 'hidden', marginBottom: 24 }}>
            <div className="panel-head" style={{ padding: '16px 22px 0' }}>
              <h3 className="h-section" style={{ fontSize: 16 }}>
                공고 목록{' '}
                <span style={{ fontSize: 13, color: 'var(--gold-deep)' }} className="num">{matchCount.toLocaleString()}건</span>
              </h3>
            </div>
            {isLoading ? <LoadingSpinner /> : <ListingsTable items={items} />}
          </div>

          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, paddingBottom: 32 }}>
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="region-chip"
                style={{ opacity: page === 1 ? 0.4 : 1 }}
              >
                이전
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const p = Math.max(1, Math.min(page - 2 + i, totalPages - 4 + i));
                return (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`region-chip${page === p ? ' on' : ''}`}
                  >
                    {p}
                  </button>
                );
              })}
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="region-chip"
                style={{ opacity: page === totalPages ? 0.4 : 1 }}
              >
                다음 <ChevIcon />
              </button>
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
