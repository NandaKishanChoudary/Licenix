import { ExecutionContext } from '@nitrostack/core';
import { BusinessService } from '../../services/business.service.js';
import { LicenseService } from '../../services/license.service.js';
import { RegulationService } from '../../services/regulation.service.js';
import { DocumentService } from '../../services/document.service.js';
import { type LicensingInput } from '../shared/licensing-input.schema.js';
/**
 * Discovery tools for licensing in Kerala
 */
export declare class DiscoveryTools {
    private businessService;
    private licenseService;
    private regulationService;
    private documentService;
    constructor(businessService: BusinessService, licenseService: LicenseService, regulationService: RegulationService, documentService: DocumentService);
    /**
     * Tool 1: business_analyzer
     * Validates business type and location, identifies profile summary
     */
    analyzeBusinessType(input: LicensingInput, ctx: ExecutionContext): Promise<any>;
    /**
     * Tool 2: license_discovery
     * Returns every required license with details for cards
     */
    discoverLicenses(input: LicensingInput, ctx: ExecutionContext): Promise<any>;
    /**
     * Tool 3: regulation_lookup
     * Returns applicable Acts/Rules and compliance notes
     */
    lookupRegulations(input: LicensingInput, ctx: ExecutionContext): Promise<any>;
    /**
     * Tool 4: document_and_forms
     * Returns required documents and official forms for each license
     */
    getDocumentsAndForms(input: LicensingInput, ctx: ExecutionContext): Promise<any>;
}
//# sourceMappingURL=discovery.tools.d.ts.map