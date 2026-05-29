<?php
/**
 * ProductModel — Acceso a datos de productos en florencia_db.
 * Todas las consultas usan PDO con prepared statements.
 */
class ProductModel
{
    public function __construct(private PDO $pdo) {}

    /**
     * Obtiene todos los productos activos con filtros opcionales.
     *
     * @param string|null $categoria  Slug de categoría (ropa, calzado, accesorios)
     * @param string|null $audiencia  Público objetivo (ninas, jovenes, mujeres)
     * @param string|null $busqueda   Término de búsqueda en nombre o descripción
     * @param bool        $soloActivos Si true, solo devuelve productos activos
     * @return array
     */
    public function getAll(
        ?string $categoria  = null,
        ?string $audiencia  = null,
        ?string $busqueda   = null,
        bool    $soloActivos = true
    ): array {
        $conditions = [];
        $params     = [];

        if ($soloActivos) {
            $conditions[] = 'p.is_active = 1';
        }

        if ($categoria) {
            $conditions[] = 'c.slug = :categoria';
            $params[':categoria'] = $categoria;
        }

        if ($audiencia) {
            $conditions[] = 'p.audiencia = :audiencia';
            $params[':audiencia'] = $audiencia;
        }

        if ($busqueda) {
            $conditions[] = '(p.nombre LIKE :busqueda OR p.descripcion LIKE :busqueda)';
            $params[':busqueda'] = '%' . $busqueda . '%';
        }

        $where = $conditions ? 'WHERE ' . implode(' AND ', $conditions) : '';

        $sql = "
            SELECT
                p.id,
                p.nombre,
                p.descripcion,
                p.precio,
                p.precio_original,
                p.stock,
                p.audiencia,
                p.subcategoria,
                p.tallas,
                p.colores,
                p.imagen,
                p.is_new,
                p.is_featured,
                p.is_active,
                p.created_at,
                c.nombre   AS categoria,
                c.slug     AS categoria_slug
            FROM productos p
            INNER JOIN categorias c ON c.id = p.categoria_id
            $where
            ORDER BY p.is_featured DESC, p.created_at DESC
        ";

        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        $rows = $stmt->fetchAll();

        return array_map([$this, 'formatProduct'], $rows);
    }

    /**
     * Obtiene un producto por su ID.
     *
     * @param int $id
     * @return array|null
     */
    public function getById(int $id): ?array
    {
        $sql = "
            SELECT
                p.*,
                c.nombre AS categoria,
                c.slug   AS categoria_slug
            FROM productos p
            INNER JOIN categorias c ON c.id = p.categoria_id
            WHERE p.id = :id AND p.is_active = 1
        ";

        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([':id' => $id]);
        $row = $stmt->fetch();

        return $row ? $this->formatProduct($row) : null;
    }

    /**
     * Crea un nuevo producto.
     *
     * @param array $data Datos del producto (validados previamente)
     * @return array Producto recién creado
     */
    public function create(array $data): array
    {
        $sql = "
            INSERT INTO productos
                (categoria_id, nombre, descripcion, precio, precio_original,
                 stock, audiencia, subcategoria, tallas, colores, imagen,
                 is_new, is_featured)
            VALUES
                (:categoria_id, :nombre, :descripcion, :precio, :precio_original,
                 :stock, :audiencia, :subcategoria, :tallas, :colores, :imagen,
                 :is_new, :is_featured)
        ";

        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([
            ':categoria_id'    => (int) $data['categoria_id'],
            ':nombre'          => trim($data['nombre']),
            ':descripcion'     => trim($data['descripcion'] ?? ''),
            ':precio'          => (float) $data['precio'],
            ':precio_original' => isset($data['precio_original']) && $data['precio_original'] !== ''
                                    ? (float) $data['precio_original']
                                    : null,
            ':stock'           => (int) $data['stock'],
            ':audiencia'       => $data['audiencia'],
            ':subcategoria'    => trim($data['subcategoria'] ?? ''),
            ':tallas'          => $data['tallas'] ?? null,
            ':colores'         => $data['colores'] ?? null,
            ':imagen'          => $data['imagen'] ?? null,
            ':is_new'          => (int) ($data['is_new'] ?? 0),
            ':is_featured'     => (int) ($data['is_featured'] ?? 0),
        ]);

        $newId = (int) $this->pdo->lastInsertId();
        return $this->getById($newId);
    }

    /**
     * Actualiza un producto existente.
     *
     * @param int   $id
     * @param array $data Campos a actualizar
     * @return array|null Producto actualizado o null si no existe
     */
    public function update(int $id, array $data): ?array
    {
        $fields = [];
        $params = [':id' => $id];

        $allowed = [
            'categoria_id', 'nombre', 'descripcion', 'precio',
            'precio_original', 'stock', 'audiencia', 'subcategoria',
            'tallas', 'colores', 'imagen', 'is_new', 'is_featured', 'is_active'
        ];

        foreach ($allowed as $field) {
            if (array_key_exists($field, $data)) {
                $fields[] = "$field = :$field";
                $params[":$field"] = $data[$field] === '' ? null : $data[$field];
            }
        }

        if (empty($fields)) {
            return $this->getById($id);
        }

        $sql = 'UPDATE productos SET ' . implode(', ', $fields) . ' WHERE id = :id';
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);

        return $this->getById($id);
    }

    /**
     * Realiza borrado lógico de un producto (is_active = 0).
     *
     * @param int $id
     * @return bool
     */
    public function delete(int $id): bool
    {
        $stmt = $this->pdo->prepare(
            'UPDATE productos SET is_active = 0 WHERE id = :id'
        );
        $stmt->execute([':id' => $id]);
        return $stmt->rowCount() > 0;
    }

    /**
     * Normaliza un registro de producto decodificando JSON arrays.
     *
     * @param array $row
     * @return array
     */
    private function formatProduct(array $row): array
    {
        $row['tallas']  = $row['tallas']  ? json_decode($row['tallas'],  true) : [];
        $row['colores'] = $row['colores'] ? json_decode($row['colores'], true) : [];
        $row['is_new']      = (bool) $row['is_new'];
        $row['is_featured'] = (bool) $row['is_featured'];
        $row['is_active']   = (bool) $row['is_active'];
        $row['precio']          = (float) $row['precio'];
        $row['precio_original'] = $row['precio_original'] !== null
                                    ? (float) $row['precio_original']
                                    : null;
        $row['stock'] = (int) $row['stock'];
        $row['id']    = (int) $row['id'];
        return $row;
    }
}
