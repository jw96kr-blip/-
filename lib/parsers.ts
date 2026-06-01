import { XMLParser } from 'fast-xml-parser';
import type { ApiResponse } from './types';

// data.go.kr quirk: single result returns object instead of array
export function normalizeItems<T>(raw: T | T[] | undefined): T[] {
  if (!raw) return [];
  return Array.isArray(raw) ? raw : [raw];
}

const xmlParser = new XMLParser({ ignoreAttributes: false, parseTagValue: true });

export function parseXmlResponse<T>(xml: string): ApiResponse<T> {
  const parsed = xmlParser.parse(xml);
  const body = parsed?.response?.body;
  const items = normalizeItems<T>(body?.items?.item);
  return {
    items,
    totalCount: body?.totalCount ?? 0,
    pageNo: body?.pageNo ?? 1,
    numOfRows: body?.numOfRows ?? 10,
  };
}

export function parseJsonResponse<T>(json: unknown): ApiResponse<T> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const raw = json as any;

  // odcloud.kr 직접 포맷: { data: [], totalCount, page, perPage }
  if (raw?.data !== undefined) {
    return {
      items: normalizeItems<T>(raw.data),
      totalCount: raw.totalCount ?? 0,
      pageNo: raw.page ?? 1,
      numOfRows: raw.perPage ?? 10,
    };
  }

  // 표준 data.go.kr 포맷: { response: { body: { items: { item: [] } } } }
  const body = raw?.response?.body;
  return {
    items: normalizeItems<T>(body?.items?.item),
    totalCount: body?.totalCount ?? 0,
    pageNo: body?.pageNo ?? 1,
    numOfRows: body?.numOfRows ?? 10,
  };
}
