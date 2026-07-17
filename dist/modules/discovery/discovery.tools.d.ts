import { ExecutionContext } from '@nitrostack/core';
import { BusinessService } from '../../services/business.service.js';
import { LicenseService } from '../../services/license.service.js';
import { RegulationService } from '../../services/regulation.service.js';
import { DocumentService } from '../../services/document.service.js';
import { type LicensingInput } from '../shared/licensing-input.schema.js';
import type { BusinessAnalysis, LicenseDiscovery, RegulationLookup, DocumentAndForms } from '../../types/index.js';
/**
 * Discovery tools for restaurant licensing in Kerala
 */
export declare class DiscoveryTools {
    private businessService;
    private licenseService;
    private regulationService;
    private documentService;
    constructor(businessService: BusinessService, licenseService: LicenseService, regulationService: RegulationService, documentService: DocumentService);
    /**
     * Tool 1: business_analyzer
     * Validates business type and location, identifies responsible departments
     */
    analyzeBusinessType(input: LicensingInput, ctx: ExecutionContext): Promise<BusinessAnalysis>;
    /**
     * Tool 2: license_discovery
     * Returns every required license with details
     */
    discoverLicenses(input: LicensingInput, ctx: ExecutionContext): Promise<LicenseDiscovery>;
    /**
     * Tool 3: regulation_lookup
     * Returns applicable Acts/Rules and compliance notes
     */
    lookupRegulations(input: LicensingInput, ctx: ExecutionContext): Promise<RegulationLookup>;
    /**
     * Tool 4: document_and_forms
     * Returns required documents and official forms for each license
     */
    getDocumentsAndForms(input: LicensingInput, ctx: ExecutionContext): Promise<DocumentAndForms>;
}
//# sourceMappingURL=discovery.tools.d.ts.map