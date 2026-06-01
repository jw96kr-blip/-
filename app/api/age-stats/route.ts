import { NextRequest } from 'next/server';
import { parseJsonResponse } from '@/lib/parsers';

// 연령별 신청자 + 당첨자 통계를 함께 반환
const BASE_REQ  = 'https://api.odcloud.kr/api/ApplyhomeStatSvc/v1/getAPTReqstAgeStat';
const BASE_WIN  = 'https://api.odcloud.kr/api/ApplyhomeStatSvc/v1/getAPTPrzwnerAgeStat';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const apiKey = process.env.SUBSCRIPTION_API_KEY;
  if (!apiKey) return Response.json({ error: 'API 키 없음' }, { status: 500 });

  // 최근 6개월 기본값
  const now = new Date();
  const sixAgo = new Date(now.getFullYear(), now.getMonth() - 6, 1);
  const lte = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}`;
  const gte = `${sixAgo.getFullYear()}${String(sixAgo.getMonth() + 1).padStart(2, '0')}`;

  const makeParams = () => {
    const p = new URLSearchParams({
      serviceKey: apiKey,
      page: '1', perPage: '20', _type: 'json',
    });
    p.set('cond[STAT_DE::LTE]', searchParams.get('lte') ?? lte);
    p.set('cond[STAT_DE::GTE]', searchParams.get('gte') ?? gte);
    return p;
  };

  try {
    const [reqRes, winRes] = await Promise.all([
      fetch(`${BASE_REQ}?${makeParams()}`, { next: { revalidate: 3600 } }),
      fetch(`${BASE_WIN}?${makeParams()}`, { next: { revalidate: 3600 } }),
    ]);

    const [reqData, winData] = await Promise.all([
      reqRes.ok ? parseJsonResponse(await reqRes.json()) : { items: [] },
      winRes.ok ? parseJsonResponse(await winRes.json()) : { items: [] },
    ]);

    // 월별 집계 → 최신 월 1건씩 합산
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sumAge = (items: any[]) => items.reduce(
      (acc, r) => ({
        AGE_30: (acc.AGE_30 ?? 0) + (r.AGE_30 ?? 0),
        AGE_40: (acc.AGE_40 ?? 0) + (r.AGE_40 ?? 0),
        AGE_50: (acc.AGE_50 ?? 0) + (r.AGE_50 ?? 0),
        AGE_60: (acc.AGE_60 ?? 0) + (r.AGE_60 ?? 0),
      }),
      {}
    );

    return Response.json({
      applicants: sumAge(reqData.items),
      winners:    sumAge(winData.items),
      monthly: {
        applicants: reqData.items,
        winners:    winData.items,
      },
    });
  } catch {
    return Response.json({ error: '서버 오류' }, { status: 500 });
  }
}
