export default function Badge({
  children,
  color = 'slate',
}: {
  children: React.ReactNode;
  color?: 'slate' | 'green' | 'red' | 'amber' | 'purple' | 'blue' | 'teal';
}) {
  const estilos: Record<string, { bg: string; color: string; border: string }> = {
    slate: { bg: '#f1f5f9', color: '#475569', border: '#e2e8f0' },
    green: { bg: '#d1fae5', color: '#065f46', border: '#a7f3d0' },
    red: { bg: '#fee2e2', color: '#991b1b', border: '#fecaca' },
    amber: { bg: '#fef3c7', color: '#92400e', border: '#fde68a' },
    purple: { bg: '#ede9fe', color: '#6d28d9', border: '#ddd6fe' },
    blue: { bg: '#dbeafe', color: '#1e40af', border: '#bfdbfe' },
    teal: { bg: '#ccfbf1', color: '#0f766e', border: '#99f6e4' },
  };

  const estilo = estilos[color];

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      padding: '4px 12px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '600',
      letterSpacing: '0.02em',
      background: estilo.bg,
      color: estilo.color,
      border: `1px solid ${estilo.border}`
    }}>
      {children}
    </span>
  );
}