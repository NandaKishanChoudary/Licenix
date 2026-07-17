import { ConfigService } from '@nitrostack/core';
import type { AdvisorRecommendation } from '../types/index.js';
interface AdvisorInput {
    analysis?: any;
    licenses?: any[];
    regulations?: any[];
    documents?: any[];
    costs?: any[];
    timelines?: any[];
}
/**
 * Provides AI-generated or heuristic-based licensing advice
 * Falls back to deterministic recommendations if Claude API is unavailable
 */
export declare class AiAdvisorService {
    private configService;
    constructor(configService: ConfigService);
    /**
     * Generate recommendations based on previous tool outputs
     */
    recommend(input: AdvisorInput): Promise<AdvisorRecommendation>;
    /**
     * Get recommendations from Claude API
     */
    private getClaudeRecommendations;
    /**
     * Generate deterministic recommendations based on structured data
     */
    private getHeuristicRecommendations;
}
export {};
//# sourceMappingURL=ai-advisor.service.d.ts.map