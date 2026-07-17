import { ALL_LICENSES } from '../data/restaurant-license-catalog.js';
import type { BusinessAnalysis } from '../types/index.js';
/**
 * Validates business type and location, identifies responsible departments
 */
export declare class BusinessService {
    /**
     * Analyze business type and location
     * Returns supported status, category, state, district, and departments
     */
    analyze(business: string, location: string): Promise<BusinessAnalysis>;
    /**
     * Fuzzy matches input business string to one of the supported sectors or "general"
     */
    private determineSector;
    /**
     * Find a Kerala district by name (fuzzy matching)
     */
    private findDistrict;
    /**
     * Get list of responsible government departments for a given sector
     */
    private getResponsibleDepartments;
    /**
     * Get all licenses required for a sector (fallback to general)
     */
    getRequiredLicenses(sector?: string): typeof ALL_LICENSES;
    /**
     * Get mandatory licenses only
     */
    getMandatoryLicenses(sector?: string): typeof ALL_LICENSES;
    /**
     * Get optional licenses
     */
    getOptionalLicenses(sector?: string): typeof ALL_LICENSES;
}
//# sourceMappingURL=business.service.d.ts.map