import { Module } from '@nitrostack/core';
import { BusinessService } from '../../services/business.service.js';
import { LicenseService } from '../../services/license.service.js';
import { RegulationService } from '../../services/regulation.service.js';
import { DocumentService } from '../../services/document.service.js';
import { CacheService } from '../../services/cache.service.js';
import { GovernmentFetcherService } from '../../services/government-fetcher.service.js';
import { LinkValidatorService } from '../../services/link-validator.service.js';
import { DiscoveryTools } from './discovery.tools.js';

@Module({
  name: 'discovery',
  description: 'Restaurant licensing discovery module - analyzes business, discovers licenses, regulations, documents, costs, and timelines',
  providers: [
    BusinessService,
    LicenseService,
    RegulationService,
    DocumentService,
    CacheService,
    GovernmentFetcherService,
    LinkValidatorService
  ],
  controllers: [DiscoveryTools]
})
export class DiscoveryModule {}
