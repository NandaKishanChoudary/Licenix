import { ToolDecorator as Tool, Widget, Injectable, ExecutionContext } from '@nitrostack/core';
import { z } from 'zod';
import { BusinessService } from '../../services/business.service.js';
import { LicenseService } from '../../services/license.service.js';
import { RegulationService } from '../../services/regulation.service.js';
import { DocumentService } from '../../services/document.service.js';
import { licensingInputSchema, type LicensingInput } from '../shared/licensing-input.schema.js';
import type { BusinessAnalysis, LicenseDiscovery, RegulationLookup, DocumentAndForms } from '../../types/index.js';

/**
 * Discovery tools for restaurant licensing in Kerala
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
   * Validates business type and location, identifies responsible departments
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
  async analyzeBusinessType(
    input: LicensingInput,
    ctx: ExecutionContext
  ): Promise<BusinessAnalysis> {
    ctx.logger.info('Analyzing business', { business: input.business, location: input.location });
    return this.businessService.analyze(input.business, input.location);
  }

  /**
   * Tool 2: license_discovery
   * Returns every required license with details
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
  async discoverLicenses(
    input: LicensingInput,
    ctx: ExecutionContext
  ): Promise<LicenseDiscovery> {
    ctx.logger.info('Discovering licenses', { business: input.business, location: input.location });

    // First validate the business
    const analysis = await this.businessService.analyze(input.business, input.location);
    if (!analysis.supported) {
      return {
        supported: false,
        message: analysis.message
      };
    }

    // Then discover licenses
    const licenses = await this.licenseService.discover(analysis);
    return {
      supported: true,
      licenses
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
  async lookupRegulations(
    input: LicensingInput,
    ctx: ExecutionContext
  ): Promise<RegulationLookup> {
    ctx.logger.info('Looking up regulations', { business: input.business, location: input.location });

    // First validate the business
    const analysis = await this.businessService.analyze(input.business, input.location);
    if (!analysis.supported) {
      return {
        supported: false,
        message: analysis.message
      };
    }

    // Then lookup regulations
    const regulations = await this.regulationService.lookup(analysis);
    return {
      supported: true,
      regulations
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
  @Widget('licensing-guide')
  async getDocumentsAndForms(
    input: LicensingInput,
    ctx: ExecutionContext
  ): Promise<DocumentAndForms> {
    ctx.logger.info('Getting documents and forms', { business: input.business, location: input.location });

    // First validate the business
    const analysis = await this.businessService.analyze(input.business, input.location);
    if (!analysis.supported) {
      return {
        supported: false,
        message: analysis.message
      };
    }

    // Then get forms
    const forms = await this.documentService.getForms(analysis);
    return {
      supported: true,
      forms
    };
  }
}
