import { NextRequest } from 'next/server';

/**
 * GET /api/apt-image?url=<hmpgAdres>&q=<houseNm>
 *
 * 1. 단지 홈페이지(hmpgAdres)에서 og:image 메타태그를 추출
 * 2. 실패 시 Naver 이미지 검색 URL 반환
 * 3. 응답: { imageUrl: string | null, searchUrl: string }
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const hmpgUrl   = searchParams.get('url');
  const houseNm   = searchParams.get('q') ?? '';

  const naverSearchUrl = `https://search.naver.com/search.naver?where=image&query=${encodeURIComponent(houseNm + ' 아파트 조감도')}`;
  const googleSearchUrl = `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(houseNm + ' 아파트 투시도')}`;

  // 단지 홈페이지가 없으면 검색 URL만 반환
  if (!hmpgUrl) {
    return Response.json({ imageUrl: null, naverSearchUrl, googleSearchUrl });
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const res = await fetch(hmpgUrl, {
      signal: controller.signal,
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1)' },
      next: { revalidate: 86400 }, // 1일 캐시
    });
    clearTimeout(timeout);

    if (!res.ok) {
      return Response.json({ imageUrl: null, naverSearchUrl, googleSearchUrl });
    }

    const html = await res.text();

    // og:image 추출
    const ogMatch = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i)
                 ?? html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);

    let imageUrl: string | null = null;
    if (ogMatch?.[1]) {
      let url = ogMatch[1];
      // 상대 경로 → 절대 경로
      if (url.startsWith('//')) url = 'https:' + url;
      else if (url.startsWith('/')) {
        const base = new URL(hmpgUrl);
        url = `${base.protocol}//${base.host}${url}`;
      }
      imageUrl = url;
    }

    return Response.json({ imageUrl, naverSearchUrl, googleSearchUrl });
  } catch {
    return Response.json({ imageUrl: null, naverSearchUrl, googleSearchUrl });
  }
}
