'use client';

import { useState, useCallback } from 'react';
import useSWR from 'swr';
import Header from '@/components/Header';
import CompetitionBars from '@/components/CompetitionBars';
import SpecialSupplyBars from '@/components/SpecialSupplyBars';
import ScoreRangeBar from '@/components/ScoreRangeBar';
import LoadingSpinner from '@/components/LoadingSpinner';
import type { ApiResponse, Listing, CompetitionRate, SpecialSupply, WinningScore } from '@/lib/types';

const fetcher = (url: string) => fetch(url).then(r => r.json());

const SearchIcon = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.2-3.2"/></svg>;
const CloseIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>;

// 경쟁률 문자열 파싱 (숫자만 반환)
function parseRate(raw?: string): number {
  if (!raw) return 0;
  const n = parseFloat(raw);
  return isNaN(n) ? 0 : n;
}

export default function CompetitionPage() {
  const [searchInput,  setSearchInput]  = useState('');
  const [searchQuery,  setSearchQuery]  = useState('');
  const [selected,     setSelected]     = useState<Listing | null>(null);
  const [perPage] = useState(20);
  const [page,  setPage] = useState(1);

  // ── 단지 검색 ─────────────────────────────────────────────────────────────
  const { data: searchResults, isLoading: searchLoading } = useSWR<ApiResponse<Listing>>(
    searchQuery ? `/api/listings?search=${encodeURIComponent(searchQuery)}&perPage=8` : null,
    fetcher
  );

  const handleSearch = () => { setSearchQuery(searchInput); setSelected(null); };
  const handleSelect = (item: Listing) => { setSelected(item); setSearchQuery(''); setSearchInput(''); };
  const handleClear  = () => { setSelected(null); setSearchQuery(''); setSearchInput(''); };

  // ── 선택된 단지 데이터 ──────────────────────────────────────────────────────
  const houseNo = selected?.HOUSE_MANAGE_NO;

  const { data: unitCmpet, isLoading: cmpLoading } = useSWR<ApiResponse<CompetitionRate>>(
    houseNo ? `/api/competition?houseManageNo=${houseNo}&perPage=30` : null, fetcher
  );
  const { data: unitScore, isLoading: scoreLoading } = useSWR<ApiResponse<WinningScore>>(
    houseNo ? `/api/apt-score?houseManageNo=${houseNo}&perPage=30` : null, fetcher
  );
  const { data: unitSpec, isLoading: specLoading } = useSWR<ApiResponse<SpecialSupply>>(
    houseNo ? `/api/special-supply?houseManageNo=${houseNo}&perPage=30` : null, fetcher
  );

  // ── 전체 경쟁률 (단지 미선택 시) ─────────────────────────────────────────
  const { data: allCmpet, isLoading: allLoading } = useSWR<ApiResponse<CompetitionRate>>(
    !houseNo ? `/api/competition?page=${page}&perPage=${perPage}` : null, fetcher
  );
  const { data: allSpec } = useSWR<ApiResponse<SpecialSupply>>(
    !houseNo ? `/api/special-supply?page=${page}&perPage=${perPage}` : null, fetcher
  );

  // ── 드릴다운 차트 데이터 계산 ─────────────────────────────────────────────
  const cmpetItems = unitCmpet?.items ?? [];
  const scoreItems = unitScore?.items ?? [];
  const specItems  = unitSpec?.items  ?? [];

  // 1순위 해당지역만, 경쟁률 높은 순으로
  const rank1Items = cmpetItems
    .filter(i => i.SUBSCRPT_RANK_CODE === 1 && i.RESIDE_SECD === '01')
    .filter(i => parseRate(i.CMPET_RATE) > 0);

  // 평형별 가점 (1순위 해당지역)
  const scoreRows = scoreItems
    .filter(i => i.RESIDE_SECD === '01' || !i.RESIDE_SECD)
    .map(i => ({
      label: i.HOUSE_TY ?? '-',
      min:   parseFloat(i.LWET_SCORE ?? '') || undefined,
      avg:   parseFloat(i.AVRG_SCORE ?? '') || undefined,
      max:   parseFloat(i.TOP_SCORE  ?? '') || undefined,
    }))
    .filter(r => r.avg != null)
    .slice(0, 8);

  // 평균 경쟁률
  const avgRate = rank1Items.length
    ? (rank1Items.reduce((s, i) => s + parseRate(i.CMPET_RATE), 0) / rank1Items.length).toFixed(1)
    : '-';
  const maxRate = rank1Items.length
    ? Math.max(...rank1Items.map(i => parseRate(i.CMPET_RATE))).toFixed(1)
    : '-';

  const totalPages = Math.ceil((allCmpet?.matchCount ?? allCmpet?.totalCount ?? 0) / perPage) || 1;

  return (
    <>
      <Header />
      <main style={{ flex: 1 }}>
        <div className="wrap">

          {/* 페이지 헤더 */}
          <div style={{ paddingTop: 24, paddingBottom: 20 }}>
            <div className="kr-eyebrow">청약접수 경쟁률 · 특별공급 신청현황</div>
            <h1 className="h-page" style={{ marginTop: 6 }}>경쟁률 분석</h1>
          </div>

          {/* ── 단지 검색 바 ─────────────────────────────────────────── */}
          <div className="card card-pad" style={{ marginBottom: 20 }}>
            <div className="panel-head" style={{ marginBottom: 12 }}>
              <h3 className="h-section" style={{ fontSize: 15 }}>단지별 상세 조회</h3>
              {selected && (
                <button onClick={handleClear} style={{ display:'flex', alignItems:'center', gap:4, fontSize:13, fontWeight:700, color:'var(--brown-soft)', background:'none', cursor:'pointer' }}>
                  <CloseIcon /> 선택 해제
                </button>
              )}
            </div>

            {selected ? (
              /* 선택된 단지 정보 */
              <div style={{ background:'var(--gold-wash)', borderRadius:10, padding:'12px 16px' }}>
                <div className="row" style={{ gap:10, flexWrap:'wrap' }}>
                  <span className={`tag ${selected.SUBSCRPT_AREA_CODE_NM === '서울' ? 'seoul' : selected.SUBSCRPT_AREA_CODE_NM === '경기' || selected.SUBSCRPT_AREA_CODE_NM === '인천' ? 'metro' : 'local'}`}>
                    {selected.SUBSCRPT_AREA_CODE_NM}
                  </span>
                  <span style={{ fontWeight:700, fontSize:15, color:'var(--brown)' }}>{selected.HOUSE_NM}</span>
                  {selected.TOT_SUPLY_HSHLDCO && (
                    <span style={{ fontSize:13, color:'var(--ink-soft)' }}>{selected.TOT_SUPLY_HSHLDCO.toLocaleString()}세대</span>
                  )}
                  {selected.RCEPT_BGNDE && (
                    <span style={{ fontSize:13, color:'var(--ink-soft)' }}>접수 {selected.RCEPT_BGNDE} ~ {selected.RCEPT_ENDDE}</span>
                  )}
                </div>
              </div>
            ) : (
              /* 검색 입력 */
              <div style={{ position:'relative' }}>
                <div style={{ display:'flex', gap:8 }}>
                  <div style={{ flex:1, position:'relative' }}>
                    <input
                      type="text"
                      placeholder="단지명으로 검색 (예: e편한세상, 자이, 힐스테이트...)"
                      value={searchInput}
                      onChange={e => setSearchInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleSearch()}
                      style={{ width:'100%', padding:'9px 12px 9px 36px', borderRadius:8, border:'1px solid var(--line-strong)', fontSize:13, color:'var(--ink)', background:'var(--card)' }}
                    />
                    <span style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)', color:'var(--ink-soft)' }}><SearchIcon /></span>
                  </div>
                  <button
                    onClick={handleSearch}
                    style={{ padding:'9px 20px', borderRadius:8, background:'var(--brown)', color:'#fff', fontSize:13, fontWeight:700, cursor:'pointer' }}
                  >
                    검색
                  </button>
                </div>

                {/* 검색 결과 드롭다운 */}
                {searchQuery && (
                  <div style={{ position:'absolute', top:'100%', left:0, right:0, background:'var(--card)', border:'1px solid var(--line-strong)', borderRadius:10, boxShadow:'0 8px 24px rgba(0,0,0,.1)', zIndex:50, overflow:'hidden', marginTop:4 }}>
                    {searchLoading ? (
                      <div style={{ padding:16, textAlign:'center', color:'var(--ink-soft)', fontSize:13 }}>검색 중...</div>
                    ) : !searchResults?.items.length ? (
                      <div style={{ padding:16, textAlign:'center', color:'var(--ink-soft)', fontSize:13 }}>검색 결과 없음</div>
                    ) : (
                      searchResults.items.map(item => (
                        <button key={item.HOUSE_MANAGE_NO} onClick={() => handleSelect(item)}
                          style={{ width:'100%', padding:'10px 16px', textAlign:'left', display:'flex', justifyContent:'space-between', alignItems:'center', background:'none', cursor:'pointer', borderBottom:'1px solid var(--line)', fontSize:13 }}
                          onMouseEnter={e => (e.currentTarget.style.background = 'var(--gold-wash)')}
                          onMouseLeave={e => (e.currentTarget.style.background = 'none')}
                        >
                          <span style={{ fontWeight:700, color:'var(--ink)' }}>{item.HOUSE_NM}</span>
                          <span style={{ color:'var(--ink-soft)', fontSize:12 }}>{item.SUBSCRPT_AREA_CODE_NM} · {item.TOT_SUPLY_HSHLDCO?.toLocaleString()}세대</span>
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── 선택된 단지 드릴다운 ──────────────────────────────── */}
          {selected ? (
            <div style={{ display:'flex', flexDirection:'column', gap:20, marginBottom:32 }}>
              {/* KPI */}
              <div className="summary-grid">
                {[
                  { label:'평형 수',    value: rank1Items.length, unit:'개', note:'1순위 기준' },
                  { label:'평균 경쟁률', value: avgRate, unit:':1', note:'1순위 해당지역' },
                  { label:'최고 경쟁률', value: maxRate, unit:':1', note:'1순위 해당지역' },
                  { label:'특공 평형',  value: specItems.filter(i => (i.SPSPLY_HSHLDCO ?? 0) > 0).length, unit:'개', note:'특별공급 있는 유형' },
                ].map((c, i) => (
                  <div key={i} className={`scard${i % 2 === 1 ? ' alt' : ''}`}>
                    <div className="scard-label">{c.label}</div>
                    <div className="scard-num num">{c.value}<small>{c.unit}</small></div>
                    <div className="scard-foot" style={{ color:'var(--ink-soft)', fontWeight:400 }}>{c.note}</div>
                  </div>
                ))}
              </div>

              <div className="grid-2">
                {/* 평형별 경쟁률 */}
                <div className="card card-pad">
                  <div className="panel-head"><h3 className="h-section" style={{ fontSize:16 }}>평형별 경쟁률 (1순위)</h3></div>
                  {cmpLoading ? <LoadingSpinner /> : (
                    <CompetitionBars items={rank1Items.map(i => ({
                      ...i, PBLANC_NO: i.HOUSE_TY, CMPET_RATE: i.CMPET_RATE,
                    }))} labelKey="HOUSE_TY" />
                  )}
                </div>

                {/* 가점 분포 */}
                <div className="card card-pad">
                  <div className="panel-head"><h3 className="h-section" style={{ fontSize:16 }}>평형별 당첨가점</h3></div>
                  {scoreLoading ? <LoadingSpinner /> : scoreRows.length ? (
                    <ScoreRangeBar rows={scoreRows} />
                  ) : (
                    <p style={{ textAlign:'center', color:'var(--ink-soft)', fontSize:13, padding:'24px 0' }}>가점 데이터 없음</p>
                  )}
                </div>
              </div>

              {/* 특별공급 현황 */}
              <div className="card card-pad">
                <div className="panel-head"><h3 className="h-section" style={{ fontSize:16 }}>특별공급 신청현황</h3></div>
                {specLoading ? <LoadingSpinner /> : <SpecialSupplyBars items={specItems} />}
              </div>
            </div>

          ) : (
            /* ── 전체 경쟁률 (미선택 시) ─────────────────────────── */
            <div style={{ display:'flex', flexDirection:'column', gap:20, marginBottom:32 }}>
              <div className="grid-2">
                <div className="card card-pad">
                  <div className="panel-head">
                    <h3 className="h-section" style={{ fontSize:16 }}>실시간 경쟁률 TOP 10</h3>
                    <span style={{ fontSize:12, color:'var(--ink-soft)' }} className="num">
                      전체 {(allCmpet?.matchCount ?? allCmpet?.totalCount ?? 0).toLocaleString()}건
                    </span>
                  </div>
                  {allLoading ? <LoadingSpinner /> : <CompetitionBars items={allCmpet?.items ?? []} />}
                </div>

                <div className="card card-pad">
                  <div className="panel-head"><h3 className="h-section" style={{ fontSize:16 }}>특별공급 현황</h3></div>
                  <SpecialSupplyBars items={allSpec?.items ?? []} />
                </div>
              </div>

              {/* 페이지네이션 */}
              {totalPages > 1 && (
                <div style={{ display:'flex', justifyContent:'center', gap:8 }}>
                  <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page===1} className="region-chip" style={{ opacity: page===1 ? 0.4:1 }}>이전</button>
                  <span className="region-chip on">{page} / {totalPages}</span>
                  <button onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={page===totalPages} className="region-chip" style={{ opacity: page===totalPages ? 0.4:1 }}>다음</button>
                </div>
              )}
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
