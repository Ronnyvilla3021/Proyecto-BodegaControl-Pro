export default function Badge({
  children,
  color = 'slate',
}: {
  children: React.ReactNode;
  color?: 'slate' | 'green' | 'red' | 'amber' | 'purple' | 'blue' | 'teal';
}) {
  const estilos: Record<string, { bg: string; color: string; border: string; dot: string }> = {
    slate: { bg: '#f1f5f9', color: '#475569', border: '#e2e8f0', dot: '#64748b' },
    green: { bg: '#d1fae5', color: '#065f46', border: '#a7f3d0', dot: '#10b981' },
    red: { bg: '#fee2e2', color: '#991b1b', border: '#fecaca', dot: '#ef4444' },
    amber: { bg: '#fef3c7', color: '#92400e', border: '#fde68a', dot: '#f59e0b' },
    purple: { bg: '#ede9fe', color: '#6d28d9', border: '#ddd6fe', dot: '#8b5cf6' },
    blue: { bg: '#dbeafe', color: '#1e40af', border: '#bfdbfe', dot: '#3b82f6' },
    teal: { bg: '#ccfbf1', color: '#0f766e', border: '#99f6e4', dot: '#14b8a6' },
  };

  const estilo = estilos[color];

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      padding: '4px 12px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '600',
      letterSpacing: '0.02em',
      background: estilo.bg,
      color: estilo.color,
      border: `1px solid ${estilo.border}`,
      whiteSpace: 'nowrap'
    }}>
      <span style={{
        width: '6px',
        height: '6px',
        borderRadius: '50%',
        background: estilo.dot,
        flexShrink: 0
      }} />
      {children}
    </span>
  );
}