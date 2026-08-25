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
      queryClient.invalidateQueries({ queryKey: ['productos'] });
    },
  });

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px', color: '#94a3b8' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
        <p>Cargando pedidos...</p>
      </div>
    );
  }

  return (
    <div style={{ width: '100%' }}>
      {/* Header */}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', width: '100%' }}>
        <div>
          <h1>Pedidos</h1>
          <p>Gestiona y da seguimiento a los pedidos</p>
        </div>
        <button onClick={() => setMostrarForm(true)} className="btn btn-primary">
          <span style={{ fontSize: '18px', lineHeight: '1' }}>+</span>
          <span>Nuevo Pedido</span>
        </button>
      </div>

      {/* Lista de pedidos */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
        {pedidos?.map((pedido) => {
          const siguiente = siguienteEstado[pedido.estado];

          return (
            <div key={pedido.id} className="card">
              {/* Encabezado del pedido */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                <div>
                  <div style={{ fontWeight: '700', color: '#0f172a', fontSize: '16px' }}>
                    Pedido #{pedido.id} — {pedido.cliente.nombre}
                  </div>
                  <div style={{ fontSize: '13px', color: '#94a3b8', marginTop: '4px' }}>
                    {new Date(pedido.creadoEn).toLocaleString()}
                  </div>
                </div>
                <span className={`badge badge-${colorEstado[pedido.estado]}`}>
                  {etiquetaEstado[pedido.estado]}
                </span>
              </div>

              {/* Detalles del pedido */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
                {pedido.detalles.map((d) => (
                  <div key={d.id} style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    padding: '8px 12px',
                    background: '#f8fafc',
                    borderRadius: '10px',
                    fontSize: '14px'
                  }}>
                    <span style={{ color: '#64748b' }}>{d.cantidad}x {d.producto.nombre}</span>
                    <span style={{ fontWeight: '600', color: '#0f172a' }}>${Number(d.subtotal).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              {/* Pie del pedido */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid #f1f5f9' }}>
                <div>
                  <span style={{ fontSize: '13px', color: '#64748b' }}>Total: </span>
                  <span style={{ fontWeight: '800', color: '#0f172a', fontSize: '18px' }}>
                    ${Number(pedido.total).toFixed(2)}
                  </span>
                </div>
                {siguiente && (
                  <button
                    onClick={() => mutacionEstado.mutate({ id: pedido.id, estado: siguiente })}
                    disabled={mutacionEstado.isPending}
                    className="btn btn-primary"
                    style={{ padding: '8px 16px', fontSize: '13px' }}
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