<?php
/**
 * GET /api/products/index.php - Listar productos con filtros
 * POST /api/products/index.php - Crear un nuevo producto (requiere Admin)
 */

require_once __DIR__ . '/../../middleware/cors.php';
require_once __DIR__ . '/../../middleware/auth.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../models/ProductModel.php';

header('Content-Type: application/json; charset=utf-8');

$method = $_SERVER['REQUEST_METHOD'];

try {
    $productModel = new ProductModel($pdo);

    if ($method === 'GET') {
        $categoria = $_GET['categoria'] ?? null;
        $audiencia = $_GET['audiencia'] ?? null;
        $busqueda = $_GET['busqueda'] ?? null;
        
        // El administrador tal vez quiera ver también los desactivados en la lista
        $soloActivos = isset($_GET['soloActivos']) ? ($_GET['soloActivos'] === 'true' || $_GET['soloActivos'] === '1') : true;

        $products = $productModel->getAll($categoria, $audiencia, $busqueda, $soloActivos);

        echo json_encode([
            'success' => true,
            'data' => $products
        ]);
        exit;
    } elseif ($method === 'POST') {
        requireAdmin();

        $body = json_decode(file_get_contents('php://input'), true);
        if (!$body) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Cuerpo de solicitud inválido.']);
            exit;
        }

        // Validación de campos requeridos
        $requiredFields = ['categoria_id', 'nombre', 'precio', 'stock', 'audiencia'];
        foreach ($requiredFields as $field) {
            if (!isset($body[$field]) || $body[$field] === '') {
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => "El campo '$field' es obligatorio."]);
                exit;
            }
        }

        // Tallas y colores convertidos a JSON string si vienen como arrays
        if (isset($body['tallas']) && is_array($body['tallas'])) {
            $body['tallas'] = json_encode($body['tallas']);
        }
        if (isset($body['colores']) && is_array($body['colores'])) {
            $body['colores'] = json_encode($body['colores']);
        }

        $newProduct = $productModel->create($body);

        http_response_code(201);
        echo json_encode([
            'success' => true,
            'message' => 'Producto creado correctamente.',
            'data' => $newProduct
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
    error_log('[products/index.php] ' . $e->getMessage());
}
