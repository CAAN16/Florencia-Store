import { apiFetch, ApiResponse } from './api';

export interface User {
  id: number;
  nombre: string;
  correo: string;
  rol: 'admin' | 'cliente';
  created_at: string;
}

export const authService = {
  /**
   * Inicia sesión del usuario
   */
  async login(correo: string, password: string): Promise<ApiResponse<{ user: User }>> {
    return apiFetch<ApiResponse<{ user: User }>>('/api/auth/login.php', {
      method: 'POST',
      body: JSON.stringify({ correo, password }),
    });
  },

  /**
   * Registra un nuevo usuario
   */
  async register(nombre: string, correo: string, password: string): Promise<ApiResponse<{ user: User }>> {
    return apiFetch<ApiResponse<{ user: User }>>('/api/auth/register.php', {
      method: 'POST',
      body: JSON.stringify({ nombre, correo, password }),
    });
  },

  /**
   * Cierra la sesión activa
   */
  async logout(): Promise<ApiResponse<null>> {
    return apiFetch<ApiResponse<null>>('/api/auth/logout.php', {
      method: 'POST',
    });
  },

  /**
   * Obtiene la sesión actual
   */
  async getSession(): Promise<ApiResponse<{ authenticated: boolean; user: User | null }>> {
    return apiFetch<ApiResponse<{ authenticated: boolean; user: User | null }>>('/api/auth/session.php', {
      method: 'GET',
    });
  },
};
