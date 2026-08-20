export interface LoginResponse {
  access_token: string;
  usuario: {
    id: number;
    nombre: string;
    email: string;
    rol: 'ADMINISTRADOR' | 'BODEGUERO' | 'REPARTIDOR' | 'SUPERVISOR';
  };
}

export interface LoginCredenciales {
  email: string;
  password: string;
}