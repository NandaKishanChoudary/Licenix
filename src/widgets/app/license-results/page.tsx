'use client';

import { useTheme, useWidgetState, useWidgetSDK } from '@nitrostack/widgets';

interface License {
  id: string;
  name: string;
  mandatory: boolean;
  issuingDepartment: string;
  description: string;
  renewalFrequency: string;
  estimatedFee?: string;
  processingTime?: string;
  status?: string;
  governmentPortal?: {
    applyOnlineUrl: string;
    portalUrl: string;
  };
}

interface LicenseResultsData {
  licenses: License[];
}

export default function LicenseResults() {
  const theme = useTheme();
  const { getToolOutput } = useWidgetSDK();
  const [state, setState] = useWidgetState<{ expandedLicense: string | null }>(() => ({
    expandedLicense: null
  }));

  const toolOutput = getToolOutput<{ widget: string; data: LicenseResultsData }>();
  const data = toolOutput?.data;

  if (!data || !data.licenses) {
    return (
      <div style={{ padding: '24px', textAlign: 'center', color: theme === 'dark' ? '#fff' : '#000' }}>
        No license data loaded.
      </div>
    );
  }

  const isDark = theme === 'dark';
  const bgColor = isDark ? '#111827' : '#ffffff';
  const cardBg = isDark ? '#1f2937' : '#f9fafb';
  const textColor = isDark ? '#ffffff' : '#111827';
  const mutedColor = isDark ? '#9ca3af' : '#4b5563';
  const borderColor = isDark ? '#374151' : '#e5e7eb';

  return (
    <div style={{
      padding: '24px',
      background: bgColor,
      color: textColor,
      fontFamily: 'system-ui, -apple-system, sans-serif',
      borderRadius: '12px',
      border: `1px solid ${borderColor}`,
      maxWidth: '600px',
      margin: '0 auto',
      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)'
    }}>
      <h2 style={{ fontSize: '20px', fontWeight: 600, margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
        📜 Required Licenses & Clearances
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {data.licenses.map((license) => {
          const isExpanded = state?.expandedLicense === license.id;
          return (
            <div
              key={license.id}
              onClick={() => setState({ expandedLicense: isExpanded ? null : license.id })}
              style={{
                padding: '16px',
                background: cardBg,
                borderRadius: '8px',
                border: `1px solid ${borderColor}`,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>{license.name}</h3>
                  <span style={{ fontSize: '12px', color: mutedColor }}>{license.issuingDepartment}</span>
                </div>
                <span style={{
                  padding: '2px 8px',
                  borderRadius: '9999px',
                  fontSize: '11px',
                  fontWeight: 600,
                  background: license.mandatory ? '#fee2e2' : '#dbeafe',
                  color: license.mandatory ? '#991b1b' : '#1e40af'
                }}>
                  {license.mandatory ? 'Mandatory' : 'Optional'}
                </span>
              </div>

              <p style={{ margin: '8px 0', fontSize: '13px', color: mutedColor, lineHeight: 1.4 }}>
                {license.description}
              </p>

              <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: mutedColor, marginTop: '8px' }}>
                <span>⏱️ {license.processingTime || '3-4 weeks'}</span>
                <span>💰 {license.estimatedFee || '₹500 - ₹2,000'}</span>
                <span>🔄 {license.renewalFrequency}</span>
              </div>

              {isExpanded && (
                <div style={{
                  marginTop: '12px',
                  paddingTop: '12px',
                  borderTop: `1px solid ${borderColor}`,
                  fontSize: '13px',
                  color: textColor,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }} onClick={(e) => e.stopPropagation()}>
                  <div>
                    <strong>Renewal Period:</strong> {license.renewalFrequency}
                  </div>
                  <div>
                    <strong>Department:</strong> {license.issuingDepartment}
                  </div>
                  {license.governmentPortal && (
                    <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                      <a
                        href={license.governmentPortal.applyOnlineUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          padding: '6px 12px',
                          background: '#3b82f6',
                          color: 'white',
                          borderRadius: '4px',
                          textDecoration: 'none',
                          fontSize: '12px',
                          fontWeight: 500
                        }}
                      >
                        Apply Online
                      </a>
                      <a
                        href={license.governmentPortal.portalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          padding: '6px 12px',
                          border: '1px solid #3b82f6',
                          color: '#3b82f6',
                          background: 'transparent',
                          borderRadius: '4px',
                          textDecoration: 'none',
                          fontSize: '12px',
                          fontWeight: 500
                        }}
                      >
                        Portal Home
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
