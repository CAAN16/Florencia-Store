"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService, User } from '@/services/auth.service';

/** Setea la cookie auxiliar que usa el middleware de Next.js para proteger rutas */
function setAuthCookie() {
  document.cookie = 'florencia_auth=1; path=/; max-age=86400; SameSite=Lax';
}

/** Borra la cookie auxiliar al hacer logout */
function clearAuthCookie() {
  document.cookie = 'florencia_auth=; path=/; max-age=0; SameSite=Lax';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (correo: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  register: (nombre: string, correo: string, password: string) => Promise<{ success: boolean; message: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar sesión real con el backend PHP al cargar la aplicación
    const checkSession = async () => {
      try {
        const response = await authService.getSession();
        if (response.success && response.data?.authenticated && response.data?.user) {
          setUser(response.data.user);
          localStorage.setItem('florencia_user', JSON.stringify(response.data.user));
        } else {
          setUser(null);
          localStorage.removeItem('florencia_user');
        }
      } catch (error) {
        console.error('Error al verificar sesión:', error);
        // Fallback temporal a localStorage si falla la conexión
        const storedUser = localStorage.getItem('florencia_user');
        if (storedUser) {
          try {
            setUser(JSON.parse(storedUser));
          } catch {
            localStorage.removeItem('florencia_user');
          }
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  const login = async (correo: string, password: string): Promise<{ success: boolean; message: string }> => {
    setIsLoading(true);
    try {
      const response = await authService.login(correo, password);
      if (response.success && response.data?.user) {
        setUser(response.data.user);
        localStorage.setItem('florencia_user', JSON.stringify(response.data.user));
        setAuthCookie();
        return { success: true, message: response.message || 'Inicio de sesión exitoso' };
      }
      return { success: false, message: response.message || 'Error al iniciar sesión' };
    } catch (error: any) {
      return { success: false, message: error.message || 'Correo o contraseña incorrectos' };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (nombre: string, correo: string, password: string): Promise<{ success: boolean; message: string }> => {
    setIsLoading(true);
    try {
      const response = await authService.register(nombre, correo, password);
      if (response.success && response.data?.user) {
        setUser(response.data.user);
        localStorage.setItem('florencia_user', JSON.stringify(response.data.user));
        setAuthCookie();
        return { success: true, message: response.message || 'Registro exitoso' };
      }
      return { success: false, message: response.message || 'Error al registrarse' };
    } catch (error: any) {
      return { success: false, message: error.message || 'Este correo ya está registrado o datos inválidos' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Error al hacer logout en servidor:', error);
    } finally {
      setUser(null);
      localStorage.removeItem('florencia_user');
      clearAuthCookie();
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      logout,
      register
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    return {
      user: null,
      isAuthenticated: false,
      isLoading: false,
      login: async () => ({ success: false, message: 'Auth not configured' }),
      logout: () => {},
      register: async () => ({ success: false, message: 'Auth not configured' })
    };
  }
  return context;
}
