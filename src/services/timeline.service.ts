import { Injectable } from '@nitrostack/core';
import { GovernmentFetcherService } from './government-fetcher.service.js';
import { LicenseService } from './license.service.js';
import type { BusinessAnalysis, TimelineBreakdown, TimelineEstimate } from '../types/index.js';

/**
 * Estimates licensing timelines for any business sector in Kerala
 */
@Injectable({ deps: [GovernmentFetcherService, LicenseService] })
export class TimelineService {
  constructor(
    private governmentFetcher: GovernmentFetcherService,
    private licenseService: LicenseService
  ) {}

  /**
   * Estimate timelines for all required licenses
   */
  async estimate(analysis: BusinessAnalysis): Promise<TimelineEstimate> {
    if (!analysis.supported || !analysis.businessCategory) {
      return {
        supported: false,
        message: 'Business is not supported',
        overallDuration: 'unavailable'
      };
    }

    const licenses = await this.licenseService.discover(analysis);
    const timelineBreakdown: TimelineBreakdown[] = [];

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
  async getTimelineForLicense(licenseId: string): Promise<TimelineBreakdown | null> {
    const license = await this.licenseService.getLicenseById(licenseId);
    if (!license) return null;

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
  private calculateTotalDuration(
    applicationProcessing: string | number,
    inspectionDuration: string | number,
    approvalDuration: string | number
  ): string {
    // If any component is unavailable, return unavailable
    if (
      applicationProcessing === 'unavailable' ||
      inspectionDuration === 'unavailable' ||
      approvalDuration === 'unavailable'
    ) {
      return 'unavailable';
    }

    // Try to parse and sum durations (simplified - assumes "X-Y days" format)
    try {
      const parseMax = (str: string): number => {
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
      } else {
        const months = Math.ceil(weeks / 4);
        return `${months} month${months > 1 ? 's' : ''}`;
      }
    } catch {
      return 'unavailable';
    }
  }
}
