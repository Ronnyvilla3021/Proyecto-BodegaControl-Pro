import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { listarClientes } from '../api/clientes';
import { listarProductos } from '../api/productos';
import { crearPedido } from '../api/pedidos';
import type { ItemPedido } from '../types/pedido';

interface Props {
  onCerrar: () => void;
}

export default function FormularioPedido({ onCerrar }: Props) {
  const [clienteId, setClienteId] = useState('');
  const [items, setItems] = useState<ItemPedido[]>([{ productoId: 0, cantidad: 1 }]);
  const [error, setError] = useState('');
  const queryClient = useQueryClient();

  const { data: clientes } = useQuery({ queryKey: ['clientes'], queryFn: listarClientes });
  const { data: productos } = useQuery({ queryKey: ['productos'], queryFn: listarProductos });

  const mutacion = useMutation({
    mutationFn: crearPedido,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pedidos'] });
      queryClient.invalidateQueries({ queryKey: ['productos'] });
      onCerrar();
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || 'Error al crear el pedido');
    },
  });

  const actualizarItem = (index: number, campo: keyof ItemPedido, valor: number) => {
    const nuevos = [...items];
    nuevos[index] = { ...nuevos[index], [campo]: valor };
    setItems(nuevos);
  };

  const agregarItem = () => setItems([...items, { productoId: 0, cantidad: 1 }]);

  const quitarItem = (index: number) => {
    if (items.length === 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  const totalEstimado = items.reduce((acc, item) => {
    const producto = productos?.find((p) => p.id === item.productoId);
    if (!producto) return acc;
    return acc + Number(producto.precio) * item.cantidad;
  }, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!clienteId) {
      setError('Selecciona un cliente');
      return;
    }

    const itemsValidos = items.filter((i) => i.productoId > 0 && i.cantidad > 0);
    if (itemsValidos.length === 0) {
      setError('Agrega al menos un producto válido');
      return;
    }

    mutacion.mutate({ clienteId: Number(clienteId), items: itemsValidos });
  };

  return (
    <div className="modal-overlay" onClick={onCerrar}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header del modal */}
        <div className="divider-bottom" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
          paddingBottom: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '44px', height: '44px', borderRadius: '12px',
              background: 'linear-gradient(135deg, #2563eb, #1e40af)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '20px',
              boxShadow: '0 4px 12px rgba(37,99,235,0.3)',
              flexShrink: 0
            }}>
              📋
            </div>
            <div>
              <h2 className="text-strong" style={{ fontSize: '19px', fontWeight: '700', margin: 0 }}>
                Nuevo Pedido
              </h2>
              <p className="text-muted" style={{ fontSize: '13px', margin: '2px 0 0', fontWeight: '500' }}>
                Completa los datos del pedido
              </p>
            </div>
          </div>
          <button
            onClick={onCerrar}
            className="btn btn-secondary"
            style={{
              width: '36px', height: '36px', padding: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '14px', fontWeight: '700', flexShrink: 0
            }}
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="surface-danger" style={{
            borderRadius: '12px',
            padding: '14px 16px',
            fontSize: '14px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontWeight: '500',
            color: '#991b1b'
          }}>
            <span style={{
              width: '20px', height: '20px', borderRadius: '50%',
              background: '#dc2626', color: 'white',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '12px', fontWeight: '700', flexShrink: 0
            }}>!</span>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label className="form-label">Cliente</label>
            <select
              value={clienteId}
              onChange={(e) => setClienteId(e.target.value)}
              className="form-input"
            >
              <option value="">Selecciona un cliente</option>
              {clientes?.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre}
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label className="form-label">Productos</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {items.map((item, index) => (
                <div key={index} className="surface-soft" style={{
                  display: 'flex',
                  gap: '10px',
                  alignItems: 'center',
                  padding: '10px',
                  borderRadius: '12px'
                }}>
                  <select
                    value={item.productoId}
                    onChange={(e) => actualizarItem(index, 'productoId', Number(e.target.value))}
                    className="form-input"
                    style={{ flex: 1 }}
                  >
                    <option value={0}>Selecciona un producto</option>
                    {productos?.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.nombre} (stock: {p.stock})
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    min="1"
                    value={item.cantidad}
                    onChange={(e) => actualizarItem(index, 'cantidad', Number(e.target.value))}
                    className="form-input"
                    style={{ width: '80px', textAlign: 'center', fontWeight: '600' }}
                  />
                  <button
                    type="button"
                    onClick={() => quitarItem(index)}
                    className="btn-chip btn-chip-danger"
                    style={{
                      width: '40px', height: '40px', padding: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '14px', flexShrink: 0
                    }}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={agregarItem}
              className="btn btn-secondary"
              style={{
                marginTop: '12px',
                width: '100%',
                justifyContent: 'center',
                borderStyle: 'dashed',
                color: '#2563eb',
                fontWeight: '700'
              }}
            >
              + Agregar producto
            </button>
          </div>

          <div className="summary-box" style={{
            padding: '18px 22px',
            marginBottom: '24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <span className="summary-label" style={{
                fontSize: '12px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                display: 'block',
                marginBottom: '2px'
              }}>
                Total estimado
              </span>
              <span className="text-soft" style={{ fontSize: '12px', fontWeight: '500' }}>
                {items.filter(i => i.productoId > 0).length} producto{items.filter(i => i.productoId > 0).length !== 1 ? 's' : ''}
              </span>
            </div>
            <span className="summary-value" style={{ fontSize: '26px', letterSpacing: '-0.02em' }}>
              ${totalEstimado.toFixed(2)}
            </span>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              type="button"
              onClick={onCerrar}
              className="btn btn-secondary"
              style={{ flex: 1, justifyContent: 'center' }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={mutacion.isPending}
              className="btn btn-primary"
              style={{ flex: 1, justifyContent: 'center' }}
            >
              {mutacion.isPending ? 'Creando...' : 'Crear pedido'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}