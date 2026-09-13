import { NavLink } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import ThemeToggle from './ThemeToggle';
import logo from '/logo.png';

interface SidebarProps {
  abierto: boolean;
  onCerrar: () => void;
}

const secciones = [
  {
    titulo: 'PRINCIPAL',
    enlaces: [
      { to: '/dashboard', label: 'Dashboard', icon: '📊', roles: ['ADMINISTRADOR', 'BODEGUERO', 'REPARTIDOR', 'SUPERVISOR'] },
    ],
  },
  {
    titulo: 'GESTIÓN',
    enlaces: [
      { to: '/inventario', label: 'Inventario', icon: '📦', roles: ['ADMINISTRADOR', 'BODEGUERO', 'SUPERVISOR'] },
      { to: '/pedidos', label: 'Pedidos', icon: '🛒', roles: ['ADMINISTRADOR', 'BODEGUERO', 'SUPERVISOR'] },
      { to: '/clientes', label: 'Clientes', icon: '👥', roles: ['ADMINISTRADOR', 'BODEGUERO', 'SUPERVISOR'] },
      { to: '/mis-entregas', label: 'Mis Entregas', icon: '🚚', roles: ['REPARTIDOR'] },
    ],
  },
  {
    titulo: 'ADMINISTRACIÓN',
    enlaces: [
      { to: '/usuarios', label: 'Usuarios', icon: '👤', roles: ['ADMINISTRADOR'] },
      { to: '/reportes', label: 'Reportes', icon: '📄', roles: ['ADMINISTRADOR', 'SUPERVISOR'] },
    ],
  },
];

export default function Sidebar({ abierto, onCerrar }: SidebarProps) {
  const { usuario, logout } = useAuthStore();

  const seccionesVisibles = secciones
    .map((s) => ({
      ...s,
      enlaces: s.enlaces.filter((e) => usuario && e.roles.includes(usuario.rol)),
    }))
    .filter((s) => s.enlaces.length > 0);

  const handleLogout = () => {
    onCerrar();
    logout();
  };

  return (
    <aside className={`sidebar ${abierto ? 'open' : ''}`}>
      {/* Logo + Toggle */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <img
            src={logo}
            alt="Bodega Control Pro"
            style={{ width: '28px', height: '28px', objectFit: 'contain' }}
          />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '15px', fontWeight: '700', letterSpacing: '-0.02em' }}>
            BodegaPro
          </div>
          <div style={{ fontSize: '11px', opacity: 0.8, fontWeight: 500 }}>
            Control de Inventario
          </div>
        </div>
        <ThemeToggle />
      </div>

      {/* Secciones de navegación */}
      {seccionesVisibles.map((seccion) => (
        <div key={seccion.titulo} className="sidebar-section">
          <div className="sidebar-section-title">{seccion.titulo}</div>
          {seccion.enlaces.map((enlace) => (
            <NavLink
              key={enlace.to}
              to={enlace.to}
              onClick={onCerrar}
              className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
            >
              <span className="sidebar-item-icon">{enlace.icon}</span>
              <span>{enlace.label}</span>
            </NavLink>
          ))}
        </div>
      ))}

      {/* Footer */}
      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="sidebar-user-avatar">
            {(usuario?.nombre || 'U').charAt(0).toUpperCase()}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              className="sidebar-user-name"
              style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
            >
              {usuario?.nombre}
            </div>
            <div className="sidebar-user-role">{usuario?.rol}</div>
          </div>
        </div>
        <button className="sidebar-logout" onClick={handleLogout}>
          <span>🔒</span>
          <span>Cerrar sesión</span>
        </button>
      </div>
    </aside>
  );
}