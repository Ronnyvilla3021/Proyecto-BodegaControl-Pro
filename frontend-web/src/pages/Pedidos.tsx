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
      <div className="text-muted" style={{ textAlign: 'center', padding: '60px' }}>
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
            <div key={pedido.id} className="card" style={{
              position: 'relative',
              overflow: 'hidden',
              paddingLeft: '28px'
            }}>
              {/* Barra lateral de estado */}
              <div style={{
                position: 'absolute', top: 0, left: 0, width: '4px', height: '100%',
                background:
                  pedido.estado === 'ENTREGADO' ? 'linear-gradient(180deg, #10b981, #059669)' :
                  pedido.estado === 'EN_RUTA' ? 'linear-gradient(180deg, #3b82f6, #2563eb)' :
                  pedido.estado === 'EMPACADO' ? 'linear-gradient(180deg, #f59e0b, #d97706)' :
                  'linear-gradient(180deg, #94a3b8, #64748b)'
              }} />

              {/* Encabezado del pedido */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                  <div className="surface-soft" style={{
                    width: '40px', height: '40px', borderRadius: '12px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '18px', flexShrink: 0
                  }}>
                    📋
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div className="text-strong" style={{ fontWeight: '700', fontSize: '16px' }}>
                      Pedido #{pedido.id} — {pedido.cliente.nombre}
                    </div>
                    <div className="text-muted" style={{ fontSize: '13px', marginTop: '2px', fontWeight: '500' }}>
                      {new Date(pedido.creadoEn).toLocaleString()}
                    </div>
                  </div>
                </div>
                <span className={`badge badge-${colorEstado[pedido.estado]}`}>
                  {etiquetaEstado[pedido.estado]}
                </span>
              </div>

              {/* Detalles del pedido */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
                {pedido.detalles.map((d) => (
                  <div key={d.id} className="item-box">
                    <span className="text-soft" style={{ fontWeight: '500', display: 'flex', alignItems: 'center' }}>
                      <span className="qty-chip">{d.cantidad}x</span>
                      {d.producto.nombre}
                    </span>
                    <span className="text-strong" style={{ fontWeight: '600' }}>${Number(d.subtotal).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              {/* Pie del pedido */}
              <div className="divider" style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: '16px'
              }}>
                <div>
                  <span className="text-soft" style={{ fontSize: '13px', fontWeight: '500' }}>Total: </span>
                  <span className="text-strong" style={{ fontWeight: '800', fontSize: '18px' }}>
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