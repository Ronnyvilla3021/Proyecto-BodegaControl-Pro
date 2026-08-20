import { NavLink } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const enlaces = [
  { to: '/dashboard', label: 'Dashboard', roles: ['ADMINISTRADOR', 'BODEGUERO', 'REPARTIDOR', 'SUPERVISOR'] },
  { to: '/inventario', label: 'Inventario', roles: ['ADMINISTRADOR', 'BODEGUERO', 'SUPERVISOR'] },
  { to: '/pedidos', label: 'Pedidos', roles: ['ADMINISTRADOR', 'BODEGUERO', 'SUPERVISOR'] },
  { to: '/clientes', label: 'Clientes', roles: ['ADMINISTRADOR', 'BODEGUERO', 'SUPERVISOR'] },
  { to: '/mis-entregas', label: 'Mis Entregas', roles: ['REPARTIDOR'] },
  { to: '/reportes', label: 'Reportes', roles: ['ADMINISTRADOR', 'SUPERVISOR'] },
  { to: '/usuarios', label: 'Usuarios', roles: ['ADMINISTRADOR'] },
];

export default function Sidebar() {
  const { usuario, logout } = useAuthStore();

  const enlacesVisibles = enlaces.filter((enlace) =>
    usuario ? enlace.roles.includes(usuario.rol) : false,
  );

  return (
    <aside className="w-64 bg-slate-900 text-slate-100 min-h-screen flex flex-col">
      <div className="p-5 border-b border-slate-700">
        <h1 className="text-lg font-bold">Bodega Control Pro</h1>
        <p className="text-xs text-slate-400 mt-1">{usuario?.nombre}</p>
        <span className="inline-block mt-1 text-[10px] uppercase tracking-wide bg-blue-600 px-2 py-0.5 rounded">
          {usuario?.rol}
        </span>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {enlacesVisibles.map((enlace) => (
          <NavLink
            key={enlace.to}
            to={enlace.to}
            className={({ isActive }) =>
              `block px-3 py-2 rounded-lg text-sm font-medium transition ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`
            }
          >
            {enlace.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-3 border-t border-slate-700">
        <button
          onClick={logout}
          className="w-full text-left px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-slate-800 transition"
        >
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}