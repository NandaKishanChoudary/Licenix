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
 * Estimates licensing costs for any business sector in Kerala
 */
let CostService = class CostService {
    governmentFetcher;
    licenseService;
    constructor(governmentFetcher, licenseService) {
        this.governmentFetcher = governmentFetcher;
        this.licenseService = licenseService;
    }
    /**
     * Estimate costs for all licenses required for a business
     */
    async estimate(analysis) {
        if (!analysis.supported || !analysis.businessCategory) {
            return {
                supported: false,
                message: 'Business is not supported',
                totalCost: 'unavailable'
            };
        }
        const licenses = await this.licenseService.discover(analysis);
        const costBreakdown = [];
        let totalCost = 0;
        for (const license of licenses) {
            const costData = await this.governmentFetcher.getCostData(license.id, analysis.district || 'Kerala');
            const applicationFee = typeof costData.data?.applicationFee === 'number'
                ? costData.data.applicationFee
                : 'unavailable';
            const renewalFee = typeof costData.data?.renewalFee === 'number'
                ? costData.data.renewalFee
                : 'unavailable';
            let estimatedTotal = 'unavailable';
            if (typeof applicationFee === 'number' && typeof renewalFee === 'number') {
                estimatedTotal = applicationFee + renewalFee;
                totalCost += estimatedTotal;
            }
            costBreakdown.push({
                licenseId: license.id,
                licenseName: license.name,
                applicationFee,
                inspectionFee: 'unavailable',
                renewalFee,
                totalEstimatedCost: estimatedTotal,
                notes: `Estimated cost for ${license.name} in ${analysis.district}`
            });
        }
        return {
            supported: true,
            costBreakdown,
            totalCost: totalCost > 0 ? totalCost : 'unavailable'
        };
    }
    /**
     * Get cost for a specific license
     */
    async getCostForLicense(licenseId, district) {
        const license = await this.licenseService.getLicenseById(licenseId);
        if (!license)
            return null;
        const costData = await this.governmentFetcher.getCostData(licenseId, district);
        const applicationFee = typeof costData.data?.applicationFee === 'number'
            ? costData.data.applicationFee
            : 'unavailable';
        const renewalFee = typeof costData.data?.renewalFee === 'number'
            ? costData.data.renewalFee
            : 'unavailable';
        let estimatedTotal = 'unavailable';
        if (typeof applicationFee === 'number' && typeof renewalFee === 'number') {
            estimatedTotal = applicationFee + renewalFee;
        }
        return {
            licenseId,
            licenseName: license.name,
            applicationFee,
            inspectionFee: 'unavailable',
            renewalFee,
            totalEstimatedCost: estimatedTotal,
            notes: `Estimated cost for ${license.name} in ${district}`
        };
    }
};
CostService = __decorate([
    Injectable({ deps: [GovernmentFetcherService, LicenseService] }),
    __metadata("design:paramtypes", [GovernmentFetcherService,
        LicenseService])
], CostService);
export { CostService };
//# sourceMappingURL=cost.service.js.map