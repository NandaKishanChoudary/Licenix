import { Injectable } from '@nitrostack/core';
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
@Injectable({ deps: [CacheService] })
export class GovernmentFetcherService {
  private readonly DEFAULT_TTL = 86400000; // 24 hours
  private readonly DEFAULT_RETRIES = 2;
  private readonly DEFAULT_BACKOFF = 1000; // 1 second

  constructor(private cacheService: CacheService) {}

  /**
   * Fetch data with fallback chain
   */
  async fetch<T>(
    key: string,
    fetcher: () => Promise<T>,
    options: FetchOptions = {}
  ): Promise<{ data: T | null; source: 'fresh-cache' | 'live' | 'stale-cache' | 'unavailable' }> {
    const ttl = options.ttl ?? this.DEFAULT_TTL;
    const retries = options.retries ?? this.DEFAULT_RETRIES;
    const backoffMs = options.backoffMs ?? this.DEFAULT_BACKOFF;

    // Step 1: Check fresh cache
    const freshData = this.cacheService.get<T>(key);
    if (freshData !== null) {
      return { data: freshData, source: 'fresh-cache' };
    }

    // Step 2: Try live fetch with retries
    let lastError: Error | null = null;
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const data = await fetcher();
        // Cache the successful result
        this.cacheService.set(key, data, ttl);
        return { data, source: 'live' };
      } catch (error) {
        lastError = error as Error;
        if (attempt < retries) {
          // Exponential backoff
          await new Promise(resolve => setTimeout(resolve, backoffMs * Math.pow(2, attempt)));
        }
      }
    }

    // Step 3: Return explicit "unavailable"
    return { data: null, source: 'unavailable' };
  }

  /**
   * Mock fetcher for FSSAI license data
   */
  async fetchFSSAIData(): Promise<any> {
    return {
      licenses: ['Basic Registration', 'State License', 'Central License'],
      renewalFrequency: '5 years',
      website: 'https://foscos.fssai.gov.in/'
    };
  }

  /**
   * Mock fetcher for GST data
   */
  async fetchGSTData(): Promise<any> {
    return {
      threshold: 40,
      thresholdUnit: 'lakhs',
      website: 'https://reg.gst.gov.in/registration/'
    };
  }

  /**
   * Mock fetcher for Fire Safety data
   */
  async fetchFireSafetyData(): Promise<any> {
    return {
      requirements: ['Fire extinguishers', 'Emergency exits', 'Fire alarm system'],
      inspectionFrequency: '3 years',
      website: 'https://fire.kerala.gov.in/eservice/'
    };
  }

  /**
   * Mock fetcher for KSPCB data
   */
  async fetchKSPCBData(): Promise<any> {
    return {
      requirements: ['Waste management plan', 'Water discharge compliance'],
      renewalFrequency: '2 years',
      website: 'https://krocmms.nic.in/'
    };
  }

  /**
   * Get cost data with fallback
   */
  async getCostData(licenseId: string, district: string): Promise<any> {
    const key = `cost:${licenseId}:${district}`;
    
    // Mock cost data - in production would fetch from government sources
    const mockCosts: Record<string, any> = {
      'trade-license': { applicationFee: 500, renewalFee: 500 },
      'fssai': { applicationFee: 2500, renewalFee: 2500 },
      'gst': { applicationFee: 0, renewalFee: 0 },
      'fire-noc': { applicationFee: 1000, renewalFee: 1000 },
      'pollution-consent': { applicationFee: 2000, renewalFee: 2000 },
      'health-certificate': { applicationFee: 500, renewalFee: 500 },
      'signage-permission': { applicationFee: 1000, renewalFee: 1000 },
      'liquor-license': { applicationFee: 5000, renewalFee: 5000 },
      'building-plan-approval': { applicationFee: 3000, renewalFee: 0 },
      'occupancy-certificate': { applicationFee: 2000, renewalFee: 0 },
      'pan-registration': { applicationFee: 110, renewalFee: 0 },
      'labor-registration': { applicationFee: 500, renewalFee: 500 },
      'drug-license': { applicationFee: 3000, renewalFee: 3000 },
      'clinical-establishment': { applicationFee: 5000, renewalFee: 5000 },
      'school-noc': { applicationFee: 10000, renewalFee: 0 },
      'factory-license': { applicationFee: 7500, renewalFee: 7500 },
      'legal-metrology': { applicationFee: 1500, renewalFee: 1500 },
      'star-classification': { applicationFee: 12000, renewalFee: 12000 }
    };

    return this.fetch(
      key,
      async () => mockCosts[licenseId] || { applicationFee: 'unavailable', renewalFee: 'unavailable' },
      { ttl: 86400000 }
    );
  }

  /**
   * Get timeline data with fallback
   */
  async getTimelineData(licenseId: string): Promise<any> {
    const key = `timeline:${licenseId}`;

    // Mock timeline data - in production would fetch from government sources
    const mockTimelines: Record<string, any> = {
      'trade-license': { applicationProcessing: '7-10 days', inspectionDuration: '3-5 days', approvalDuration: '2-3 days' },
      'fssai': { applicationProcessing: '5-7 days', inspectionDuration: '7-10 days', approvalDuration: '3-5 days' },
      'gst': { applicationProcessing: '1-2 days', inspectionDuration: 'N/A', approvalDuration: '1-2 days' },
      'fire-noc': { applicationProcessing: '5-7 days', inspectionDuration: '7-10 days', approvalDuration: '3-5 days' },
      'pollution-consent': { applicationProcessing: '10-15 days', inspectionDuration: '7-10 days', approvalDuration: '5-7 days' },
      'health-certificate': { applicationProcessing: '3-5 days', inspectionDuration: '2-3 days', approvalDuration: '2-3 days' },
      'signage-permission': { applicationProcessing: '5-7 days', inspectionDuration: '2-3 days', approvalDuration: '2-3 days' },
      'liquor-license': { applicationProcessing: '15-20 days', inspectionDuration: '10-15 days', approvalDuration: '5-10 days' },
      'building-plan-approval': { applicationProcessing: '15-30 days', inspectionDuration: '10-15 days', approvalDuration: '5-10 days' },
      'occupancy-certificate': { applicationProcessing: '10-15 days', inspectionDuration: '5-7 days', approvalDuration: '3-5 days' },
      'pan-registration': { applicationProcessing: '1-2 days', inspectionDuration: 'N/A', approvalDuration: '1-2 days' },
      'labor-registration': { applicationProcessing: '3-5 days', inspectionDuration: 'N/A', approvalDuration: '2-3 days' },
      'drug-license': { applicationProcessing: '15-20 days', inspectionDuration: '10-15 days', approvalDuration: '5-7 days' },
      'clinical-establishment': { applicationProcessing: '20-30 days', inspectionDuration: '10-15 days', approvalDuration: '7-10 days' },
      'school-noc': { applicationProcessing: '30-45 days', inspectionDuration: '15-20 days', approvalDuration: '10-15 days' },
      'factory-license': { applicationProcessing: '20-30 days', inspectionDuration: '15-20 days', approvalDuration: '10-15 days' },
      'legal-metrology': { applicationProcessing: '5-7 days', inspectionDuration: '3-5 days', approvalDuration: '2-3 days' },
      'star-classification': { applicationProcessing: '30-60 days', inspectionDuration: '20-30 days', approvalDuration: '15-20 days' }
    };

    return this.fetch(
      key,
      async () => mockTimelines[licenseId] || { applicationProcessing: 'unavailable', inspectionDuration: 'unavailable', approvalDuration: 'unavailable' },
      { ttl: 86400000 }
    );
  }
}
