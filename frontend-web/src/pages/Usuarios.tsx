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
      <div className="text-muted" style={{ textAlign: 'center', padding: '60px' }}>
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
        <div className="stat-card" style={{ position: 'relative', overflow: 'hidden' }}>
          <div style={{
            position: 'absolute', top: 0, left: 0, width: '4px', height: '100%',
            background: 'linear-gradient(180deg, #2563eb, #1e40af)'
          }} />
          <div className="stat-icon" style={{ background: '#dbeafe' }}>👥</div>
          <div className="stat-label">Total usuarios</div>
          <div className="stat-value" style={{ color: '#2563eb' }}>{total}</div>
        </div>
        <div className="stat-card" style={{ position: 'relative', overflow: 'hidden' }}>
          <div style={{
            position: 'absolute', top: 0, left: 0, width: '4px', height: '100%',
            background: 'linear-gradient(180deg, #10b981, #059669)'
          }} />
          <div className="stat-icon" style={{ background: '#d1fae5' }}>✅</div>
          <div className="stat-label">Activos ahora</div>
          <div className="stat-value" style={{ color: '#10b981' }}>{activos}</div>
        </div>
        <div className="stat-card" style={{ position: 'relative', overflow: 'hidden' }}>
          <div style={{
            position: 'absolute', top: 0, left: 0, width: '4px', height: '100%',
            background: 'linear-gradient(180deg, #f59e0b, #d97706)'
          }} />
          <div className="stat-icon" style={{ background: '#fef3c7' }}>🚚</div>
          <div className="stat-label">Repartidores</div>
          <div className="stat-value" style={{ color: '#f59e0b' }}>{repartidores}</div>
        </div>
      </div>

      {/* Formulario */}
      {mostrarForm && (
        <div className="card" style={{ marginBottom: '24px' }}>
          <div className="divider-bottom" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '24px',
            paddingBottom: '16px'
          }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '12px',
              background: 'linear-gradient(135deg, #2563eb, #1e40af)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '18px',
              boxShadow: '0 4px 12px rgba(37,99,235,0.3)'
            }}>
              👤
            </div>
            <div>
              <h2 className="text-strong" style={{ fontSize: '17px', fontWeight: '700', margin: 0 }}>
                {mutacion.isPending ? 'Creando usuario...' : 'Nuevo Usuario'}
              </h2>
              <p className="text-muted" style={{ fontSize: '13px', margin: '2px 0 0' }}>
                Añade un nuevo miembro al equipo
              </p>
            </div>
          </div>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
            {error && (
              <div className="surface-danger" style={{
                gridColumn: 'span 2',
                borderRadius: '12px',
                padding: '14px 16px',
                fontSize: '14px',
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
          <div key={u.id} className="card-with-strip" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', minWidth: 0 }}>
              <div className="avatar" style={{
                background: u.activo
                  ? 'linear-gradient(135deg, #2563eb, #1e40af)'
                  : 'linear-gradient(135deg, #94a3b8, #64748b)',
                boxShadow: u.activo
                  ? '0 4px 12px rgba(37,99,235,0.25)'
                  : '0 4px 12px rgba(100,116,139,0.2)'
              }}>
                {u.nombre.charAt(0).toUpperCase()}
              </div>
              <div style={{ minWidth: 0 }}>
                <div className="text-strong" style={{ fontWeight: '700', fontSize: '15px' }}>{u.nombre}</div>
                <div className="text-soft" style={{ fontSize: '13px', fontWeight: '500' }}>{u.email}</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
              <span className={`badge badge-${colorRol[u.rol]}`}>{u.rol}</span>
              <span className={`badge badge-${u.activo ? 'green' : 'slate'}`}>
                {u.activo ? 'Activo' : 'Inactivo'}
              </span>

              {u.id === usuarioActual?.id ? (
                <span className="chip" style={{ width: '100px', textAlign: 'center' }}>
                  Tu cuenta
                </span>
              ) : (
                <button
                  onClick={() => mutacionEstado.mutate({ id: u.id, activo: !u.activo })}
                  disabled={mutacionEstado.isPending}
                  className={`btn-chip ${u.activo ? 'btn-chip-danger' : 'btn-chip-success'}`}
                  style={{ width: '100px', textAlign: 'center' }}
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