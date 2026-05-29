<?php
/**
 * NewsletterModel — Gestión de suscriptores del boletín en florencia_db.
 */
class NewsletterModel
{
    public function __construct(private PDO $pdo) {}

    /**
     * Suscribe un correo al newsletter.
     * Si el correo ya existe pero estaba inactivo, lo reactiva.
     *
     * @param string $correo
     * @return array ['success' => bool, 'message' => string, 'isNew' => bool]
     */
    public function subscribe(string $correo): array
    {
        $correo = strtolower(trim($correo));

        // Verificar si ya existe
        $stmt = $this->pdo->prepare(
            'SELECT id, is_active FROM suscriptores_newsletter WHERE correo = :correo LIMIT 1'
        );
        $stmt->execute([':correo' => $correo]);
        $existing = $stmt->fetch();

        if ($existing) {
            if ((bool) $existing['is_active']) {
                return [
                    'success' => false,
                    'message' => 'Este correo ya está suscrito al newsletter.',
                    'isNew'   => false,
                ];
            }

            // Reactivar suscripción
            $update = $this->pdo->prepare(
                'UPDATE suscriptores_newsletter SET is_active = 1 WHERE id = :id'
            );
            $update->execute([':id' => $existing['id']]);

            return [
                'success' => true,
                'message' => '¡Tu suscripción ha sido reactivada!',
                'isNew'   => false,
            ];
        }

        // Nuevo suscriptor
        $insert = $this->pdo->prepare(
            'INSERT INTO suscriptores_newsletter (correo) VALUES (:correo)'
        );
        $insert->execute([':correo' => $correo]);

        return [
            'success' => true,
            'message' => '¡Gracias por suscribirte! Pronto recibirás nuestras novedades.',
            'isNew'   => true,
        ];
    }

    /**
     * Obtiene todos los suscriptores activos.
     *
     * @return array
     */
    public function getActive(): array
    {
        $stmt = $this->pdo->query(
            'SELECT id, correo, created_at
             FROM suscriptores_newsletter
             WHERE is_active = 1
             ORDER BY created_at DESC'
        );
        return $stmt->fetchAll();
    }
}
