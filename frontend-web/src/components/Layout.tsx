import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const menuItems = [
  {
    section: 'PRINCIPAL',
    items: [
      { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    ]
  },
  {
    section: 'GESTIÓN',
    items: [
      { path: '/inventario', label: 'Inventario', icon: '📦' },
      { path: '/pedidos', label: 'Pedidos', icon: '🛒' },
      { path: '/clientes', label: 'Clientes', icon: '👥' },
    ]
  },
  {
    section: 'ADMINISTRACIÓN',
    items: [
      { path: '/usuarios', label: 'Usuarios', icon: '👤' },
      { path: '/reportes', label: 'Reportes', icon: '📄' },
    ]
  }
];

export default function Layout() {
  const navigate = useNavigate();
  const { usuario, logout } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f1f5f9', width: '100%' }}>
      {/* Sidebar */}
      <aside className="sidebar">
        {/* Logo */}
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">🏭</div>
          <div>
            <div style={{ fontSize: '16px', fontWeight: '700', letterSpacing: '-0.02em' }}>BodegaPro</div>
            <div style={{ fontSize: '11px', opacity: '0.8' }}>Control de Inventario</div>
          </div>
        </div>

        {/* Navegación */}
        {menuItems.map((section) => (
          <div key={section.section} className="sidebar-section">
            <div className="sidebar-section-title">{section.section}</div>
            {section.items.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `sidebar-item ${isActive ? 'active' : ''}`
                }
              >
                <span className="sidebar-item-icon">{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>
        ))}

        {/* Footer con usuario */}
        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-user-avatar">
              {(usuario?.nombre || 'U').charAt(0).toUpperCase()}
            </div>
            <div style={{ flex: 1 }}>
              <div className="sidebar-user-name">{usuario?.nombre}</div>
              <div className="sidebar-user-role">{usuario?.rol}</div>
            </div>
          </div>
          <button className="sidebar-logout" onClick={handleLogout}>
            <span>🔒</span>
            <span>Cerrar sesión</span>
          </button>
        </div>
      </aside>

      {/* Contenido principal - AHORA OCUPA TODO EL ANCHO RESTANTE */}
      <main style={{ 
        flex: 1, 
        marginLeft: '280px', 
        padding: '32px', 
        minHeight: '100vh',
        width: 'calc(100% - 280px)',
        boxSizing: 'border-box',
        maxWidth: 'none'
      }}>
        <Outlet />
      </main>
    </div>
  );
}