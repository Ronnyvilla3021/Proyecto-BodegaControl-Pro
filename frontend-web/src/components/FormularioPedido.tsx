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
      queryClient.invalidateQueries({ queryKey: ['productos'] }); // el stock también cambia
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
    if (items.length === 1) return; // siempre debe quedar al menos 1
    setItems(items.filter((_, i) => i !== index));
  };

  // Calcula el total en vivo, según los precios reales de los productos cargados
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
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-bold text-slate-800 mb-4">Nuevo pedido</h2>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm rounded-lg px-3 py-2 mb-4">{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          <label className="block text-sm font-medium text-slate-700 mb-1">Cliente</label>
          <select
            value={clienteId}
            onChange={(e) => setClienteId(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 mb-4"
          >
            <option value="">Selecciona un cliente</option>
            {clientes?.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </select>

          <label className="block text-sm font-medium text-slate-700 mb-2">Productos</label>
          <div className="space-y-2 mb-2">
            {items.map((item, index) => (
              <div key={index} className="flex gap-2">
                <select
                  value={item.productoId}
                  onChange={(e) => actualizarItem(index, 'productoId', Number(e.target.value))}
                  className="flex-1 border rounded-lg px-3 py-2 text-sm"
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
                  className="w-20 border rounded-lg px-3 py-2 text-sm"
                />
                <button
                  type="button"
                  onClick={() => quitarItem(index)}
                  className="text-red-500 px-2 hover:bg-red-50 rounded-lg"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={agregarItem}
            className="text-blue-600 text-sm font-medium hover:underline mb-4"
          >
            + Agregar producto
          </button>

          <div className="bg-slate-50 rounded-lg px-4 py-3 mb-4 flex justify-between items-center">
            <span className="text-sm text-slate-600">Total estimado</span>
            <span className="text-lg font-bold text-slate-800">${totalEstimado.toFixed(2)}</span>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onCerrar}
              className="flex-1 bg-slate-100 text-slate-700 rounded-lg py-2 font-medium hover:bg-slate-200 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={mutacion.isPending}
              className="flex-1 bg-blue-600 text-white rounded-lg py-2 font-medium hover:bg-blue-700 transition disabled:opacity-50"
            >
              {mutacion.isPending ? 'Creando...' : 'Crear pedido'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}