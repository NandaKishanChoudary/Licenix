/**
 * Official government portal URLs for each license type in Kerala.
 * Single source of truth used by license discovery and document services.
 */
export interface LicensePortalInfo {
    formName: string;
    portalUrl: string;
    applyOnlineUrl: string;
    submissionMethod: 'online' | 'offline' | 'both';
    departmentName: string;
}
export declare const LICENSE_PORTALS: Record<string, LicensePortalInfo>;
export declare const DEFAULT_PORTAL: LicensePortalInfo;
export declare function getPortalForLicense(licenseId: string): LicensePortalInfo;
//# sourceMappingURL=license-portals.d.ts.map