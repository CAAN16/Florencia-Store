<?php
/**
 * GET /api/products/detail.php?id=X - Obtener detalle de un producto
 * PUT /api/products/detail.php?id=X - Editar un producto (requiere Admin)
 * DELETE /api/products/detail.php?id=X - Eliminar (desactivar) un producto (requiere Admin)
 */

require_once __DIR__ . '/../../middleware/cors.php';
require_once __DIR__ . '/../../middleware/auth.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../models/ProductModel.php';

header('Content-Type: application/json; charset=utf-8');

$method = $_SERVER['REQUEST_METHOD'];
$id = isset($_GET['id']) ? (int) $_GET['id'] : 0;

if ($id <= 0) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'ID de producto inválido o no especificado.']);
    exit;
}

try {
    $productModel = new ProductModel($pdo);

    if ($method === 'GET') {
        $product = $productModel->getById($id);

        if (!$product) {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Producto no encontrado.']);
            exit;
        }

        echo json_encode([
            'success' => true,
            'data' => $product
        ]);
        exit;
    } elseif ($method === 'PUT') {
        requireAdmin();

        $body = json_decode(file_get_contents('php://input'), true);
        if (!$body) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Cuerpo de solicitud inválido.']);
            exit;
        }

        // Tallas y colores convertidos a JSON string si vienen como arrays
        if (isset($body['tallas']) && is_array($body['tallas'])) {
            $body['tallas'] = json_encode($body['tallas']);
        }
        if (isset($body['colores']) && is_array($body['colores'])) {
            $body['colores'] = json_encode($body['colores']);
        }

        $updatedProduct = $productModel->update($id, $body);

        if (!$updatedProduct) {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Producto no encontrado o no actualizado.']);
            exit;
        }

        echo json_encode([
            'success' => true,
            'message' => 'Producto actualizado correctamente.',
            'data' => $updatedProduct
        ]);
        exit;
    } elseif ($method === 'DELETE') {
        requireAdmin();

        $success = $productModel->delete($id);

        if (!$success) {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Producto no encontrado o ya eliminado.']);
            exit;
        }

        echo json_encode([
            'success' => true,
            'message' => 'Producto eliminado correctamente.'
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
    error_log('[products/detail.php] ' . $e->getMessage());
}
