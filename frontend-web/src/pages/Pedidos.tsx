import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { listarPedidos, cambiarEstado } from '../api/pedidos';
import { siguienteEstado, colorEstado, etiquetaEstado } from '../utils/estadosPedido';
import FormularioPedido from '../components/FormularioPedido';

export default function Pedidos() {
  const [mostrarForm, setMostrarForm] = useState(false);
  const queryClient = useQueryClient();

  const { data: pedidos, isLoading } = useQuery({
    queryKey: ['pedidos'],
    queryFn: listarPedidos,
  });

  const mutacionEstado = useMutation({
    mutationFn: ({ id, estado }: { id: number; estado: any }) => cambiarEstado(id, estado),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pedidos'] });
      queryClient.invalidateQueries({ queryKey: ['productos'] }); // por si descontó stock
    },
  });

  if (isLoading) return <div className="p-8">Cargando pedidos...</div>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Pedidos</h1>
        <button
          onClick={() => setMostrarForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
        >
          + Nuevo Pedido
        </button>
      </div>

      <div className="space-y-3">
        {pedidos?.map((pedido) => {
          const siguiente = siguienteEstado[pedido.estado];

          return (
            <div key={pedido.id} className="bg-white rounded-xl shadow-sm p-5">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-semibold text-slate-800">
                    Pedido #{pedido.id} — {pedido.cliente.nombre}
                  </p>
                  <p className="text-xs text-slate-400">
                    {new Date(pedido.creadoEn).toLocaleString()}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${colorEstado[pedido.estado]}`}
                >
                  {etiquetaEstado[pedido.estado]}
                </span>
              </div>

              <ul className="text-sm text-slate-600 space-y-1 mb-3">
                {pedido.detalles.map((d) => (
                  <li key={d.id}>
                    {d.cantidad}x {d.producto.nombre} — ${Number(d.subtotal).toFixed(2)}
                  </li>
                ))}
              </ul>

              <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                <span className="font-bold text-slate-800">
                  Total: ${Number(pedido.total).toFixed(2)}
                </span>
                {siguiente && (
                  <button
                    onClick={() => mutacionEstado.mutate({ id: pedido.id, estado: siguiente })}
                    disabled={mutacionEstado.isPending}
                    className="text-sm bg-slate-800 text-white px-3 py-1.5 rounded-lg hover:bg-slate-700 transition disabled:opacity-50"
                  >
                    Avanzar a {etiquetaEstado[siguiente]}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {mostrarForm && <FormularioPedido onCerrar={() => setMostrarForm(false)} />}
    </div>
  );
}