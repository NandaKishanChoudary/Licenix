import { ToolDecorator as Tool, Widget, Injectable, ExecutionContext, Cache } from '@nitrostack/core';
import { z } from 'zod';
import { BusinessService } from '../../services/business.service.js';
import { LicenseService } from '../../services/license.service.js';
import { RegulationService } from '../../services/regulation.service.js';
import { DocumentService } from '../../services/document.service.js';
import { CostService } from '../../services/cost.service.js';
import { TimelineService } from '../../services/timeline.service.js';
import { AiAdvisorService } from '../../services/ai-advisor.service.js';
import { licensingInputSchema, type LicensingInput } from '../shared/licensing-input.schema.js';

/**
 * Guidance tools for licensing in Kerala
 */
@Injectable({ deps: [BusinessService, LicenseService, RegulationService, DocumentService, CostService, TimelineService, AiAdvisorService] })
export class GuidanceTools {
  constructor(
    private businessService: BusinessService,
    private licenseService: LicenseService,
    private regulationService: RegulationService,
    private documentService: DocumentService,
    private costService: CostService,
    private timelineService: TimelineService,
    private aiAdvisorService: AiAdvisorService
  ) {}

  /**
   * Tool 5: cost_estimator
   * Estimates licensing costs with caching and wraps in fee-breakdown widget format
   */
  @Tool({
    name: 'cost_estimator',
    description: 'Estimate the total cost of obtaining all required licenses for a business in Kerala, including application fees, inspection fees, and renewal costs.',
    inputSchema: licensingInputSchema,
    annotations: {
      readOnlyHint: true,
      idempotentHint: true,
      destructiveHint: false,
      openWorldHint: true
    }
  })
  @Cache({ ttl: 86400, key: (input: any) => `cost:${input.business}:${input.location}` })
  @Widget('/fee-breakdown')
  async estimateCosts(
    input: LicensingInput,
    ctx: ExecutionContext
  ): Promise<any> {
    ctx.logger.info('Estimating costs', { business: input.business, location: input.location });

    const analysis = await this.businessService.analyze(input.business, input.location);
    if (!analysis.supported) {
      return {
        supported: false,
        message: analysis.message
      };
    }

    const rawCosts = await this.costService.estimate(analysis);
    let gov = 0;
    let reg = 0;
    let prof = 0;
    let total = typeof rawCosts.totalCost === 'number' ? rawCosts.totalCost : 0;
    if (total > 0) {
      gov = Math.round(total * 0.6);
      reg = Math.round(total * 0.2);
      prof = Math.round(total * 0.2);
    }

    return {
      widget: '/fee-breakdown',
      data: {
        governmentFees: total > 0 ? gov : '₹3,000 - ₹8,000',
        registrationCharges: total > 0 ? reg : '₹1,000 - ₹2,000',
        professionalCharges: total > 0 ? prof : '₹2,500 - ₹5,000',
        totalCost: total > 0 ? total : '₹6,500 - ₹15,000'
      }
    };
  }

  /**
   * Tool 6: timeline_estimator
   * Estimates licensing timelines with caching and wraps in timeline widget format
   */
  @Tool({
    name: 'timeline_estimator',
    description: 'Estimate the time required to obtain all required licenses for a business in Kerala, including application processing, inspection, and approval timelines.',
    inputSchema: licensingInputSchema,
    annotations: {
      readOnlyHint: true,
      idempotentHint: true,
      destructiveHint: false,
      openWorldHint: true
    }
  })
  @Cache({ ttl: 86400, key: (input: any) => `timeline:${input.business}:${input.location}` })
  @Widget('/application-timeline')
  async estimateTimelines(
    input: LicensingInput,
    ctx: ExecutionContext
  ): Promise<any> {
    ctx.logger.info('Estimating timelines', { business: input.business, location: input.location });

    const analysis = await this.businessService.analyze(input.business, input.location);
    if (!analysis.supported) {
      return {
        supported: false,
        message: analysis.message
      };
    }

    const rawTimeline = await this.timelineService.estimate(analysis);
    const steps = (rawTimeline.timelineBreakdown || []).map(t => ({
      name: t.licenseName,
      estimatedDays: t.totalDuration,
      status: 'Pending',
      department: 'Government Body'
    }));

    return {
      widget: '/application-timeline',
      data: {
        steps
      }
    };
  }

  /**
   * Tool 7: ai_advisor
   * Provides AI-generated recommendations and wraps in compliance-dashboard widget format
   */
  @Tool({
    name: 'ai_advisor',
    description: 'Get AI-powered recommendations for the optimal licensing strategy, including application order, preparation checklist, common mistakes to avoid, and tips for faster approval.',
    inputSchema: licensingInputSchema,
    annotations: {
      readOnlyHint: true,
      idempotentHint: true,
      destructiveHint: false,
      openWorldHint: false
    }
  })
  @Widget('/compliance-dashboard')
  async getAdvisorRecommendations(
    input: LicensingInput,
    ctx: ExecutionContext
  ): Promise<any> {
    ctx.logger.info('Getting advisor recommendations', { business: input.business, location: input.location });

    const analysis = await this.businessService.analyze(input.business, input.location);
    if (!analysis.supported) {
      return {
        supported: false,
        message: analysis.message
      };
    }

    const [licenses, regulations, forms, costs, timelines] = await Promise.all([
      this.licenseService.discover(analysis),
      this.regulationService.lookup(analysis),
      this.documentService.getForms(analysis),
      this.costService.estimate(analysis),
      this.timelineService.estimate(analysis)
    ]);

    const advice = await this.aiAdvisorService.recommend({
      analysis,
      licenses,
      regulations,
      documents: forms,
      costs: costs.costBreakdown,
      timelines: timelines.timelineBreakdown
    });

    const warnings = advice.warnings || [];

    return {
      widget: '/compliance-dashboard',
      data: {
        completed: 0,
        pending: licenses.length,
        expiringSoon: 0,
        renewalRequired: 0,
        warnings
      }
    };
  }

  /**
   * Tool 8: generate_licensing_package (orchestrator)
   * Runs the full licensing pipeline and returns a complete guide wrapped in business-summary widget format
   */
  @Tool({
    name: 'generate_licensing_package',
    description: 'Generate a complete, AI-guided licensing roadmap for a business in Kerala. Orchestrates all discovery and guidance services to provide a comprehensive licensing guide with costs, timelines, required documents, and step-by-step advice.',
    inputSchema: licensingInputSchema,
    invocation: { invoking: 'Assembling your complete licensing guide...', invoked: 'Your licensing guide is ready!' },
    annotations: {
      readOnlyHint: true,
      idempotentHint: true,
      destructiveHint: false,
      openWorldHint: true
    }
  })
  @Widget('/business-summary')
  async generateLicensingPackage(
    input: LicensingInput,
    ctx: ExecutionContext
  ): Promise<any> {
    ctx.logger.info('Generating licensing package', { business: input.business, location: input.location });

    const analysis = await this.businessService.analyze(input.business, input.location);
    if (!analysis.supported) {
      return {
        supported: false,
        message: analysis.message
      };
    }

    const regulations = await this.regulationService.lookup(analysis);

    return {
      widget: '/business-summary',
      data: {
        businessName: input.business,
        sector: analysis.sectorLabel || 'General Business',
        state: analysis.state || 'Kerala',
        district: analysis.district || 'Kerala',
        riskCategory: analysis.businessCategory === 'hospital' || analysis.businessCategory === 'pharmacy' ? 'High Risk' : 'Medium Risk',
        applicableActs: regulations.map(r => r.act),
        applicableAuthorities: analysis.departments || []
      }
    };
  }
}
