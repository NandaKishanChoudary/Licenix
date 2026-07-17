var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Injectable } from '@nitrostack/core';
import { REGULATIONS } from '../data/restaurant-license-catalog.js';
/**
 * Looks up applicable regulations and acts for a business
 */
let RegulationService = class RegulationService {
    /**
     * Lookup applicable regulations for a business category in Kerala
     */
    async lookup(analysis) {
        if (!analysis.supported || !analysis.businessCategory) {
            return [];
        }
        const category = analysis.businessCategory;
        const state = analysis.state || 'Kerala';
        if (state === 'Kerala') {
            // Find regulations where the category is listed in applicableSectors
            // Or if it's a custom category, return the general ones (Municipality, GST, IT, Labor)
            const matchedRegs = REGULATIONS.filter(reg => {
                if (!reg.applicableSectors)
                    return false;
                // If it's a known preset sector, match it directly
                return reg.applicableSectors.includes(category);
            });
            // Fallback: if somehow no regulations matched, return general ones (applicable to it_company)
            const regsToMap = matchedRegs.length > 0
                ? matchedRegs
                : REGULATIONS.filter(reg => reg.applicableSectors?.includes('it_company'));
            return regsToMap.map(reg => ({
                act: reg.act,
                rules: reg.rules,
                applicableSection: reg.applicableSection,
                complianceNotes: reg.complianceNotes
            }));
        }
        return [];
    }
    /**
     * Get all regulations
     */
    getAllRegulations() {
        return REGULATIONS.map(reg => ({
            act: reg.act,
            rules: reg.rules,
            applicableSection: reg.applicableSection,
            complianceNotes: reg.complianceNotes
        }));
    }
    /**
     * Get regulations by act name
     */
    getRegulationsByAct(actName) {
        return REGULATIONS
            .filter(reg => reg.act.toLowerCase().includes(actName.toLowerCase()))
            .map(reg => ({
            act: reg.act,
            rules: reg.rules,
            applicableSection: reg.applicableSection,
            complianceNotes: reg.complianceNotes
        }));
    }
};
RegulationService = __decorate([
    Injectable()
], RegulationService);
export { RegulationService };
//# sourceMappingURL=regulation.service.js.map