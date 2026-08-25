import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { listarProductos, crearProducto } from '../api/productos';
import { listarCategorias } from '../api/categorias';
import type { CrearProductoDto } from '../types/producto';
import ModalMovimiento from '../components/ModalMovimiento';

export default function Inventario() {
  const [mostrarForm, setMostrarForm] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState<number | null>(null);
  const queryClient = useQueryClient();

  const { data: productos, isLoading } = useQuery({
    queryKey: ['productos'],
    queryFn: listarProductos,
  });

  const { data: categorias } = useQuery({
    queryKey: ['categorias'],
    queryFn: listarCategorias,
  });

  const mutacionCrear = useMutation({
    mutationFn: crearProducto,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productos'] });
      setMostrarForm(false);
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);

    const dto: CrearProductoDto = {
      codigo: form.get('codigo') as string,
      nombre: form.get('nombre') as string,
      precio: Number(form.get('precio')),
      stock: Number(form.get('stock')) || 0,
      categoriaId: Number(form.get('categoriaId')),
    };

    mutacionCrear.mutate(dto);
  };

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px', color: '#94a3b8' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
        <p>Cargando inventario...</p>
      </div>
    );
  }

  return (
    <div style={{ width: '100%' }}>
      {/* Header */}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', width: '100%' }}>
        <div>
          <h1>Inventario</h1>
          <p>Gestiona tus productos y stock</p>
        </div>
        <button onClick={() => setMostrarForm(!mostrarForm)} className="btn btn-primary">
          <span style={{ fontSize: '18px', lineHeight: '1' }}>+</span>
          <span>{mostrarForm ? 'Cancelar' : 'Nuevo Producto'}</span>
        </button>
      </div>

      {/* Formulario */}
      {mostrarForm && (
        <div className="card" style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#0f172a', marginBottom: '24px' }}>
            Nuevo Producto
          </h2>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
            <div>
              <label className="form-label">Código</label>
              <input name="codigo" required className="form-input" placeholder="PROD-001" />
            </div>
            <div>
              <label className="form-label">Nombre</label>
              <input name="nombre" required className="form-input" placeholder="Nombre del producto" />
            </div>
            <div>
              <label className="form-label">Precio</label>
              <input name="precio" type="number" step="0.01" required className="form-input" placeholder="0.00" />
            </div>
            <div>
              <label className="form-label">Stock inicial</label>
              <input name="stock" type="number" className="form-input" placeholder="0" />
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Categoría</label>
              <select name="categoriaId" required className="form-input">
                <option value="">Selecciona una categoría</option>
                {categorias?.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.nombre}
                  </option>
                ))}
              </select>
            </div>
            <button type="submit" disabled={mutacionCrear.isPending} className="btn btn-primary" style={{ gridColumn: 'span 2', justifyContent: 'center' }}>
              {mutacionCrear.isPending ? 'Guardando...' : 'Guardar producto'}
            </button>
          </form>
        </div>
      )}

      {/* Tabla de productos */}
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Código</th>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Stock</th>
              <th style={{ textAlign: 'right' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos?.map((p) => (
              <tr key={p.id}>
                <td style={{ fontFamily: 'monospace', fontSize: '13px', color: '#64748b' }}>{p.codigo}</td>
                <td style={{ fontWeight: '500' }}>{p.nombre}</td>
                <td>{p.categoria.nombre}</td>
                <td style={{ fontWeight: '600' }}>${Number(p.precio).toFixed(2)}</td>
                <td>
                  <span className={`badge badge-${p.stock <= 10 ? 'red' : 'green'}`}>
                    {p.stock}
                  </span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <button
                    onClick={() => setProductoSeleccionado(p.id)}
                    className="btn btn-secondary"
                    style={{ padding: '6px 12px', fontSize: '12px' }}
                  >
                    Registrar movimiento
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {productoSeleccionado && (
        <ModalMovimiento
          productoId={productoSeleccionado}
          onCerrar={() => setProductoSeleccionado(null)}
        />
      )}
    </div>
  );
}