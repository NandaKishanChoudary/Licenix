'use client';

import { useTheme, useWidgetSDK } from '@nitrostack/widgets';

interface BusinessSummaryData {
  businessName: string;
  sector: string;
  state: string;
  district: string;
  riskCategory: string;
  applicableActs: string[];
  applicableAuthorities: string[];
}

export default function BusinessSummary() {
  const theme = useTheme();
  const { getToolOutput } = useWidgetSDK();

  const toolOutput = getToolOutput<{ widget: string; data: BusinessSummaryData }>();
  const data = toolOutput?.data;

  if (!data) {
    return (
      <div style={{ padding: '24px', textAlign: 'center', color: theme === 'dark' ? '#fff' : '#000' }}>
        No business profile details loaded.
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
      maxWidth: '550px',
      margin: '0 auto',
      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
    }}>
      <h2 style={{ fontSize: '20px', fontWeight: 600, margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
        🏢 Business Setup Profile Summary
      </h2>

      {/* Main Details Card */}
      <div style={{
        padding: '16px',
        background: cardBg,
        borderRadius: '8px',
        border: `1px solid ${borderColor}`,
        marginBottom: '20px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>
              {data.businessName || 'Unnamed Business'}
            </h3>
            <span style={{ fontSize: '12px', color: mutedColor }}>
              {data.sector}
            </span>
          </div>
          <span style={{
            fontSize: '11px',
            fontWeight: 600,
            padding: '4px 10px',
            borderRadius: '9999px',
            background: data.riskCategory.toLowerCase().includes('high') ? '#fee2e2' : '#fef3c7',
            color: data.riskCategory.toLowerCase().includes('high') ? '#991b1b' : '#92400e'
          }}>
            ⚠️ {data.riskCategory}
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', fontSize: '13px', borderTop: `1px solid ${borderColor}`, paddingTop: '12px' }}>
          <div>
            <span style={{ color: mutedColor, display: 'block', fontSize: '11px' }}>STATE</span>
            <strong>{data.state}</strong>
          </div>
          <div>
            <span style={{ color: mutedColor, display: 'block', fontSize: '11px' }}>DISTRICT / CITY</span>
            <strong>{data.district}</strong>
          </div>
        </div>
      </div>

      {/* Grid: Acts & Authorities */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
        {/* Applicable Acts */}
        <div>
          <h4 style={{ fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: mutedColor, margin: '0 0 8px 0' }}>
            📜 Governing Acts & Regulations
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {data.applicableActs.map((act, idx) => (
              <div
                key={idx}
                style={{
                  fontSize: '12.5px',
                  padding: '8px 12px',
                  background: cardBg,
                  borderRadius: '6px',
                  border: `1px solid ${borderColor}`
                }}
              >
                {act}
              </div>
            ))}
          </div>
        </div>

        {/* Governing Authorities */}
        <div>
          <h4 style={{ fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: mutedColor, margin: '0 0 8px 0' }}>
            🏛️ Governing Authorities & Bodies
          </h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {data.applicableAuthorities.map((auth, idx) => (
              <span
                key={idx}
                style={{
                  fontSize: '12px',
                  padding: '6px 12px',
                  background: isDark ? '#374151' : '#e5e7eb',
                  borderRadius: '6px',
                  fontWeight: 500
                }}
              >
                {auth}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
