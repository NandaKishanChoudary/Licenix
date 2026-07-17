import { ToolDecorator as Tool, Widget, Injectable, ExecutionContext } from '@nitrostack/core';
import { z } from 'zod';
import { BusinessService } from '../../services/business.service.js';
import { LicenseService } from '../../services/license.service.js';
import { RegulationService } from '../../services/regulation.service.js';
import { DocumentService } from '../../services/document.service.js';
import { licensingInputSchema, type LicensingInput } from '../shared/licensing-input.schema.js';

/**
 * Discovery tools for licensing in Kerala
 */
@Injectable({ deps: [BusinessService, LicenseService, RegulationService, DocumentService] })
export class DiscoveryTools {
  constructor(
    private businessService: BusinessService,
    private licenseService: LicenseService,
    private regulationService: RegulationService,
    private documentService: DocumentService
  ) {}

  /**
   * Tool 1: business_analyzer
   * Validates business type and location, identifies profile summary
   */
  @Tool({
    name: 'business_analyzer',
    description: 'Validate the business type/location and identify industry, category, state, district, and responsible government departments. ALWAYS call this tool first before discovering licenses, regulations, or documents.',
    inputSchema: licensingInputSchema,
    annotations: {
      readOnlyHint: true,
      idempotentHint: true,
      destructiveHint: false,
      openWorldHint: false
    }
  })
  @Widget('/business-summary')
  async analyzeBusinessType(
    input: LicensingInput,
    ctx: ExecutionContext
  ): Promise<any> {
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
  @Tool({
    name: 'license_discovery',
    description: 'Discover all required licenses for a business sector in Kerala, including mandatory status, issuing department, and renewal frequency. Call this tool ONLY AFTER business_analyzer has been called to validate the business and location.',
    inputSchema: licensingInputSchema,
    annotations: {
      readOnlyHint: true,
      idempotentHint: true,
      destructiveHint: false,
      openWorldHint: false
    }
  })
  @Widget('/license-results')
  async discoverLicenses(
    input: LicensingInput,
    ctx: ExecutionContext
  ): Promise<any> {
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
  @Tool({
    name: 'regulation_lookup',
    description: 'Look up applicable Acts, Rules, and regulations for business licensing in Kerala.',
    inputSchema: licensingInputSchema,
    annotations: {
      readOnlyHint: true,
      idempotentHint: true,
      destructiveHint: false,
      openWorldHint: true
    }
  })
  @Widget('/compliance-dashboard')
  async lookupRegulations(
    input: LicensingInput,
    ctx: ExecutionContext
  ): Promise<any> {
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
  @Tool({
    name: 'document_and_forms',
    description: 'Get required documents, official forms, and submission details for each license needed to open a business in Kerala.',
    inputSchema: licensingInputSchema,
    annotations: {
      readOnlyHint: true,
      idempotentHint: true,
      destructiveHint: false,
      openWorldHint: true
    }
  })
  @Widget('/document-checklist')
  async getDocumentsAndForms(
    input: LicensingInput,
    ctx: ExecutionContext
  ): Promise<any> {
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
}
