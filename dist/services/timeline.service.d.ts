import { GovernmentFetcherService } from './government-fetcher.service.js';
import { LicenseService } from './license.service.js';
import type { BusinessAnalysis, TimelineBreakdown, TimelineEstimate } from '../types/index.js';
/**
 * Estimates licensing timelines for any business sector in Kerala
 */
export declare class TimelineService {
    private governmentFetcher;
    private licenseService;
    constructor(governmentFetcher: GovernmentFetcherService, licenseService: LicenseService);
    /**
     * Estimate timelines for all required licenses
     */
    estimate(analysis: BusinessAnalysis): Promise<TimelineEstimate>;
    /**
     * Get timeline for a specific license
     */
    getTimelineForLicense(licenseId: string): Promise<TimelineBreakdown | null>;
    /**
     * Calculate total duration from component durations
     */
    private calculateTotalDuration;
}
//# sourceMappingURL=timeline.service.d.ts.map