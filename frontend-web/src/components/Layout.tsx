import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function Layout() {
  const [sidebarAbierto, setSidebarAbierto] = useState(false);
  const location = useLocation();

  // Cierra el sidebar al cambiar de ruta (móvil)
  useEffect(() => {
    setSidebarAbierto(false);
  }, [location.pathname]);

  // Bloquea el scroll del body cuando el sidebar está abierto en móvil
  useEffect(() => {
    if (sidebarAbierto) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [sidebarAbierto]);

  const cerrarSidebar = () => setSidebarAbierto(false);

  return (
    <div className="app-shell">
      {/* Botón hamburguesa (solo móvil) */}
      <button
        className="hamburger-btn"
        onClick={() => setSidebarAbierto(true)}
        aria-label="Abrir menú"
      >
        ☰
      </button>

      {/* Overlay (solo móvil, cuando el sidebar está abierto) */}
      <div
        className={`sidebar-overlay ${sidebarAbierto ? 'visible' : ''}`}
        onClick={cerrarSidebar}
      />

      {/* Sidebar */}
      <Sidebar abierto={sidebarAbierto} onCerrar={cerrarSidebar} />

      {/* Contenido principal */}
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}