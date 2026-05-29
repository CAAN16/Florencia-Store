<?php
/**
 * POST  /api/contact/index.php - Registrar un nuevo mensaje de contacto
 * GET   /api/contact/index.php - Obtener lista de mensajes (requiere Admin)
 * PATCH /api/contact/index.php - Marcar un mensaje como leído (requiere Admin)
 */

require_once __DIR__ . '/../../middleware/cors.php';
require_once __DIR__ . '/../../middleware/auth.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../models/ContactModel.php';

header('Content-Type: application/json; charset=utf-8');

$method = $_SERVER['REQUEST_METHOD'];

try {
    $contactModel = new ContactModel($pdo);

    if ($method === 'POST') {
        $body = json_decode(file_get_contents('php://input'), true);
        if (!$body) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Cuerpo de solicitud inválido.']);
            exit;
        }

        $nombre  = trim($body['nombre'] ?? '');
        $correo  = trim($body['correo'] ?? '');
        $asunto  = trim($body['asunto'] ?? '');
        $mensaje = trim($body['mensaje'] ?? '');

        if (!$nombre || !$correo || !$asunto || !$mensaje) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Todos los campos son obligatorios.']);
            exit;
        }

        if (!filter_var($correo, FILTER_VALIDATE_EMAIL)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Correo electrónico inválido.']);
            exit;
        }

        $result = $contactModel->create($nombre, $correo, $asunto, $mensaje);

        http_response_code(201);
        echo json_encode([
            'success' => true,
            'message' => 'Mensaje enviado correctamente. Nos pondremos en contacto pronto.',
            'data'    => $result
        ]);
        exit;

    } elseif ($method === 'GET') {
        requireAdmin();

        $soloNoLeidos = isset($_GET['soloNoLeidos'])
            ? ($_GET['soloNoLeidos'] === 'true' || $_GET['soloNoLeidos'] === '1')
            : false;
        $messages = $contactModel->getAll($soloNoLeidos);

        echo json_encode([
            'success' => true,
            'data'    => $messages
        ]);
        exit;

    } elseif ($method === 'PATCH') {
        requireAdmin();

        $body = json_decode(file_get_contents('php://input'), true);
        $id   = isset($body['id']) ? (int) $body['id'] : 0;

        if ($id <= 0) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'ID de mensaje inválido.']);
            exit;
        }

        $updated = $contactModel->marcarLeido($id);

        if (!$updated) {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Mensaje no encontrado o ya estaba marcado como leído.']);
            exit;
        }

        echo json_encode([
            'success' => true,
            'message' => 'Mensaje marcado como leído.'
        ]);
        exit;

    } else {
        http_response_code(405);
        echo json_encode(['success' => false, 'message' => 'Método no permitido.']);
        exit;
    }

} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Error interno del servidor.']);
    error_log('[contact/index.php] ' . $e->getMessage());
}
