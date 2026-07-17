var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nitrostack/core';
import { BusinessService } from '../../services/business.service.js';
import { LicenseService } from '../../services/license.service.js';
import { RegulationService } from '../../services/regulation.service.js';
import { DocumentService } from '../../services/document.service.js';
import { CacheService } from '../../services/cache.service.js';
import { GovernmentFetcherService } from '../../services/government-fetcher.service.js';
import { LinkValidatorService } from '../../services/link-validator.service.js';
import { DiscoveryTools } from './discovery.tools.js';
let DiscoveryModule = class DiscoveryModule {
};
DiscoveryModule = __decorate([
    Module({
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
], DiscoveryModule);
export { DiscoveryModule };
//# sourceMappingURL=discovery.module.js.map