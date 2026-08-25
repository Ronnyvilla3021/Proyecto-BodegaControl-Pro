import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { listarClientes, crearCliente, actualizarCliente } from '../api/clientes';
import type { Cliente } from '../types/pedido';

export default function Clientes() {
  const [mostrarForm, setMostrarForm] = useState(false);
  const [clienteEditando, setClienteEditando] = useState<Cliente | null>(null);
  const queryClient = useQueryClient();

  const { data: clientes, isLoading } = useQuery({
    queryKey: ['clientes'],
    queryFn: listarClientes,
  });

  const mutacionCrear = useMutation({
    mutationFn: crearCliente,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientes'] });
      setMostrarForm(false);
    },
  });

  const mutacionActualizar = useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: any }) => actualizarCliente(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientes'] });
      setClienteEditando(null);
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);

    const dto = {
      nombre: form.get('nombre') as string,
      telefono: (form.get('telefono') as string) || undefined,
      direccion: (form.get('direccion') as string) || undefined,
      email: (form.get('email') as string) || undefined,
    };

    if (clienteEditando) {
      mutacionActualizar.mutate({ id: clienteEditando.id, dto });
    } else {
      mutacionCrear.mutate(dto);
    }
  };

  const abrirFormulario = (cliente?: Cliente) => {
    setClienteEditando(cliente ?? null);
    setMostrarForm(true);
  };

  const cerrarFormulario = () => {
    setMostrarForm(false);
    setClienteEditando(null);
  };

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px', color: '#94a3b8' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
        <p>Cargando clientes...</p>
      </div>
    );
  }

  const guardando = mutacionCrear.isPending || mutacionActualizar.isPending;

  return (
    <div style={{ width: '100%' }}>
      {/* Header */}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', width: '100%' }}>
        <div>
          <h1>Clientes</h1>
          <p>Gestiona tu cartera de clientes</p>
        </div>
        <button
          onClick={() => (mostrarForm ? cerrarFormulario() : abrirFormulario())}
          className="btn btn-primary"
        >
          <span style={{ fontSize: '18px', lineHeight: '1' }}>+</span>
          <span>{mostrarForm ? 'Cancelar' : 'Nuevo Cliente'}</span>
        </button>
      </div>

      {/* Formulario */}
      {mostrarForm && (
        <div className="card" style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#0f172a', marginBottom: '24px' }}>
            {clienteEditando ? `Editando: ${clienteEditando.nombre}` : 'Nuevo Cliente'}
          </h2>
          <form
            key={clienteEditando?.id ?? 'nuevo'}
            onSubmit={handleSubmit}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}
          >
            <div>
              <label className="form-label">Nombre</label>
              <input
                name="nombre"
                defaultValue={clienteEditando?.nombre}
                required
                className="form-input"
                placeholder="Nombre completo"
              />
            </div>
            <div>
              <label className="form-label">Teléfono</label>
              <input
                name="telefono"
                defaultValue={clienteEditando?.telefono ?? ''}
                className="form-input"
                placeholder="+56 9 1234 5678"
              />
            </div>
            <div>
              <label className="form-label">Correo</label>
              <input
                name="email"
                type="email"
                defaultValue={clienteEditando?.email ?? ''}
                className="form-input"
                placeholder="cliente@ejemplo.com"
              />
            </div>
            <div>
              <label className="form-label">Dirección</label>
              <input
                name="direccion"
                defaultValue={clienteEditando?.direccion ?? ''}
                className="form-input"
                placeholder="Calle, número, comuna"
              />
            </div>

            <button
              type="submit"
              disabled={guardando}
              className="btn btn-primary"
              style={{ gridColumn: 'span 2', justifyContent: 'center' }}
            >
              {guardando ? 'Guardando...' : clienteEditando ? 'Guardar cambios' : 'Crear cliente'}
            </button>
          </form>
        </div>
      )}

      {/* Tabla de clientes */}
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Teléfono</th>
              <th>Correo</th>
              <th>Dirección</th>
              <th style={{ textAlign: 'right' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clientes?.map((c) => (
              <tr key={c.id}>
                <td style={{ fontWeight: '500' }}>{c.nombre}</td>
                <td>{c.telefono || '—'}</td>
                <td>{c.email || '—'}</td>
                <td>{c.direccion || '—'}</td>
                <td style={{ textAlign: 'right' }}>
                  <button
                    onClick={() => abrirFormulario(c)}
                    className="btn btn-secondary"
                    style={{ padding: '6px 12px', fontSize: '12px' }}
                  >
                    Editar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}