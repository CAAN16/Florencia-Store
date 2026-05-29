<?php
/**
 * POST /api/products/upload-image.php - Subir imagen de producto (requiere Admin)
 *
 * Recibe: un archivo en $_FILES['imagen']
 * Respuesta: { success, message, url? }
 */

require_once __DIR__ . '/../../middleware/cors.php';
require_once __DIR__ . '/../../middleware/auth.php';

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Método no permitido.']);
    exit;
}

try {
    requireAdmin();

    if (!isset($_FILES['imagen']) || $_FILES['imagen']['error'] !== UPLOAD_ERR_OK) {
        $errorCode = $_FILES['imagen']['error'] ?? 'No se recibió archivo';
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Error al subir el archivo o no se especificó un archivo.',
            'error_code' => $errorCode
        ]);
        exit;
    }

    $file = $_FILES['imagen'];
    $allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    $maxSize = 2 * 1024 * 1024; // 2MB

    // Validar tipo mime
    $finfo = new finfo(FILEINFO_MIME_TYPE);
    $mimeType = $finfo->file($file['tmp_name']);

    if (!in_array($mimeType, $allowedTypes)) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Tipo de archivo no permitido. Solo se aceptan imágenes JPG, PNG y WebP.'
        ]);
        exit;
    }

    // Validar tamaño
    if ($file['size'] > $maxSize) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'El tamaño del archivo excede el límite permitido de 2MB.'
        ]);
        exit;
    }

    // Crear directorio si no existe
    $uploadDir = __DIR__ . '/../../uploads/productos/';
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }

    // Generar nombre de archivo único e inocuo
    $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
    if (empty($extension)) {
        $extension = $mimeType === 'image/png' ? 'png' : ($mimeType === 'image/webp' ? 'webp' : 'jpg');
    }
    
    // Sanitizar nombre o simplemente usar un hash aleatorio
    $filename = bin2hex(random_bytes(10)) . '.' . $extension;
    $destination = $uploadDir . $filename;

    if (!move_uploaded_file($file['tmp_name'], $destination)) {
        throw new Exception('No se pudo mover el archivo subido al directorio de destino.');
    }

    // Retorna la ruta relativa
    $relativePath = 'uploads/productos/' . $filename;

    echo json_encode([
        'success' => true,
        'message' => 'Imagen subida correctamente.',
        'imagen' => $relativePath
    ]);
    exit;

} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Error interno del servidor al procesar la imagen.']);
    error_log('[upload-image.php] ' . $e->getMessage());
}
