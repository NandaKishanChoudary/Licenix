import { Injectable } from '@nitrostack/core';
import { ALL_LICENSES, SECTOR_LICENSES } from '../data/restaurant-license-catalog.js';
import { LinkValidatorService } from './link-validator.service.js';
import { getPortalForLicense } from '../data/license-portals.js';
import type { BusinessAnalysis, License, GovernmentPortal } from '../types/index.js';

/**
 * Discovers required licenses for a business
 */
@Injectable({ deps: [LinkValidatorService] })
export class LicenseService {
  constructor(private linkValidator: LinkValidatorService) {}

  /**
   * Discover all required licenses for a business based on its analysis
   */
  async discover(analysis: BusinessAnalysis): Promise<License[]> {
    if (!analysis.supported || !analysis.businessCategory) {
      return [];
    }

    const category = analysis.businessCategory;
    const licenseIds = SECTOR_LICENSES[category] || SECTOR_LICENSES.general;

    const licenses = ALL_LICENSES.filter(license => licenseIds.includes(license.id));

    return Promise.all(
      licenses.map(async license => ({
        id: license.id,
        name: license.name,
        mandatory: license.mandatory,
        issuingDepartment: license.issuingDepartment,
        description: license.description,
        renewalFrequency: license.renewalFrequency,
        imageUrl: license.imageUrl,
        governmentPortal: await this.buildGovernmentPortal(license.id)
      }))
    );
  }

  private async buildGovernmentPortal(licenseId: string): Promise<GovernmentPortal> {
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
  async getLicenseById(licenseId: string): Promise<License | null> {
    const license = ALL_LICENSES.find(l => l.id === licenseId);
    if (!license) return null;

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
  async getMandatoryLicenses(sector?: string): Promise<License[]> {
    let licenses = ALL_LICENSES;
    if (sector) {
      const licenseIds = SECTOR_LICENSES[sector] || SECTOR_LICENSES.general;
      licenses = ALL_LICENSES.filter(l => licenseIds.includes(l.id));
    }

    return Promise.all(
      licenses.filter(l => l.mandatory).map(async license => ({
        id: license.id,
        name: license.name,
        mandatory: license.mandatory,
        issuingDepartment: license.issuingDepartment,
        description: license.description,
        renewalFrequency: license.renewalFrequency,
        imageUrl: license.imageUrl,
        governmentPortal: await this.buildGovernmentPortal(license.id)
      }))
    );
  }

  /**
   * Get optional licenses, optionally filtered by sector
   */
  async getOptionalLicenses(sector?: string): Promise<License[]> {
    let licenses = ALL_LICENSES;
    if (sector) {
      const licenseIds = SECTOR_LICENSES[sector] || SECTOR_LICENSES.general;
      licenses = ALL_LICENSES.filter(l => licenseIds.includes(l.id));
    }

    return Promise.all(
      licenses.filter(l => !l.mandatory).map(async license => ({
        id: license.id,
        name: license.name,
        mandatory: license.mandatory,
        issuingDepartment: license.issuingDepartment,
        description: license.description,
        renewalFrequency: license.renewalFrequency,
        imageUrl: license.imageUrl,
        governmentPortal: await this.buildGovernmentPortal(license.id)
      }))
    );
  }
}
