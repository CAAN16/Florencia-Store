<?php
/**
 * ContactModel — Gestión de mensajes de contacto en florencia_db.
 */
class ContactModel
{
    public function __construct(private PDO $pdo) {}

    /**
     * Guarda un nuevo mensaje de contacto.
     *
     * @param string $nombre
     * @param string $correo
     * @param string $asunto
     * @param string $mensaje
     * @return array Mensaje recién creado
     */
    public function create(string $nombre, string $correo, string $asunto, string $mensaje): array
    {
        $stmt = $this->pdo->prepare(
            'INSERT INTO mensajes_contacto (nombre, correo, asunto, mensaje)
             VALUES (:nombre, :correo, :asunto, :mensaje)'
        );

        $stmt->execute([
            ':nombre'  => trim($nombre),
            ':correo'  => strtolower(trim($correo)),
            ':asunto'  => trim($asunto),
            ':mensaje' => trim($mensaje),
        ]);

        return [
            'id'         => (int) $this->pdo->lastInsertId(),
            'nombre'     => trim($nombre),
            'correo'     => strtolower(trim($correo)),
            'asunto'     => trim($asunto),
            'mensaje'    => trim($mensaje),
            'leido'      => false,
            'created_at' => date('Y-m-d H:i:s'),
        ];
    }

    /**
     * Obtiene todos los mensajes de contacto (para el panel admin).
     *
     * @param bool $soloNoLeidos
     * @return array
     */
    public function getAll(bool $soloNoLeidos = false): array
    {
        $where = $soloNoLeidos ? 'WHERE leido = 0' : '';
        $stmt  = $this->pdo->query(
            "SELECT id, nombre, correo, asunto, mensaje, leido, created_at
             FROM mensajes_contacto
             $where
             ORDER BY created_at DESC"
        );
        return $stmt->fetchAll();
    }

    /**
     * Marca un mensaje como leído.
     *
     * @param int $id
     * @return bool
     */
    public function marcarLeido(int $id): bool
    {
        $stmt = $this->pdo->prepare(
            'UPDATE mensajes_contacto SET leido = 1 WHERE id = :id'
        );
        $stmt->execute([':id' => $id]);
        return $stmt->rowCount() > 0;
    }
}
