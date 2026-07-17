import { Injectable, ConfigService } from '@nitrostack/core';
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
@Injectable({ deps: [ConfigService] })
export class AiAdvisorService {
  constructor(private configService: ConfigService) {}

  /**
   * Generate recommendations based on previous tool outputs
   */
  async recommend(input: AdvisorInput): Promise<AdvisorRecommendation> {
    if (!input.analysis?.supported) {
      return {
        supported: false,
        message: 'Cannot generate recommendations for unsupported business'
      };
    }

    // Try to use Claude API if available, otherwise use heuristic
    const apiKey = this.configService.get('ANTHROPIC_API_KEY');
    
    if (apiKey) {
      try {
        return await this.getClaudeRecommendations(input, apiKey);
      } catch (error) {
        // Fall back to heuristic if Claude fails
      }
    }

    // Heuristic-based recommendations
    return this.getHeuristicRecommendations(input);
  }

  /**
   * Get recommendations from Claude API
   */
  private async getClaudeRecommendations(input: AdvisorInput, apiKey: string): Promise<AdvisorRecommendation> {
    // In a real implementation, this would call the Claude API
    // For now, we'll use the heuristic approach
    return this.getHeuristicRecommendations(input);
  }

  /**
   * Generate deterministic recommendations based on structured data
   */
  private getHeuristicRecommendations(input: AdvisorInput): AdvisorRecommendation {
    const licenses = input.licenses || [];
    const category = input.analysis?.businessCategory || 'general';

    // Helper to check if a specific license ID is present
    const hasLicense = (id: string) => licenses.some((l: any) => l.id === id);

    // Predefined dependency hierarchy for sorting
    const dependencyRank: Record<string, number> = {
      'pan-registration': 1,
      'building-plan-approval': 2,
      'occupancy-certificate': 3,
      'trade-license': 4,
      'gst': 5,
      'labor-registration': 6,
      'pollution-consent': 7,
      'fire-noc': 8,
      'fssai': 9,
      'drug-license': 9,
      'clinical-establishment': 9,
      'school-noc': 9,
      'factory-license': 9,
      'legal-metrology': 10,
      'health-certificate': 11,
      'signage-permission': 12,
      'liquor-license': 13,
      'star-classification': 14
    };

    // Sort licenses that are present by dependency rank
    const sortedLicenses = [...licenses].sort((a, b) => {
      const rankA = dependencyRank[a.id] || 99;
      const rankB = dependencyRank[b.id] || 99;
      return rankA - rankB;
    });

    const applicationOrder = sortedLicenses.map(l => l.name);

    // Dynamic preparation checklist
    const preparationChecklist = [
      'Gather all personal documents (Aadhaar Card, PAN Card, Passport photos)'
    ];

    if (hasLicense('building-plan-approval')) {
      preparationChecklist.push('Prepare building plans and architectural drawings');
    }
    if (hasLicense('trade-license')) {
      preparationChecklist.push('Arrange proof of premises (rental agreement or property deed)');
    }
    if (hasLicense('fssai')) {
      preparationChecklist.push('Get water quality testing and laboratory reports done');
      preparationChecklist.push('Create food safety plan and detailed menu card');
    }
    if (hasLicense('pollution-consent')) {
      preparationChecklist.push('Prepare solid, liquid, or bio-medical waste management plan');
    }
    if (hasLicense('health-certificate')) {
      preparationChecklist.push('Arrange staff health and medical fitness certificates');
    }
    if (hasLicense('labor-registration')) {
      preparationChecklist.push('Prepare employee list and salary/wage structures');
    }
    if (hasLicense('fire-noc')) {
      preparationChecklist.push('Set up basic fire safety measures (extinguishers, fire hydrants, exit signs)');
    }
    if (hasLicense('drug-license')) {
      preparationChecklist.push('Hire a registered pharmacist and purchase refrigerator/AC for cold chain storage');
    }
    if (hasLicense('clinical-establishment')) {
      preparationChecklist.push('Verify Doctor registrations (TCMC) and facility infrastructure specs');
    }
    if (hasLicense('school-noc')) {
      preparationChecklist.push('Obtain building fitness certificate from PWD/LSGD engineer and sanitary fitness from Health Inspector');
    }
    if (hasLicense('factory-license')) {
      preparationChecklist.push('Obtain stability certificate from authorized competent person');
    }
    if (hasLicense('legal-metrology')) {
      preparationChecklist.push('List and verify all commercial weighing and measuring instruments');
    }
    if (hasLicense('liquor-license')) {
      preparationChecklist.push('Obtain distance certificate and police clearance certificate');
    }

    // Dynamic documents to prepare first
    const documentsToPrepareFist = [
      'Aadhaar Card',
      'PAN Card',
      'Rental Agreement / Property Deed'
    ];

    if (hasLicense('building-plan-approval') || hasLicense('occupancy-certificate')) {
      documentsToPrepareFist.push('Building Plan Approval / Drawings');
    }
    if (hasLicense('drug-license')) {
      documentsToPrepareFist.push('Registered Pharmacist Certificate');
    }
    if (hasLicense('clinical-establishment')) {
      documentsToPrepareFist.push('Doctor Council Registration Certificates');
    }

    // Dynamic common mistakes
    const commonMistakes = [
      'Applying for licenses in the wrong order (dependencies matter)',
      'Incomplete documentation leading to rejections',
      'Not getting building permit/plan approval before commercial lease commitment'
    ];

    if (hasLicense('fssai')) {
      commonMistakes.push('Not verifying water quality before FSSAI application');
    }
    if (hasLicense('pollution-consent')) {
      commonMistakes.push('Inadequate waste management planning (KSPCB violations can lead to closure)');
    }
    if (hasLicense('fire-noc')) {
      commonMistakes.push('Ignoring fire safety requirements (non-compliant emergency exits)');
    }
    if (hasLicense('drug-license')) {
      commonMistakes.push('Stocking medicines without a registered pharmacist present');
    }

    // Dynamic warnings
    const warnings = [
      'Ensure all business name filings match exactly across PAN, GST, and Trade License'
    ];

    if (hasLicense('building-plan-approval')) {
      warnings.push('Building plan approval is mandatory before starting any physical construction or alterations');
    }
    if (hasLicense('fssai')) {
      warnings.push('FSSAI inspection is mandatory - premises must meet food safety standards');
    }
    if (hasLicense('fire-noc')) {
      warnings.push('Fire NOC requires proper fire safety measures - non-negotiable for public safety');
    }
    if (hasLicense('pollution-consent')) {
      warnings.push('Pollution consent requires waste management plan - violations can lead to immediate closure');
    }
    if (hasLicense('drug-license')) {
      warnings.push('Sale of drugs without a valid retail/wholesale license is a severe criminal offense');
    }

    // Expected completion time
    const complexSectors = ['hospital', 'school', 'manufacturing', 'hotel'];
    const expectedCompletionTime = complexSectors.includes(category) || hasLicense('liquor-license')
      ? '3-6 months (due to multi-stage departmental clearances)' 
      : '2-4 months (standard compliance process)';

    // Tips for faster approval
    const tipsForFasterApproval = [
      'Apply for licenses in the recommended order to avoid delays',
      'Prepare all documents before applying - incomplete applications cause rejections',
      'Use online portals (K-SMART for local bodies, K-SWIFT for single-window) to expedite processing',
      'Regularly follow up with local self-government inspectors - don\'t wait for automatic updates',
      'Ensure premises meet all safety and sanitation standards before inspection dates'
    ];

    return {
      supported: true,
      applicationOrder,
      preparationChecklist,
      documentsToPrepareFist,
      commonMistakes,
      warnings,
      expectedCompletionTime,
      tipsForFasterApproval
    };
  }
}
