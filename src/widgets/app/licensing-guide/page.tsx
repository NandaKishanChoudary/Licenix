'use client';

import { useWidgetSDK, useTheme, useMaxHeight, useDisplayMode, useWidgetState } from '@nitrostack/widgets';

export const dynamic = 'force-dynamic';

interface License {
  id: string;
  name: string;
  mandatory: boolean;
  issuingDepartment: string;
  description: string;
  renewalFrequency: string;
  imageUrl?: string;
}

interface CostBreakdown {
  licenseId: string;
  licenseName: string;
  applicationFee: string | number;
  inspectionFee: string | number;
  renewalFee: string | number;
  totalEstimatedCost: string | number;
  notes?: string;
}

interface TimelineBreakdown {
  licenseId: string;
  licenseName: string;
  applicationProcessing: string;
  inspectionDuration: string;
  approvalDuration: string;
  totalDuration: string;
  notes?: string;
}

interface LicenseForm {
  licenseId: string;
  licenseName: string;
  requiredDocuments: Array<{ name: string; required: boolean; description?: string }>;
  officialForm: { name: string; url: string; verified: boolean };
  applyOnlineLink?: { url: string; verified: boolean };
  submissionMethod: 'online' | 'offline' | 'both';
  departmentContact: { name: string; phone?: string; email?: string; address?: string };
  imageUrl?: string;
}

interface LicensingPackageData {
  supported: boolean;
  message?: string;
  analysis?: {
    supported: boolean;
    businessCategory?: string;
    state?: string;
    district?: string;
    departments?: string[];
  };
  licenses?: License[];
  regulations?: any[];
  forms?: LicenseForm[];
  costs?: CostBreakdown[];
  timelines?: TimelineBreakdown[];
  advice?: {
    supported: boolean;
    applicationOrder?: string[];
    preparationChecklist?: string[];
    documentsToPrepareFist?: string[];
    commonMistakes?: string[];
    warnings?: string[];
    expectedCompletionTime?: string;
    tipsForFasterApproval?: string[];
  };
}

export default function LicensingGuideWidget() {
  const theme = useTheme();
  const { isReady, getToolOutput } = useWidgetSDK();
  const [state, setState] = useWidgetState<{ expandedLicense: string | null; viewMode: 'overview' | 'detailed' }>(() => ({
    expandedLicense: null,
    viewMode: 'overview'
  }));

  const data = getToolOutput<LicensingPackageData>();

  if (!isReady) {
    return (
      <div style={{
        padding: '24px',
        textAlign: 'center',
        color: theme === 'dark' ? '#fff' : '#000',
      }}>
        Initializing...
      </div>
    );
  }

  if (!data) {
    return (
      <div style={{
        padding: '24px',
        textAlign: 'center',
        color: theme === 'dark' ? '#fff' : '#000',
      }}>
        Loading licensing guide...
      </div>
    );
  }

  if (!data.supported) {
    return (
      <div style={{
        padding: '24px',
        background: theme === 'dark' ? '#2d3748' : '#fee2e2',
        borderRadius: '12px',
        color: theme === 'dark' ? '#fff' : '#991b1b',
        border: `1px solid ${theme === 'dark' ? '#742a2a' : '#fecaca'}`,
      }}>
        <h3 style={{ margin: '0 0 8px 0' }}>⚠️ Unable to Generate Guide</h3>
        <p style={{ margin: 0 }}>{data.message || 'Could not generate licensing guide for this business.'}</p>
      </div>
    );
  }

  const isDark = theme === 'dark';
  const bgColor = isDark ? '#1a202c' : '#ffffff';
  const cardBg = isDark ? '#2d3748' : '#f9fafb';
  const textColor = isDark ? '#ffffff' : '#000000';
  const mutedColor = isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)';
  const borderColor = isDark ? '#4a5568' : '#e5e7eb';

  const licenses = data.licenses ?? [];
  const costs = data.costs ?? [];
  const timelines = data.timelines ?? [];
  const advice = data.advice ?? {};
  const analysis = data.analysis ?? {};

  const getSectorIcon = (category: string) => {
    switch (category) {
      case 'restaurant': return '🏪';
      case 'pharmacy': return '💊';
      case 'hotel': return '🏨';
      case 'hospital': return '🏥';
      case 'school': return '🏫';
      case 'manufacturing': return '🏭';
      case 'retail': return '🛍️';
      case 'it_company': return '💻';
      default: return '🏪';
    }
  };

  const sectorName = analysis.sectorLabel ?? 'Business';
  const sectorIcon = getSectorIcon(analysis.businessCategory ?? 'general');

  const getMandatoryCount = () => licenses.filter((l: License) => l.mandatory).length;
  const getTotalCost = () => {
    const total = costs.reduce((sum: number, c: CostBreakdown) => {
      const cost = typeof c.totalEstimatedCost === 'number' ? c.totalEstimatedCost : 0;
      return sum + cost;
    }, 0);
    return total > 0 ? `₹${total.toLocaleString()}` : 'Unavailable';
  };

  const getCostForLicense = (licenseId: string) => {
    const cost = costs.find((c: CostBreakdown) => c.licenseId === licenseId);
    return cost?.totalEstimatedCost ?? 'Unavailable';
  };

  const getTimelineForLicense = (licenseId: string) => {
    const timeline = timelines.find((t: TimelineBreakdown) => t.licenseId === licenseId);
    return timeline?.totalDuration ?? 'Unavailable';
  };

  const handleDownloadReport = () => {
    let md = `# Licensing Guide: ${sectorName} in ${analysis.district || 'Kerala'}\n\n`;
    md += `Generated by Smart Licensing Assistant on ${new Date().toLocaleDateString()}\n\n`;
    md += `## 📋 Quick Stats\n`;
    md += `- Total Licenses: ${licenses.length} (${getMandatoryCount()} mandatory)\n`;
    md += `- Estimated Cost: ${getTotalCost()}\n`;
    md += `- Timeline: ${advice.expectedCompletionTime || '3-6 months'}\n\n`;
    
    md += `## 📜 Required Licenses\n\n`;
    licenses.forEach((l: any, idx: number) => {
      md += `### ${idx + 1}. ${l.name} (${l.mandatory ? 'Mandatory' : 'Optional'})\n`;
      md += `- **Issuing Department:** ${l.issuingDepartment}\n`;
      md += `- **Description:** ${l.description}\n`;
      md += `- **Renewal Frequency:** ${l.renewalFrequency}\n`;
      md += `- **Cost:** ${getCostForLicense(l.id)}\n`;
      md += `- **Timeline:** ${getTimelineForLicense(l.id)}\n\n`;
    });

    md += `## 💰 Detailed Cost Breakdown\n\n`;
    md += `| License | Application Fee | Renewal Fee | Total Estimated Cost |\n`;
    md += `| --- | --- | --- | --- |\n`;
    costs.forEach((c: any) => {
      md += `| ${c.licenseName} | ${c.applicationFee} | ${c.renewalFee} | ${c.totalEstimatedCost} |\n`;
    });
    md += `| **TOTAL** | | | **${getTotalCost()}** |\n\n`;

    if (advice.supported) {
      md += `## 💡 AI-Powered Advice\n\n`;
      if (advice.applicationOrder) {
        md += `### Recommended Application Order:\n`;
        advice.applicationOrder.forEach((item: string, idx: number) => {
          md += `${idx + 1}. ${item}\n`;
        });
        md += `\n`;
      }
      if (advice.preparationChecklist) {
        md += `### Preparation Checklist:\n`;
        advice.preparationChecklist.forEach((item: string) => {
          md += `- [ ] ${item}\n`;
        });
        md += `\n`;
      }
      if (advice.warnings) {
        md += `### Warnings:\n`;
        advice.warnings.forEach((item: string) => {
          md += `- ⚠️ ${item}\n`;
        });
        md += `\n`;
      }
    }

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${sectorName.toLowerCase().replace(/[^a-z0-9]+/g, '_')}_licensing_report.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{
      padding: '24px',
      background: bgColor,
      color: textColor,
      fontFamily: 'system-ui, -apple-system, sans-serif',
      maxWidth: '1200px',
      margin: '0 auto',
    }}>
      {/* Header */}
      <div style={{
        marginBottom: '32px',
        paddingBottom: '24px',
        borderBottom: `1px solid ${borderColor}`,
      }}>
        <h1 style={{ margin: '0 0 8px 0', fontSize: '32px', fontWeight: 'bold' }}>
          {sectorIcon} {sectorName} Licensing Guide
        </h1>
        <p style={{ margin: '0 0 16px 0', color: mutedColor, fontSize: '16px' }}>
          Complete roadmap for opening a {analysis.businessInput || 'business'} in {analysis.district || 'Kerala'}
        </p>

        {/* Quick Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginTop: '16px',
        }}>
          <div style={{
            padding: '16px',
            background: cardBg,
            borderRadius: '8px',
            border: `1px solid ${borderColor}`,
          }}>
            <div style={{ fontSize: '12px', color: mutedColor, marginBottom: '4px' }}>Total Licenses</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{licenses.length}</div>
            <div style={{ fontSize: '12px', color: mutedColor, marginTop: '4px' }}>
              {getMandatoryCount()} mandatory
            </div>
          </div>

          <div style={{
            padding: '16px',
            background: cardBg,
            borderRadius: '8px',
            border: `1px solid ${borderColor}`,
          }}>
            <div style={{ fontSize: '12px', color: mutedColor, marginBottom: '4px' }}>Estimated Cost</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{getTotalCost()}</div>
            <div style={{ fontSize: '12px', color: mutedColor, marginTop: '4px' }}>
              All licenses combined
            </div>
          </div>

          <div style={{
            padding: '16px',
            background: cardBg,
            borderRadius: '8px',
            border: `1px solid ${borderColor}`,
          }}>
            <div style={{ fontSize: '12px', color: mutedColor, marginBottom: '4px' }}>Timeline</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
              {advice.expectedCompletionTime || '3-6 months'}
            </div>
            <div style={{ fontSize: '12px', color: mutedColor, marginTop: '4px' }}>
              Estimated duration
            </div>
          </div>
        </div>
      </div>

      {/* View Mode Toggle & Action Buttons */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px',
        marginBottom: '24px',
      }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setState({ ...state, viewMode: 'overview' })}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              border: state?.viewMode === 'overview' ? '2px solid #3b82f6' : `1px solid ${borderColor}`,
              background: state?.viewMode === 'overview' ? '#3b82f6' : cardBg,
              color: state?.viewMode === 'overview' ? 'white' : textColor,
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 0.2s',
            }}
          >
            📋 Overview
          </button>
          <button
            onClick={() => setState({ ...state, viewMode: 'detailed' })}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              border: state?.viewMode === 'detailed' ? '2px solid #3b82f6' : `1px solid ${borderColor}`,
              background: state?.viewMode === 'detailed' ? '#3b82f6' : cardBg,
              color: state?.viewMode === 'detailed' ? 'white' : textColor,
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 0.2s',
            }}
          >
            📊 Detailed View
          </button>
        </div>

        <button
          onClick={handleDownloadReport}
          style={{
            padding: '8px 16px',
            borderRadius: '6px',
            border: 'none',
            background: '#10b981',
            color: 'white',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            transition: 'all 0.2s',
          }}
        >
          📥 Download Full Report (.md)
        </button>
      </div>

      {/* Licenses Grid */}
      <div style={{
        marginBottom: '32px',
      }}>
        <h2 style={{ margin: '0 0 16px 0', fontSize: '20px', fontWeight: 'bold' }}>
          📜 Required Licenses
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '16px',
        }}>
          {licenses.map((license: License) => (
            <div
              key={license.id}
              onClick={() => setState({
                ...state,
                expandedLicense: state?.expandedLicense === license.id ? null : license.id
              })}
              style={{
                padding: '16px',
                background: cardBg,
                borderRadius: '8px',
                border: `1px solid ${borderColor}`,
                cursor: 'pointer',
                transition: 'all 0.2s',
                transform: state?.expandedLicense === license.id ? 'scale(1.02)' : 'scale(1)',
                boxShadow: state?.expandedLicense === license.id ? '0 4px 12px rgba(0,0,0,0.1)' : 'none',
              }}
            >
              {/* License Image */}
              {license.imageUrl && (
                <div style={{
                  width: '100%',
                  height: '160px',
                  borderRadius: '6px',
                  marginBottom: '12px',
                  overflow: 'hidden',
                  background: '#e5e7eb',
                }}>
                  <img
                    src={license.imageUrl}
                    alt={license.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                    onError={(e: any) => {
                      if (e.target) e.target.style.display = 'none';
                    }}
                  />
                </div>
              )}

              {/* License Header */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'start',
                marginBottom: '8px',
              }}>
                <div>
                  <h3 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: 'bold' }}>
                    {license.name}
                  </h3>
                  <p style={{ margin: 0, fontSize: '12px', color: mutedColor }}>
                    {license.issuingDepartment}
                  </p>
                </div>
                <span style={{
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  background: license.mandatory ? '#fee2e2' : '#dbeafe',
                  color: license.mandatory ? '#991b1b' : '#1e40af',
                }}>
                  {license.mandatory ? '✓ Mandatory' : '○ Optional'}
                </span>
              </div>

              {/* License Description */}
              <p style={{
                margin: '8px 0',
                fontSize: '13px',
                color: mutedColor,
                lineHeight: '1.4',
              }}>
                {license.description}
              </p>

              {/* License Meta */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '12px',
                color: mutedColor,
                marginTop: '12px',
                paddingTop: '12px',
                borderTop: `1px solid ${borderColor}`,
              }}>
                <span>💰 {getCostForLicense(license.id)}</span>
                <span>⏱️ {getTimelineForLicense(license.id)}</span>
                <span>🔄 {license.renewalFrequency}</span>
              </div>

              {/* Expanded Details */}
              {state?.expandedLicense === license.id && state?.viewMode === 'detailed' && (
                <div style={{
                  marginTop: '12px',
                  paddingTop: '12px',
                  borderTop: `1px solid ${borderColor}`,
                  fontSize: '12px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }} onClick={(e) => e.stopPropagation()}>
                  <div style={{ marginBottom: '4px' }}>
                    <strong>Issuing Department:</strong> {license.issuingDepartment}
                  </div>
                  <div style={{ marginBottom: '4px' }}>
                    <strong>Renewal Frequency:</strong> {license.renewalFrequency}
                  </div>
                  {license.governmentPortal && (
                    <div style={{
                      marginTop: '8px',
                      padding: '12px',
                      background: isDark ? '#1a202c' : '#f3f4f6',
                      borderRadius: '6px',
                      border: `1px solid ${borderColor}`,
                    }}>
                      <div style={{ fontWeight: 'bold', marginBottom: '6px', fontSize: '13px' }}>
                        🏛️ {license.governmentPortal.formName}
                      </div>
                      <div style={{ color: mutedColor, marginBottom: '10px', fontSize: '11px' }}>
                        Method: {license.governmentPortal.submissionMethod} 
                        {license.governmentPortal.verified ? ' (🛡️ Verified Link)' : ' (Unverified Link)'}
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <a
                          href={license.governmentPortal.applyOnlineUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            padding: '8px 12px',
                            background: '#3b82f6',
                            color: 'white',
                            textDecoration: 'none',
                            borderRadius: '4px',
                            fontWeight: 'bold',
                            textAlign: 'center',
                            flex: 1,
                            transition: 'background 0.2s',
                          }}
                        >
                          🌐 Apply Online
                        </a>
                        <a
                          href={license.governmentPortal.portalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            padding: '8px 12px',
                            background: 'transparent',
                            color: '#3b82f6',
                            border: '1px solid #3b82f6',
                            textDecoration: 'none',
                            borderRadius: '4px',
                            fontWeight: 'bold',
                            textAlign: 'center',
                            flex: 1,
                            transition: 'all 0.2s',
                          }}
                        >
                          Portal Home
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Advice Section */}
      {advice.supported && state?.viewMode === 'detailed' && (
        <div style={{
          marginBottom: '32px',
          padding: '20px',
          background: cardBg,
          borderRadius: '8px',
          border: `1px solid ${borderColor}`,
        }}>
          <h2 style={{ margin: '0 0 16px 0', fontSize: '20px', fontWeight: 'bold' }}>
            💡 AI-Powered Recommendations
          </h2>

          {advice.applicationOrder && advice.applicationOrder.length > 0 && (
            <div style={{ marginBottom: '16px' }}>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: 'bold' }}>
                Recommended Application Order:
              </h3>
              <ol style={{ margin: '0', paddingLeft: '20px', fontSize: '13px', color: mutedColor }}>
                {advice.applicationOrder.slice(0, 5).map((item: string, idx: number) => (
                  <li key={idx} style={{ marginBottom: '4px' }}>{item}</li>
                ))}
                {advice.applicationOrder.length > 5 && (
                  <li style={{ marginTop: '4px', fontStyle: 'italic' }}>
                    ...and {advice.applicationOrder.length - 5} more
                  </li>
                )}
              </ol>
            </div>
          )}

          {advice.warnings && advice.warnings.length > 0 && (
            <div style={{
              padding: '12px',
              background: isDark ? '#742a2a' : '#fee2e2',
              borderRadius: '6px',
              border: `1px solid ${isDark ? '#991b1b' : '#fecaca'}`,
              marginTop: '12px',
            }}>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: 'bold', color: isDark ? '#fca5a5' : '#991b1b' }}>
                ⚠️ Important Warnings:
              </h3>
              <ul style={{ margin: '0', paddingLeft: '20px', fontSize: '13px' }}>
                {advice.warnings.slice(0, 3).map((warning: string, idx: number) => (
                  <li key={idx} style={{ marginBottom: '4px', color: isDark ? '#fca5a5' : '#991b1b' }}>
                    {warning}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Cost Breakdown Table */}
      {state?.viewMode === 'detailed' && costs.length > 0 && (
        <div style={{
          marginBottom: '32px',
          padding: '20px',
          background: cardBg,
          borderRadius: '8px',
          border: `1px solid ${borderColor}`,
        }}>
          <h2 style={{ margin: '0 0 16px 0', fontSize: '20px', fontWeight: 'bold' }}>
            💰 Detailed Cost Breakdown
          </h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
              <thead>
                <tr style={{ borderBottom: `2px solid ${borderColor}`, textAlign: 'left' }}>
                  <th style={{ padding: '12px 8px', fontWeight: 'bold' }}>License</th>
                  <th style={{ padding: '12px 8px', fontWeight: 'bold' }}>Application Fee</th>
                  <th style={{ padding: '12px 8px', fontWeight: 'bold' }}>Renewal Fee</th>
                  <th style={{ padding: '12px 8px', fontWeight: 'bold' }}>Total Cost</th>
                </tr>
              </thead>
              <tbody>
                {costs.map((c: CostBreakdown, idx: number) => (
                  <tr key={idx} style={{ borderBottom: `1px solid ${borderColor}` }}>
                    <td style={{ padding: '12px 8px', fontWeight: '500' }}>{c.licenseName}</td>
                    <td style={{ padding: '12px 8px' }}>{typeof c.applicationFee === 'number' ? `₹${c.applicationFee}` : c.applicationFee}</td>
                    <td style={{ padding: '12px 8px' }}>{typeof c.renewalFee === 'number' ? `₹${c.renewalFee}` : c.renewalFee}</td>
                    <td style={{ padding: '12px 8px', fontWeight: '500' }}>{typeof c.totalEstimatedCost === 'number' ? `₹${c.totalEstimatedCost}` : c.totalEstimatedCost}</td>
                  </tr>
                ))}
                <tr style={{ background: isDark ? '#232d3d' : '#f3f4f6', fontWeight: 'bold' }}>
                  <td style={{ padding: '12px 8px' }}>TOTAL (Approx)</td>
                  <td style={{ padding: '12px 8px' }}>-</td>
                  <td style={{ padding: '12px 8px' }}>-</td>
                  <td style={{ padding: '12px 8px', color: '#10b981' }}>{getTotalCost()}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Timeline Breakdown Table */}
      {state?.viewMode === 'detailed' && timelines.length > 0 && (
        <div style={{
          marginBottom: '32px',
          padding: '20px',
          background: cardBg,
          borderRadius: '8px',
          border: `1px solid ${borderColor}`,
        }}>
          <h2 style={{ margin: '0 0 16px 0', fontSize: '20px', fontWeight: 'bold' }}>
            ⏱️ Estimated Processing Timelines
          </h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
              <thead>
                <tr style={{ borderBottom: `2px solid ${borderColor}`, textAlign: 'left' }}>
                  <th style={{ padding: '12px 8px', fontWeight: 'bold' }}>License</th>
                  <th style={{ padding: '12px 8px', fontWeight: 'bold' }}>Submission / Processing</th>
                  <th style={{ padding: '12px 8px', fontWeight: 'bold' }}>Inspection</th>
                  <th style={{ padding: '12px 8px', fontWeight: 'bold' }}>Approval</th>
                  <th style={{ padding: '12px 8px', fontWeight: 'bold' }}>Total Time</th>
                </tr>
              </thead>
              <tbody>
                {timelines.map((t: TimelineBreakdown, idx: number) => (
                  <tr key={idx} style={{ borderBottom: `1px solid ${borderColor}` }}>
                    <td style={{ padding: '12px 8px', fontWeight: '500' }}>{t.licenseName}</td>
                    <td style={{ padding: '12px 8px' }}>{t.applicationProcessing}</td>
                    <td style={{ padding: '12px 8px' }}>{t.inspectionDuration}</td>
                    <td style={{ padding: '12px 8px' }}>{t.approvalDuration}</td>
                    <td style={{ padding: '12px 8px', fontWeight: '500' }}>{t.totalDuration}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Footer */}
      <div style={{
        textAlign: 'center',
        fontSize: '12px',
        color: mutedColor,
        paddingTop: '16px',
        borderTop: `1px solid ${borderColor}`,
      }}>
        <p style={{ margin: 0 }}>
          ✨ Smart Licensing Assistant | Generated for {analysis.district || 'Kerala'}
        </p>
      </div>
    </div>
  );
}
