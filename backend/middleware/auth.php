<?php
/**
 * Middleware de autenticación.
 * Gestiona sesiones PHP y protege endpoints que requieren login.
 */

if (session_status() === PHP_SESSION_NONE) {
    session_set_cookie_params([
        'lifetime' => 86400,      // 1 día
        'path'     => '/',
        'secure'   => false,      // true en producción con HTTPS
        'httponly' => true,       // evitar acceso JS a la cookie
        'samesite' => 'Lax',
    ]);
    session_start();
}

/**
 * Verifica que el usuario haya iniciado sesión.
 * Si no, responde 401 y detiene la ejecución.
 */
function requireAuth(): void
{
    if (empty($_SESSION['user'])) {
        http_response_code(401);
        echo json_encode([
            'success' => false,
            'message' => 'No autenticado. Inicia sesión para continuar.'
        ]);
        exit;
    }
}

/**
 * Verifica que el usuario sea administrador.
 * Si no, responde 403 y detiene la ejecución.
 */
function requireAdmin(): void
{
    requireAuth();

    if ($_SESSION['user']['rol'] !== 'admin') {
        http_response_code(403);
        echo json_encode([
            'success' => false,
            'message' => 'Acceso denegado. Se requieren permisos de administrador.'
        ]);
        exit;
    }
}

/**
 * Devuelve el usuario de la sesión actual o null si no hay sesión.
 *
 * @return array|null
 */
function getCurrentUser(): ?array
{
    return $_SESSION['user'] ?? null;
}
