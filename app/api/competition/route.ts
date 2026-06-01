import { NextRequest } from 'next/server';
import { parseJsonResponse, parseXmlResponse } from '@/lib/parsers';
import type { CompetitionRate } from '@/lib/types';

const BASE_URL =
  'https://api.odcloud.kr/api/ApplyhomeInfoDetailSvc/v1/getAPTLttotPblancMdl';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const apiKey = process.env.COMPETITION_API_KEY;
  if (!apiKey) {
    return Response.json({ error: 'API 키가 설정되지 않았습니다.' }, { status: 500 });
  }

  const params = new URLSearchParams({
    serviceKey: apiKey,
    pageNo: searchParams.get('pageNo') ?? '1',
    numOfRows: searchParams.get('numOfRows') ?? '10',
    _type: 'json',
  });

  try {
    const res = await fetch(`${BASE_URL}?${params}`, {
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      return Response.json({ error: `upstream 오류: ${res.status}` }, { status: res.status });
    }

    const contentType = res.headers.get('content-type') ?? '';
    if (contentType.includes('xml')) {
      const xml = await res.text();
      return Response.json(parseXmlResponse<CompetitionRate>(xml));
    }

    const json = await res.json();
    return Response.json(parseJsonResponse<CompetitionRate>(json));
  } catch (err) {
    return Response.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}
