import { useAuthStore } from '../store/authStore';

const API_URL = import.meta.env.VITE_API_URL;

const reportes = [
  {
    formato: 'CSV',
    descripcion: 'Formato de texto plano, ideal para importar en otras herramientas.',
    endpoint: '/reportes/productos/csv',
    icono: '📄',
  },
  {
    formato: 'Excel',
    descripcion: 'Hoja de cálculo con encabezados formateados, lista para análisis.',
    endpoint: '/reportes/productos/excel',
    icono: '📊',
  },
  {
    formato: 'PDF',
    descripcion: 'Documento listo para imprimir o compartir con el equipo.',
    endpoint: '/reportes/productos/pdf',
    icono: '📕',
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
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(3, 1fr)', 
        gap: '20px',
        width: '100%'
      }}>
        {reportes.map((r) => (
          <div key={r.formato} className="stat-card">
            <div className="stat-icon" style={{ background: '#dbeafe' }}>{r.icono}</div>
            <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#0f172a', marginBottom: '8px' }}>
              Reporte de productos ({r.formato})
            </h2>
            <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '20px', lineHeight: '1.5' }}>
              {r.descripcion}
            </p>
            <a
              href={`${API_URL}${r.endpoint}?token=${token}`}
              className="btn btn-primary"
              style={{ textDecoration: 'none', width: '100%', justifyContent: 'center' }}
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