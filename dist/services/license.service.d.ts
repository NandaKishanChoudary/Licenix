import { LinkValidatorService } from './link-validator.service.js';
import type { BusinessAnalysis, License } from '../types/index.js';
/**
 * Discovers required licenses for a business
 */
export declare class LicenseService {
    private linkValidator;
    constructor(linkValidator: LinkValidatorService);
    /**
     * Discover all required licenses for a business based on its analysis
     */
    discover(analysis: BusinessAnalysis): Promise<License[]>;
    private buildGovernmentPortal;
    /**
     * Get a specific license by ID
     */
    getLicenseById(licenseId: string): Promise<License | null>;
    /**
     * Get mandatory licenses only, optionally filtered by sector
     */
    getMandatoryLicenses(sector?: string): Promise<License[]>;
    /**
     * Get optional licenses, optionally filtered by sector
     */
    getOptionalLicenses(sector?: string): Promise<License[]>;
}
//# sourceMappingURL=license.service.d.ts.map