/**
 * Módulo central de llamadas API para Florencia WebStore.
 *
 * Estrategia de URL:
 * - En el NAVEGADOR: usa rutas relativas (/api/...) para que pasen por el
 *   proxy de Next.js (next.config.mjs → rewrites). Esto es ESENCIAL para que
 *   las cookies de sesión PHP (PHPSESSID) se envíen y reciban correctamente,
 *   ya que el navegador solo comparte cookies del mismo origen.
 * - En el SERVIDOR (SSR/RSC): usa la URL absoluta configurada en NEXT_PUBLIC_API_URL.
 */

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost/mujer-bonita/backend';

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  authenticated?: boolean;
  user?: any;
}

/**
 * Resuelve la URL base según el entorno de ejecución.
 * En el navegador usa rutas relativas para aprovechar el proxy de Next.js.
 */
function resolveBaseUrl(): string {
  // typeof window === 'undefined' → estamos en el servidor (Node.js / SSR)
  if (typeof window === 'undefined') {
    return API_BASE_URL;
  }
  // En el navegador: usar origen relativo para que el proxy reenvíe al PHP
  return '';
}

/**
 * Helper de fetch con configuraciones predeterminadas para interactuar con el backend PHP.
 */
export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  // Asegurar que el endpoint empiece con /
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const base = resolveBaseUrl();
  const url = `${base}${path}`;

  // Combinar headers predeterminados y personalizados
  const headers = new Headers(options.headers || {});

  // No setear Content-Type si es FormData (el navegador lo hará automáticamente con el boundary)
  if (!(options.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const config: RequestInit = {
    ...options,
    headers,
    // 'include' envía y recibe cookies en el mismo origen → el proxy hace que
    // el backend PHP esté en el mismo origen que el frontend Next.js
    credentials: 'include',
  };

  const response = await fetch(url, config);

  // Manejar respuestas sin contenido (como 204 No Content)
  if (response.status === 204) {
    return {} as T;
  }

  let data;
  try {
    data = await response.json();
  } catch (error) {
    throw new Error(`Error al decodificar la respuesta del servidor: ${response.statusText}`);
  }

  if (!response.ok) {
    const errorMessage = data?.message || `Error HTTP: ${response.status} ${response.statusText}`;
    throw new Error(errorMessage);
  }

  return data as T;
}
