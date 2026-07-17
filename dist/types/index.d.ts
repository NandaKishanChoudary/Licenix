/**
 * Shared types for the Smart Licensing Assistant
 */
export interface GovernmentPortal {
    formName: string;
    portalUrl: string;
    applyOnlineUrl: string;
    verified: boolean;
    submissionMethod: 'online' | 'offline' | 'both';
}
export interface BusinessAnalysis {
    supported: boolean;
    message?: string;
    businessInput?: string;
    businessCategory?: string;
    sectorLabel?: string;
    state?: string;
    district?: string;
    departments?: string[];
}
export interface License {
    id: string;
    name: string;
    mandatory: boolean;
    issuingDepartment: string;
    description: string;
    renewalFrequency: string;
    imageUrl?: string;
    governmentPortal?: GovernmentPortal;
}
export interface LicenseDiscovery {
    supported: boolean;
    message?: string;
    licenses?: License[];
}
export interface Document {
    name: string;
    required: boolean;
    description?: string;
}
export interface LicenseForm {
    licenseId: string;
    licenseName: string;
    requiredDocuments: Document[];
    officialForm: {
        name: string;
        url: string;
        verified: boolean;
    };
    applyOnlineLink?: {
        url: string;
        verified: boolean;
    };
    submissionMethod: 'online' | 'offline' | 'both';
    departmentContact: {
        name: string;
        phone?: string;
        email?: string;
        address?: string;
    };
    imageUrl?: string;
}
export interface DocumentAndForms {
    supported: boolean;
    message?: string;
    forms?: LicenseForm[];
}
export interface Regulation {
    act: string;
    rules: string[];
    applicableSection?: string;
    complianceNotes: string;
}
export interface RegulationLookup {
    supported: boolean;
    message?: string;
    regulations?: Regulation[];
}
export interface CostBreakdown {
    licenseId: string;
    licenseName: string;
    applicationFee: string | number;
    inspectionFee: string | number;
    renewalFee: string | number;
    totalEstimatedCost: string | number;
    notes?: string;
}
export interface CostEstimate {
    supported: boolean;
    message?: string;
    costBreakdown?: CostBreakdown[];
    totalCost: string | number;
}
export interface TimelineBreakdown {
    licenseId: string;
    licenseName: string;
    applicationProcessing: string;
    inspectionDuration: string;
    approvalDuration: string;
    totalDuration: string;
    notes?: string;
}
export interface TimelineEstimate {
    supported: boolean;
    message?: string;
    timelineBreakdown?: TimelineBreakdown[];
    overallDuration: string;
}
export interface AdvisorRecommendation {
    supported: boolean;
    message?: string;
    applicationOrder?: string[];
    preparationChecklist?: string[];
    documentsToPrepareFist?: string[];
    commonMistakes?: string[];
    warnings?: string[];
    expectedCompletionTime?: string;
    tipsForFasterApproval?: string[];
}
export interface LicensingPackage {
    supported: boolean;
    message?: string;
    analysis?: BusinessAnalysis;
    licenses?: License[];
    regulations?: Regulation[];
    forms?: LicenseForm[];
    costs?: CostBreakdown[];
    timelines?: TimelineBreakdown[];
    advice?: AdvisorRecommendation;
}
//# sourceMappingURL=index.d.ts.map