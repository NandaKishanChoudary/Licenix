/**
 * License Catalog for Kerala (All Sectors)
 * Stable taxonomy of licenses, documents, departments, and regulations
 */
export const ALL_LICENSES = [
    {
        id: 'trade-license',
        name: 'Trade License',
        mandatory: true,
        issuingDepartment: 'Municipal Corporation / Panchayat',
        description: 'Basic business registration license required to operate any commercial establishment',
        renewalFrequency: 'Annual',
        imageUrl: 'https://images.unsplash.com/photo-1554224311-beee415c15c7?w=400&h=300&fit=crop'
    },
    {
        id: 'fssai',
        name: 'FSSAI License',
        mandatory: true,
        issuingDepartment: 'Food Safety and Standards Authority of India',
        description: 'Food safety registration/license for food business operations',
        renewalFrequency: 'Every 5 years',
        imageUrl: 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=400&h=300&fit=crop'
    },
    {
        id: 'gst',
        name: 'GST Registration',
        mandatory: true,
        issuingDepartment: 'GST Authority',
        description: 'Goods and Services Tax registration for business turnover above threshold',
        renewalFrequency: 'Ongoing (annual compliance)',
        imageUrl: 'https://images.unsplash.com/photo-1554224311-beee415c15c7?w=400&h=300&fit=crop'
    },
    {
        id: 'fire-noc',
        name: 'Fire NOC',
        mandatory: true,
        issuingDepartment: 'Fire and Rescue Services',
        description: 'Fire safety clearance certificate for building safety compliance',
        renewalFrequency: 'Every 3 years',
        imageUrl: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&h=300&fit=crop'
    },
    {
        id: 'pollution-consent',
        name: 'Pollution Consent',
        mandatory: true,
        issuingDepartment: 'Kerala State Pollution Control Board',
        description: 'Environmental clearance for waste management and pollution control',
        renewalFrequency: 'Every 2 years',
        imageUrl: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=400&h=300&fit=crop'
    },
    {
        id: 'health-certificate',
        name: 'Health Certificate',
        mandatory: true,
        issuingDepartment: 'Health Department',
        description: 'Health and sanitation compliance certificate',
        renewalFrequency: 'Annual',
        imageUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=300&fit=crop'
    },
    {
        id: 'signage-permission',
        name: 'Signage Permission',
        mandatory: false,
        issuingDepartment: 'Municipal Corporation / Panchayat',
        description: 'Permission for outdoor signage and advertisement boards',
        renewalFrequency: 'Annual',
        imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop'
    },
    {
        id: 'liquor-license',
        name: 'Liquor License (if applicable)',
        mandatory: false,
        issuingDepartment: 'Excise Department',
        description: 'License for serving alcoholic beverages (if establishment serves alcohol)',
        renewalFrequency: 'Annual',
        imageUrl: 'https://images.unsplash.com/photo-1608270861620-7c80b997e038?w=400&h=300&fit=crop'
    },
    {
        id: 'building-plan-approval',
        name: 'Building Plan Approval',
        mandatory: true,
        issuingDepartment: 'Municipal Corporation / Panchayat',
        description: 'Approval of building plans and layout for commercial use',
        renewalFrequency: 'One-time (valid for construction period)',
        imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop'
    },
    {
        id: 'occupancy-certificate',
        name: 'Occupancy Certificate',
        mandatory: true,
        issuingDepartment: 'Municipal Corporation / Panchayat',
        description: 'Certificate confirming building is fit for occupation',
        renewalFrequency: 'One-time',
        imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop'
    },
    {
        id: 'pan-registration',
        name: 'PAN Registration',
        mandatory: true,
        issuingDepartment: 'Income Tax Department',
        description: 'Permanent Account Number for tax purposes',
        renewalFrequency: 'One-time',
        imageUrl: 'https://images.unsplash.com/photo-1554224311-beee415c15c7?w=400&h=300&fit=crop'
    },
    {
        id: 'labor-registration',
        name: 'Labor Registration',
        mandatory: true,
        issuingDepartment: 'Department of Labor',
        description: 'Registration under labor laws if employing workers',
        renewalFrequency: 'Annual',
        imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop'
    },
    {
        id: 'drug-license',
        name: 'Drug License',
        mandatory: true,
        issuingDepartment: 'Drugs Control Department',
        description: 'Mandatory license for retail and wholesale distribution of medicines',
        renewalFrequency: 'Every 5 years',
        imageUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=300&fit=crop'
    },
    {
        id: 'clinical-establishment',
        name: 'Clinical Establishment Registration',
        mandatory: true,
        issuingDepartment: 'Kerala State Council for Clinical Establishments',
        description: 'Mandatory registration for clinics, hospitals, and laboratories under the Clinical Establishments Act',
        renewalFrequency: 'Every 5 years',
        imageUrl: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&h=300&fit=crop'
    },
    {
        id: 'school-noc',
        name: 'School NOC & Recognition',
        mandatory: true,
        issuingDepartment: 'General Education Department',
        description: 'NOC and recognition certificate for starting and operating school services',
        renewalFrequency: 'One-time (with periodic inspections)',
        imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop'
    },
    {
        id: 'factory-license',
        name: 'Factory License',
        mandatory: true,
        issuingDepartment: 'Directorate of Factories and Boilers',
        description: 'License required to operate a manufacturing facility or factory under the Factories Act',
        renewalFrequency: 'Annual',
        imageUrl: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&h=300&fit=crop'
    },
    {
        id: 'legal-metrology',
        name: 'Legal Metrology Stamping & Verification',
        mandatory: true,
        issuingDepartment: 'Legal Metrology Department',
        description: 'Verification and stamping of weighing and measuring instruments used in commercial transactions',
        renewalFrequency: 'Annual',
        imageUrl: 'https://images.unsplash.com/photo-1554224311-beee415c15c7?w=400&h=300&fit=crop'
    },
    {
        id: 'star-classification',
        name: 'Star Classification (if applicable)',
        mandatory: false,
        issuingDepartment: 'Ministry of Tourism',
        description: 'Optional star rating certification for hospitality and lodging establishments',
        renewalFrequency: 'Every 5 years',
        imageUrl: 'https://images.unsplash.com/photo-1608270861620-7c80b997e038?w=400&h=300&fit=crop'
    }
];
export const SECTOR_DISPLAY_NAMES = {
    restaurant: 'Restaurant / Food Service',
    pharmacy: 'Pharmacy / Medical Store',
    hotel: 'Hotel / Hospitality',
    hospital: 'Hospital / Clinic / Healthcare',
    school: 'School / Educational Institution',
    manufacturing: 'Manufacturing / Factory',
    retail: 'Retail / Shop',
    it_company: 'IT / Software / Technology',
    general: 'General Business'
};
export const SUPPORTED_SECTORS = Object.keys(SECTOR_DISPLAY_NAMES);
// Mapping of sector to list of license IDs required
export const SECTOR_LICENSES = {
    restaurant: [
        'trade-license',
        'fssai',
        'gst',
        'fire-noc',
        'pollution-consent',
        'health-certificate',
        'signage-permission',
        'liquor-license',
        'building-plan-approval',
        'occupancy-certificate',
        'pan-registration',
        'labor-registration'
    ],
    pharmacy: [
        'trade-license',
        'drug-license',
        'gst',
        'pan-registration',
        'labor-registration',
        'building-plan-approval',
        'occupancy-certificate',
        'signage-permission'
    ],
    hotel: [
        'trade-license',
        'fssai',
        'gst',
        'fire-noc',
        'pollution-consent',
        'health-certificate',
        'signage-permission',
        'liquor-license',
        'building-plan-approval',
        'occupancy-certificate',
        'pan-registration',
        'labor-registration',
        'star-classification'
    ],
    hospital: [
        'trade-license',
        'clinical-establishment',
        'gst',
        'fire-noc',
        'pollution-consent',
        'health-certificate',
        'signage-permission',
        'building-plan-approval',
        'occupancy-certificate',
        'pan-registration',
        'labor-registration'
    ],
    school: [
        'trade-license',
        'school-noc',
        'fire-noc',
        'building-plan-approval',
        'occupancy-certificate',
        'pan-registration',
        'labor-registration',
        'signage-permission'
    ],
    manufacturing: [
        'trade-license',
        'factory-license',
        'gst',
        'fire-noc',
        'pollution-consent',
        'building-plan-approval',
        'occupancy-certificate',
        'pan-registration',
        'labor-registration',
        'signage-permission'
    ],
    retail: [
        'trade-license',
        'gst',
        'pan-registration',
        'labor-registration',
        'building-plan-approval',
        'occupancy-certificate',
        'signage-permission',
        'legal-metrology'
    ],
    it_company: [
        'trade-license',
        'gst',
        'pan-registration',
        'labor-registration',
        'building-plan-approval',
        'occupancy-certificate',
        'signage-permission'
    ],
    // Baseline general licenses for any unspecified custom sector
    general: [
        'trade-license',
        'gst',
        'pan-registration',
        'labor-registration',
        'building-plan-approval',
        'occupancy-certificate',
        'signage-permission'
    ]
};
// Backward compatibility export
export const RESTAURANT_LICENSES = ALL_LICENSES.filter(l => SECTOR_LICENSES.restaurant.includes(l.id));
export const KERALA_DISTRICTS = [
    'Thiruvananthapuram',
    'Kollam',
    'Pathanamthitta',
    'Alappuzha',
    'Kottayam',
    'Idukki',
    'Ernakulam',
    'Thrissur',
    'Palakkad',
    'Malappuram',
    'Kozhikode',
    'Wayanad',
    'Kannur',
    'Kasaragod'
];
export const GOVERNMENT_DEPARTMENTS = {
    'Municipal Corporation': {
        name: 'Municipal Corporation / Panchayat',
        phone: 'Contact local municipal office',
        email: 'info@municipality.gov.in'
    },
    'FSSAI': {
        name: 'Food Safety and Standards Authority of India',
        phone: '+91-11-2959-2222',
        email: 'contact@fssai.gov.in',
        website: 'https://www.fssai.gov.in'
    },
    'GST': {
        name: 'GST Authority',
        phone: 'Contact local GST office',
        email: 'support@gst.gov.in',
        website: 'https://www.gst.gov.in'
    },
    'Fire': {
        name: 'Fire and Rescue Services',
        phone: '101 (Emergency)',
        email: 'Contact local fire station'
    },
    'KSPCB': {
        name: 'Kerala State Pollution Control Board',
        phone: '+91-484-2351-500',
        email: 'info@kspcb.gov.in',
        website: 'https://www.kspcb.gov.in'
    },
    'Health': {
        name: 'Health Department',
        phone: 'Contact local health office',
        email: 'health@kerala.gov.in'
    },
    'Excise': {
        name: 'Excise Department',
        phone: 'Contact local excise office',
        email: 'excise@kerala.gov.in'
    },
    'Income Tax': {
        name: 'Income Tax Department',
        phone: '1800-180-1961',
        email: 'Contact local income tax office',
        website: 'https://www.incometax.gov.in'
    },
    'Labor': {
        name: 'Department of Labor',
        phone: 'Contact local labor office',
        email: 'labor@kerala.gov.in'
    },
    'Drugs Control': {
        name: 'Drugs Control Department',
        phone: '+91-471-2303-990',
        email: 'dcd.ker@nic.in',
        website: 'https://dcd.kerala.gov.in'
    },
    'Clinical Establishments': {
        name: 'Kerala State Council for Clinical Establishments',
        phone: '+91-471-2551-300',
        email: 'clinicalestablishments.kerala@gmail.com',
        website: 'https://clinicalestablishments.kerala.gov.in'
    },
    'Education': {
        name: 'General Education Department',
        phone: '+91-471-2323-925',
        email: 'education.dept@kerala.gov.in',
        website: 'https://education.kerala.gov.in'
    },
    'Factories and Boilers': {
        name: 'Directorate of Factories and Boilers',
        phone: '+91-471-2441-597',
        email: 'dir.fab.labour@kerala.gov.in',
        website: 'https://fab.kerala.gov.in'
    },
    'Legal Metrology': {
        name: 'Legal Metrology Department',
        phone: '+91-471-2442-944',
        email: 'clm.lmd@kerala.gov.in',
        website: 'https://lmd.kerala.gov.in'
    },
    'Tourism': {
        name: 'Ministry of Tourism',
        phone: '1800-11-1363',
        email: 'info@tourism.gov.in',
        website: 'https://tourism.gov.in'
    }
};
export const REGULATIONS = [
    {
        act: 'Food Safety and Standards Act, 2006',
        rules: [
            'Food Safety and Standards (Licensing and Registration of Food Businesses) Regulations, 2015',
            'Food Safety and Standards (Hygiene and Sanitary Practices) Regulations, 2020'
        ],
        applicableSection: 'Sections 21-23',
        complianceNotes: 'Mandatory for all food businesses. Covers food handling, storage, and hygiene standards.',
        applicableSectors: ['restaurant', 'hotel']
    },
    {
        act: 'Kerala Municipality Act, 1994',
        rules: [
            'Trade License Rules',
            'Building Rules'
        ],
        applicableSection: 'Sections 415-425',
        complianceNotes: 'Governs municipal licensing and building regulations for commercial establishments.',
        applicableSectors: ['restaurant', 'pharmacy', 'hotel', 'hospital', 'school', 'manufacturing', 'retail', 'it_company']
    },
    {
        act: 'Fire Safety Regulations',
        rules: [
            'National Building Code (NBC) Fire Safety Requirements',
            'Kerala Fire Safety Rules'
        ],
        applicableSection: 'Part 4',
        complianceNotes: 'Mandatory fire safety measures including exits, fire extinguishers, and emergency procedures.',
        applicableSectors: ['restaurant', 'hotel', 'hospital', 'school', 'manufacturing']
    },
    {
        act: 'Environmental Protection Act, 1986',
        rules: [
            'Water (Prevention and Control of Pollution) Act, 1974',
            'Air (Prevention and Control of Pollution) Act, 1981'
        ],
        applicableSection: 'Sections 3-5',
        complianceNotes: 'Covers waste management, water discharge, and air quality standards.',
        applicableSectors: ['restaurant', 'hotel', 'hospital', 'manufacturing', 'pharmacy']
    },
    {
        act: 'Goods and Services Tax Act, 2017',
        rules: [
            'GST Registration Rules',
            'GST Compliance Rules'
        ],
        applicableSection: 'Sections 22-25',
        complianceNotes: 'Mandatory for businesses with turnover above threshold. Requires quarterly/monthly filings.',
        applicableSectors: ['restaurant', 'pharmacy', 'hotel', 'hospital', 'manufacturing', 'retail', 'it_company']
    },
    {
        act: 'Income Tax Act, 1961',
        rules: [
            'PAN Registration Rules',
            'Income Tax Filing Requirements'
        ],
        applicableSection: 'Sections 139-142',
        complianceNotes: 'Mandatory PAN registration and annual income tax filing for business entities.',
        applicableSectors: ['restaurant', 'pharmacy', 'hotel', 'hospital', 'school', 'manufacturing', 'retail', 'it_company']
    },
    {
        act: 'Labor Laws',
        rules: [
            'Shops and Establishments Act',
            'Building and Other Construction Workers Act',
            'Employees State Insurance Act'
        ],
        applicableSection: 'Various',
        complianceNotes: 'Covers employee registration, working hours, safety, and social security.',
        applicableSectors: ['restaurant', 'pharmacy', 'hotel', 'hospital', 'school', 'manufacturing', 'retail', 'it_company']
    },
    {
        act: 'Excise Act, 1998 (if serving alcohol)',
        rules: [
            'Liquor License Rules',
            'Alcohol Service Regulations'
        ],
        applicableSection: 'Sections 32-45',
        complianceNotes: 'Mandatory if serving alcoholic beverages. Includes age verification and service hours.',
        applicableSectors: ['restaurant', 'hotel']
    },
    {
        act: 'Drugs and Cosmetics Act, 1940',
        rules: [
            'Drugs and Cosmetics Rules, 1945'
        ],
        applicableSection: 'Sections 18-22',
        complianceNotes: 'Governs sale, stocking, exhibition, and manufacturing of drugs and cosmetics. Mandatory retail/wholesale licenses required.',
        applicableSectors: ['pharmacy']
    },
    {
        act: 'Kerala Clinical Establishments (Registration and Regulation) Act, 2018',
        rules: [
            'Kerala Clinical Establishments Registration Rules, 2018'
        ],
        applicableSection: 'Sections 3-8',
        complianceNotes: 'Mandatory registration for all clinics, hospitals, diagnostic centers, and dental offices in Kerala.',
        applicableSectors: ['hospital']
    },
    {
        act: 'Kerala Education Act, 1958',
        rules: [
            'Kerala Education Rules (KER)'
        ],
        applicableSection: 'Chapter V',
        complianceNotes: 'Governs registration, curriculum compliance, and building safety certifications for educational institutions.',
        applicableSectors: ['school']
    },
    {
        act: 'Factories Act, 1948',
        rules: [
            'Kerala Factories Rules, 1957'
        ],
        applicableSection: 'Sections 6-10',
        complianceNotes: 'Governs licensing, health, safety, welfare, working hours, and employment rules for factories.',
        applicableSectors: ['manufacturing']
    },
    {
        act: 'Legal Metrology Act, 2009',
        rules: [
            'Legal Metrology (General) Rules, 2011'
        ],
        applicableSection: 'Sections 24-28',
        complianceNotes: 'Mandatory verification and stamping of all weighing and measuring devices used for commercial trade.',
        applicableSectors: ['retail']
    }
];
//# sourceMappingURL=restaurant-license-catalog.js.map