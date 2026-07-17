import { LinkValidatorService } from './link-validator.service.js';
import type { BusinessAnalysis, LicenseForm } from '../types/index.js';
/**
 * Provides required documents and forms for each license with live government URLs
 */
export declare class DocumentService {
    private linkValidator;
    constructor(linkValidator: LinkValidatorService);
    /**
     * Get forms and documents for all licenses of a business category
     */
    getForms(analysis: BusinessAnalysis): Promise<LicenseForm[]>;
    /**
     * Get form details for a specific license with live portal URLs
     */
    private getFormForLicense;
}
//# sourceMappingURL=document.service.d.ts.map