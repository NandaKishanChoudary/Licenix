import { Injectable } from '@nitrostack/core';
import { REGULATIONS } from '../data/restaurant-license-catalog.js';
import type { BusinessAnalysis, Regulation } from '../types/index.js';

/**
 * Looks up applicable regulations and acts for a business
 */
@Injectable()
export class RegulationService {
  /**
   * Lookup applicable regulations for a business category in Kerala
   */
  async lookup(analysis: BusinessAnalysis): Promise<Regulation[]> {
    if (!analysis.supported || !analysis.businessCategory) {
      return [];
    }

    const category = analysis.businessCategory;
    const state = analysis.state || 'Kerala';

    if (state === 'Kerala') {
      // Find regulations where the category is listed in applicableSectors
      // Or if it's a custom category, return the general ones (Municipality, GST, IT, Labor)
      const matchedRegs = REGULATIONS.filter(reg => {
        if (!reg.applicableSectors) return false;
        
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
  getAllRegulations(): Regulation[] {
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
  getRegulationsByAct(actName: string): Regulation[] {
    return REGULATIONS
      .filter(reg => reg.act.toLowerCase().includes(actName.toLowerCase()))
      .map(reg => ({
        act: reg.act,
        rules: reg.rules,
        applicableSection: reg.applicableSection,
        complianceNotes: reg.complianceNotes
      }));
  }
}
