import { OccupationDetails } from '@/types/onet';

const CACHE_DURATION = 1000 * 60 * 5; // 5 minutes

interface CacheItem {
  data: OccupationDetails;
  timestamp: number;
}

const cache: Map<string, CacheItem> = new Map();

export function getCachedOccupation(code: string): OccupationDetails | null {
  const item = cache.get(code);
  if (item && Date.now() - item.timestamp < CACHE_DURATION) {
    return item.data;
  }
  return null;
}

export function setCachedOccupation(code: string, data: OccupationDetails): void {
  cache.set(code, { data, timestamp: Date.now() });
}