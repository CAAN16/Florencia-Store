<?php
/**
 * Carga las variables de entorno desde el archivo .env
 * ubicado en la raíz del backend.
 *
 * En producción, se recomienda configurar las variables
 * directamente en el servidor web (Apache/Nginx).
 */

$envFile = __DIR__ . '/../../.env';

if (!file_exists($envFile)) {
    // Intentar con .env en la raíz del backend
    $envFile = __DIR__ . '/../.env';
}

if (file_exists($envFile)) {
    $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);

    foreach ($lines as $line) {
        // Ignorar comentarios
        if (str_starts_with(trim($line), '#')) {
            continue;
        }

        if (str_contains($line, '=')) {
            [$key, $value] = explode('=', $line, 2);
            $key   = trim($key);
            $value = trim($value);

            // Quitar comillas si las hay
            $value = trim($value, '"\'');

            if (!array_key_exists($key, $_ENV)) {
                $_ENV[$key] = $value;
                putenv("$key=$value");
            }
        }
    }
}
