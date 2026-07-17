'use client';

import { useTheme, useWidgetSDK } from '@nitrostack/widgets';

interface TimelineStep {
  name: string;
  estimatedDays: string;
  status: 'Pending' | 'In-Progress' | 'Completed' | string;
  department: string;
}

interface TimelineData {
  steps: TimelineStep[];
}

export default function ApplicationTimeline() {
  const theme = useTheme();
  const { getToolOutput } = useWidgetSDK();

  const toolOutput = getToolOutput<{ widget: string; data: TimelineData }>();
  const data = toolOutput?.data;

  if (!data || !data.steps) {
    return (
      <div style={{ padding: '24px', textAlign: 'center', color: theme === 'dark' ? '#fff' : '#000' }}>
        No timeline data loaded.
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return '#10b981';
      case 'in-progress': return '#3b82f6';
      case 'pending': return '#f59e0b';
      default: return '#6b7280';
    }
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
      maxWidth: '500px',
      margin: '0 auto',
      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
    }}>
      <h2 style={{ fontSize: '20px', fontWeight: 600, margin: '0 0 24px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
        ⏱️ Licensing Processing Timeline
      </h2>

      <div style={{ position: 'relative', paddingLeft: '24px' }}>
        {/* Timeline Line */}
        <div style={{
          position: 'absolute',
          left: '7px',
          top: '8px',
          bottom: '8px',
          width: '2px',
          background: isDark ? '#374151' : '#e5e7eb',
        }} />

        {data.steps.map((step, idx) => {
          const statusColor = getStatusColor(step.status);
          return (
            <div key={idx} style={{ position: 'relative', marginBottom: '24px' }}>
              {/* Timeline Dot */}
              <div style={{
                position: 'absolute',
                left: '-24px',
                top: '5px',
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                background: statusColor,
                border: `3px solid ${bgColor}`,
                boxShadow: `0 0 0 1px ${borderColor}`
              }} />

              {/* Card Contents */}
              <div style={{
                padding: '14px',
                background: cardBg,
                borderRadius: '8px',
                border: `1px solid ${borderColor}`,
                marginLeft: '8px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 600 }}>{step.name}</h3>
                  <span style={{
                    fontSize: '10px',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    background: `${statusColor}22`,
                    color: statusColor,
                    fontWeight: 600
                  }}>
                    {step.status}
                  </span>
                </div>
                <span style={{ fontSize: '11px', color: mutedColor, display: 'block', marginBottom: '4px' }}>
                  🏛️ {step.department}
                </span>
                <span style={{ fontSize: '12px', fontWeight: 500, color: isDark ? '#60a5fa' : '#2563eb' }}>
                  ⏱️ Estimated duration: {step.estimatedDays}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
