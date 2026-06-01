import { XMLParser } from 'fast-xml-parser';
import type { ApiResponse } from './types';

export function normalizeItems<T>(raw: T | T[] | undefined): T[] {
  if (!raw) return [];
  return Array.isArray(raw) ? raw : [raw];
}

const xmlParser = new XMLParser({ ignoreAttributes: false, parseTagValue: true });

export function parseXmlResponse<T>(xml: string): ApiResponse<T> {
  const parsed = xmlParser.parse(xml);
  const body = parsed?.response?.body;
  const items = normalizeItems<T>(body?.items?.item);
  const total = body?.totalCount ?? 0;
  return {
    items,
    totalCount: total,
    matchCount: body?.matchCount ?? total,
    pageNo: body?.pageNo ?? 1,
    numOfRows: body?.numOfRows ?? 10,
  };
}

export function parseJsonResponse<T>(json: unknown): ApiResponse<T> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const raw = json as any;

  // odcloud.kr 직접 포맷: { data: [], totalCount, matchCount, page, perPage }
  if (raw?.data !== undefined) {
    return {
      items: normalizeItems<T>(raw.data),
      totalCount: raw.totalCount ?? 0,
      matchCount: raw.matchCount ?? raw.totalCount ?? 0, // ★ 필터 결과 수
      pageNo: raw.page ?? 1,
      numOfRows: raw.perPage ?? 10,
    };
  }

  // 표준 data.go.kr 포맷
  const body = raw?.response?.body;
  const total = body?.totalCount ?? 0;
  return {
    items: normalizeItems<T>(body?.items?.item),
    totalCount: total,
    matchCount: body?.matchCount ?? total,
    pageNo: body?.pageNo ?? 1,
    numOfRows: body?.numOfRows ?? 10,
  };
}
