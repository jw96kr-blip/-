import { NextRequest } from 'next/server';
import { parseJsonResponse, parseXmlResponse } from '@/lib/parsers';
import type { ListingModel } from '@/lib/types';

// APT 분양정보 주택형별 상세조회 — LTTOT_TOP_AMOUNT(분양가) 포함
const BASE_URL = 'https://api.odcloud.kr/api/ApplyhomeInfoDetailSvc/v1/getAPTLttotPblancMdl';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const apiKey = process.env.LISTINGS_API_KEY;
  if (!apiKey) return Response.json({ error: 'API 키 없음' }, { status: 500 });

  const houseManageNo = searchParams.get('houseManageNo');
  const pblancNo      = searchParams.get('pblancNo');
  if (!houseManageNo) return Response.json({ error: 'houseManageNo 필수' }, { status: 400 });

  const params = new URLSearchParams({
    serviceKey: apiKey,
    page:       '1',
    perPage:    '20',
    _type:      'json',
  });
  if (houseManageNo) params.set('cond[HOUSE_MANAGE_NO::EQ]', houseManageNo);
  if (pblancNo)      params.set('cond[PBLANC_NO::EQ]', pblancNo!);

  try {
    const res = await fetch(`${BASE_URL}?${params}`, { next: { revalidate: 3600 } });
    if (!res.ok) return Response.json({ error: `upstream: ${res.status}` }, { status: res.status });
    const ct = res.headers.get('content-type') ?? '';
    const json = ct.includes('xml') ? parseXmlResponse<ListingModel>(await res.text()) : parseJsonResponse<ListingModel>(await res.json());
    return Response.json(json);
  } catch {
    return Response.json({ error: '서버 오류' }, { status: 500 });
  }
}
