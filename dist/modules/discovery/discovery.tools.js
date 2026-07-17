var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ToolDecorator as Tool, Widget, Injectable } from '@nitrostack/core';
import { BusinessService } from '../../services/business.service.js';
import { LicenseService } from '../../services/license.service.js';
import { RegulationService } from '../../services/regulation.service.js';
import { DocumentService } from '../../services/document.service.js';
import { licensingInputSchema } from '../shared/licensing-input.schema.js';
/**
 * Discovery tools for licensing in Kerala
 */
let DiscoveryTools = class DiscoveryTools {
    businessService;
    licenseService;
    regulationService;
    documentService;
    constructor(businessService, licenseService, regulationService, documentService) {
        this.businessService = businessService;
        this.licenseService = licenseService;
        this.regulationService = regulationService;
        this.documentService = documentService;
    }
    /**
     * Tool 1: business_analyzer
     * Validates business type and location, identifies profile summary
     */
    async analyzeBusinessType(input, ctx) {
        ctx.logger.info('Analyzing business', { business: input.business, location: input.location });
        const analysis = await this.businessService.analyze(input.business, input.location);
        if (!analysis.supported) {
            return {
                supported: false,
                message: analysis.message
            };
        }
        const regulations = await this.regulationService.lookup(analysis);
        const applicableActs = regulations.map(r => r.act);
        return {
            widget: '/business-summary',
            data: {
                businessName: input.business,
                sector: analysis.sectorLabel || 'General Business',
                state: analysis.state || 'Kerala',
                district: analysis.district || 'Kerala',
                riskCategory: analysis.businessCategory === 'hospital' || analysis.businessCategory === 'pharmacy' ? 'High Risk' : 'Medium Risk',
                applicableActs,
                applicableAuthorities: analysis.departments || []
            }
        };
    }
    /**
     * Tool 2: license_discovery
     * Returns every required license with details for cards
     */
    async discoverLicenses(input, ctx) {
        ctx.logger.info('Discovering licenses', { business: input.business, location: input.location });
        const analysis = await this.businessService.analyze(input.business, input.location);
        if (!analysis.supported) {
            return {
                supported: false,
                message: analysis.message
            };
        }
        const rawLicenses = await this.licenseService.discover(analysis);
        const licenses = rawLicenses.map(l => ({
            id: l.id,
            name: l.name,
            mandatory: l.mandatory,
            issuingDepartment: l.issuingDepartment,
            description: l.description,
            renewalFrequency: l.renewalFrequency,
            estimatedFee: l.id === 'gst' || l.id === 'pan-registration' ? 'Free' : '₹500 - ₹5,000',
            processingTime: l.id === 'gst' || l.id === 'pan-registration' ? '1-2 days' : '3-4 weeks',
            status: 'pending',
            governmentPortal: {
                applyOnlineUrl: l.governmentPortal?.applyOnlineUrl || '#',
                portalUrl: l.governmentPortal?.portalUrl || '#'
            }
        }));
        return {
            widget: '/license-results',
            data: {
                licenses
            }
        };
    }
    /**
     * Tool 3: regulation_lookup
     * Returns applicable Acts/Rules and compliance notes
     */
    async lookupRegulations(input, ctx) {
        ctx.logger.info('Looking up regulations', { business: input.business, location: input.location });
        const analysis = await this.businessService.analyze(input.business, input.location);
        if (!analysis.supported) {
            return {
                supported: false,
                message: analysis.message
            };
        }
        const regulations = await this.regulationService.lookup(analysis);
        const warnings = regulations.map(r => r.complianceNotes);
        return {
            widget: '/compliance-dashboard',
            data: {
                completed: 0,
                pending: regulations.length,
                expiringSoon: 0,
                renewalRequired: 0,
                warnings
            }
        };
    }
    /**
     * Tool 4: document_and_forms
     * Returns required documents and official forms for each license
     */
    async getDocumentsAndForms(input, ctx) {
        ctx.logger.info('Getting documents and forms', { business: input.business, location: input.location });
        const analysis = await this.businessService.analyze(input.business, input.location);
        if (!analysis.supported) {
            return {
                supported: false,
                message: analysis.message
            };
        }
        const forms = await this.documentService.getForms(analysis);
        const documents = forms.flatMap(f => f.requiredDocuments.map(doc => ({
            name: doc.name,
            required: doc.required,
            placeholder: `Upload copy of ${doc.name}`,
            sampleUrl: f.officialForm?.url || '#',
            verificationStatus: 'pending'
        })));
        return {
            widget: '/document-checklist',
            data: {
                documents
            }
        };
    }
};
__decorate([
    Tool({
        name: 'business_analyzer',
        description: 'Validate the business type/location and identify industry, category, state, district, and responsible government departments. ALWAYS call this tool first before discovering licenses, regulations, or documents.',
        inputSchema: licensingInputSchema,
        annotations: {
            readOnlyHint: true,
            idempotentHint: true,
            destructiveHint: false,
            openWorldHint: false
        }
    }),
    Widget('/business-summary'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], DiscoveryTools.prototype, "analyzeBusinessType", null);
__decorate([
    Tool({
        name: 'license_discovery',
        description: 'Discover all required licenses for a business sector in Kerala, including mandatory status, issuing department, and renewal frequency. Call this tool ONLY AFTER business_analyzer has been called to validate the business and location.',
        inputSchema: licensingInputSchema,
        annotations: {
            readOnlyHint: true,
            idempotentHint: true,
            destructiveHint: false,
            openWorldHint: false
        }
    }),
    Widget('/license-results'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], DiscoveryTools.prototype, "discoverLicenses", null);
__decorate([
    Tool({
        name: 'regulation_lookup',
        description: 'Look up applicable Acts, Rules, and regulations for business licensing in Kerala.',
        inputSchema: licensingInputSchema,
        annotations: {
            readOnlyHint: true,
            idempotentHint: true,
            destructiveHint: false,
            openWorldHint: true
        }
    }),
    Widget('/compliance-dashboard'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], DiscoveryTools.prototype, "lookupRegulations", null);
__decorate([
    Tool({
        name: 'document_and_forms',
        description: 'Get required documents, official forms, and submission details for each license needed to open a business in Kerala.',
        inputSchema: licensingInputSchema,
        annotations: {
            readOnlyHint: true,
            idempotentHint: true,
            destructiveHint: false,
            openWorldHint: true
        }
    }),
    Widget('/document-checklist'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], DiscoveryTools.prototype, "getDocumentsAndForms", null);
DiscoveryTools = __decorate([
    Injectable({ deps: [BusinessService, LicenseService, RegulationService, DocumentService] }),
    __metadata("design:paramtypes", [BusinessService,
        LicenseService,
        RegulationService,
        DocumentService])
], DiscoveryTools);
export { DiscoveryTools };
//# sourceMappingURL=discovery.tools.js.map