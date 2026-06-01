import { NextRequest } from 'next/server';
import { parseJsonResponse, parseXmlResponse } from '@/lib/parsers';
import type { CompetitionRate } from '@/lib/types';

const BASE_URL = 'https://api.odcloud.kr/api/ApplyhomeInfoCmpetRtSvc/v1/getAPTLttotPblancCmpet';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const apiKey = process.env.COMPETITION_API_KEY;
  if (!apiKey) return Response.json({ error: 'API 키 없음' }, { status: 500 });

  const params = new URLSearchParams({
    serviceKey: apiKey,
    page:    searchParams.get('page') ?? searchParams.get('pageNo') ?? '1',
    perPage: searchParams.get('perPage') ?? searchParams.get('numOfRows') ?? '10',
    _type:   'json',
  });

  // 특정 단지 필터 (드릴다운용)
  const houseManageNo = searchParams.get('houseManageNo');
  const pblancNo      = searchParams.get('pblancNo');
  if (houseManageNo) params.set('cond[HOUSE_MANAGE_NO::EQ]', houseManageNo);
  if (pblancNo)      params.set('cond[PBLANC_NO::EQ]', pblancNo);

  // 거주구분 필터 (01=해당지역, 02=기타지역)
  const resideSecd = searchParams.get('resideSecd');
  if (resideSecd) params.set('cond[RESIDE_SECD::EQ]', resideSecd);

  try {
    const res = await fetch(`${BASE_URL}?${params}`, { next: { revalidate: 300 } });
    if (!res.ok) return Response.json({ error: `upstream: ${res.status}` }, { status: res.status });
    const ct = res.headers.get('content-type') ?? '';
    const json = ct.includes('xml') ? parseXmlResponse<CompetitionRate>(await res.text()) : parseJsonResponse<CompetitionRate>(await res.json());
    return Response.json(json);
  } catch {
    return Response.json({ error: '서버 오류' }, { status: 500 });
  }
}
