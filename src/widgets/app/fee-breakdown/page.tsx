'use client';

import { useTheme, useWidgetSDK } from '@nitrostack/widgets';

interface FeeBreakdownData {
  governmentFees: string | number;
  registrationCharges: string | number;
  professionalCharges: string | number;
  totalCost: string | number;
}

export default function FeeBreakdown() {
  const theme = useTheme();
  const { getToolOutput } = useWidgetSDK();

  const toolOutput = getToolOutput<{ widget: string; data: FeeBreakdownData }>();
  const data = toolOutput?.data;

  if (!data) {
    return (
      <div style={{ padding: '24px', textAlign: 'center', color: theme === 'dark' ? '#fff' : '#000' }}>
        No fee details loaded.
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
      maxWidth: '500px',
      margin: '0 auto',
      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
    }}>
      <h2 style={{ fontSize: '20px', fontWeight: 600, margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
        💰 Licensing & Registration Fee Breakdown
      </h2>

      {/* Summary Card */}
      <div style={{
        padding: '20px',
        background: isDark ? 'linear-gradient(135deg, #1e3a8a 0%, #1e1b4b 100%)' : 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
        borderRadius: '10px',
        border: `1px solid ${isDark ? '#1e40af' : '#bfdbfe'}`,
        marginBottom: '20px',
        textAlign: 'center'
      }}>
        <span style={{ fontSize: '13px', color: isDark ? '#bfdbfe' : '#1e3a8a', fontWeight: 500 }}>
          TOTAL ESTIMATED COST
        </span>
        <div style={{
          fontSize: '32px',
          fontWeight: 700,
          color: isDark ? '#60a5fa' : '#2563eb',
          marginTop: '6px'
        }}>
          {typeof data.totalCost === 'number' ? `₹${data.totalCost.toLocaleString()}` : data.totalCost}
        </div>
        <p style={{ margin: '8px 0 0 0', fontSize: '11px', color: isDark ? '#93c5fd' : '#1e40af', opacity: 0.8 }}>
          Includes government duties, direct registration fees, and estimated setup charges.
        </p>
      </div>

      {/* Breakdown Items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: '12px 14px',
          background: cardBg,
          borderRadius: '8px',
          border: `1px solid ${borderColor}`
        }}>
          <div>
            <strong style={{ fontSize: '14px' }}>🏛️ Government Fees</strong>
            <div style={{ fontSize: '11px', color: mutedColor, marginTop: '2px' }}>Official processing charges</div>
          </div>
          <span style={{ fontSize: '15px', fontWeight: 600 }}>
            {typeof data.governmentFees === 'number' ? `₹${data.governmentFees.toLocaleString()}` : data.governmentFees}
          </span>
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: '12px 14px',
          background: cardBg,
          borderRadius: '8px',
          border: `1px solid ${borderColor}`
        }}>
          <div>
            <strong style={{ fontSize: '14px' }}>📝 Registration Charges</strong>
            <div style={{ fontSize: '11px', color: mutedColor, marginTop: '2px' }}>Stamp duties & local body costs</div>
          </div>
          <span style={{ fontSize: '15px', fontWeight: 600 }}>
            {typeof data.registrationCharges === 'number' ? `₹${data.registrationCharges.toLocaleString()}` : data.registrationCharges}
          </span>
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: '12px 14px',
          background: cardBg,
          borderRadius: '8px',
          border: `1px solid ${borderColor}`
        }}>
          <div>
            <strong style={{ fontSize: '14px' }}>💼 Professional Charges</strong>
            <div style={{ fontSize: '11px', color: mutedColor, marginTop: '2px' }}>Estimated compliance filings (avg)</div>
          </div>
          <span style={{ fontSize: '15px', fontWeight: 600 }}>
            {typeof data.professionalCharges === 'number' ? `₹${data.professionalCharges.toLocaleString()}` : data.professionalCharges}
          </span>
        </div>
      </div>
    </div>
  );
}
