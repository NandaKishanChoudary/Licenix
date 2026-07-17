import { Injectable } from '@nitrostack/core';
import { GovernmentFetcherService } from './government-fetcher.service.js';
import { LicenseService } from './license.service.js';
import type { BusinessAnalysis, CostBreakdown, CostEstimate } from '../types/index.js';

/**
 * Estimates licensing costs for any business sector in Kerala
 */
@Injectable({ deps: [GovernmentFetcherService, LicenseService] })
export class CostService {
  constructor(
    private governmentFetcher: GovernmentFetcherService,
    private licenseService: LicenseService
  ) {}

  /**
   * Estimate costs for all licenses required for a business
   */
  async estimate(analysis: BusinessAnalysis): Promise<CostEstimate> {
    if (!analysis.supported || !analysis.businessCategory) {
      return {
        supported: false,
        message: 'Business is not supported',
        totalCost: 'unavailable'
      };
    }

    const licenses = await this.licenseService.discover(analysis);
    const costBreakdown: CostBreakdown[] = [];
    let totalCost = 0;

    for (const license of licenses) {
      const costData = await this.governmentFetcher.getCostData(license.id, analysis.district || 'Kerala');
      
      const applicationFee = typeof costData.data?.applicationFee === 'number' 
        ? costData.data.applicationFee 
        : 'unavailable';
      const renewalFee = typeof costData.data?.renewalFee === 'number' 
        ? costData.data.renewalFee 
        : 'unavailable';

      let estimatedTotal: number | string = 'unavailable';
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
  async getCostForLicense(licenseId: string, district: string): Promise<CostBreakdown | null> {
    const license = await this.licenseService.getLicenseById(licenseId);
    if (!license) return null;

    const costData = await this.governmentFetcher.getCostData(licenseId, district);
    
    const applicationFee = typeof costData.data?.applicationFee === 'number' 
      ? costData.data.applicationFee 
      : 'unavailable';
    const renewalFee = typeof costData.data?.renewalFee === 'number' 
      ? costData.data.renewalFee 
      : 'unavailable';

    let estimatedTotal: number | string = 'unavailable';
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
}
