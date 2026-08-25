import { useAuthStore } from '../store/authStore';
import { useDashboardStream } from '../hooks/useDashboardStream';

export default function Dashboard() {
  const { usuario } = useAuthStore();
  const { datos, conectado } = useDashboardStream();

  return (
    <div style={{ width: '100%' }}>
      {/* Header */}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
        <div>
          <h1>Dashboard</h1>
          <p>Bienvenido de nuevo, {usuario?.nombre}. Aquí tienes el resumen de hoy.</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'white', padding: '8px 16px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: conectado ? '#10b981' : '#ef4444' }} />
          <span style={{ fontSize: '13px', color: '#64748b', fontWeight: '500' }}>
            {conectado ? 'En vivo' : 'Conectando...'}
          </span>
        </div>
      </div>

      {!datos ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#94a3b8' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
          <p style={{ fontSize: '16px' }}>Cargando datos en tiempo real...</p>
        </div>
      ) : (
        <>
          {/* Stats Cards - Grid de 3 columnas que ocupa todo el ancho */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(3, 1fr)', 
            gap: '20px', 
            marginBottom: '32px',
            width: '100%'
          }}>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: '#dbeafe' }}>📦</div>
              <div className="stat-label">Pedidos hoy</div>
              <div className="stat-value" style={{ color: '#1e40af' }}>{datos.pedidosHoy}</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: '#d1fae5' }}>🚚</div>
              <div className="stat-label">Entregas hoy</div>
              <div className="stat-value" style={{ color: '#065f46' }}>{datos.entregasHoy}</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: '#fee2e2' }}>⚠️</div>
              <div className="stat-label">Stock bajo</div>
              <div className="stat-value" style={{ color: '#991b1b' }}>{datos.stockBajo.length}</div>
            </div>
          </div>

          {/* Grid de contenido - 2 columnas que ocupa todo el ancho */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(2, 1fr)', 
            gap: '24px',
            width: '100%'
          }}>
            {/* Stock bajo */}
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                  ⚠️
                </div>
                <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#0f172a', margin: 0 }}>Stock bajo</h2>
              </div>
              
              {datos.stockBajo.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '32px', color: '#94a3b8' }}>
                  <div style={{ fontSize: '32px', marginBottom: '8px' }}>✅</div>
                  <p style={{ fontSize: '14px' }}>Todo el inventario está en buen nivel.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {datos.stockBajo.map((p) => (
                    <div key={p.id} style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center', 
                      padding: '12px 16px', 
                      background: '#fef2f2', 
                      borderRadius: '12px',
                      border: '1px solid #fecaca'
                    }}>
                      <span style={{ fontSize: '14px', color: '#0f172a', fontWeight: '500' }}>{p.nombre}</span>
                      <span style={{ fontSize: '14px', color: '#ef4444', fontWeight: '700' }}>{p.stock} u.</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Más vendidos */}
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                  🔥
                </div>
                <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#0f172a', margin: 0 }}>Más vendidos</h2>
              </div>
              
              {datos.productosVendidos.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '32px', color: '#94a3b8' }}>
                  <div style={{ fontSize: '32px', marginBottom: '8px' }}>📭</div>
                  <p style={{ fontSize: '14px' }}>Aún no hay ventas registradas.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {datos.productosVendidos.map((v, i) => (
                    <div key={i} style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center', 
                      padding: '12px 16px', 
                      background: '#eff6ff', 
                      borderRadius: '12px',
                      border: '1px solid #bfdbfe'
                    }}>
                      <span style={{ fontSize: '14px', color: '#0f172a', fontWeight: '500' }}>
                        {v.producto?.nombre ?? 'Producto eliminado'}
                      </span>
                      <span style={{ fontSize: '14px', color: '#2563eb', fontWeight: '700' }}>{v.cantidadVendida} u.</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '24px', textAlign: 'right' }}>
            Última actualización: {new Date(datos.timestamp).toLocaleTimeString()}
          </p>
        </>
      )}
    </div>
  );
}