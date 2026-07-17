import type { BusinessAnalysis, Regulation } from '../types/index.js';
/**
 * Looks up applicable regulations and acts for a business
 */
export declare class RegulationService {
    /**
     * Lookup applicable regulations for a business category in Kerala
     */
    lookup(analysis: BusinessAnalysis): Promise<Regulation[]>;
    /**
     * Get all regulations
     */
    getAllRegulations(): Regulation[];
    /**
     * Get regulations by act name
     */
    getRegulationsByAct(actName: string): Regulation[];
}
//# sourceMappingURL=regulation.service.d.ts.map