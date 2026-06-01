import { NextRequest } from 'next/server';
import { parseJsonResponse, parseXmlResponse } from '@/lib/parsers';
import type { Listing } from '@/lib/types';

const BASE_URL = 'https://api.odcloud.kr/api/ApplyhomeInfoDetailSvc/v1/getAPTLttotPblancDetail';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const apiKey = process.env.LISTINGS_API_KEY;
  if (!apiKey) return Response.json({ error: 'API 키 없음' }, { status: 500 });

  const params = new URLSearchParams({
    serviceKey: apiKey,
    page:    searchParams.get('page') ?? searchParams.get('pageNo') ?? '1',
    perPage: searchParams.get('perPage') ?? searchParams.get('numOfRows') ?? '10',
    _type:   'json',
  });

  // 지역 필터 (시도코드명 또는 코드)
  const region = searchParams.get('region');        // 예: 서울, 경기, 인천
  const regionCode = searchParams.get('regionCode'); // 예: 100, 410
  if (region)     params.set('cond[SUBSCRPT_AREA_CODE_NM::EQ]', region);
  if (regionCode) params.set('cond[SUBSCRPT_AREA_CODE::EQ]', regionCode);

  // 주택구분 (민영=01, 국민=03)
  const houseType = searchParams.get('houseType');
  if (houseType) params.set('cond[HOUSE_DTL_SECD::EQ]', houseType);

  // 기간 필터 (모집공고일 기준)
  const from = searchParams.get('from');
  const to   = searchParams.get('to');
  if (from) params.set('cond[RCRIT_PBLANC_DE::GTE]', from);
  if (to)   params.set('cond[RCRIT_PBLANC_DE::LTE]', to);

  // 주택명 검색
  const search = searchParams.get('search');
  if (search) params.set('cond[HOUSE_NM::LIKE]', search);

  // 공급지역 주소 검색
  const addr = searchParams.get('addr');
  if (addr) params.set('cond[HSSPLY_ADRES::LIKE]', addr);

  try {
    const res = await fetch(`${BASE_URL}?${params}`, { next: { revalidate: 300 } });
    if (!res.ok) return Response.json({ error: `upstream: ${res.status}` }, { status: res.status });
    const ct = res.headers.get('content-type') ?? '';
    const json = ct.includes('xml') ? parseXmlResponse<Listing>(await res.text()) : parseJsonResponse<Listing>(await res.json());
    return Response.json(json);
  } catch {
    return Response.json({ error: '서버 오류' }, { status: 500 });
  }
}
