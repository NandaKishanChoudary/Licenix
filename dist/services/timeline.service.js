var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@nitrostack/core';
import { GovernmentFetcherService } from './government-fetcher.service.js';
import { LicenseService } from './license.service.js';
/**
 * Estimates licensing timelines for any business sector in Kerala
 */
let TimelineService = class TimelineService {
    governmentFetcher;
    licenseService;
    constructor(governmentFetcher, licenseService) {
        this.governmentFetcher = governmentFetcher;
        this.licenseService = licenseService;
    }
    /**
     * Estimate timelines for all required licenses
     */
    async estimate(analysis) {
        if (!analysis.supported || !analysis.businessCategory) {
            return {
                supported: false,
                message: 'Business is not supported',
                overallDuration: 'unavailable'
            };
        }
        const licenses = await this.licenseService.discover(analysis);
        const timelineBreakdown = [];
        for (const license of licenses) {
            const timelineData = await this.governmentFetcher.getTimelineData(license.id);
            const applicationProcessing = timelineData.data?.applicationProcessing || 'unavailable';
            const inspectionDuration = timelineData.data?.inspectionDuration || 'unavailable';
            const approvalDuration = timelineData.data?.approvalDuration || 'unavailable';
            timelineBreakdown.push({
                licenseId: license.id,
                licenseName: license.name,
                applicationProcessing,
                inspectionDuration,
                approvalDuration,
                totalDuration: this.calculateTotalDuration(applicationProcessing, inspectionDuration, approvalDuration),
                notes: `Estimated timeline for ${license.name}`
            });
        }
        return {
            supported: true,
            timelineBreakdown,
            overallDuration: '2-4 months (estimated for all licenses)'
        };
    }
    /**
     * Get timeline for a specific license
     */
    async getTimelineForLicense(licenseId) {
        const license = await this.licenseService.getLicenseById(licenseId);
        if (!license)
            return null;
        const timelineData = await this.governmentFetcher.getTimelineData(licenseId);
        const applicationProcessing = timelineData.data?.applicationProcessing || 'unavailable';
        const inspectionDuration = timelineData.data?.inspectionDuration || 'unavailable';
        const approvalDuration = timelineData.data?.approvalDuration || 'unavailable';
        return {
            licenseId,
            licenseName: license.name,
            applicationProcessing,
            inspectionDuration,
            approvalDuration,
            totalDuration: this.calculateTotalDuration(applicationProcessing, inspectionDuration, approvalDuration),
            notes: `Estimated timeline for ${license.name}`
        };
    }
    /**
     * Calculate total duration from component durations
     */
    calculateTotalDuration(applicationProcessing, inspectionDuration, approvalDuration) {
        // If any component is unavailable, return unavailable
        if (applicationProcessing === 'unavailable' ||
            inspectionDuration === 'unavailable' ||
            approvalDuration === 'unavailable') {
            return 'unavailable';
        }
        // Try to parse and sum durations (simplified - assumes "X-Y days" format)
        try {
            const parseMax = (str) => {
                const match = str.match(/(\d+)/g);
                return match ? Math.max(...match.map(Number)) : 0;
            };
            const appMax = parseMax(String(applicationProcessing));
            const inspMax = parseMax(String(inspectionDuration));
            const approvMax = parseMax(String(approvalDuration));
            const totalDays = appMax + inspMax + approvMax;
            const weeks = Math.ceil(totalDays / 7);
            if (weeks <= 4) {
                return `${weeks} weeks`;
            }
            else {
                const months = Math.ceil(weeks / 4);
                return `${months} month${months > 1 ? 's' : ''}`;
            }
        }
        catch {
            return 'unavailable';
        }
    }
};
TimelineService = __decorate([
    Injectable({ deps: [GovernmentFetcherService, LicenseService] }),
    __metadata("design:paramtypes", [GovernmentFetcherService,
        LicenseService])
], TimelineService);
export { TimelineService };
//# sourceMappingURL=timeline.service.js.map