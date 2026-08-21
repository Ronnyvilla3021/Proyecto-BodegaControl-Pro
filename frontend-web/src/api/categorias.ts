import api from './cliente';
import type { Categoria } from '../types/producto';

export async function listarCategorias(): Promise<Categoria[]> {
  const { data } = await api.get('/categorias');
  return data;
}

export async function crearCategoria(nombre: string): Promise<Categoria> {
  const { data } = await api.post('/categorias', { nombre });
  return data;
}