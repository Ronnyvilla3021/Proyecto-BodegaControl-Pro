import api from './cliente';
import type { Producto, CrearProductoDto, MovimientoDto } from '../types/producto';

export async function listarProductos(): Promise<Producto[]> {
  const { data } = await api.get('/productos');
  return data;
}

export async function crearProducto(dto: CrearProductoDto): Promise<Producto> {
  const { data } = await api.post('/productos', dto);
  return data;
}

export async function registrarMovimiento(productoId: number, dto: MovimientoDto) {
  const { data } = await api.post(`/productos/${productoId}/movimiento`, dto);
  return data;
}

export async function obtenerKardex(productoId: number) {
  const { data } = await api.get(`/productos/${productoId}/kardex`);
  return data;
}