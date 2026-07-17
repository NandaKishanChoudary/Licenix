/**
 * License Catalog for Kerala (All Sectors)
 * Stable taxonomy of licenses, documents, departments, and regulations
 */
export interface LicenseCatalogItem {
    id: string;
    name: string;
    mandatory: boolean;
    issuingDepartment: string;
    description: string;
    renewalFrequency: string;
    imageUrl?: string;
}
export declare const ALL_LICENSES: LicenseCatalogItem[];
export declare const SECTOR_DISPLAY_NAMES: Record<string, string>;
export declare const SUPPORTED_SECTORS: string[];
export declare const SECTOR_LICENSES: Record<string, string[]>;
export declare const RESTAURANT_LICENSES: LicenseCatalogItem[];
export declare const KERALA_DISTRICTS: string[];
export declare const GOVERNMENT_DEPARTMENTS: {
    'Municipal Corporation': {
        name: string;
        phone: string;
        email: string;
    };
    FSSAI: {
        name: string;
        phone: string;
        email: string;
        website: string;
    };
    GST: {
        name: string;
        phone: string;
        email: string;
        website: string;
    };
    Fire: {
        name: string;
        phone: string;
        email: string;
    };
    KSPCB: {
        name: string;
        phone: string;
        email: string;
        website: string;
    };
    Health: {
        name: string;
        phone: string;
        email: string;
    };
    Excise: {
        name: string;
        phone: string;
        email: string;
    };
    'Income Tax': {
        name: string;
        phone: string;
        email: string;
        website: string;
    };
    Labor: {
        name: string;
        phone: string;
        email: string;
    };
    'Drugs Control': {
        name: string;
        phone: string;
        email: string;
        website: string;
    };
    'Clinical Establishments': {
        name: string;
        phone: string;
        email: string;
        website: string;
    };
    Education: {
        name: string;
        phone: string;
        email: string;
        website: string;
    };
    'Factories and Boilers': {
        name: string;
        phone: string;
        email: string;
        website: string;
    };
    'Legal Metrology': {
        name: string;
        phone: string;
        email: string;
        website: string;
    };
    Tourism: {
        name: string;
        phone: string;
        email: string;
        website: string;
    };
};
export declare const REGULATIONS: {
    act: string;
    rules: string[];
    applicableSection: string;
    complianceNotes: string;
    applicableSectors: string[];
}[];
//# sourceMappingURL=restaurant-license-catalog.d.ts.map