<?php
/**
 * UserModel — Acceso a datos de usuarios en florencia_db.
 * Las contraseñas se hashean con bcrypt (password_hash / password_verify).
 */
class UserModel
{
    public function __construct(private PDO $pdo) {}

    /**
     * Busca un usuario por correo electrónico.
     *
     * @param string $correo
     * @return array|null
     */
    public function findByEmail(string $correo): ?array
    {
        $stmt = $this->pdo->prepare(
            'SELECT id, nombre, correo, password_hash, rol, is_active, fecha_registro
             FROM usuarios
             WHERE correo = :correo
             LIMIT 1'
        );
        $stmt->execute([':correo' => strtolower(trim($correo))]);
        $row = $stmt->fetch();
        return $row ?: null;
    }

    /**
     * Autentica al usuario verificando la contraseña con bcrypt.
     * Devuelve los datos del usuario sin el hash de contraseña.
     *
     * @param string $correo
     * @param string $password
     * @return array|null  null si las credenciales son incorrectas o la cuenta está desactivada
     */
    public function login(string $correo, string $password): ?array
    {
        $user = $this->findByEmail($correo);

        if (!$user) {
            return null;
        }

        if (!(bool) $user['is_active']) {
            return null;
        }

        if (!password_verify($password, $user['password_hash'])) {
            return null;
        }

        // No exponer el hash en la respuesta
        unset($user['password_hash']);
        $user['id']        = (int) $user['id'];
        $user['is_active'] = (bool) $user['is_active'];

        return $user;
    }

    /**
     * Registra un nuevo usuario con contraseña hasheada en bcrypt.
     *
     * @param string $nombre
     * @param string $correo
     * @param string $password  Contraseña en texto plano (se hashea aquí)
     * @return array|null       Datos del nuevo usuario o null si el correo ya existe
     */
    public function register(string $nombre, string $correo, string $password): ?array
    {
        $correo = strtolower(trim($correo));

        // Verificar que el correo no esté en uso
        if ($this->findByEmail($correo)) {
            return null;
        }

        $hash = password_hash($password, PASSWORD_BCRYPT, ['cost' => 12]);

        $stmt = $this->pdo->prepare(
            'INSERT INTO usuarios (nombre, correo, password_hash, rol)
             VALUES (:nombre, :correo, :password_hash, "cliente")'
        );
        $stmt->execute([
            ':nombre'        => trim($nombre),
            ':correo'        => $correo,
            ':password_hash' => $hash,
        ]);

        $newId = (int) $this->pdo->lastInsertId();

        return [
            'id'             => $newId,
            'nombre'         => trim($nombre),
            'correo'         => $correo,
            'rol'            => 'cliente',
            'is_active'      => true,
            'fecha_registro' => date('Y-m-d H:i:s'),
        ];
    }

    /**
     * Obtiene la lista de todos los usuarios (sin contraseñas).
     *
     * @return array
     */
    public function getAll(): array
    {
        $stmt = $this->pdo->query(
            'SELECT id, nombre, correo, rol, is_active, fecha_registro
             FROM usuarios
             ORDER BY fecha_registro DESC'
        );
        return $stmt->fetchAll();
    }
}
