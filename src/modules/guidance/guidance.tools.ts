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
import type { CostEstimate, TimelineEstimate, AdvisorRecommendation, LicensingPackage } from '../../types/index.js';

/**
 * Guidance tools for restaurant licensing in Kerala
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
   * Estimates licensing costs with caching
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
  async estimateCosts(
    input: LicensingInput,
    ctx: ExecutionContext
  ): Promise<CostEstimate> {
    ctx.logger.info('Estimating costs', { business: input.business, location: input.location });

    // First validate the business
    const analysis = await this.businessService.analyze(input.business, input.location);
    if (!analysis.supported) {
      return {
        supported: false,
        message: analysis.message,
        totalCost: 'unavailable'
      };
    }

    // Then estimate costs
    return this.costService.estimate(analysis);
  }

  /**
   * Tool 6: timeline_estimator
   * Estimates licensing timelines with caching
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
  async estimateTimelines(
    input: LicensingInput,
    ctx: ExecutionContext
  ): Promise<TimelineEstimate> {
    ctx.logger.info('Estimating timelines', { business: input.business, location: input.location });

    // First validate the business
    const analysis = await this.businessService.analyze(input.business, input.location);
    if (!analysis.supported) {
      return {
        supported: false,
        message: analysis.message,
        overallDuration: 'unavailable'
      };
    }

    // Then estimate timelines
    return this.timelineService.estimate(analysis);
  }

  /**
   * Tool 7: ai_advisor
   * Provides AI-generated or heuristic-based recommendations
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
  async getAdvisorRecommendations(
    input: LicensingInput,
    ctx: ExecutionContext
  ): Promise<AdvisorRecommendation> {
    ctx.logger.info('Getting advisor recommendations', { business: input.business, location: input.location });

    // First validate the business
    const analysis = await this.businessService.analyze(input.business, input.location);
    if (!analysis.supported) {
      return {
        supported: false,
        message: analysis.message
      };
    }

    // Gather all data for advisor
    const [licenses, regulations, forms, costs, timelines] = await Promise.all([
      this.licenseService.discover(analysis),
      this.regulationService.lookup(analysis),
      this.documentService.getForms(analysis),
      this.costService.estimate(analysis),
      this.timelineService.estimate(analysis)
    ]);

    // Get recommendations
    return this.aiAdvisorService.recommend({
      analysis,
      licenses,
      regulations,
      documents: forms,
      costs: costs.costBreakdown,
      timelines: timelines.timelineBreakdown
    });
  }

  /**
   * Tool 8: generate_licensing_package (orchestrator)
   * Runs the full licensing pipeline and returns a complete guide
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
  @Widget('licensing-guide')
  async generateLicensingPackage(
    input: LicensingInput,
    ctx: ExecutionContext
  ): Promise<LicensingPackage> {
    ctx.logger.info('Generating licensing package', { business: input.business, location: input.location });

    // Step 1: Analyze business
    const analysis = await this.businessService.analyze(input.business, input.location);
    if (!analysis.supported) {
      return {
        supported: false,
        message: analysis.message
      };
    }

    // Step 2: Gather all data in parallel
    const [licenses, regulations, forms, costs, timelines] = await Promise.all([
      this.licenseService.discover(analysis),
      this.regulationService.lookup(analysis),
      this.documentService.getForms(analysis),
      this.costService.estimate(analysis),
      this.timelineService.estimate(analysis)
    ]);

    // Step 3: Get AI recommendations
    const advice = await this.aiAdvisorService.recommend({
      analysis,
      licenses,
      regulations,
      documents: forms,
      costs: costs.costBreakdown,
      timelines: timelines.timelineBreakdown
    });

    // Step 4: Assemble the complete package
    return {
      supported: true,
      analysis,
      licenses,
      regulations,
      forms,
      costs: costs.costBreakdown,
      timelines: timelines.timelineBreakdown,
      advice
    };
  }
}
