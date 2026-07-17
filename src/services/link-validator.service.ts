import { Injectable } from '@nitrostack/core';
import { CacheService } from './cache.service.js';

/**
 * Validates URLs against an allowlist of official government domains
 * and checks basic reachability via HTTP HEAD requests.
 */
@Injectable({ deps: [CacheService] })
export class LinkValidatorService {
  private readonly ALLOWED_DOMAINS = [
    'gov.in',
    'nic.in',
    'fssai.gov.in',
    'gst.gov.in',
    'kspcb.gov.in',
    'kerala.gov.in',
    'incometax.gov.in',
    'online.nic.in',
    'eservices.nic.in',
    'nsdl.com',
    'tin-nsdl.com',
    'lsgkerala.gov.in'
  ];

  private readonly REQUEST_TIMEOUT_MS = 5000;

  constructor(private cacheService: CacheService) {}

  /**
   * Check if a URL is from an allowed government domain
   */
  isAllowedDomain(url: string): boolean {
    try {
      const urlObj = new URL(url);
      const hostname = urlObj.hostname.toLowerCase();

      return this.ALLOWED_DOMAINS.some(domain =>
        hostname === domain || hostname.endsWith('.' + domain)
      );
    } catch {
      return false;
    }
  }

  /**
   * Validate a URL (domain check + reachability via HEAD request)
   */
  async validateUrl(url: string): Promise<{ verified: boolean; url: string; reason?: string }> {
    const cacheKey = `link:${url}`;
    const cached = this.cacheService.get<{ verified: boolean; url: string; reason?: string }>(cacheKey);
    if (cached) {
      return cached;
    }

    if (!this.isAllowedDomain(url)) {
      const result = {
        verified: false,
        url,
        reason: 'URL is not from an official government domain'
      };
      this.cacheService.set(cacheKey, result, 86400000); // 24h cache
      return result;
    }

    try {
      new URL(url);
    } catch {
      const result = {
        verified: false,
        url,
        reason: 'Invalid URL format'
      };
      this.cacheService.set(cacheKey, result, 86400000);
      return result;
    }

    const reachable = await this.checkReachability(url);
    const result = {
      verified: reachable,
      url,
      reason: reachable ? undefined : 'Portal did not respond within timeout'
    };
    this.cacheService.set(cacheKey, result, 86400000);
    return result;
  }

  /**
   * Batch validate multiple URLs
   */
  async validateUrls(urls: string[]): Promise<Array<{ verified: boolean; url: string; reason?: string }>> {
    return Promise.all(urls.map(url => this.validateUrl(url)));
  }

  private async checkReachability(url: string): Promise<boolean> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.REQUEST_TIMEOUT_MS);

    try {
      const response = await fetch(url, {
        method: 'HEAD',
        signal: controller.signal,
        redirect: 'follow',
        headers: { 'User-Agent': 'Licenix-LinkValidator/1.0' }
      });
      return response.ok || response.status === 405 || response.status === 403;
    } catch {
      // Some gov portals block HEAD; try GET as fallback
      try {
        const response = await fetch(url, {
          method: 'GET',
          signal: controller.signal,
          redirect: 'follow',
          headers: { 'User-Agent': 'Licenix-LinkValidator/1.0' }
        });
        return response.ok || response.status === 403;
      } catch {
        return false;
      }
    } finally {
      clearTimeout(timeout);
    }
  }
}
