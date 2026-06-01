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
  const body = (json as any)?.response?.body;
  const items = normalizeItems<T>(body?.items?.item);
  return {
    items,
    totalCount: body?.totalCount ?? 0,
    pageNo: body?.pageNo ?? 1,
    numOfRows: body?.numOfRows ?? 10,
  };
}
