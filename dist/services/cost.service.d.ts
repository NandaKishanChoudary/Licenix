import { GovernmentFetcherService } from './government-fetcher.service.js';
import { LicenseService } from './license.service.js';
import type { BusinessAnalysis, CostBreakdown, CostEstimate } from '../types/index.js';
/**
 * Estimates licensing costs for any business sector in Kerala
 */
export declare class CostService {
    private governmentFetcher;
    private licenseService;
    constructor(governmentFetcher: GovernmentFetcherService, licenseService: LicenseService);
    /**
     * Estimate costs for all licenses required for a business
     */
    estimate(analysis: BusinessAnalysis): Promise<CostEstimate>;
    /**
     * Get cost for a specific license
     */
    getCostForLicense(licenseId: string, district: string): Promise<CostBreakdown | null>;
}
//# sourceMappingURL=cost.service.d.ts.map