import type { ApiResponse, Listing, CompetitionRate, SpecialSupply, SubscriptionWinner } from './types';

async function fetchApi<T>(path: string, params?: Record<string, string>): Promise<ApiResponse<T>> {
  const searchParams = new URLSearchParams(params);
  const res = await fetch(`/api/${path}?${searchParams}`);
  if (!res.ok) throw new Error(`API 오류: ${res.status}`);
  return res.json();
}

export const apiClient = {
  getListings: (params?: Record<string, string>) =>
    fetchApi<Listing>('listings', params),

  getCompetition: (params?: Record<string, string>) =>
    fetchApi<CompetitionRate>('competition', params),

  getSpecialSupply: (params?: Record<string, string>) =>
    fetchApi<SpecialSupply>('special-supply', params),

  getWinners: (params?: Record<string, string>) =>
    fetchApi<SubscriptionWinner>('subscriptions', params),
};
