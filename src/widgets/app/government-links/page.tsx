'use client';

import { useTheme, useWidgetSDK } from '@nitrostack/widgets';

interface PortalItem {
  name: string;
  officialWebsite: string;
  applyOnlineUrl: string;
  downloadFormsUrl?: string;
  contactInfo?: string;
  officeAddress?: string;
}

interface GovernmentLinksData {
  portals: PortalItem[];
}

export default function GovernmentLinks() {
  const theme = useTheme();
  const { getToolOutput } = useWidgetSDK();

  const toolOutput = getToolOutput<{ widget: string; data: GovernmentLinksData }>();
  const data = toolOutput?.data;

  if (!data || !data.portals) {
    return (
      <div style={{ padding: '24px', textAlign: 'center', color: theme === 'dark' ? '#fff' : '#000' }}>
        No government portal links loaded.
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
      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
    }}>
      <h2 style={{ fontSize: '20px', fontWeight: 600, margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
        🌐 Official Government Portals & Clearances
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {data.portals.map((portal, idx) => (
          <div
            key={idx}
            style={{
              padding: '16px',
              background: cardBg,
              borderRadius: '8px',
              border: `1px solid ${borderColor}`
            }}
          >
            <h3 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: 600 }}>🏛️ {portal.name}</h3>
            <span style={{ fontSize: '11px', color: mutedColor, display: 'block', marginBottom: '12px' }}>
              Office: {portal.officeAddress || 'Not specified'}
            </span>

            {/* Quick Links */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
              <a
                href={portal.applyOnlineUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: '6px 12px',
                  background: '#2563eb',
                  color: 'white',
                  borderRadius: '4px',
                  textDecoration: 'none',
                  fontSize: '12px',
                  fontWeight: 600
                }}
              >
                🌐 Apply Online
              </a>
              <a
                href={portal.officialWebsite}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: '6px 12px',
                  border: '1px solid #2563eb',
                  color: '#2563eb',
                  background: 'transparent',
                  borderRadius: '4px',
                  textDecoration: 'none',
                  fontSize: '12px',
                  fontWeight: 600
                }}
              >
                Portal Homepage
              </a>
              {portal.downloadFormsUrl && portal.downloadFormsUrl !== '#' && (
                <a
                  href={portal.downloadFormsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    padding: '6px 12px',
                    background: isDark ? '#374151' : '#e5e7eb',
                    color: textColor,
                    borderRadius: '4px',
                    textDecoration: 'none',
                    fontSize: '12px',
                    fontWeight: 500
                  }}
                >
                  Download Forms 📥
                </a>
              )}
            </div>

            {/* Contact Details */}
            {portal.contactInfo && (
              <div style={{
                fontSize: '12px',
                color: mutedColor,
                paddingTop: '8px',
                borderTop: `1px solid ${borderColor}`,
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                📞 <strong>Contact:</strong> {portal.contactInfo}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
