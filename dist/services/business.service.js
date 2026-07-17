var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Injectable } from '@nitrostack/core';
import { ALL_LICENSES, KERALA_DISTRICTS, SECTOR_LICENSES, SECTOR_DISPLAY_NAMES } from '../data/restaurant-license-catalog.js';
/**
 * Validates business type and location, identifies responsible departments
 */
let BusinessService = class BusinessService {
    /**
     * Analyze business type and location
     * Returns supported status, category, state, district, and departments
     */
    async analyze(business, location) {
        const normalizedBusiness = business.toLowerCase().trim();
        const normalizedLocation = location.toLowerCase().trim();
        // Check if location is in Kerala
        const district = this.findDistrict(normalizedLocation);
        if (!district) {
            return {
                supported: false,
                message: `${location} is not a valid location in Kerala. Please specify a Kerala district such as Kochi, Kozhikode, Thiruvananthapuram, etc.`
            };
        }
        // Determine target sector category
        const sector = this.determineSector(normalizedBusiness);
        if (!sector) {
            return {
                supported: false,
                message: `The business type "${business}" is too vague. Please specify a concrete type of business (e.g. restaurant, pharmacy, hospital, IT company, salon, gym).`
            };
        }
        const departments = this.getResponsibleDepartments(sector);
        return {
            supported: true,
            businessInput: business.trim(),
            businessCategory: sector,
            sectorLabel: SECTOR_DISPLAY_NAMES[sector] ?? SECTOR_DISPLAY_NAMES.general,
            state: 'Kerala',
            district,
            departments
        };
    }
    /**
     * Fuzzy matches input business string to one of the supported sectors or "general"
     */
    determineSector(business) {
        const b = business.toLowerCase().trim();
        // Check for vague business descriptions
        const vagueWords = ['business', 'company', 'firm', 'venture', 'enterprise', 'something', 'anything', 'shop', 'store'];
        if (!b || vagueWords.includes(b) || b.length < 3) {
            return null;
        }
        const sectorKeywords = {
            restaurant: [
                "restaurant",
                "food",
                "cafe",
                "bakery",
                "canteen",
                "diner",
                "eatery",
                "juice",
                "coffee",
                "pizza",
                "pub",
                "bar",
                "lounge",
                "brewery"
            ],
            pharmacy: [
                "pharmacy",
                "drug",
                "chemist",
                "medical store",
                "medicine"
            ],
            hotel: [
                "hotel",
                "resort",
                "lodge",
                "homestay",
                "hostel",
                "guest house",
                "inn"
            ],
            hospital: [
                "hospital",
                "clinic",
                "healthcare",
                "medical center",
                "diagnostic",
                "lab",
                "dental",
                "physiotherapy"
            ],
            school: [
                "school",
                "college",
                "academy",
                "education",
                "training",
                "tuition",
                "university",
                "kindergarten"
            ],
            manufacturing: [
                "factory",
                "manufacturing",
                "industry",
                "plant",
                "production",
                "mill",
                "workshop"
            ],
            retail: [
                "retail",
                "shop",
                "store",
                "supermarket",
                "boutique",
                "electronics",
                "mobile shop",
                "clothing",
                "fashion",
                "grocery",
                "gift shop"
            ],
            it_company: [
                "software",
                "it",
                "technology",
                "startup",
                "consultancy",
                "agency",
                "web",
                "ai",
                "cyber",
                "computer",
                "digital"
            ],
            // Additional keywords that map to general sector baseline licenses
            salon: ["salon", "beauty", "spa", "parlour", "parlor", "barber"],
            gym: ["gym", "fitness", "yoga", "sports", "wellness"],
            agriculture: ["farm", "agriculture", "dairy", "poultry", "fishery", "aquaculture"],
            transport: ["transport", "logistics", "courier", "taxi", "travel agency"],
            construction: ["construction", "builder", "contractor", "real estate"]
        };
        // Keywords that should map to general sector (checked after named sectors)
        const generalSectorKeywords = [
            ...(sectorKeywords.salon ?? []),
            ...(sectorKeywords.gym ?? []),
            ...(sectorKeywords.agriculture ?? []),
            ...(sectorKeywords.transport ?? []),
            ...(sectorKeywords.construction ?? [])
        ];
        for (const [sector, keywords] of Object.entries(sectorKeywords)) {
            if (['salon', 'gym', 'agriculture', 'transport', 'construction'].includes(sector)) {
                continue;
            }
            if (keywords.some(keyword => b.includes(keyword))) {
                return sector;
            }
        }
        if (generalSectorKeywords.some(keyword => b.includes(keyword))) {
            return "general";
        }
        // Any unrecognized business type still gets baseline general licenses
        return "general";
    }
    /**
     * Find a Kerala district by name (fuzzy matching)
     */
    findDistrict(location) {
        // Exact match
        const exact = KERALA_DISTRICTS.find(d => d.toLowerCase() === location);
        if (exact)
            return exact;
        // Partial match (e.g., "kochi" -> "Ernakulam")
        const partialMatches = {
            'kochi': 'Ernakulam',
            'cochin': 'Ernakulam',
            'thiruvananthapuram': 'Thiruvananthapuram',
            'trivandrum': 'Thiruvananthapuram',
            'tvpm': 'Thiruvananthapuram',
            'kozhikode': 'Kozhikode',
            'calicut': 'Kozhikode',
            'kannur': 'Kannur',
            'cannanore': 'Kannur',
            'thrissur': 'Thrissur',
            'trichur': 'Thrissur',
            'malappuram': 'Malappuram',
            'palakkad': 'Palakkad',
            'palghat': 'Palakkad',
            'alappuzha': 'Alappuzha',
            'alleppey': 'Alappuzha',
            'kottayam': 'Kottayam',
            'idukki': 'Idukki',
            'wayanad': 'Wayanad',
            'kasaragod': 'Kasaragod',
            'kollam': 'Kollam',
            'quilon': 'Kollam',
            'pathanamthitta': 'Pathanamthitta'
        };
        return partialMatches[location] || null;
    }
    /**
     * Get list of responsible government departments for a given sector
     */
    getResponsibleDepartments(sector) {
        const defaultDeps = [
            'Municipal Corporation / Panchayat',
            'GST Authority',
            'Income Tax Department',
            'Department of Labor'
        ];
        switch (sector) {
            case 'restaurant':
                return [
                    ...defaultDeps,
                    'Food Safety and Standards Authority of India (FSSAI)',
                    'Fire and Rescue Services',
                    'Kerala State Pollution Control Board (KSPCB)',
                    'Health Department'
                ];
            case 'pharmacy':
                return [
                    ...defaultDeps,
                    'Drugs Control Department'
                ];
            case 'hotel':
                return [
                    ...defaultDeps,
                    'Food Safety and Standards Authority of India (FSSAI)',
                    'Fire and Rescue Services',
                    'Kerala State Pollution Control Board (KSPCB)',
                    'Health Department',
                    'Excise Department (if applicable)',
                    'Ministry of Tourism'
                ];
            case 'hospital':
                return [
                    ...defaultDeps,
                    'Kerala State Council for Clinical Establishments',
                    'Fire and Rescue Services',
                    'Kerala State Pollution Control Board (KSPCB)',
                    'Health Department'
                ];
            case 'school':
                return [
                    'Municipal Corporation / Panchayat',
                    'General Education Department',
                    'Fire and Rescue Services',
                    'Health Department',
                    'Department of Labor',
                    'Income Tax Department'
                ];
            case 'manufacturing':
                return [
                    ...defaultDeps,
                    'Directorate of Factories and Boilers',
                    'Fire and Rescue Services',
                    'Kerala State Pollution Control Board (KSPCB)'
                ];
            case 'retail':
                return [
                    ...defaultDeps,
                    'Legal Metrology Department'
                ];
            case 'it_company':
                return defaultDeps;
            default:
                return defaultDeps;
        }
    }
    /**
     * Get all licenses required for a sector (fallback to general)
     */
    getRequiredLicenses(sector = 'general') {
        const targetSector = SECTOR_LICENSES[sector] ? sector : 'general';
        const licenseIds = SECTOR_LICENSES[targetSector];
        return ALL_LICENSES.filter(l => licenseIds.includes(l.id));
    }
    /**
     * Get mandatory licenses only
     */
    getMandatoryLicenses(sector = 'general') {
        return this.getRequiredLicenses(sector).filter(l => l.mandatory);
    }
    /**
     * Get optional licenses
     */
    getOptionalLicenses(sector = 'general') {
        return this.getRequiredLicenses(sector).filter(l => !l.mandatory);
    }
};
BusinessService = __decorate([
    Injectable()
], BusinessService);
export { BusinessService };
//# sourceMappingURL=business.service.js.map