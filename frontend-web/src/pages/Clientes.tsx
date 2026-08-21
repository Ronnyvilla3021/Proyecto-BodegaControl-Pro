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

  if (isLoading) return <div className="p-8">Cargando clientes...</div>;

  const guardando = mutacionCrear.isPending || mutacionActualizar.isPending;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Clientes</h1>
        <button
          onClick={() => (mostrarForm ? cerrarFormulario() : abrirFormulario())}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
        >
          {mostrarForm ? 'Cancelar' : '+ Nuevo Cliente'}
        </button>
      </div>

      {mostrarForm && (
        <form
          key={clienteEditando?.id ?? 'nuevo'}
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-sm p-6 mb-6 grid grid-cols-2 gap-4"
        >
          <h2 className="col-span-2 font-semibold text-slate-700">
            {clienteEditando ? `Editando: ${clienteEditando.nombre}` : 'Nuevo cliente'}
          </h2>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nombre</label>
            <input
              name="nombre"
              defaultValue={clienteEditando?.nombre}
              required
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Teléfono</label>
            <input
              name="telefono"
              defaultValue={clienteEditando?.telefono ?? ''}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Correo</label>
            <input
              name="email"
              type="email"
              defaultValue={clienteEditando?.email ?? ''}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Dirección</label>
            <input
              name="direccion"
              defaultValue={clienteEditando?.direccion ?? ''}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>

          <button
            type="submit"
            disabled={guardando}
            className="col-span-2 bg-blue-600 text-white rounded-lg py-2 font-medium hover:bg-blue-700 transition disabled:opacity-50"
          >
            {guardando ? 'Guardando...' : clienteEditando ? 'Guardar cambios' : 'Crear cliente'}
          </button>
        </form>
      )}

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-600 text-left">
            <tr>
              <th className="px-4 py-3">Nombre</th>
              <th className="px-4 py-3">Teléfono</th>
              <th className="px-4 py-3">Correo</th>
              <th className="px-4 py-3">Dirección</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {clientes?.map((c) => (
              <tr key={c.id} className="border-t border-slate-100">
                <td className="px-4 py-3 font-medium text-slate-800">{c.nombre}</td>
                <td className="px-4 py-3 text-slate-600">{c.telefono || '—'}</td>
                <td className="px-4 py-3 text-slate-600">{c.email || '—'}</td>
                <td className="px-4 py-3 text-slate-600">{c.direccion || '—'}</td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => abrirFormulario(c)}
                    className="text-blue-600 text-xs font-medium hover:underline"
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