export type Rol = 'ADMINISTRADOR' | 'BODEGUERO' | 'REPARTIDOR' | 'SUPERVISOR';

export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  rol: Rol;
  activo: boolean;
  creadoEn: string;
}

export interface CrearUsuarioDto {
  nombre: string;
  email: string;
  password: string;
  rol: Rol;
}