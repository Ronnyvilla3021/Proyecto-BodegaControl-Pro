import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { registrarMovimiento } from '../api/productos';

interface Props {
  productoId: number;
  onCerrar: () => void;
}

export default function ModalMovimiento({ productoId, onCerrar }: Props) {
  const [tipo, setTipo] = useState<'ENTRADA' | 'SALIDA'>('ENTRADA');
  const [error, setError] = useState('');
  const queryClient = useQueryClient();

  const mutacion = useMutation({
    mutationFn: (dto: { tipo: 'ENTRADA' | 'SALIDA'; cantidad: number; motivo?: string }) =>
      registrarMovimiento(productoId, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productos'] });
      onCerrar();
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || 'Error al registrar el movimiento');
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    const form = new FormData(e.currentTarget);

    mutacion.mutate({
      tipo,
      cantidad: Number(form.get('cantidad')),
      motivo: form.get('motivo') as string,
    });
  };

  return (
    <div className="modal-overlay" onClick={onCerrar}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '420px' }}>
        {/* Header */}
        <div className="divider-bottom" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
          paddingBottom: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '44px', height: '44px', borderRadius: '12px',
              background: tipo === 'ENTRADA'
                ? 'linear-gradient(135deg, #10b981, #059669)'
                : 'linear-gradient(135deg, #ef4444, #dc2626)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '20px',
              boxShadow: tipo === 'ENTRADA'
                ? '0 4px 12px rgba(16,185,129,0.3)'
                : '0 4px 12px rgba(239,68,68,0.3)',
              transition: 'all 0.3s',
              flexShrink: 0
            }}>
              {tipo === 'ENTRADA' ? '↑' : '↓'}
            </div>
            <div>
              <h2 className="text-strong" style={{ fontSize: '18px', fontWeight: '700', margin: 0 }}>
                Registrar movimiento
              </h2>
              <p className="text-muted" style={{ fontSize: '13px', margin: '2px 0 0', fontWeight: '500' }}>
                {tipo === 'ENTRADA' ? 'Ingreso de stock' : 'Salida de stock'}
              </p>
            </div>
          </div>
          <button
            onClick={onCerrar}
            className="btn btn-secondary"
            style={{
              width: '36px', height: '36px', padding: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '14px', fontWeight: '700', flexShrink: 0
            }}
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="surface-danger" style={{
            borderRadius: '12px',
            padding: '14px 16px',
            fontSize: '14px',
            marginBottom: '20px',
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

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label className="form-label">Tipo de movimiento</label>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="button"
                onClick={() => setTipo('ENTRADA')}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: '12px',
                  fontWeight: '700',
                  fontSize: '13px',
                  border: tipo === 'ENTRADA' ? '2px solid #10b981' : '2px solid var(--color-border)',
                  background: tipo === 'ENTRADA' ? '#d1fae5' : 'transparent',
                  color: tipo === 'ENTRADA' ? '#065f46' : 'var(--color-text-secondary)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: tipo === 'ENTRADA' ? '0 4px 12px rgba(16,185,129,0.15)' : 'none',
                  letterSpacing: '0.02em',
                  fontFamily: 'inherit'
                }}
              >
                ↑ Entrada
              </button>
              <button
                type="button"
                onClick={() => setTipo('SALIDA')}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: '12px',
                  fontWeight: '700',
                  fontSize: '13px',
                  border: tipo === 'SALIDA' ? '2px solid #ef4444' : '2px solid var(--color-border)',
                  background: tipo === 'SALIDA' ? '#fee2e2' : 'transparent',
                  color: tipo === 'SALIDA' ? '#991b1b' : 'var(--color-text-secondary)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: tipo === 'SALIDA' ? '0 4px 12px rgba(239,68,68,0.15)' : 'none',
                  letterSpacing: '0.02em',
                  fontFamily: 'inherit'
                }}
              >
                ↓ Salida
              </button>
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label className="form-label">Cantidad</label>
            <input
              name="cantidad"
              type="number"
              min="1"
              required
              className="form-input"
              placeholder="0"
              style={{ fontSize: '16px', fontWeight: '600' }}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label className="form-label">Motivo (opcional)</label>
            <input
              name="motivo"
              className="form-input"
              placeholder="Ej: Compra a proveedor, ajuste de inventario..."
            />
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              type="button"
              onClick={onCerrar}
              className="btn btn-secondary"
              style={{ flex: 1, justifyContent: 'center' }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={mutacion.isPending}
              className="btn"
              style={{
                flex: 1,
                justifyContent: 'center',
                color: 'white',
                background: tipo === 'ENTRADA'
                  ? 'linear-gradient(135deg, #10b981, #059669)'
                  : 'linear-gradient(135deg, #ef4444, #dc2626)',
                boxShadow: tipo === 'ENTRADA'
                  ? '0 4px 12px rgba(16,185,129,0.3)'
                  : '0 4px 12px rgba(239,68,68,0.3)'
              }}
            >
              {mutacion.isPending ? 'Guardando...' : 'Confirmar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}