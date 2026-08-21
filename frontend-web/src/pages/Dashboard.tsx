import { useAuthStore } from '../store/authStore';
import { useDashboardStream } from '../hooks/useDashboardStream';

export default function Dashboard() {
  const { usuario } = useAuthStore();
  const { datos, conectado } = useDashboardStream();

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-1">
        <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span
            className={`w-2 h-2 rounded-full ${conectado ? 'bg-green-500 animate-pulse' : 'bg-red-400'}`}
          />
          {conectado ? 'En vivo' : 'Conectando...'}
        </div>
      </div>
      <p className="text-slate-500 mb-6">Bienvenido de nuevo, {usuario?.nombre}.</p>

      {!datos ? (
        <p className="text-slate-400">Cargando datos en tiempo real...</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-xl shadow-sm p-5">
              <p className="text-sm text-slate-500">Pedidos hoy</p>
              <p className="text-3xl font-bold text-slate-800 mt-1">{datos.pedidosHoy}</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-5">
              <p className="text-sm text-slate-500">Entregas hoy</p>
              <p className="text-3xl font-bold text-slate-800 mt-1">{datos.entregasHoy}</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-5">
              <p className="text-sm text-slate-500">Productos con stock bajo</p>
              <p className="text-3xl font-bold text-red-600 mt-1">{datos.stockBajo.length}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl shadow-sm p-5">
              <h2 className="font-semibold text-slate-700 mb-3">⚠️ Stock bajo</h2>
              {datos.stockBajo.length === 0 ? (
                <p className="text-sm text-slate-400">Todo el inventario está en buen nivel.</p>
              ) : (
                <ul className="space-y-2">
                  {datos.stockBajo.map((p) => (
                    <li key={p.id} className="flex justify-between text-sm">
                      <span className="text-slate-700">{p.nombre}</span>
                      <span className="font-medium text-red-600">{p.stock} u.</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="bg-white rounded-xl shadow-sm p-5">
              <h2 className="font-semibold text-slate-700 mb-3">🔥 Más vendidos</h2>
              {datos.productosVendidos.length === 0 ? (
                <p className="text-sm text-slate-400">Aún no hay ventas registradas.</p>
              ) : (
                <ul className="space-y-2">
                  {datos.productosVendidos.map((v, i) => (
                    <li key={i} className="flex justify-between text-sm">
                      <span className="text-slate-700">{v.producto?.nombre ?? 'Producto eliminado'}</span>
                      <span className="font-medium text-slate-800">{v.cantidadVendida} u.</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <p className="text-xs text-slate-400 mt-4">
            Última actualización: {new Date(datos.timestamp).toLocaleTimeString()}
          </p>
        </>
      )}
    </div>
  );
}