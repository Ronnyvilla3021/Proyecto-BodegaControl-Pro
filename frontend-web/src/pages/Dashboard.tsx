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
        <div className="surface-soft" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 16px',
          borderRadius: '12px',
        }}>
          <span style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: conectado ? '#10b981' : '#ef4444',
            boxShadow: conectado ? '0 0 0 4px rgba(16,185,129,0.15)' : '0 0 0 4px rgba(239,68,68,0.15)'
          }} />
          <span className="text-soft" style={{ fontSize: '13px', fontWeight: '600' }}>
            {conectado ? 'En vivo' : 'Conectando...'}
          </span>
        </div>
      </div>

      {!datos ? (
        <div className="text-muted" style={{ textAlign: 'center', padding: '60px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
          <p style={{ fontSize: '16px' }}>Cargando datos en tiempo real...</p>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '20px',
            marginBottom: '28px',
            width: '100%'
          }}>
            <div className="stat-card" style={{ position: 'relative', overflow: 'hidden' }}>
              <div style={{
                position: 'absolute', top: 0, left: 0, width: '4px', height: '100%',
                background: 'linear-gradient(180deg, #2563eb, #1e40af)'
              }} />
              <div className="stat-icon" style={{ background: '#dbeafe' }}>📦</div>
              <div className="stat-label">Pedidos hoy</div>
              <div className="stat-value" style={{ color: '#2563eb' }}>{datos.pedidosHoy}</div>
            </div>
            <div className="stat-card" style={{ position: 'relative', overflow: 'hidden' }}>
              <div style={{
                position: 'absolute', top: 0, left: 0, width: '4px', height: '100%',
                background: 'linear-gradient(180deg, #10b981, #059669)'
              }} />
              <div className="stat-icon" style={{ background: '#d1fae5' }}>🚚</div>
              <div className="stat-label">Entregas hoy</div>
              <div className="stat-value" style={{ color: '#10b981' }}>{datos.entregasHoy}</div>
            </div>
            <div className="stat-card" style={{ position: 'relative', overflow: 'hidden' }}>
              <div style={{
                position: 'absolute', top: 0, left: 0, width: '4px', height: '100%',
                background: 'linear-gradient(180deg, #ef4444, #dc2626)'
              }} />
              <div className="stat-icon" style={{ background: '#fee2e2' }}>⚠️</div>
              <div className="stat-label">Stock bajo</div>
              <div className="stat-value" style={{ color: '#ef4444' }}>{datos.stockBajo.length}</div>
            </div>
          </div>

          {/* Grid de contenido */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '24px',
            width: '100%'
          }}>
            {/* Stock bajo */}
            <div className="card">
              <div className="divider" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '20px',
                paddingBottom: '16px',
                borderTop: 'none',
                borderBottom: '1px solid #f1f5f9'
              }}>
                <div style={{
                  width: '40px', height: '40px', borderRadius: '12px',
                  background: '#fee2e2',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '20px',
                  boxShadow: '0 4px 12px rgba(239,68,68,0.15)',
                  flexShrink: 0
                }}>
                  ⚠️
                </div>
                <div>
                  <h2 className="text-strong" style={{ fontSize: '17px', fontWeight: '700', margin: 0 }}>Stock bajo</h2>
                  <p className="text-muted" style={{ fontSize: '12px', margin: '2px 0 0', fontWeight: '500' }}>
                    {datos.stockBajo.length} producto{datos.stockBajo.length !== 1 ? 's' : ''} en alerta
                  </p>
                </div>
              </div>

              {datos.stockBajo.length === 0 ? (
                <div className="text-muted" style={{ textAlign: 'center', padding: '32px' }}>
                  <div style={{ fontSize: '32px', marginBottom: '8px' }}>✅</div>
                  <p style={{ fontSize: '14px' }}>Todo el inventario está en buen nivel.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {datos.stockBajo.map((p) => (
                    <div key={p.id} className="surface-danger" style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '12px 16px',
                      borderRadius: '12px'
                    }}>
                      <span className="text-strong" style={{ fontSize: '14px', fontWeight: '600' }}>{p.nombre}</span>
                      <span className="badge badge-red">{p.stock} u.</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Más vendidos */}
            <div className="card">
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '20px',
                paddingBottom: '16px',
                borderBottom: '1px solid #f1f5f9'
              }}>
                <div style={{
                  width: '40px', height: '40px', borderRadius: '12px',
                  background: '#fef3c7',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '20px',
                  boxShadow: '0 4px 12px rgba(245,158,11,0.15)',
                  flexShrink: 0
                }}>
                  🔥
                </div>
                <div>
                  <h2 className="text-strong" style={{ fontSize: '17px', fontWeight: '700', margin: 0 }}>Más vendidos</h2>
                  <p className="text-muted" style={{ fontSize: '12px', margin: '2px 0 0', fontWeight: '500' }}>
                    Top productos del período
                  </p>
                </div>
              </div>

              {datos.productosVendidos.length === 0 ? (
                <div className="text-muted" style={{ textAlign: 'center', padding: '32px' }}>
                  <div style={{ fontSize: '32px', marginBottom: '8px' }}>📭</div>
                  <p style={{ fontSize: '14px' }}>Aún no hay ventas registradas.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {datos.productosVendidos.map((v, i) => (
                    <div key={i} className="surface-info" style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '12px 16px',
                      borderRadius: '12px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                        <span style={{
                          width: '24px', height: '24px', borderRadius: '8px',
                          background: i === 0 ? 'linear-gradient(135deg, #f59e0b, #d97706)' : '#dbeafe',
                          color: i === 0 ? 'white' : '#2563eb',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '11px', fontWeight: '800', flexShrink: 0
                        }}>
                          {i + 1}
                        </span>
                        <span className="text-strong" style={{
                          fontSize: '14px', fontWeight: '600',
                          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                        }}>
                          {v.producto?.nombre ?? 'Producto eliminado'}
                        </span>
                      </div>
                      <span className="badge badge-blue">{v.cantidadVendida} u.</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <p className="text-muted" style={{ fontSize: '12px', marginTop: '24px', textAlign: 'right', fontWeight: '500' }}>
            Última actualización: {new Date(datos.timestamp).toLocaleTimeString()}
          </p>
        </>
      )}
    </div>
  );
}