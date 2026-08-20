import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Usuario {
  id: number;
  nombre: string;
  email: string;
  rol: 'ADMINISTRADOR' | 'BODEGUERO' | 'REPARTIDOR' | 'SUPERVISOR';
}

interface AuthState {
  usuario: Usuario | null;
  token: string | null;
  login: (usuario: Usuario, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      usuario: null,
      token: null,
      login: (usuario, token) => set({ usuario, token }),
      logout: () => set({ usuario: null, token: null }),
    }),
    { name: 'bodega-auth' }, // clave en localStorage
  ),
);