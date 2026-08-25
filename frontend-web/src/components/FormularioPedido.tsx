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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#0f172a', margin: 0 }}>Nuevo Pedido</h2>
          <button
            onClick={onCerrar}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: '#f1f5f9',
              border: 'none',
              cursor: 'pointer',
              fontSize: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            ✕
          </button>
        </div>

        {error && (
          <div style={{ 
            background: '#fee2e2', 
            color: '#991b1b', 
            borderRadius: '12px', 
            padding: '12px 16px', 
            fontSize: '14px',
            marginBottom: '20px',
            border: '1px solid #fecaca'
          }}>
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {items.map((item, index) => (
                <div key={index} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
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
                    style={{ width: '80px' }}
                  />
                  <button
                    type="button"
                    onClick={() => quitarItem(index)}
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      background: '#fee2e2',
                      color: '#ef4444',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '16px'
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
              style={{
                marginTop: '12px',
                color: '#2563eb',
                fontSize: '14px',
                fontWeight: '600',
                background: 'none',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              + Agregar producto
            </button>
          </div>

          <div style={{
            background: '#f8fafc',
            borderRadius: '12px',
            padding: '16px 20px',
            marginBottom: '24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span style={{ fontSize: '14px', color: '#64748b', fontWeight: '500' }}>Total estimado</span>
            <span style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a' }}>${totalEstimado.toFixed(2)}</span>
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