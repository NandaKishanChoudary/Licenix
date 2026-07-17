'use client';

import { useTheme, useWidgetSDK } from '@nitrostack/widgets';

interface ComplianceDashboardData {
  completed: number;
  pending: number;
  expiringSoon: number;
  renewalRequired: number;
  warnings?: string[];
}

export default function ComplianceDashboard() {
  const theme = useTheme();
  const { getToolOutput } = useWidgetSDK();

  const toolOutput = getToolOutput<{ widget: string; data: ComplianceDashboardData }>();
  const data = toolOutput?.data;

  if (!data) {
    return (
      <div style={{ padding: '24px', textAlign: 'center', color: theme === 'dark' ? '#fff' : '#000' }}>
        No compliance dashboard details loaded.
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
      <h2 style={{ fontSize: '20px', fontWeight: 600, margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
        🛡️ Licensing Compliance Status
      </h2>

      {/* Grid Status Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '12px',
        marginBottom: '20px'
      }}>
        {/* Completed Card */}
        <div style={{
          padding: '16px',
          background: cardBg,
          borderRadius: '8px',
          border: `1px solid ${borderColor}`,
          borderLeft: '4px solid #10b981'
        }}>
          <span style={{ fontSize: '12px', color: mutedColor, fontWeight: 500 }}>Completed</span>
          <div style={{ fontSize: '28px', fontWeight: 700, color: '#10b981', marginTop: '4px' }}>
            {data.completed}
          </div>
        </div>

        {/* Pending Card */}
        <div style={{
          padding: '16px',
          background: cardBg,
          borderRadius: '8px',
          border: `1px solid ${borderColor}`,
          borderLeft: '4px solid #f59e0b'
        }}>
          <span style={{ fontSize: '12px', color: mutedColor, fontWeight: 500 }}>Pending</span>
          <div style={{ fontSize: '28px', fontWeight: 700, color: '#f59e0b', marginTop: '4px' }}>
            {data.pending}
          </div>
        </div>

        {/* Expiring Soon Card */}
        <div style={{
          padding: '16px',
          background: cardBg,
          borderRadius: '8px',
          border: `1px solid ${borderColor}`,
          borderLeft: '4px solid #ef4444'
        }}>
          <span style={{ fontSize: '12px', color: mutedColor, fontWeight: 500 }}>Expiring Soon</span>
          <div style={{ fontSize: '28px', fontWeight: 700, color: '#ef4444', marginTop: '4px' }}>
            {data.expiringSoon}
          </div>
        </div>

        {/* Renewal Required Card */}
        <div style={{
          padding: '16px',
          background: cardBg,
          borderRadius: '8px',
          border: `1px solid ${borderColor}`,
          borderLeft: '4px solid #3b82f6'
        }}>
          <span style={{ fontSize: '12px', color: mutedColor, fontWeight: 500 }}>Renewal Required</span>
          <div style={{ fontSize: '28px', fontWeight: 700, color: '#3b82f6', marginTop: '4px' }}>
            {data.renewalRequired}
          </div>
        </div>
      </div>

      {/* Warnings & Advice */}
      {data.warnings && data.warnings.length > 0 && (
        <div style={{
          padding: '14px',
          background: isDark ? '#7f1d1d' : '#fee2e2',
          borderRadius: '8px',
          border: `1px solid ${isDark ? '#991b1b' : '#fecaca'}`
        }}>
          <h3 style={{
            fontSize: '13px',
            fontWeight: 600,
            margin: '0 0 8px 0',
            color: isDark ? '#fca5a5' : '#991b1b',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            ⚠️ Critical Compliance Warnings
          </h3>
          <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '12px', color: isDark ? '#fca5a5' : '#991b1b', lineHeight: 1.5 }}>
            {data.warnings.map((warning, idx) => (
              <li key={idx} style={{ marginBottom: '4px' }}>{warning}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
