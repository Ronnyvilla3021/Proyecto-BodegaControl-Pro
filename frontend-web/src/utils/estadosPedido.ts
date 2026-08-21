import type { EstadoPedido } from '../types/pedido';

export const siguienteEstado: Record<EstadoPedido, EstadoPedido | null> = {
  PENDIENTE: 'EMPACADO',
  EMPACADO: 'EN_RUTA',
  EN_RUTA: 'ENTREGADO',
  ENTREGADO: null,
};

export const colorEstado: Record<EstadoPedido, string> = {
  PENDIENTE: 'bg-slate-100 text-slate-700',
  EMPACADO: 'bg-amber-100 text-amber-700',
  EN_RUTA: 'bg-blue-100 text-blue-700',
  ENTREGADO: 'bg-green-100 text-green-700',
};

export const etiquetaEstado: Record<EstadoPedido, string> = {
  PENDIENTE: 'Pendiente',
  EMPACADO: 'Empacado',
  EN_RUTA: 'En ruta',
  ENTREGADO: 'Entregado',
};