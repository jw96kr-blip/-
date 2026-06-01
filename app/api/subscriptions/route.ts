import { NextRequest } from 'next/server';
import { parseJsonResponse, parseXmlResponse } from '@/lib/parsers';
import type { SubscriptionWinner } from '@/lib/types';

// 지역별 청약 가점제 당첨자 정보 (평균/최고/최저 가점 포함)
const BASE_URL = 'https://api.odcloud.kr/api/ApplyhomeStatSvc/v1/getAPTApsPrzwnerStat';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const apiKey = process.env.SUBSCRIPTION_API_KEY;
  if (!apiKey) return Response.json({ error: 'API 키 없음' }, { status: 500 });

  // 최근 6개월 데이터 조회
  const now = new Date();
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, 1);
  const gteYm = `${sixMonthsAgo.getFullYear()}${String(sixMonthsAgo.getMonth() + 1).padStart(2, '0')}`;
  const lteYm = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}`;

  const params = new URLSearchParams({
    serviceKey: apiKey,
    page:       searchParams.get('page') ?? '1',
    perPage:    searchParams.get('perPage') ?? '10',
    _type:      'json',
  });
  params.set('cond[STAT_DE::LTE]', lteYm);
  params.set('cond[STAT_DE::GTE]', gteYm);

  // 특정 지역 필터
  const areaCode = searchParams.get('subscrpt_area_code');
  if (areaCode) params.set('cond[SUBSCRPT_AREA_CODE::EQ]', areaCode);

  try {
    const res = await fetch(`${BASE_URL}?${params}`, { next: { revalidate: 3600 } });
    if (!res.ok) return Response.json({ error: `upstream: ${res.status}` }, { status: res.status });
    const ct = res.headers.get('content-type') ?? '';
    const json = ct.includes('xml') ? parseXmlResponse<SubscriptionWinner>(await res.text()) : parseJsonResponse<SubscriptionWinner>(await res.json());
    return Response.json(json);
  } catch {
    return Response.json({ error: '서버 오류' }, { status: 500 });
  }
}
