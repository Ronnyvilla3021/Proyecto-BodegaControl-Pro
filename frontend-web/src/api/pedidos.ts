import api from './cliente';
import type { Pedido, CrearPedidoDto, EstadoPedido } from '../types/pedido';

export async function listarPedidos(): Promise<Pedido[]> {
  const { data } = await api.get('/pedidos');
  return data;
}

export async function crearPedido(dto: CrearPedidoDto): Promise<Pedido> {
  const { data } = await api.post('/pedidos', dto);
  return data;
}

export async function cambiarEstado(id: number, estado: EstadoPedido) {
  const { data } = await api.patch(`/pedidos/${id}/estado`, { estado });
  return data;
}