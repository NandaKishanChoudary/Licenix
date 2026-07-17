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

export const LICENSE_PORTALS: Record<string, LicensePortalInfo> = {
  'trade-license': {
    formName: 'K-SMART IFTE & OS License Application Form',
    portalUrl: 'https://ksmart.lsgkerala.gov.in/',
    applyOnlineUrl: 'https://ksmart.lsgkerala.gov.in/ksmart/pages/service-details/trade-license',
    submissionMethod: 'online',
    departmentName: 'Municipal Corporation / Panchayat (via K-SMART)'
  },
  fssai: {
    formName: 'FoSCoS FSSAI Form A (Registration) / Form B (License)',
    portalUrl: 'https://foscos.fssai.gov.in/',
    applyOnlineUrl: 'https://foscos.fssai.gov.in/apply-for-lic-reg',
    submissionMethod: 'online',
    departmentName: 'Food Safety and Standards Authority of India (FoSCoS)'
  },
  gst: {
    formName: 'GST Registration Form (REG-01)',
    portalUrl: 'https://www.gst.gov.in/',
    applyOnlineUrl: 'https://reg.gst.gov.in/registration/',
    submissionMethod: 'online',
    departmentName: 'GST Authority (GSTN)'
  },
  'fire-noc': {
    formName: 'Kerala Fire NOC e-Services Application Form',
    portalUrl: 'https://fire.kerala.gov.in/',
    applyOnlineUrl: 'https://fire.kerala.gov.in/eservice/',
    submissionMethod: 'both',
    departmentName: 'Kerala Fire and Rescue Services Department'
  },
  'pollution-consent': {
    formName: 'KSPCB Consent to Establish/Operate Form (OCMMS)',
    portalUrl: 'https://kspcb.gov.in/',
    applyOnlineUrl: 'https://krocmms.nic.in/',
    submissionMethod: 'online',
    departmentName: 'Kerala State Pollution Control Board (KSPCB)'
  },
  'health-certificate': {
    formName: 'K-SMART Municipal Health Certificate Application',
    portalUrl: 'https://ksmart.lsgkerala.gov.in/',
    applyOnlineUrl: 'https://ksmart.lsgkerala.gov.in/',
    submissionMethod: 'both',
    departmentName: 'Health Department, Local Self Government (LSGD)'
  },
  'signage-permission': {
    formName: 'K-SMART Signage & Advertisement Board Permission Form',
    portalUrl: 'https://ksmart.lsgkerala.gov.in/',
    applyOnlineUrl: 'https://ksmart.lsgkerala.gov.in/',
    submissionMethod: 'both',
    departmentName: 'Municipal Corporation / Panchayat (via K-SMART)'
  },
  'liquor-license': {
    formName: 'Kerala Excise License Application Form (FL-3 / FL-11)',
    portalUrl: 'https://excise.kerala.gov.in/',
    applyOnlineUrl: 'https://excise.kerala.gov.in/downloads/',
    submissionMethod: 'both',
    departmentName: 'Excise Department, Government of Kerala'
  },
  'building-plan-approval': {
    formName: 'K-SMART Building Permit Application Form',
    portalUrl: 'https://ksmart.lsgkerala.gov.in/',
    applyOnlineUrl: 'https://ksmart.lsgkerala.gov.in/',
    submissionMethod: 'online',
    departmentName: 'Municipal Corporation / Panchayat (via K-SMART)'
  },
  'occupancy-certificate': {
    formName: 'K-SMART Occupancy Certificate Application Form',
    portalUrl: 'https://ksmart.lsgkerala.gov.in/',
    applyOnlineUrl: 'https://ksmart.lsgkerala.gov.in/',
    submissionMethod: 'online',
    departmentName: 'Municipal Corporation / Panchayat (via K-SMART)'
  },
  'pan-registration': {
    formName: 'PAN Application Form (Form 49A for Indian Citizens / Entities)',
    portalUrl: 'https://www.onlineservices.nsdl.com/paam/MPanApplication.html',
    applyOnlineUrl: 'https://www.onlineservices.nsdl.com/paam/MPanApplication.html',
    submissionMethod: 'online',
    departmentName: 'Income Tax Department (NSDL/Protean PAN portal)'
  },
  'labor-registration': {
    formName: 'Kerala Labour Department Shops & Commercial Establishments Registration (LIMS)',
    portalUrl: 'https://lc.kerala.gov.in/',
    applyOnlineUrl: 'https://lims.lc.kerala.gov.in/',
    submissionMethod: 'online',
    departmentName: 'Department of Labor, Government of Kerala'
  },
  'drug-license': {
    formName: 'Kerala Drugs Control Department Drug License Application (e-Drop)',
    portalUrl: 'https://dcd.kerala.gov.in/',
    applyOnlineUrl: 'https://dcd.kerala.gov.in/index.php/online-services',
    submissionMethod: 'online',
    departmentName: 'Drugs Control Department, Government of Kerala'
  },
  'clinical-establishment': {
    formName: 'Kerala Clinical Establishments Registration Form (KSCCE Portal)',
    portalUrl: 'https://clinicalestablishments.kerala.gov.in/',
    applyOnlineUrl: 'https://clinicalestablishments.kerala.gov.in/index.php/online-registration',
    submissionMethod: 'online',
    departmentName: 'Kerala State Council for Clinical Establishments'
  },
  'school-noc': {
    formName: 'General Education Department School NOC Recognition Form',
    portalUrl: 'https://education.kerala.gov.in/',
    applyOnlineUrl: 'https://education.kerala.gov.in/downloads-forms/',
    submissionMethod: 'both',
    departmentName: 'General Education Department, Government of Kerala'
  },
  'factory-license': {
    formName: 'Directorate of Factories & Boilers Factory Permit/License Application',
    portalUrl: 'https://fab.kerala.gov.in/',
    applyOnlineUrl: 'https://fab.kerala.gov.in/online-services/',
    submissionMethod: 'online',
    departmentName: 'Directorate of Factories and Boilers, Kerala'
  },
  'legal-metrology': {
    formName: 'Legal Metrology Stamping and Verification Application',
    portalUrl: 'https://lmd.kerala.gov.in/',
    applyOnlineUrl: 'https://lmd.kerala.gov.in/services/',
    submissionMethod: 'both',
    departmentName: 'Legal Metrology Department, Government of Kerala'
  },
  'star-classification': {
    formName: 'Ministry of Tourism Star Classification Application Form',
    portalUrl: 'https://tourism.gov.in/',
    applyOnlineUrl: 'https://nidhi.nic.in/',
    submissionMethod: 'online',
    departmentName: 'Ministry of Tourism, Government of India (Kerala Chapter)'
  }
};

export const DEFAULT_PORTAL: LicensePortalInfo = {
  formName: 'Official Application Form (K-SWIFT Single Window)',
  portalUrl: 'https://kswift.kerala.gov.in/',
  applyOnlineUrl: 'https://kswift.kerala.gov.in/',
  submissionMethod: 'online',
  departmentName: 'Single Window Clearance Board (K-SWIFT)'
};

export function getPortalForLicense(licenseId: string): LicensePortalInfo {
  return LICENSE_PORTALS[licenseId] ?? DEFAULT_PORTAL;
}
