import { NavLink } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import ThemeToggle from './ThemeToggle';
import logo from '/logo.png'; // Importar directamente

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
  const enlacesVisibles = enlaces.filter((e) => usuario && e.roles.includes(usuario.rol));

  return (
    <aside className="w-64 min-h-screen flex flex-col bg-linear-to-b from-[#1e3a5f] to-[#15243c] dark:from-[#0b0e17] dark:to-[#0b0e17] text-white">
      <div className="p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img 
            src={logo} 
            alt="Bodega Control Pro" 
            className="w-10 h-10 object-contain" 
          />
          <div>
            <h1 className="text-lg font-bold tracking-tight">Bodega Control Pro</h1>
            <p className="text-xs text-white/50 mt-1">{usuario?.nombre}</p>
            <span className="inline-block mt-2 text-[10px] uppercase tracking-wider bg-white/10 px-2.5 py-1 rounded-full">
              {usuario?.rol}
            </span>
          </div>
        </div>
        <ThemeToggle />
      </div>

      <nav className="flex-1 px-3 space-y-1 mt-4">
        {enlacesVisibles.map((enlace) => (
          <NavLink
            key={enlace.to}
            to={enlace.to}
            className={({ isActive }) =>
              `block px-4 py-2.5 rounded-2xl text-sm font-medium transition ${
                isActive
                  ? 'bg-white/15 text-white shadow-inner'
                  : 'text-white/60 hover:bg-white/10 hover:text-white'
              }`
            }
          >
            {enlace.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-3">
        <button
          onClick={logout}
          className="w-full text-left px-4 py-2.5 rounded-2xl text-sm text-red-300 hover:bg-white/10 transition"
        >
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}