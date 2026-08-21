import api from './cliente';
import type { Usuario, CrearUsuarioDto } from '../types/usuario';

export async function listarUsuarios(): Promise<Usuario[]> {
  const { data } = await api.get('/usuarios');
  return data;
}

export async function crearUsuario(dto: CrearUsuarioDto): Promise<Usuario> {
  const { data } = await api.post('/usuarios', dto);
  return data;
}

export async function cambiarEstadoUsuario(id: number, activo: boolean): Promise<Usuario> {
  const { data } = await api.patch(`/usuarios/${id}/estado`, { activo });
  return data;
}