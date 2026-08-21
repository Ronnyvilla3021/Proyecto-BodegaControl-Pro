import api from './cliente';
import type { Cliente } from '../types/pedido';

export async function listarClientes(): Promise<Cliente[]> {
  const { data } = await api.get('/clientes');
  return data;
}

export async function crearCliente(dto: {
  nombre: string;
  telefono?: string;
  direccion?: string;
  email?: string;
}): Promise<Cliente> {
  const { data } = await api.post('/clientes', dto);
  return data;
}

export async function actualizarCliente(
  id: number,
  dto: { nombre: string; telefono?: string; direccion?: string; email?: string },
): Promise<Cliente> {
  const { data } = await api.patch(`/clientes/${id}`, dto);
  return data;
}