-- ==========================================================
--  FLORENCIA_DB — Base de Datos del Catálogo Florencia
--  Proyecto: Sistema Web de Gestión y Catálogo Comercial
--  Charset: utf8mb4 (soporta emojis y caracteres del español)
-- ==========================================================

CREATE DATABASE IF NOT EXISTS florencia_db
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE florencia_db;

-- ----------------------------------------------------------
-- TABLA: categorias
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS categorias (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nombre      VARCHAR(50)  NOT NULL,
  slug        VARCHAR(50)  NOT NULL UNIQUE,
  icono       VARCHAR(10)  DEFAULT NULL,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------
-- TABLA: usuarios
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS usuarios (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nombre          VARCHAR(100) NOT NULL,
  correo          VARCHAR(150) NOT NULL UNIQUE,
  password_hash   VARCHAR(255) NOT NULL,
  rol             ENUM('admin', 'cliente') NOT NULL DEFAULT 'cliente',
  is_active       TINYINT(1) NOT NULL DEFAULT 1,
  fecha_registro  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_correo (correo),
  INDEX idx_rol (rol)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------
-- TABLA: productos
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS productos (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  categoria_id    INT UNSIGNED NOT NULL,
  nombre          VARCHAR(150) NOT NULL,
  descripcion     TEXT,
  precio          DECIMAL(10, 2) NOT NULL,
  precio_original DECIMAL(10, 2) DEFAULT NULL,    -- precio antes de descuento
  stock           INT UNSIGNED NOT NULL DEFAULT 0,
  audiencia       ENUM('ninas', 'jovenes', 'mujeres') NOT NULL,
  subcategoria    VARCHAR(80)  DEFAULT NULL,
  tallas          VARCHAR(255) DEFAULT NULL,       -- JSON array serializado, ej: '["S","M","L"]'
  colores         VARCHAR(255) DEFAULT NULL,       -- JSON array serializado, ej: '["Rosa","Azul"]'
  imagen          VARCHAR(500) DEFAULT NULL,       -- ruta relativa: uploads/productos/nombre.jpg
  is_new          TINYINT(1) NOT NULL DEFAULT 0,
  is_featured     TINYINT(1) NOT NULL DEFAULT 0,
  is_active       TINYINT(1) NOT NULL DEFAULT 1,
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE RESTRICT,
  INDEX idx_categoria (categoria_id),
  INDEX idx_audiencia (audiencia),
  INDEX idx_is_featured (is_featured),
  INDEX idx_is_new (is_new),
  INDEX idx_precio (precio)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------
-- TABLA: mensajes_contacto
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS mensajes_contacto (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nombre      VARCHAR(100) NOT NULL,
  correo      VARCHAR(150) NOT NULL,
  asunto      VARCHAR(200) NOT NULL,
  mensaje     TEXT NOT NULL,
  leido       TINYINT(1) NOT NULL DEFAULT 0,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_leido (leido),
  INDEX idx_correo (correo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------
-- TABLA: suscriptores_newsletter
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS suscriptores_newsletter (
  id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  correo       VARCHAR(150) NOT NULL UNIQUE,
  is_active    TINYINT(1) NOT NULL DEFAULT 1,
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_correo (correo),
  INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================================
-- SEEDS — Datos de prueba
-- ==========================================================

-- Categorías
INSERT INTO categorias (nombre, slug, icono) VALUES
  ('Ropa',       'ropa',       '👗'),
  ('Calzado',    'calzado',    '👠'),
  ('Accesorios', 'accesorios', '👜');

-- Usuarios (contraseñas hasheadas con bcrypt)
-- admin123  → hash bcrypt
-- cliente123 → hash bcrypt
INSERT INTO usuarios (nombre, correo, password_hash, rol) 
VALUES ('Administrador', 'admin@florencia.com', '$2y$12$jmWq96jHdX91PLPACOCAf.9HirwkIpV1aPl9bEzf0x9nneYGZnWzu', 'admin'), 
('María García', 'maria@ejemplo.com', '$2y$12$IgBCczS9YH2di5K2AfXzoOch3aznLQpsg2c9AqtrTTZCR.dfZMLjq', 'cliente');

-- Productos (los 12 del catálogo actual, con imagen = URL Unsplash)
INSERT INTO productos
  (categoria_id, nombre, descripcion, precio, precio_original, stock, audiencia, subcategoria, tallas, colores, imagen, is_new, is_featured)
VALUES
  (
    1,
    'Vestido Floral Primavera',
    'Elegante vestido floral perfecto para la temporada de primavera. Confeccionado con telas de alta calidad.',
    89.99, 119.99, 15, 'mujeres', 'vestidos',
    '["XS","S","M","L","XL"]',
    '["Rosa","Azul","Verde"]',
    'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=500&fit=crop',
    1, 1
  ),
  (
    1,
    'Blusa Elegante Satinada',
    'Blusa satinada con detalles de encaje, perfecta para ocasiones especiales.',
    59.99, NULL, 20, 'jovenes', 'blusas',
    '["S","M","L"]',
    '["Blanco","Negro","Beige"]',
    'https://images.unsplash.com/photo-1551163943-3f6a855d1153?w=400&h=500&fit=crop',
    1, 0
  ),
  (
    2,
    'Sandalias de Tacón Rosa',
    'Sandalias elegantes con tacón de 8cm, perfectas para eventos formales.',
    79.99, 99.99, 12, 'mujeres', 'tacones',
    '["35","36","37","38","39","40"]',
    '["Rosa","Nude","Negro"]',
    'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&h=500&fit=crop',
    0, 1
  ),
  (
    3,
    'Bolso de Mano Chic',
    'Bolso de mano elegante con cadena dorada, ideal para cualquier ocasión.',
    49.99, NULL, 25, 'jovenes', 'bolsos',
    NULL,
    '["Rosa","Blanco","Negro"]',
    'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=500&fit=crop',
    0, 1
  ),
  (
    1,
    'Vestido Princesa Rosa',
    'Hermoso vestido de princesa con tul y detalles brillantes.',
    69.99, NULL, 18, 'ninas', 'vestidos',
    '["2-3","4-5","6-7","8-9","10-11"]',
    '["Rosa","Lila","Blanco"]',
    'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=400&h=500&fit=crop',
    1, 0
  ),
  (
    2,
    'Zapatillas Deportivas Trendy',
    'Zapatillas cómodas con diseño moderno y suela de alta resistencia.',
    89.99, NULL, 30, 'jovenes', 'deportivas',
    '["35","36","37","38","39","40"]',
    '["Blanco/Rosa","Negro/Dorado"]',
    'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&h=500&fit=crop',
    1, 0
  ),
  (
    3,
    'Aretes Dorados Elegantes',
    'Aretes dorados con diseño geométrico, baño de oro de 18k.',
    29.99, NULL, 50, 'mujeres', 'joyeria',
    NULL,
    '["Dorado","Plateado","Oro Rosa"]',
    'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&h=500&fit=crop',
    0, 0
  ),
  (
    1,
    'Falda Plisada Midi',
    'Falda plisada midi perfecta para looks sofisticados y elegantes.',
    54.99, 74.99, 22, 'mujeres', 'faldas',
    '["XS","S","M","L"]',
    '["Beige","Negro","Burdeos"]',
    'https://images.unsplash.com/photo-1583496661160-fb5886a0uj35?w=400&h=500&fit=crop',
    0, 1
  ),
  (
    2,
    'Bailarinas con Lazo',
    'Bailarinas cómodas y elegantes con lazo decorativo.',
    45.99, NULL, 35, 'ninas', 'flats',
    '["28","29","30","31","32","33","34"]',
    '["Rosa","Blanco","Azul"]',
    'https://images.unsplash.com/photo-1604001307862-2d953b875079?w=400&h=500&fit=crop',
    0, 0
  ),
  (
    3,
    'Diadema con Perlas',
    'Hermosa diadema decorada con perlas y cristales.',
    19.99, NULL, 40, 'ninas', 'pelo',
    NULL,
    '["Blanco","Rosa","Dorado"]',
    'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=400&h=500&fit=crop',
    1, 0
  ),
  (
    1,
    'Pantalón Wide Leg',
    'Pantalón de pierna ancha con tiro alto, máxima elegancia y comodidad.',
    64.99, NULL, 28, 'jovenes', 'pantalones',
    '["XS","S","M","L","XL"]',
    '["Negro","Beige","Blanco"]',
    'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=500&fit=crop',
    0, 0
  ),
  (
    3,
    'Collar de Corazón',
    'Delicado collar con dije de corazón en plata 925.',
    34.99, NULL, 45, 'jovenes', 'joyeria',
    NULL,
    '["Plateado","Dorado","Oro Rosa"]',
    'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=500&fit=crop',
    0, 1
  );
