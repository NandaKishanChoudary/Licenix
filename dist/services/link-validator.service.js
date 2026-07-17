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
import { CacheService } from './cache.service.js';
/**
 * Validates URLs against an allowlist of official government domains
 * and checks basic reachability via HTTP HEAD requests.
 */
let LinkValidatorService = class LinkValidatorService {
    cacheService;
    ALLOWED_DOMAINS = [
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
    REQUEST_TIMEOUT_MS = 5000;
    constructor(cacheService) {
        this.cacheService = cacheService;
    }
    /**
     * Check if a URL is from an allowed government domain
     */
    isAllowedDomain(url) {
        try {
            const urlObj = new URL(url);
            const hostname = urlObj.hostname.toLowerCase();
            return this.ALLOWED_DOMAINS.some(domain => hostname === domain || hostname.endsWith('.' + domain));
        }
        catch {
            return false;
        }
    }
    /**
     * Validate a URL (domain check + reachability via HEAD request)
     */
    async validateUrl(url) {
        const cacheKey = `link:${url}`;
        const cached = this.cacheService.get(cacheKey);
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
        }
        catch {
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
    async validateUrls(urls) {
        return Promise.all(urls.map(url => this.validateUrl(url)));
    }
    async checkReachability(url) {
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
        }
        catch {
            // Some gov portals block HEAD; try GET as fallback
            try {
                const response = await fetch(url, {
                    method: 'GET',
                    signal: controller.signal,
                    redirect: 'follow',
                    headers: { 'User-Agent': 'Licenix-LinkValidator/1.0' }
                });
                return response.ok || response.status === 403;
            }
            catch {
                return false;
            }
        }
        finally {
            clearTimeout(timeout);
        }
    }
};
LinkValidatorService = __decorate([
    Injectable({ deps: [CacheService] }),
    __metadata("design:paramtypes", [CacheService])
], LinkValidatorService);
export { LinkValidatorService };
//# sourceMappingURL=link-validator.service.js.map