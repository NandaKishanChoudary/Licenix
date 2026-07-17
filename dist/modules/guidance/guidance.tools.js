var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ToolDecorator as Tool, Widget, Injectable, Cache } from '@nitrostack/core';
import { BusinessService } from '../../services/business.service.js';
import { LicenseService } from '../../services/license.service.js';
import { RegulationService } from '../../services/regulation.service.js';
import { DocumentService } from '../../services/document.service.js';
import { CostService } from '../../services/cost.service.js';
import { TimelineService } from '../../services/timeline.service.js';
import { AiAdvisorService } from '../../services/ai-advisor.service.js';
import { licensingInputSchema } from '../shared/licensing-input.schema.js';
/**
 * Guidance tools for restaurant licensing in Kerala
 */
let GuidanceTools = class GuidanceTools {
    businessService;
    licenseService;
    regulationService;
    documentService;
    costService;
    timelineService;
    aiAdvisorService;
    constructor(businessService, licenseService, regulationService, documentService, costService, timelineService, aiAdvisorService) {
        this.businessService = businessService;
        this.licenseService = licenseService;
        this.regulationService = regulationService;
        this.documentService = documentService;
        this.costService = costService;
        this.timelineService = timelineService;
        this.aiAdvisorService = aiAdvisorService;
    }
    /**
     * Tool 5: cost_estimator
     * Estimates licensing costs with caching
     */
    async estimateCosts(input, ctx) {
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
    async estimateTimelines(input, ctx) {
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
    async getAdvisorRecommendations(input, ctx) {
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
    async generateLicensingPackage(input, ctx) {
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
};
__decorate([
    Tool({
        name: 'cost_estimator',
        description: 'Estimate the total cost of obtaining all required licenses for a business in Kerala, including application fees, inspection fees, and renewal costs.',
        inputSchema: licensingInputSchema,
        annotations: {
            readOnlyHint: true,
            idempotentHint: true,
            destructiveHint: false,
            openWorldHint: true
        }
    }),
    Cache({ ttl: 86400, key: (input) => `cost:${input.business}:${input.location}` }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], GuidanceTools.prototype, "estimateCosts", null);
__decorate([
    Tool({
        name: 'timeline_estimator',
        description: 'Estimate the time required to obtain all required licenses for a business in Kerala, including application processing, inspection, and approval timelines.',
        inputSchema: licensingInputSchema,
        annotations: {
            readOnlyHint: true,
            idempotentHint: true,
            destructiveHint: false,
            openWorldHint: true
        }
    }),
    Cache({ ttl: 86400, key: (input) => `timeline:${input.business}:${input.location}` }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], GuidanceTools.prototype, "estimateTimelines", null);
__decorate([
    Tool({
        name: 'ai_advisor',
        description: 'Get AI-powered recommendations for the optimal licensing strategy, including application order, preparation checklist, common mistakes to avoid, and tips for faster approval.',
        inputSchema: licensingInputSchema,
        annotations: {
            readOnlyHint: true,
            idempotentHint: true,
            destructiveHint: false,
            openWorldHint: false
        }
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], GuidanceTools.prototype, "getAdvisorRecommendations", null);
__decorate([
    Tool({
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
    }),
    Widget('licensing-guide'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], GuidanceTools.prototype, "generateLicensingPackage", null);
GuidanceTools = __decorate([
    Injectable({ deps: [BusinessService, LicenseService, RegulationService, DocumentService, CostService, TimelineService, AiAdvisorService] }),
    __metadata("design:paramtypes", [BusinessService,
        LicenseService,
        RegulationService,
        DocumentService,
        CostService,
        TimelineService,
        AiAdvisorService])
], GuidanceTools);
export { GuidanceTools };
//# sourceMappingURL=guidance.tools.js.map