import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { CrearUsuarioDto, Rol } from '../types/usuario';
import { listarUsuarios, crearUsuario, cambiarEstadoUsuario } from '../api/usuarios';
import { useAuthStore } from '../store/authStore';

const roles: Rol[] = ['ADMINISTRADOR', 'BODEGUERO', 'REPARTIDOR', 'SUPERVISOR'];

const colorRol: Record<Rol, string> = {
  ADMINISTRADOR: 'bg-purple-100 text-purple-700',
  BODEGUERO: 'bg-blue-100 text-blue-700',
  REPARTIDOR: 'bg-amber-100 text-amber-700',
  SUPERVISOR: 'bg-teal-100 text-teal-700',
};

export default function Usuarios() {
  const [mostrarForm, setMostrarForm] = useState(false);
  const [error, setError] = useState('');
  const queryClient = useQueryClient();

  const { data: usuarios, isLoading } = useQuery({
    queryKey: ['usuarios'],
    queryFn: listarUsuarios,
  });

  const usuarioActual = useAuthStore((state) => state.usuario);

  const mutacion = useMutation({
    mutationFn: crearUsuario,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
      setMostrarForm(false);
      setError('');
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || 'Error al crear el usuario');
    },
  });

  const mutacionEstado = useMutation({
  mutationFn: ({ id, activo }: { id: number; activo: boolean }) =>
    cambiarEstadoUsuario(id, activo),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['usuarios'] });
  },
});

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    const form = new FormData(e.currentTarget);

    const dto: CrearUsuarioDto = {
      nombre: form.get('nombre') as string,
      email: form.get('email') as string,
      password: form.get('password') as string,
      rol: form.get('rol') as Rol,
    };

    mutacion.mutate(dto);
  };

  if (isLoading) return <div className="p-8">Cargando usuarios...</div>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Usuarios</h1>
        <button
          onClick={() => setMostrarForm(!mostrarForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
        >
          {mostrarForm ? 'Cancelar' : '+ Nuevo Usuario'}
        </button>
      </div>

      {mostrarForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-sm p-6 mb-6 grid grid-cols-2 gap-4"
        >
          {error && (
            <div className="col-span-2 bg-red-50 text-red-600 text-sm rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nombre</label>
            <input name="nombre" required className="w-full border rounded-lg px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Correo</label>
            <input
              name="email"
              type="email"
              required
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Contraseña</label>
            <input
              name="password"
              type="password"
              required
              minLength={6}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Rol</label>
            <select name="rol" required className="w-full border rounded-lg px-3 py-2">
              {roles.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={mutacion.isPending}
            className="col-span-2 bg-blue-600 text-white rounded-lg py-2 font-medium hover:bg-blue-700 transition disabled:opacity-50"
          >
            {mutacion.isPending ? 'Creando...' : 'Crear usuario'}
          </button>
        </form>
      )}

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-600 text-left">
  <tr>
    <th className="px-4 py-3">Nombre</th>
    <th className="px-4 py-3">Correo</th>
    <th className="px-4 py-3">Rol</th>
    <th className="px-4 py-3">Estado</th>
    <th className="px-4 py-3"></th>
  </tr>
</thead>
<tbody>
  {usuarios?.map((u) => (
    <tr key={u.id} className="border-t border-slate-100">
      <td className="px-4 py-3 font-medium text-slate-800">{u.nombre}</td>
      <td className="px-4 py-3 text-slate-600">{u.email}</td>
      <td className="px-4 py-3">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorRol[u.rol]}`}>
          {u.rol}
        </span>
      </td>
      <td className="px-4 py-3">
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            u.activo ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'
          }`}
        >
          {u.activo ? 'Activo' : 'Inactivo'}
        </span>
      </td>
      <td className="px-4 py-3 text-right">
  {u.id === usuarioActual?.id ? (
    <span className="text-xs text-slate-400">Tu cuenta</span>
  ) : (
    <button
      onClick={() => mutacionEstado.mutate({ id: u.id, activo: !u.activo })}
      disabled={mutacionEstado.isPending}
      className={`text-xs font-medium hover:underline disabled:opacity-50 ${
        u.activo ? 'text-red-600' : 'text-green-600'
      }`}
    >
      {u.activo ? 'Desactivar' : 'Activar'}
    </button>
  )}
</td>
    </tr>
  ))}
</tbody>
        </table>
      </div>
    </div>
  );
}