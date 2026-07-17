import { ExecutionContext } from '@nitrostack/core';
import { BusinessService } from '../../services/business.service.js';
import { LicenseService } from '../../services/license.service.js';
import { RegulationService } from '../../services/regulation.service.js';
import { DocumentService } from '../../services/document.service.js';
import { CostService } from '../../services/cost.service.js';
import { TimelineService } from '../../services/timeline.service.js';
import { AiAdvisorService } from '../../services/ai-advisor.service.js';
import { type LicensingInput } from '../shared/licensing-input.schema.js';
import type { CostEstimate, TimelineEstimate, AdvisorRecommendation, LicensingPackage } from '../../types/index.js';
/**
 * Guidance tools for restaurant licensing in Kerala
 */
export declare class GuidanceTools {
    private businessService;
    private licenseService;
    private regulationService;
    private documentService;
    private costService;
    private timelineService;
    private aiAdvisorService;
    constructor(businessService: BusinessService, licenseService: LicenseService, regulationService: RegulationService, documentService: DocumentService, costService: CostService, timelineService: TimelineService, aiAdvisorService: AiAdvisorService);
    /**
     * Tool 5: cost_estimator
     * Estimates licensing costs with caching
     */
    estimateCosts(input: LicensingInput, ctx: ExecutionContext): Promise<CostEstimate>;
    /**
     * Tool 6: timeline_estimator
     * Estimates licensing timelines with caching
     */
    estimateTimelines(input: LicensingInput, ctx: ExecutionContext): Promise<TimelineEstimate>;
    /**
     * Tool 7: ai_advisor
     * Provides AI-generated or heuristic-based recommendations
     */
    getAdvisorRecommendations(input: LicensingInput, ctx: ExecutionContext): Promise<AdvisorRecommendation>;
    /**
     * Tool 8: generate_licensing_package (orchestrator)
     * Runs the full licensing pipeline and returns a complete guide
     */
    generateLicensingPackage(input: LicensingInput, ctx: ExecutionContext): Promise<LicensingPackage>;
}
//# sourceMappingURL=guidance.tools.d.ts.map