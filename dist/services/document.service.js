var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@nitrostack/core';
import { ALL_LICENSES, SECTOR_LICENSES } from '../data/restaurant-license-catalog.js';
import { LinkValidatorService } from './link-validator.service.js';
import { getPortalForLicense } from '../data/license-portals.js';
/**
 * Provides required documents and forms for each license with live government URLs
 */
let DocumentService = class DocumentService {
    linkValidator;
    constructor(linkValidator) {
        this.linkValidator = linkValidator;
    }
    /**
     * Get forms and documents for all licenses of a business category
     */
    async getForms(analysis) {
        if (!analysis.supported || !analysis.businessCategory) {
            return [];
        }
        const category = analysis.businessCategory;
        const licenseIds = SECTOR_LICENSES[category] || SECTOR_LICENSES.general;
        return Promise.all(ALL_LICENSES
            .filter(license => licenseIds.includes(license.id))
            .map(license => this.getFormForLicense(license.id, license.name)));
    }
    /**
     * Get form details for a specific license with live portal URLs
     */
    async getFormForLicense(licenseId, licenseName) {
        const forms = {
            'trade-license': {
                licenseId: 'trade-license',
                licenseName: 'Trade License',
                requiredDocuments: [
                    { name: 'Aadhaar Card', required: true, description: 'Identity proof of owner' },
                    { name: 'PAN Card', required: true, description: 'Tax identification' },
                    { name: 'Rental Agreement / Property Deed', required: true, description: 'Proof of premises' },
                    { name: 'Building Plan Approval', required: true, description: 'Municipal building clearance' },
                    { name: 'Address Proof', required: true, description: 'Utility bill or tax receipt' }
                ],
                officialForm: {
                    name: 'K-SMART IFTE & OS License Application Form',
                    url: 'https://ksmart.lsgkerala.gov.in/',
                    verified: true
                },
                applyOnlineLink: {
                    url: 'https://ksmart.lsgkerala.gov.in/',
                    verified: true
                },
                submissionMethod: 'online',
                departmentContact: {
                    name: 'Municipal Corporation / Panchayat (via K-SMART)',
                    phone: 'Contact local municipal office',
                    email: 'info@municipality.gov.in',
                    address: 'Local Municipal Office'
                },
                imageUrl: 'https://images.unsplash.com/photo-1554224311-beee415c15c7?w=400&h=300&fit=crop'
            },
            'fssai': {
                licenseId: 'fssai',
                licenseName: 'FSSAI License',
                requiredDocuments: [
                    { name: 'Aadhaar Card', required: true, description: 'Identity proof of proprietor' },
                    { name: 'PAN Card', required: true, description: 'Tax identification of business' },
                    { name: 'Rental Agreement / Property Deed', required: true, description: 'Proof of premises' },
                    { name: 'Building Plan / Blueprint', required: true, description: 'Layout of food processing area' },
                    { name: 'Menu Card / Food Items List', required: true, description: 'List of food items to be handled' },
                    { name: 'Proof of Water Source & Testing Report', required: true, description: 'Water safety verification' }
                ],
                officialForm: {
                    name: 'FoSCoS FSSAI Form A (Registration) / Form B (License)',
                    url: 'https://foscos.fssai.gov.in/',
                    verified: true
                },
                applyOnlineLink: {
                    url: 'https://foscos.fssai.gov.in/',
                    verified: true
                },
                submissionMethod: 'online',
                departmentContact: {
                    name: 'Food Safety and Standards Authority of India (FoSCoS)',
                    phone: '+91-11-2959-2222',
                    email: 'contact@fssai.gov.in',
                    address: 'FSSAI Regional Office, Kerala'
                },
                imageUrl: 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=400&h=300&fit=crop'
            },
            'gst': {
                licenseId: 'gst',
                licenseName: 'GST Registration',
                requiredDocuments: [
                    { name: 'PAN Card', required: true, description: 'Permanent Account Number of business/proprietor' },
                    { name: 'Aadhaar Card', required: true, description: 'Identity proof of promoters' },
                    { name: 'Bank Account Details (Passbook/Cancelled Cheque)', required: true, description: 'Refunds/payments mapping' },
                    { name: 'Business Address Proof (Lease/Utility Bill)', required: true, description: 'Proof of principal place of business' },
                    { name: 'Passport Photos of Owner', required: true, description: 'Promoter verification' }
                ],
                officialForm: {
                    name: 'GST Registration Form (REG-01)',
                    url: 'https://reg.gst.gov.in/registration/',
                    verified: true
                },
                applyOnlineLink: {
                    url: 'https://reg.gst.gov.in/registration/',
                    verified: true
                },
                submissionMethod: 'online',
                departmentContact: {
                    name: 'GST Authority (GSTN)',
                    phone: 'Contact local GST office',
                    email: 'support@gst.gov.in',
                    address: 'State Goods & Services Tax Department, Kerala'
                },
                imageUrl: 'https://images.unsplash.com/photo-1554224311-beee415c15c7?w=400&h=300&fit=crop'
            },
            'fire-noc': {
                licenseId: 'fire-noc',
                licenseName: 'Fire NOC',
                requiredDocuments: [
                    { name: 'Building Plan / Architectural Blueprint', required: true, description: 'Detailing layout and structure' },
                    { name: 'Occupancy Certificate', required: true, description: 'Confirming building structure compliance' },
                    { name: 'Fire Safety Plan & Layout of Hydrants/Extinguishers', required: true, description: 'Safety mapping' },
                    { name: 'Aadhaar Card of Applicant', required: true, description: 'Identity proof' },
                    { name: 'Rental Agreement / Property Deed', required: true, description: 'Proof of premises ownership/possession' }
                ],
                officialForm: {
                    name: 'Kerala Fire NOC e-Services Application Form',
                    url: 'https://fire.kerala.gov.in/eservice/',
                    verified: true
                },
                applyOnlineLink: {
                    url: 'https://fire.kerala.gov.in/eservice/',
                    verified: true
                },
                submissionMethod: 'both',
                departmentContact: {
                    name: 'Kerala Fire and Rescue Services Department',
                    phone: '101 (Emergency)',
                    email: 'Contact local fire station',
                    address: 'Local Fire Station / District HQ'
                },
                imageUrl: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&h=300&fit=crop'
            },
            'pollution-consent': {
                licenseId: 'pollution-consent',
                licenseName: 'Pollution Consent',
                requiredDocuments: [
                    { name: 'Building Plan', required: true, description: 'Layout of premises' },
                    { name: 'Solid & Liquid Waste Management Plan', required: true, description: 'Effluent/refuse disposal' },
                    { name: 'Water Discharge details (Sewage/Trade effluent)', required: true, description: 'Wastewater routing' },
                    { name: 'Aadhaar Card of Applicant', required: true, description: 'Identity proof' },
                    { name: 'Environmental Category Details (Red/Orange/Green/White)', required: true, description: 'Classification of industry' }
                ],
                officialForm: {
                    name: 'KSPCB Consent to Establish/Operate Form (OCMMS)',
                    url: 'https://krocmms.nic.in/',
                    verified: true
                },
                applyOnlineLink: {
                    url: 'https://krocmms.nic.in/',
                    verified: true
                },
                submissionMethod: 'online',
                departmentContact: {
                    name: 'Kerala State Pollution Control Board (KSPCB)',
                    phone: '+91-484-2351-500',
                    email: 'info@kspcb.gov.in',
                    address: 'KSPCB Head Office / District Office'
                },
                imageUrl: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=400&h=300&fit=crop'
            },
            'health-certificate': {
                licenseId: 'health-certificate',
                licenseName: 'Health Certificate',
                requiredDocuments: [
                    { name: 'Aadhaar Card of Applicant', required: true, description: 'Identity proof' },
                    { name: 'Building Plan & Location layout', required: true, description: 'Premises structure' },
                    { name: 'Sanitation & Cleanliness Plan', required: true, description: 'Hygiene maintenance routine' },
                    { name: 'Water Quality Certificate', required: true, description: 'Bacteriological test report' },
                    { name: 'Medical Fitness Certificates of Staff', required: true, description: 'Fitness reports for all handlers' }
                ],
                officialForm: {
                    name: 'K-SMART Municipal Health Certificate Application',
                    url: 'https://ksmart.lsgkerala.gov.in/',
                    verified: true
                },
                applyOnlineLink: {
                    url: 'https://ksmart.lsgkerala.gov.in/',
                    verified: true
                },
                submissionMethod: 'both',
                departmentContact: {
                    name: 'Health Department, Local Self Government (LSGD)',
                    phone: 'Contact local health inspector office',
                    email: 'health@kerala.gov.in',
                    address: 'Local Primary Health Centre / Municipal Office'
                },
                imageUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=300&fit=crop'
            },
            'signage-permission': {
                licenseId: 'signage-permission',
                licenseName: 'Signage Permission',
                requiredDocuments: [
                    { name: 'Signage Design, Dimension, Layout & Content details', required: true, description: 'Visual specifications' },
                    { name: 'Building Front Elevation Blueprint', required: true, description: 'Location of signage on premises' },
                    { name: 'Aadhaar Card of Proprietor', required: true, description: 'Identity proof' },
                    { name: 'Rental Agreement / Property Deed', required: true, description: 'Premises authorization' }
                ],
                officialForm: {
                    name: 'K-SMART Signage & Advertisement Board Permission Form',
                    url: 'https://ksmart.lsgkerala.gov.in/',
                    verified: true
                },
                applyOnlineLink: {
                    url: 'https://ksmart.lsgkerala.gov.in/',
                    verified: true
                },
                submissionMethod: 'both',
                departmentContact: {
                    name: 'Municipal Corporation / Panchayat (via K-SMART)',
                    phone: 'Contact local municipal office',
                    email: 'info@municipality.gov.in',
                    address: 'Local Municipal Office'
                },
                imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop'
            },
            'liquor-license': {
                licenseId: 'liquor-license',
                licenseName: 'Liquor License',
                requiredDocuments: [
                    { name: 'Aadhaar Card of Applicant', required: true, description: 'Identity proof' },
                    { name: 'PAN Card of Applicant', required: true, description: 'Tax identification' },
                    { name: 'Approved Building Plan (specifically marked bar area)', required: true, description: 'Premises blueprint' },
                    { name: 'Police Clearance Certificate', required: true, description: 'Background verification' },
                    { name: 'Rental Agreement / Property Deed', required: true, description: 'Premises authorization' },
                    { name: 'Distance Certificate (from educational institutions, temples)', required: true, description: 'Proximity check' }
                ],
                officialForm: {
                    name: 'Kerala Excise License Application Form (FL-3 / FL-11)',
                    url: 'https://excise.kerala.gov.in/',
                    verified: true
                },
                applyOnlineLink: {
                    url: 'https://excise.kerala.gov.in/',
                    verified: true
                },
                submissionMethod: 'both',
                departmentContact: {
                    name: 'Excise Department, Government of Kerala',
                    phone: 'Contact local excise circle office',
                    email: 'excise@kerala.gov.in',
                    address: 'Local Excise Office / Circle Inspector'
                },
                imageUrl: 'https://images.unsplash.com/photo-1608270861620-7c80b997e038?w=400&h=300&fit=crop'
            },
            'building-plan-approval': {
                licenseId: 'building-plan-approval',
                licenseName: 'Building Plan Approval',
                requiredDocuments: [
                    { name: 'Detailed Architectural Plans & Structural Designs', required: true, description: 'Engineering drawings' },
                    { name: 'Site Plan & Location Sketch', required: true, description: 'Property boundaries mapping' },
                    { name: 'Aadhaar Card of Owner', required: true, description: 'Identity proof' },
                    { name: 'Property Deed / Ownership Certificate', required: true, description: 'Proof of land ownership' },
                    { name: 'Structural Design Calculations', required: true, description: 'Safety verification' }
                ],
                officialForm: {
                    name: 'K-SMART Building Permit Application Form',
                    url: 'https://ksmart.lsgkerala.gov.in/',
                    verified: true
                },
                applyOnlineLink: {
                    url: 'https://ksmart.lsgkerala.gov.in/',
                    verified: true
                },
                submissionMethod: 'online',
                departmentContact: {
                    name: 'Municipal Corporation / Panchayat (via K-SMART)',
                    phone: 'Contact local municipal town planning office',
                    email: 'info@municipality.gov.in',
                    address: 'Local Municipal Office'
                },
                imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop'
            },
            'occupancy-certificate': {
                licenseId: 'occupancy-certificate',
                licenseName: 'Occupancy Certificate',
                requiredDocuments: [
                    { name: 'Approved Building Plan and Permit Copy', required: true, description: 'Reference documents' },
                    { name: 'Completion Certificate (from registered architect/engineer)', required: true, description: 'Construction completion confirmation' },
                    { name: 'Aadhaar Card of Applicant', required: true, description: 'Identity proof' },
                    { name: 'Municipal Inspection Report', required: true, description: 'Site fitness verification' }
                ],
                officialForm: {
                    name: 'K-SMART Occupancy Certificate Application Form',
                    url: 'https://ksmart.lsgkerala.gov.in/',
                    verified: true
                },
                applyOnlineLink: {
                    url: 'https://ksmart.lsgkerala.gov.in/',
                    verified: true
                },
                submissionMethod: 'online',
                departmentContact: {
                    name: 'Municipal Corporation / Panchayat (via K-SMART)',
                    phone: 'Contact local municipal office',
                    email: 'info@municipality.gov.in',
                    address: 'Local Municipal Office'
                },
                imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop'
            },
            'pan-registration': {
                licenseId: 'pan-registration',
                licenseName: 'PAN Registration',
                requiredDocuments: [
                    { name: 'Aadhaar Card of Owner', required: true, description: 'Identity and address proof' },
                    { name: 'Proof of Date of Birth (Aadhaar/DOB Certificate)', required: true, description: 'DOB verification' },
                    { name: 'Business Incorporation / Partnership Deed (if non-proprietorship)', required: false, description: 'Entity proof' }
                ],
                officialForm: {
                    name: 'PAN Application Form (Form 49A for Indian Citizens / Entities)',
                    url: 'https://www.onlineservices.nsdl.com/paam/MPanApplication.html',
                    verified: true
                },
                applyOnlineLink: {
                    url: 'https://www.onlineservices.nsdl.com/paam/MPanApplication.html',
                    verified: true
                },
                submissionMethod: 'online',
                departmentContact: {
                    name: 'Income Tax Department (NSDL/Protean PAN portal)',
                    phone: '1800-180-1961',
                    email: 'tininfo@nsdl.co.in',
                    address: 'Income Tax Pan Services Unit, Pune'
                },
                imageUrl: 'https://images.unsplash.com/photo-1554224311-beee415c15c7?w=400&h=300&fit=crop'
            },
            'labor-registration': {
                licenseId: 'labor-registration',
                licenseName: 'Labor Registration',
                requiredDocuments: [
                    { name: 'Aadhaar Card of Owner/Applicant', required: true, description: 'Identity proof' },
                    { name: 'PAN Card of Applicant/Business', required: true, description: 'Tax identification' },
                    { name: 'Employee List with Details', required: true, description: 'Names, designations, and wages' },
                    { name: 'Salary & Wage Structure', required: true, description: 'Statutory compliance details' },
                    { name: 'Building Layout Blueprint / Shop Plan', required: true, description: 'Workplace setup proof' }
                ],
                officialForm: {
                    name: 'Kerala Labour Department Shops & Commercial Establishments Registration (LIMS)',
                    url: 'https://lc.kerala.gov.in/',
                    verified: true
                },
                applyOnlineLink: {
                    url: 'https://lc.kerala.gov.in/',
                    verified: true
                },
                submissionMethod: 'online',
                departmentContact: {
                    name: 'Department of Labor, Government of Kerala',
                    phone: 'Contact local labor officer',
                    email: 'labor.commissionerate@kerala.gov.in',
                    address: 'Local Labour Office / District Labour Commissioner'
                },
                imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop'
            },
            'drug-license': {
                licenseId: 'drug-license',
                licenseName: 'Drug License',
                requiredDocuments: [
                    { name: 'Pharmacist Registration Certificate & Consent Letter', required: true, description: 'Certified pharmacist representation' },
                    { name: 'Approved Building Plan (min. 10 sq meters for retail)', required: true, description: 'Layout blueprint' },
                    { name: 'Aadhaar & PAN Cards of Owner', required: true, description: 'Identity & Tax proof' },
                    { name: 'Rental Agreement / Property Ownership Deed', required: true, description: 'Premises authorization' },
                    { name: 'Purchase Invoice of Refrigerator & AC (with cold chain details)', required: true, description: 'Cold storage verification' }
                ],
                officialForm: {
                    name: 'Kerala Drugs Control Department Drug License Application (e-Drop)',
                    url: 'https://dcd.kerala.gov.in/',
                    verified: true
                },
                applyOnlineLink: {
                    url: 'https://dcd.kerala.gov.in/',
                    verified: true
                },
                submissionMethod: 'online',
                departmentContact: {
                    name: 'Drugs Control Department, Government of Kerala',
                    phone: '+91-471-2303-990',
                    email: 'dcd.ker@nic.in',
                    address: 'Office of the Drugs Controller, Thiruvananthapuram'
                },
                imageUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=300&fit=crop'
            },
            'clinical-establishment': {
                licenseId: 'clinical-establishment',
                licenseName: 'Clinical Establishment Registration',
                requiredDocuments: [
                    { name: 'Doctor Registration Certificate (TCMC / State Council)', required: true, description: 'Medical qualification proof' },
                    { name: 'Infrastructure blueprint and equipment checklist', required: true, description: 'Facility specifications' },
                    { name: 'Pollution Control Consent (KSPCB) for bio-medical waste', required: true, description: 'Hazardous waste clearance' },
                    { name: 'Aadhaar and PAN Cards of promoters', required: true, description: 'Identity proof' },
                    { name: 'Rental Agreement / Lease deed of clinical space', required: true, description: 'Premises authorization' }
                ],
                officialForm: {
                    name: 'Kerala Clinical Establishments Registration Form (KSCCE Portal)',
                    url: 'https://clinicalestablishments.kerala.gov.in/',
                    verified: true
                },
                applyOnlineLink: {
                    url: 'https://clinicalestablishments.kerala.gov.in/',
                    verified: true
                },
                submissionMethod: 'online',
                departmentContact: {
                    name: 'Kerala State Council for Clinical Establishments',
                    phone: '+91-471-2551-300',
                    email: 'clinicalestablishments.kerala@gmail.com',
                    address: 'KSCCE Office, Thiruvananthapuram'
                },
                imageUrl: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&h=300&fit=crop'
            },
            'school-noc': {
                licenseId: 'school-noc',
                licenseName: 'School NOC & Recognition',
                requiredDocuments: [
                    { name: 'Land ownership deed (registered trust/society deed)', required: true, description: 'Property ownership validation' },
                    { name: 'Building safety certificate (signed by PWD/LSGD executive engineer)', required: true, description: 'Structural stability confirmation' },
                    { name: 'Sanitary Fitness Certificate (Health Inspector)', required: true, description: 'Sanitation standards' },
                    { name: 'Fire safety NOC (Kerala Fire & Rescue)', required: true, description: 'Fire safety compliance' },
                    { name: 'List of qualified teaching staff & curriculum structure', required: true, description: 'Academic compliance details' }
                ],
                officialForm: {
                    name: 'General Education Department School NOC Recognition Form',
                    url: 'https://education.kerala.gov.in/',
                    verified: true
                },
                applyOnlineLink: {
                    url: 'https://education.kerala.gov.in/',
                    verified: true
                },
                submissionMethod: 'both',
                departmentContact: {
                    name: 'General Education Department, Government of Kerala',
                    phone: '+91-471-2323-925',
                    email: 'education.dept@kerala.gov.in',
                    address: 'Secretariat, Thiruvananthapuram'
                },
                imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop'
            },
            'factory-license': {
                licenseId: 'factory-license',
                licenseName: 'Factory License',
                requiredDocuments: [
                    { name: 'Approved building & machinery layout plans', required: true, description: 'Factory blueprint' },
                    { name: 'Stability Certificate (from authorized competent person)', required: true, description: 'Structural verification' },
                    { name: 'Machinery details & KSEB power loading allocation', required: true, description: 'Equipment specs' },
                    { name: 'Chemical Safety MSDS sheets (if handling hazards)', required: false, description: 'Chemical compliance' },
                    { name: 'Fire NOC & KSPCB Pollution Consent', required: true, description: 'Safety & Environmental clearances' }
                ],
                officialForm: {
                    name: 'Directorate of Factories & Boilers Factory Permit/License Application',
                    url: 'https://fab.kerala.gov.in/',
                    verified: true
                },
                applyOnlineLink: {
                    url: 'https://fab.kerala.gov.in/',
                    verified: true
                },
                submissionMethod: 'online',
                departmentContact: {
                    name: 'Directorate of Factories and Boilers, Kerala',
                    phone: '+91-471-2441-597',
                    email: 'dir.fab.labour@kerala.gov.in',
                    address: 'Directorate Office, Thiruvananthapuram'
                },
                imageUrl: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&h=300&fit=crop'
            },
            'legal-metrology': {
                licenseId: 'legal-metrology',
                licenseName: 'Legal Metrology Stamping & Verification',
                requiredDocuments: [
                    { name: 'Manufacturer / Dealer invoice of weighing instruments', required: true, description: 'Purchase proof' },
                    { name: 'Weights and measures details (make, capacity, serial number)', required: true, description: 'Instrument cataloging' },
                    { name: 'Aadhaar Card of Applicant', required: true, description: 'Identity proof' },
                    { name: 'Shop address proof / Trade License permit copy', required: true, description: 'Premises authorization' }
                ],
                officialForm: {
                    name: 'Legal Metrology Stamping and Verification Application',
                    url: 'https://lmd.kerala.gov.in/',
                    verified: true
                },
                applyOnlineLink: {
                    url: 'https://lmd.kerala.gov.in/',
                    verified: true
                },
                submissionMethod: 'both',
                departmentContact: {
                    name: 'Legal Metrology Department, Government of Kerala',
                    phone: '+91-471-2442-944',
                    email: 'clm.lmd@kerala.gov.in',
                    address: 'Office of the Controller of Legal Metrology, Thiruvananthapuram'
                },
                imageUrl: 'https://images.unsplash.com/photo-1554224311-beee415c15c7?w=400&h=300&fit=crop'
            },
            'star-classification': {
                licenseId: 'star-classification',
                licenseName: 'Star Classification (if applicable)',
                requiredDocuments: [
                    { name: 'Valid Fire NOC, FSSAI & KSPCB Pollution Consent', required: true, description: 'Statutory clearances' },
                    { name: 'Approved building plans and occupancy certificate', required: true, description: 'Premises stability' },
                    { name: 'Detailed photos of guest rooms, common areas, and amenities', required: true, description: 'Visual specifications' },
                    { name: 'Bar license copy (if applying for star classification with bar)', required: false, description: 'Excise clearance' },
                    { name: 'Staff training certificates & hospitality background profile', required: true, description: 'Service standards' }
                ],
                officialForm: {
                    name: 'Ministry of Tourism Star Classification Application Form',
                    url: 'https://tourism.gov.in/',
                    verified: true
                },
                applyOnlineLink: {
                    url: 'https://tourism.gov.in/',
                    verified: true
                },
                submissionMethod: 'online',
                departmentContact: {
                    name: 'Ministry of Tourism, Government of India (Kerala Chapter)',
                    phone: '1800-11-1363',
                    email: 'info@tourism.gov.in',
                    address: 'India Tourism Office, Kochi, Kerala'
                },
                imageUrl: 'https://images.unsplash.com/photo-1608270861620-7c80b997e038?w=400&h=300&fit=crop'
            }
        };
        const form = forms[licenseId] || {
            licenseId,
            licenseName,
            requiredDocuments: [
                { name: 'Aadhaar Card', required: true, description: 'Identity proof of promoters' },
                { name: 'PAN Card', required: true, description: 'Tax identification' },
                { name: 'Rental Agreement / Property deed', required: true, description: 'Proof of premises authorization' }
            ],
            officialForm: {
                name: 'Official Application Form (K-SWIFT)',
                url: 'https://kswift.kerala.gov.in/',
                verified: false
            },
            applyOnlineLink: {
                url: 'https://kswift.kerala.gov.in/',
                verified: false
            },
            submissionMethod: 'online',
            departmentContact: {
                name: 'Single Window Clearance Board (K-SWIFT)',
                phone: '+91-471-2318-900',
                email: 'support.kswift@kerala.gov.in',
                address: 'KSIDC, Thiruvananthapuram'
            }
        };
        const portal = getPortalForLicense(licenseId);
        // Override form details with the live portal configuration
        form.officialForm.name = portal.formName;
        form.officialForm.url = portal.portalUrl;
        if (form.applyOnlineLink) {
            form.applyOnlineLink.url = portal.applyOnlineUrl;
        }
        form.submissionMethod = portal.submissionMethod;
        form.departmentContact.name = portal.departmentName;
        // Validate the URLs dynamically using the link validator
        const [formUrlCheck, applyUrlCheck] = await Promise.all([
            this.linkValidator.validateUrl(form.officialForm.url),
            form.applyOnlineLink ? this.linkValidator.validateUrl(form.applyOnlineLink.url) : Promise.resolve({ verified: false })
        ]);
        form.officialForm.verified = formUrlCheck.verified;
        if (form.applyOnlineLink) {
            form.applyOnlineLink.verified = applyUrlCheck.verified;
        }
        return form;
    }
};
DocumentService = __decorate([
    Injectable({ deps: [LinkValidatorService] }),
    __metadata("design:paramtypes", [LinkValidatorService])
], DocumentService);
export { DocumentService };
//# sourceMappingURL=document.service.js.map