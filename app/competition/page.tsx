'use client';

import { useState } from 'react';
import useSWR from 'swr';
import Header from '@/components/Header';
import CompetitionRateChart from '@/components/CompetitionRateChart';
import SpecialSupplyTable from '@/components/SpecialSupplyTable';
import LoadingSpinner from '@/components/LoadingSpinner';
import type { ApiResponse, CompetitionRate, SpecialSupply } from '@/lib/types';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function CompetitionPage() {
  const [page, setPage] = useState(1);
  const numOfRows = 20;

  const { data: compData, isLoading: compLoading } = useSWR<ApiResponse<CompetitionRate>>(
    `/api/competition?pageNo=${page}&numOfRows=${numOfRows}`,
    fetcher
  );
  const { data: spData, isLoading: spLoading } = useSWR<ApiResponse<SpecialSupply>>(
    `/api/special-supply?pageNo=${page}&numOfRows=${numOfRows}`,
    fetcher
  );

  const totalPages = compData ? Math.ceil(compData.totalCount / numOfRows) : 1;

  return (
    <>
      <Header />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8 space-y-8">
        <div>
          <h1 className="text-xl font-bold text-slate-800">청약 경쟁률</h1>
          <p className="text-sm text-slate-500 mt-1">총 {compData?.totalCount?.toLocaleString() ?? '-'}건</p>
        </div>

        <section className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-slate-700">경쟁률 차트 (상위 10건)</h2>
          </div>
          <div className="px-6 py-4">
            {compLoading ? (
              <LoadingSpinner />
            ) : (
              <CompetitionRateChart items={compData?.items ?? []} />
            )}
          </div>
        </section>

        <section className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-slate-700">특별공급 신청현황</h2>
          </div>
          {spLoading ? <LoadingSpinner /> : <SpecialSupplyTable items={spData?.items ?? []} />}
        </section>

        {totalPages > 1 && (
          <div className="flex justify-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 rounded-lg border border-slate-200 text-sm disabled:opacity-40 hover:bg-slate-50"
            >
              이전
            </button>
            <span className="px-4 py-2 text-sm text-slate-600">{page} / {totalPages}</span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 rounded-lg border border-slate-200 text-sm disabled:opacity-40 hover:bg-slate-50"
            >
              다음
            </button>
          </div>
        )}
      </main>
    </>
  );
}
