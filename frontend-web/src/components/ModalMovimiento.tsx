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
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '400px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a', margin: 0 }}>Registrar movimiento</h2>
          <button
            onClick={onCerrar}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: '#f1f5f9',
              border: 'none',
              cursor: 'pointer',
              fontSize: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            ✕
          </button>
        </div>

        {error && (
          <div style={{ 
            background: '#fee2e2', 
            color: '#991b1b', 
            borderRadius: '12px', 
            padding: '12px 16px', 
            fontSize: '14px',
            marginBottom: '20px',
            border: '1px solid #fecaca'
          }}>
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
                  padding: '10px',
                  borderRadius: '12px',
                  fontWeight: '600',
                  fontSize: '14px',
                  border: tipo === 'ENTRADA' ? '2px solid #10b981' : '2px solid #e2e8f0',
                  background: tipo === 'ENTRADA' ? '#d1fae5' : 'white',
                  color: tipo === 'ENTRADA' ? '#065f46' : '#64748b',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                ↑ Entrada
              </button>
              <button
                type="button"
                onClick={() => setTipo('SALIDA')}
                style={{
                  flex: 1,
                  padding: '10px',
                  borderRadius: '12px',
                  fontWeight: '600',
                  fontSize: '14px',
                  border: tipo === 'SALIDA' ? '2px solid #ef4444' : '2px solid #e2e8f0',
                  background: tipo === 'SALIDA' ? '#fee2e2' : 'white',
                  color: tipo === 'SALIDA' ? '#991b1b' : '#64748b',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
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
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label className="form-label">Motivo (opcional)</label>
            <input name="motivo" className="form-input" placeholder="Motivo del movimiento" />
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
              className="btn btn-primary"
              style={{ flex: 1, justifyContent: 'center' }}
            >
              {mutacion.isPending ? 'Guardando...' : 'Confirmar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}