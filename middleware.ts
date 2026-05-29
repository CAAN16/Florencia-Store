import { NextRequest, NextResponse } from 'next/server';

/**
 * Middleware de protección de rutas del lado del servidor.
 *
 * Rutas protegidas: /admin/* e /inventario
 * Si el usuario no tiene el token de sesión en localStorage no podemos
 * verificarlo en el servidor (las cookies de sesión PHP son httpOnly y no
 * accesibles desde JS). Por eso usamos una cookie auxiliar `florencia_auth`
 * que el frontend setea al hacer login y borra al hacer logout.
 *
 * Esta cookie NO es de seguridad absoluta (la sesión real la valida PHP),
 * pero evita que usuarios no autenticados vean el HTML de las páginas
 * protegidas antes del redirect del lado cliente.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtectedRoute =
    pathname.startsWith('/admin') || pathname.startsWith('/inventario');

  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  // La cookie `florencia_auth` la setea el frontend tras login exitoso
  const authCookie = request.cookies.get('florencia_auth');

  if (!authCookie?.value) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/inventario/:path*'],
};
