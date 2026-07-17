'use client';

import { useTheme, useWidgetState, useWidgetSDK } from '@nitrostack/widgets';

interface DocumentItem {
  name: string;
  required: boolean;
  placeholder?: string;
  sampleUrl?: string;
  verificationStatus?: 'verified' | 'pending' | 'unverified';
}

interface DocumentChecklistData {
  documents: DocumentItem[];
}

export default function DocumentChecklist() {
  const theme = useTheme();
  const { getToolOutput } = useWidgetSDK();
  const [state, setState] = useWidgetState<{ checkedDocs: Record<string, boolean> }>(() => ({
    checkedDocs: {}
  }));

  const toolOutput = getToolOutput<{ widget: string; data: DocumentChecklistData }>();
  const data = toolOutput?.data;

  if (!data || !data.documents) {
    return (
      <div style={{ padding: '24px', textAlign: 'center', color: theme === 'dark' ? '#fff' : '#000' }}>
        No document checklist loaded.
      </div>
    );
  }

  const handleCheckboxChange = (docName: string) => {
    const currentChecked = state?.checkedDocs || {};
    setState({
      checkedDocs: {
        ...currentChecked,
        [docName]: !currentChecked[docName]
      }
    });
  };

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
        📁 Document Preparation Checklist
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {data.documents.map((doc, idx) => {
          const isChecked = !!state?.checkedDocs?.[doc.name];
          return (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'start',
                gap: '12px',
                padding: '14px',
                background: cardBg,
                borderRadius: '8px',
                border: `1px solid ${borderColor}`,
                opacity: isChecked ? 0.7 : 1,
                transition: 'opacity 0.2s'
              }}
            >
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => handleCheckboxChange(doc.name)}
                style={{
                  marginTop: '4px',
                  width: '18px',
                  height: '18px',
                  cursor: 'pointer'
                }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
                  <strong style={{
                    fontSize: '14px',
                    textDecoration: isChecked ? 'line-through' : 'none'
                  }}>
                    {doc.name}
                  </strong>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <span style={{
                      fontSize: '10px',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      background: doc.required ? '#fee2e2' : '#f3f4f6',
                      color: doc.required ? '#991b1b' : '#4b5563',
                      fontWeight: 600
                    }}>
                      {doc.required ? 'Required' : 'Optional'}
                    </span>
                    {doc.verificationStatus && (
                      <span style={{
                        fontSize: '10px',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        background: doc.verificationStatus === 'verified' ? '#d1fae5' : '#fef3c7',
                        color: doc.verificationStatus === 'verified' ? '#065f46' : '#92400e',
                        fontWeight: 600
                      }}>
                        {doc.verificationStatus.toUpperCase()}
                      </span>
                    )}
                  </div>
                </div>

                <div style={{
                  marginTop: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '8px'
                }}>
                  <span style={{ fontSize: '11px', color: mutedColor }}>
                    {doc.placeholder || 'Placeholder for upload'}
                  </span>
                  {doc.sampleUrl && doc.sampleUrl !== '#' && (
                    <a
                      href={doc.sampleUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        fontSize: '11px',
                        color: '#3b82f6',
                        textDecoration: 'none',
                        fontWeight: 500
                      }}
                    >
                      Download Sample 📥
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
