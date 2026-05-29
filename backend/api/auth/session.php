<?php
/**
 * GET /api/auth/session
 * Devuelve el usuario de la sesión actual o null si no hay sesión.
 *
 * Respuesta: { success, authenticated, user? }
 */

require_once __DIR__ . '/../../middleware/cors.php';
require_once __DIR__ . '/../../middleware/auth.php';

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Método no permitido.']);
    exit;
}

$user = getCurrentUser();

echo json_encode([
    'success'       => true,
    'authenticated' => $user !== null,
    'user'          => $user,
]);
