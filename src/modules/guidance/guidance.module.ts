import { Module } from '@nitrostack/core';
import { BusinessService } from '../../services/business.service.js';
import { LicenseService } from '../../services/license.service.js';
import { RegulationService } from '../../services/regulation.service.js';
import { DocumentService } from '../../services/document.service.js';
import { CostService } from '../../services/cost.service.js';
import { TimelineService } from '../../services/timeline.service.js';
import { AiAdvisorService } from '../../services/ai-advisor.service.js';
import { CacheService } from '../../services/cache.service.js';
import { GovernmentFetcherService } from '../../services/government-fetcher.service.js';
import { LinkValidatorService } from '../../services/link-validator.service.js';
import { GuidanceTools } from './guidance.tools.js';

@Module({
  name: 'guidance',
  description: 'Restaurant licensing guidance module - generates complete licensing packages with AI-powered advice',
  providers: [
    BusinessService,
    LicenseService,
    RegulationService,
    DocumentService,
    CostService,
    TimelineService,
    AiAdvisorService,
    CacheService,
    GovernmentFetcherService,
    LinkValidatorService
  ],
  controllers: [GuidanceTools]
})
export class GuidanceModule {}
