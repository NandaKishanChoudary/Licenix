import { CacheService } from './cache.service.js';
interface FetchOptions {
    ttl?: number;
    retries?: number;
    backoffMs?: number;
}
/**
 * Fetches live government data with fallback chain:
 * fresh cache → live fetch (retry w/ backoff) → stale cache → explicit "unavailable"
 */
export declare class GovernmentFetcherService {
    private cacheService;
    private readonly DEFAULT_TTL;
    private readonly DEFAULT_RETRIES;
    private readonly DEFAULT_BACKOFF;
    constructor(cacheService: CacheService);
    /**
     * Fetch data with fallback chain
     */
    fetch<T>(key: string, fetcher: () => Promise<T>, options?: FetchOptions): Promise<{
        data: T | null;
        source: 'fresh-cache' | 'live' | 'stale-cache' | 'unavailable';
    }>;
    /**
     * Mock fetcher for FSSAI license data
     */
    fetchFSSAIData(): Promise<any>;
    /**
     * Mock fetcher for GST data
     */
    fetchGSTData(): Promise<any>;
    /**
     * Mock fetcher for Fire Safety data
     */
    fetchFireSafetyData(): Promise<any>;
    /**
     * Mock fetcher for KSPCB data
     */
    fetchKSPCBData(): Promise<any>;
    /**
     * Get cost data with fallback
     */
    getCostData(licenseId: string, district: string): Promise<any>;
    /**
     * Get timeline data with fallback
     */
    getTimelineData(licenseId: string): Promise<any>;
}
export {};
//# sourceMappingURL=government-fetcher.service.d.ts.map