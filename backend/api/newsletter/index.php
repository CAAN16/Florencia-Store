<?php
/**
 * POST /api/newsletter/index.php - Suscribir un correo al newsletter
 * GET /api/newsletter/index.php - Listar suscriptores activos (requiere Admin)
 */

require_once __DIR__ . '/../../middleware/cors.php';
require_once __DIR__ . '/../../middleware/auth.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../models/NewsletterModel.php';

header('Content-Type: application/json; charset=utf-8');

$method = $_SERVER['REQUEST_METHOD'];

try {
    $newsletterModel = new NewsletterModel($pdo);

    if ($method === 'POST') {
        $body = json_decode(file_get_contents('php://input'), true);
        if (!$body) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Cuerpo de solicitud inválido.']);
            exit;
        }

        $correo = trim($body['correo'] ?? '');

        if (!$correo) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'El correo electrónico es requerido.']);
            exit;
        }

        if (!filter_var($correo, FILTER_VALIDATE_EMAIL)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Correo electrónico inválido.']);
            exit;
        }

        $result = $newsletterModel->subscribe($correo);

        if (!$result['success']) {
            http_response_code(400); // Bad Request (ya suscrito)
            echo json_encode([
                'success' => false,
                'message' => $result['message']
            ]);
            exit;
        }

        http_response_code(200);
        echo json_encode([
            'success' => true,
            'message' => $result['message']
        ]);
        exit;
    } elseif ($method === 'GET') {
        requireAdmin();

        $subscribers = $newsletterModel->getActive();

        echo json_encode([
            'success' => true,
            'data' => $subscribers
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
    error_log('[newsletter/index.php] ' . $e->getMessage());
}
