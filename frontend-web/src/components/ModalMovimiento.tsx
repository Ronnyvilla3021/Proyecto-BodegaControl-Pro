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
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm">
        <h2 className="text-lg font-bold text-slate-800 mb-4">Registrar movimiento</h2>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm rounded-lg px-3 py-2 mb-4">{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="flex gap-2 mb-4">
            <button
              type="button"
              onClick={() => setTipo('ENTRADA')}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${
                tipo === 'ENTRADA' ? 'bg-green-600 text-white' : 'bg-slate-100 text-slate-600'
              }`}
            >
              Entrada
            </button>
            <button
              type="button"
              onClick={() => setTipo('SALIDA')}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${
                tipo === 'SALIDA' ? 'bg-red-600 text-white' : 'bg-slate-100 text-slate-600'
              }`}
            >
              Salida
            </button>
          </div>

          <label className="block text-sm font-medium text-slate-700 mb-1">Cantidad</label>
          <input
            name="cantidad"
            type="number"
            min="1"
            required
            className="w-full border rounded-lg px-3 py-2 mb-4"
          />

          <label className="block text-sm font-medium text-slate-700 mb-1">Motivo (opcional)</label>
          <input name="motivo" className="w-full border rounded-lg px-3 py-2 mb-6" />

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onCerrar}
              className="flex-1 bg-slate-100 text-slate-700 rounded-lg py-2 font-medium hover:bg-slate-200 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={mutacion.isPending}
              className="flex-1 bg-blue-600 text-white rounded-lg py-2 font-medium hover:bg-blue-700 transition disabled:opacity-50"
            >
              {mutacion.isPending ? 'Guardando...' : 'Confirmar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}