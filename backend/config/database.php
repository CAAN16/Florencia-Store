<?php
/**
 * Configuración de conexión a la base de datos florencia_db.
 * Usa PDO con prepared statements para prevenir SQL Injection.
 */

require_once __DIR__ . '/env.php';

try {
    $dsn = sprintf(
        'mysql:host=%s;port=%s;dbname=%s;charset=utf8mb4',
        $_ENV['DB_HOST'],
        $_ENV['DB_PORT'] ?? '3306',
        $_ENV['DB_NAME']
    );

    $pdo = new PDO($dsn, $_ENV['DB_USER'], $_ENV['DB_PASS'], [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ]);

    // Asegurar charset utf8mb4 a nivel de conexión
    $pdo->exec("SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci");

} catch (PDOException $e) {
    http_response_code(500);
    header('Content-Type: application/json');
    echo json_encode([
        'success' => false,
        'message' => 'Error de conexión a la base de datos.'
    ]);
    error_log('[florencia_db] PDOException: ' . $e->getMessage());
    exit;
}
