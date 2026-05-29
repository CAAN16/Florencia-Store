<?php
/**
 * Index de Florencia WebStore API.
 * Muestra el estado del servicio y endpoints disponibles.
 */

require_once __DIR__ . '/middleware/cors.php';

header('Content-Type: application/json; charset=utf-8');

echo json_encode([
    'success' => true,
    'message' => 'Florencia WebStore API RESTful está funcionando correctamente.',
    'version' => '1.0',
    'endpoints' => [
        'auth' => [
            'login'    => 'POST /api/auth/login.php',
            'register' => 'POST /api/auth/register.php',
            'logout'   => 'POST /api/auth/logout.php',
            'session'  => 'GET /api/auth/session.php',
        ],
        'products' => [
            'list'   => 'GET /api/products/index.php',
            'create' => 'POST /api/products/index.php',
            'detail' => 'GET /api/products/detail.php?id={id}',
            'update' => 'PUT /api/products/detail.php?id={id}',
            'delete' => 'DELETE /api/products/detail.php?id={id}',
            'upload' => 'POST /api/products/upload-image.php',
        ],
        'contact' => [
            'send' => 'POST /api/contact/index.php',
            'list' => 'GET /api/contact/index.php',
        ],
        'newsletter' => [
            'subscribe' => 'POST /api/newsletter/index.php',
            'list'      => 'GET /api/newsletter/index.php',
        ]
    ]
]);
