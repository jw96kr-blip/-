import { NextRequest } from 'next/server';
import { parseJsonResponse, parseXmlResponse } from '@/lib/parsers';
import type { WinningScore } from '@/lib/types';

// APT 분양정보 당첨가점 조회 (최저/평균/최고 가점)
const BASE_URL = 'https://api.odcloud.kr/api/ApplyhomeInfoCmpetRtSvc/v1/getAptLttotPblancScore';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const apiKey = process.env.COMPETITION_API_KEY;
  if (!apiKey) return Response.json({ error: 'API 키 없음' }, { status: 500 });

  const params = new URLSearchParams({
    serviceKey: apiKey,
    page:       searchParams.get('page') ?? '1',
    perPage:    searchParams.get('perPage') ?? '10',
    _type:      'json',
  });
  const houseManageNo = searchParams.get('houseManageNo');
  const pblancNo      = searchParams.get('pblancNo');
  if (houseManageNo) params.set('cond[HOUSE_MANAGE_NO::EQ]', houseManageNo);
  if (pblancNo)      params.set('cond[PBLANC_NO::EQ]', pblancNo);

  try {
    const res = await fetch(`${BASE_URL}?${params}`, { next: { revalidate: 3600 } });
    if (!res.ok) return Response.json({ error: `upstream: ${res.status}` }, { status: res.status });
    const ct = res.headers.get('content-type') ?? '';
    const json = ct.includes('xml') ? parseXmlResponse<WinningScore>(await res.text()) : parseJsonResponse<WinningScore>(await res.json());
    return Response.json(json);
  } catch {
    return Response.json({ error: '서버 오류' }, { status: 500 });
  }
}
