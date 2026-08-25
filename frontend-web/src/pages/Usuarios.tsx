import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { CrearUsuarioDto, Rol } from '../types/usuario';
import { listarUsuarios, crearUsuario, cambiarEstadoUsuario } from '../api/usuarios';
import { useAuthStore } from '../store/authStore';

const roles: Rol[] = ['ADMINISTRADOR', 'BODEGUERO', 'REPARTIDOR', 'SUPERVISOR'];

const colorRol: Record<Rol, string> = {
  ADMINISTRADOR: 'purple',
  BODEGUERO: 'blue',
  REPARTIDOR: 'amber',
  SUPERVISOR: 'teal',
};

export default function Usuarios() {
  const [mostrarForm, setMostrarForm] = useState(false);
  const [error, setError] = useState('');
  const queryClient = useQueryClient();
  const usuarioActual = useAuthStore((state) => state.usuario);

  const { data: usuarios, isLoading } = useQuery({ queryKey: ['usuarios'], queryFn: listarUsuarios });

  const mutacion = useMutation({
    mutationFn: crearUsuario,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
      setMostrarForm(false);
      setError('');
    },
    onError: (err: any) => setError(err.response?.data?.message || 'Error al crear el usuario'),
  });

  const mutacionEstado = useMutation({
    mutationFn: ({ id, activo }: { id: number; activo: boolean }) => cambiarEstadoUsuario(id, activo),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['usuarios'] }),
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    const form = new FormData(e.currentTarget);
    mutacion.mutate({
      nombre: form.get('nombre') as string,
      email: form.get('email') as string,
      password: form.get('password') as string,
      rol: form.get('rol') as Rol,
    } as CrearUsuarioDto);
  };

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px', color: '#94a3b8' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
        <p>Cargando usuarios...</p>
      </div>
    );
  }

  const activos = usuarios?.filter((u) => u.activo).length ?? 0;
  const total = usuarios?.length ?? 0;
  const repartidores = usuarios?.filter((u) => u.rol === 'REPARTIDOR').length ?? 0;

  return (
    <div style={{ width: '100%' }}>
      {/* Header */}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', width: '100%' }}>
        <div>
          <h1>Usuarios</h1>
          <p>Gestiona el equipo y sus permisos</p>
        </div>
        <button onClick={() => setMostrarForm(!mostrarForm)} className="btn btn-primary">
          <span style={{ fontSize: '18px', lineHeight: '1' }}>+</span>
          <span>{mostrarForm ? 'Cancelar' : 'Nuevo Usuario'}</span>
        </button>
      </div>

      {/* Stats */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#dbeafe' }}>👥</div>
          <div className="stat-label">Total usuarios</div>
          <div className="stat-value" style={{ color: '#1e40af' }}>{total}</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#d1fae5' }}>✓</div>
          <div className="stat-label">Activos ahora</div>
          <div className="stat-value" style={{ color: '#065f46' }}>{activos}</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#fef3c7' }}>🚚</div>
          <div className="stat-label">Repartidores</div>
          <div className="stat-value" style={{ color: '#92400e' }}>{repartidores}</div>
        </div>
      </div>

      {/* Formulario */}
      {mostrarForm && (
        <div className="card" style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#0f172a', marginBottom: '24px' }}>
            {mutacion.isPending ? 'Creando usuario...' : 'Nuevo Usuario'}
          </h2>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
            {error && (
              <div style={{ 
                gridColumn: 'span 2', 
                background: '#fee2e2', 
                color: '#991b1b', 
                borderRadius: '12px', 
                padding: '12px 16px', 
                fontSize: '14px',
                border: '1px solid #fecaca'
              }}>
                {error}
              </div>
            )}
            <div>
              <label className="form-label">Nombre</label>
              <input name="nombre" type="text" required className="form-input" placeholder="Nombre completo" />
            </div>
            <div>
              <label className="form-label">Correo</label>
              <input name="email" type="email" required className="form-input" placeholder="correo@ejemplo.com" />
            </div>
            <div>
              <label className="form-label">Contraseña</label>
              <input name="password" type="password" required minLength={6} className="form-input" placeholder="Mínimo 6 caracteres" />
            </div>
            <div>
              <label className="form-label">Rol</label>
              <select name="rol" required className="form-input">
                {roles.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
            <button type="submit" disabled={mutacion.isPending} className="btn btn-primary" style={{ gridColumn: 'span 2', justifyContent: 'center' }}>
              {mutacion.isPending ? 'Creando...' : 'Crear usuario'}
            </button>
          </form>
        </div>
      )}

      {/* Lista de usuarios */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
        {usuarios?.map((u) => (
          <div key={u.id} className="card-with-strip" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div className="avatar">
                {u.nombre.charAt(0).toUpperCase()}
              </div>
              <div>
                <div style={{ fontWeight: '600', color: '#0f172a', fontSize: '15px' }}>{u.nombre}</div>
                <div style={{ fontSize: '13px', color: '#64748b' }}>{u.email}</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span className={`badge badge-${colorRol[u.rol]}`}>{u.rol}</span>
              <span className={`badge badge-${u.activo ? 'green' : 'slate'}`}>
                {u.activo ? 'Activo' : 'Inactivo'}
              </span>

              {u.id === usuarioActual?.id ? (
                <span style={{ fontSize: '13px', color: '#94a3b8', width: '80px', textAlign: 'right' }}>
                  Tu cuenta
                </span>
              ) : (
                <button
                  onClick={() => mutacionEstado.mutate({ id: u.id, activo: !u.activo })}
                  disabled={mutacionEstado.isPending}
                  style={{
                    fontSize: '13px',
                    fontWeight: '600',
                    color: u.activo ? '#ef4444' : '#10b981',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    width: '80px',
                    textAlign: 'right',
                    transition: 'all 0.2s'
                  }}
                >
                  {u.activo ? 'Desactivar' : 'Activar'}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}