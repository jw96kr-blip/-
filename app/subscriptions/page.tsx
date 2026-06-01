'use client';

import { useState } from 'react';
import useSWR from 'swr';
import Header from '@/components/Header';
import WinnersTable from '@/components/WinnersTable';
import LoadingSpinner from '@/components/LoadingSpinner';
import type { ApiResponse, SubscriptionWinner } from '@/lib/types';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function SubscriptionsPage() {
  const [page, setPage] = useState(1);
  const numOfRows = 20;

  const { data, isLoading } = useSWR<ApiResponse<SubscriptionWinner>>(
    `/api/subscriptions?pageNo=${page}&numOfRows=${numOfRows}`,
    fetcher
  );

  const totalPages = data ? Math.ceil(data.totalCount / numOfRows) : 1;

  return (
    <>
      <Header />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8 space-y-6">
        <div>
          <h1 className="text-xl font-bold text-slate-800">청약 당첨자 정보</h1>
          <p className="text-sm text-slate-500 mt-1">
            총 {data?.totalCount?.toLocaleString() ?? '-'}건
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          {isLoading ? <LoadingSpinner /> : <WinnersTable items={data?.items ?? []} />}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 rounded-lg border border-slate-200 text-sm disabled:opacity-40 hover:bg-slate-50"
            >
              이전
            </button>
            <span className="px-4 py-2 text-sm text-slate-600">
              {page} / {totalPages}
            </span>
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
