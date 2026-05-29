<?php
/**
 * Middleware CORS.
 * Permite peticiones desde el frontend Next.js.
 * Debe llamarse antes de cualquier output.
 */

require_once __DIR__ . '/../config/env.php';

$allowedOrigin = $_ENV['FRONTEND_URL'] ?? 'http://localhost:3000';

// En desarrollo aceptar también localhost sin puerto específico
$requestOrigin = $_SERVER['HTTP_ORIGIN'] ?? '';

$isAllowed = (
    $requestOrigin === $allowedOrigin ||
    // Permitir variantes comunes de desarrollo
    preg_match('/^https?:\/\/localhost(:\d+)?$/', $requestOrigin) ||
    preg_match('/^https?:\/\/127\.0\.0\.1(:\d+)?$/', $requestOrigin)
);

if ($isAllowed && $requestOrigin) {
    header('Access-Control-Allow-Origin: ' . $requestOrigin);
} else {
    header('Access-Control-Allow-Origin: ' . $allowedOrigin);
}

header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Access-Control-Max-Age: 86400'); // cache preflight 24h

// Responder al preflight OPTIONS inmediatamente
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}
