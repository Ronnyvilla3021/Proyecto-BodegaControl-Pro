import { useAuthStore } from '../store/authStore';

const API_URL = import.meta.env.VITE_API_URL;

const reportes = [
  {
    formato: 'CSV',
    descripcion: 'Formato de texto plano, ideal para importar en otras herramientas.',
    endpoint: '/reportes/productos/csv',
    icono: '📄',
    color: '#10b981',
    colorBg: '#d1fae5',
    shadow: 'rgba(16,185,129,0.25)',
  },
  {
    formato: 'Excel',
    descripcion: 'Hoja de cálculo con encabezados formateados, lista para análisis.',
    endpoint: '/reportes/productos/excel',
    icono: '📊',
    color: '#059669',
    colorBg: '#d1fae5',
    shadow: 'rgba(5,150,105,0.25)',
  },
  {
    formato: 'PDF',
    descripcion: 'Documento listo para imprimir o compartir con el equipo.',
    endpoint: '/reportes/productos/pdf',
    icono: '📕',
    color: '#dc2626',
    colorBg: '#fee2e2',
    shadow: 'rgba(220,38,38,0.25)',
  },
];

export default function Reportes() {
  const token = useAuthStore((state) => state.token);

  return (
    <div style={{ width: '100%' }}>
      {/* Header */}
      <div className="page-header" style={{ width: '100%' }}>
        <div>
          <h1>Reportes</h1>
          <p>Exporta el inventario actual en el formato que necesites.</p>
        </div>
      </div>

      {/* Grid de reportes */}
      <div className="grid-3" style={{ width: '100%' }}>
        {reportes.map((r) => (
          <div key={r.formato} className="stat-card" style={{
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{
              position: 'absolute', top: 0, left: 0, width: '4px', height: '100%',
              background: `linear-gradient(180deg, ${r.color}, ${r.color}dd)`
            }} />
            <div className="stat-icon" style={{
              background: r.colorBg,
              boxShadow: `0 4px 12px ${r.shadow}`
            }}>{r.icono}</div>
            <h2 className="text-strong" style={{ fontSize: '17px', fontWeight: '700', marginBottom: '8px' }}>
              Reporte de productos ({r.formato})
            </h2>
            <p className="text-soft" style={{ fontSize: '14px', marginBottom: '20px', lineHeight: '1.5', flex: 1 }}>
              {r.descripcion}
            </p>
            <a
              href={`${API_URL}${r.endpoint}?token=${token}`}
              className="btn"
              style={{
                textDecoration: 'none',
                width: '100%',
                justifyContent: 'center',
                color: 'white',
                background: `linear-gradient(135deg, ${r.color}, ${r.color}cc)`,
                boxShadow: `0 4px 12px ${r.shadow}`
              }}
            >
              <span>⬇️</span>
              <span>Descargar {r.formato}</span>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}