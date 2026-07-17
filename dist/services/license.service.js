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
import { ALL_LICENSES, SECTOR_LICENSES } from '../data/restaurant-license-catalog.js';
import { LinkValidatorService } from './link-validator.service.js';
import { getPortalForLicense } from '../data/license-portals.js';
/**
 * Discovers required licenses for a business
 */
let LicenseService = class LicenseService {
    linkValidator;
    constructor(linkValidator) {
        this.linkValidator = linkValidator;
    }
    /**
     * Discover all required licenses for a business based on its analysis
     */
    async discover(analysis) {
        if (!analysis.supported || !analysis.businessCategory) {
            return [];
        }
        const category = analysis.businessCategory;
        const licenseIds = SECTOR_LICENSES[category] || SECTOR_LICENSES.general;
        const licenses = ALL_LICENSES.filter(license => licenseIds.includes(license.id));
        return Promise.all(licenses.map(async (license) => ({
            id: license.id,
            name: license.name,
            mandatory: license.mandatory,
            issuingDepartment: license.issuingDepartment,
            description: license.description,
            renewalFrequency: license.renewalFrequency,
            imageUrl: license.imageUrl,
            governmentPortal: await this.buildGovernmentPortal(license.id)
        })));
    }
    async buildGovernmentPortal(licenseId) {
        const portal = getPortalForLicense(licenseId);
        const [portalCheck, applyCheck] = await Promise.all([
            this.linkValidator.validateUrl(portal.portalUrl),
            this.linkValidator.validateUrl(portal.applyOnlineUrl)
        ]);
        return {
            formName: portal.formName,
            portalUrl: portal.portalUrl,
            applyOnlineUrl: portal.applyOnlineUrl,
            verified: portalCheck.verified && applyCheck.verified,
            submissionMethod: portal.submissionMethod
        };
    }
    /**
     * Get a specific license by ID
     */
    async getLicenseById(licenseId) {
        const license = ALL_LICENSES.find(l => l.id === licenseId);
        if (!license)
            return null;
        return {
            id: license.id,
            name: license.name,
            mandatory: license.mandatory,
            issuingDepartment: license.issuingDepartment,
            description: license.description,
            renewalFrequency: license.renewalFrequency,
            imageUrl: license.imageUrl,
            governmentPortal: await this.buildGovernmentPortal(license.id)
        };
    }
    /**
     * Get mandatory licenses only, optionally filtered by sector
     */
    async getMandatoryLicenses(sector) {
        let licenses = ALL_LICENSES;
        if (sector) {
            const licenseIds = SECTOR_LICENSES[sector] || SECTOR_LICENSES.general;
            licenses = ALL_LICENSES.filter(l => licenseIds.includes(l.id));
        }
        return Promise.all(licenses.filter(l => l.mandatory).map(async (license) => ({
            id: license.id,
            name: license.name,
            mandatory: license.mandatory,
            issuingDepartment: license.issuingDepartment,
            description: license.description,
            renewalFrequency: license.renewalFrequency,
            imageUrl: license.imageUrl,
            governmentPortal: await this.buildGovernmentPortal(license.id)
        })));
    }
    /**
     * Get optional licenses, optionally filtered by sector
     */
    async getOptionalLicenses(sector) {
        let licenses = ALL_LICENSES;
        if (sector) {
            const licenseIds = SECTOR_LICENSES[sector] || SECTOR_LICENSES.general;
            licenses = ALL_LICENSES.filter(l => licenseIds.includes(l.id));
        }
        return Promise.all(licenses.filter(l => !l.mandatory).map(async (license) => ({
            id: license.id,
            name: license.name,
            mandatory: license.mandatory,
            issuingDepartment: license.issuingDepartment,
            description: license.description,
            renewalFrequency: license.renewalFrequency,
            imageUrl: license.imageUrl,
            governmentPortal: await this.buildGovernmentPortal(license.id)
        })));
    }
};
LicenseService = __decorate([
    Injectable({ deps: [LinkValidatorService] }),
    __metadata("design:paramtypes", [LinkValidatorService])
], LicenseService);
export { LicenseService };
//# sourceMappingURL=license.service.js.map