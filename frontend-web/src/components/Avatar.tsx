const coloresPorLetra = ['#2563eb', '#7c3aed', '#059669', '#d97706', '#dc2626', '#0891b2', '#db2777'];

export default function Avatar({ nombre }: { nombre: string }) {
  const iniciales = nombre
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const indiceColor = nombre.charCodeAt(0) % coloresPorLetra.length;

  return (
    <div
      style={{
        width: '48px',
        height: '48px',
        borderRadius: '14px',
        background: `linear-gradient(135deg, ${coloresPorLetra[indiceColor]}, ${coloresPorLetra[indiceColor]}cc)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontWeight: '700',
        fontSize: '16px',
        letterSpacing: '0.02em',
        boxShadow: `0 4px 12px ${coloresPorLetra[indiceColor]}40`,
        flexShrink: 0,
        border: '2px solid rgba(255,255,255,0.2)'
      }}
    >
      {iniciales}
    </div>
  );
}