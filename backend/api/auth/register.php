<?php
/**
 * POST /api/auth/register
 * Registra un nuevo usuario con rol 'cliente'.
 *
 * Body JSON: { "nombre": string, "correo": string, "password": string }
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

    $nombre   = trim($body['nombre']   ?? '');
    $correo   = trim($body['correo']   ?? '');
    $password = trim($body['password'] ?? '');

    // Validaciones
    $errors = [];

    if (strlen($nombre) < 2) {
        $errors[] = 'El nombre debe tener al menos 2 caracteres.';
    }

    if (!filter_var($correo, FILTER_VALIDATE_EMAIL)) {
        $errors[] = 'El correo electrónico no es válido.';
    }

    if (strlen($password) < 6) {
        $errors[] = 'La contraseña debe tener al menos 6 caracteres.';
    }

    if ($errors) {
        http_response_code(422);
        echo json_encode(['success' => false, 'message' => implode(' ', $errors)]);
        exit;
    }

    $userModel = new UserModel($pdo);
    $newUser   = $userModel->register($nombre, $correo, $password);

    if (!$newUser) {
        http_response_code(409);
        echo json_encode(['success' => false, 'message' => 'Este correo ya está registrado.']);
        exit;
    }

    // Auto-login tras registro
    $_SESSION['user'] = $newUser;

    http_response_code(201);
    echo json_encode([
        'success' => true,
        'message' => 'Registro exitoso. ¡Bienvenida a Florencia!',
        'user'    => $newUser,
    ]);

} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Error interno del servidor.']);
    error_log('[register.php] ' . $e->getMessage());
}
