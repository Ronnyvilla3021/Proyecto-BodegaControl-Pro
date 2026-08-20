import api from './cliente';
import type { LoginCredenciales, LoginResponse } from '../types/auth';

export async function login(credenciales: LoginCredenciales): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>('/auth/login', credenciales);
  return data;
}