import { CacheService } from './cache.service.js';
/**
 * Validates URLs against an allowlist of official government domains
 * and checks basic reachability via HTTP HEAD requests.
 */
export declare class LinkValidatorService {
    private cacheService;
    private readonly ALLOWED_DOMAINS;
    private readonly REQUEST_TIMEOUT_MS;
    constructor(cacheService: CacheService);
    /**
     * Check if a URL is from an allowed government domain
     */
    isAllowedDomain(url: string): boolean;
    /**
     * Validate a URL (domain check + reachability via HEAD request)
     */
    validateUrl(url: string): Promise<{
        verified: boolean;
        url: string;
        reason?: string;
    }>;
    /**
     * Batch validate multiple URLs
     */
    validateUrls(urls: string[]): Promise<Array<{
        verified: boolean;
        url: string;
        reason?: string;
    }>>;
    private checkReachability;
}
//# sourceMappingURL=link-validator.service.d.ts.map