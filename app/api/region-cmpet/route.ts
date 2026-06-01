import { NextRequest } from 'next/server';
import { parseJsonResponse } from '@/lib/parsers';

// 지역별 청약 경쟁률 통계 (getAPTCmpetrtAreaStat)
const BASE_URL = 'https://api.odcloud.kr/api/ApplyhomeStatSvc/v1/getAPTCmpetrtAreaStat';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const apiKey = process.env.SUBSCRIPTION_API_KEY;
  if (!apiKey) return Response.json({ error: 'API 키 없음' }, { status: 500 });

  const now = new Date();
  const lte = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}`;
  const oneAgo = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const gte = `${oneAgo.getFullYear()}${String(oneAgo.getMonth() + 1).padStart(2, '0')}`;

  const params = new URLSearchParams({
    serviceKey: apiKey,
    page: '1', perPage: '30', _type: 'json',
  });
  params.set('cond[STAT_DE::LTE]', searchParams.get('lte') ?? lte);
  params.set('cond[STAT_DE::GTE]', searchParams.get('gte') ?? gte);
  const code = searchParams.get('areaCode');
  if (code) params.set('cond[SUBSCRPT_AREA_CODE::EQ]', code);

  try {
    const res = await fetch(`${BASE_URL}?${params}`, { next: { revalidate: 3600 } });
    if (!res.ok) return Response.json({ error: `upstream: ${res.status}` }, { status: res.status });
    return Response.json(parseJsonResponse(await res.json()));
  } catch {
    return Response.json({ error: '서버 오류' }, { status: 500 });
  }
}
