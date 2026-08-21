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
  const token = useAuthStore((state: { token: string | null }) => state.token);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-slate-800 mb-1">Reportes</h1>
      <p className="text-slate-500 mb-6">Exporta el inventario actual en el formato que necesites.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {reportes.map((r) => (
          <div key={r.formato} className="bg-white rounded-xl shadow-sm p-6">
            <span className="text-3xl">{r.icono}</span>
            <h2 className="font-semibold text-slate-800 mt-3">Reporte de productos ({r.formato})</h2>
            <p className="text-sm text-slate-500 mt-1 mb-4">{r.descripcion}</p>
            <a
              href={`${API_URL}${r.endpoint}?token=${token}`}
              className="inline-block bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Descargar {r.formato}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}