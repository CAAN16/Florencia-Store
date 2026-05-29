<?php
/**
 * POST /api/auth/login
 * Autentica al usuario y crea la sesión PHP.
 *
 * Body JSON: { "correo": string, "password": string }
 * Respuesta: { success, message, user? }
 */

require_once __DIR__ . '/../../middleware/cors.php';
require_once __DIR__ . '/../../middleware/auth.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../models/UserModel.php';

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Método no permitido.']);
    exit;
}

try {
    $body = json_decode(file_get_contents('php://input'), true);

    $correo   = trim($body['correo']   ?? '');
    $password = trim($body['password'] ?? '');

    // Validación básica
    if (!$correo || !$password) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Correo y contraseña son requeridos.']);
        exit;
    }

    if (!filter_var($correo, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Correo electrónico inválido.']);
        exit;
    }

    $userModel = new UserModel($pdo);
    $user = $userModel->login($correo, $password);

    if (!$user) {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Correo o contraseña incorrectos.']);
        exit;
    }

    // Guardar usuario en sesión
    $_SESSION['user'] = $user;

    echo json_encode([
        'success' => true,
        'message' => 'Inicio de sesión exitoso.',
        'user'    => $user,
    ]);

} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Error interno del servidor.']);
    error_log('[login.php] ' . $e->getMessage());
}
